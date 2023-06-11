<template>
    <div class="SkyBoxViewPage">
      <div id="container" />
      <div class="controls-box">
        <section>
          <el-row>
            <el-checkbox v-model="properties.rotate">
              rotate
            </el-checkbox>
          </el-row>
          <el-row>
            <div v-for="(item,key) in properties" :key="key">
              <div v-if="item&&item.name!=undefined">
                <el-col :span="8">
                  <span class="vertice-span">{{ item.name }}</span>
                </el-col>
                <el-col :span="13">
                  <el-slider v-model="item.value" :min="item.min" :max="item.max" :step="item.step" :format-tooltip="formatTooltip" @change="propertiesChange" />
                </el-col>
                <el-col :span="3">
                  <span class="vertice-span">{{ item.value }}</span>
                </el-col>
              </div>
            </div>
          </el-row>
          <el-row>
            <el-col :span="8" class="label-col">
              <label>texture</label>
            </el-col>
            <el-col :span="16">
              <el-select v-model="properties.textureType" placeholder="请选择" @change="propertiesChange">
                <el-option v-for="item in texturesOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-col>
          </el-row>
        </section>
      </div>
    </div>
  </template>
  
  <script>
  import * as THREE from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
  export default {
    name:"SkyBoxViewPage",
    data() {
      return {
        texturesOptions: [
          {
            value: 'bathroom',
            label: 'bathroom'
          },
          {
            value: 'plaster',
            label: 'plaster'
          },
          {
            value: 'metal-floor',
            label: 'metal-floor'
          },
          {
            value: 'none',
            label: 'none'
          }
        ],
        properties: {
          normalScale: {
            name: 'normalScale',
            value: 1,
            min: -2,
            max: 2,
            step: 0.1
          },
          reflectivity: {
            name: 'reflectivity',
            value: 1,
            min: 0,
            max: 2,
            step: 0.1
          },
          textureType: 'none',
          rotate: false
        },
        cube: null,
        sphere: null,
        torus: null,
        camera: null,
        cubeCamera: null,
        cubeRenderTarget: null,
        scene: null,
        renderer: null,
        controls: null
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      formatTooltip(val) {
        return val
      },
  
      // 初始化
      async init() {
        this.createScene() // 创建场景
        await this.createRender() // 创建渲染器
        this.createCamera() // 创建相机
        this.createLight() // 创建光源
        this.createModels() // 创建模型
  
        this.createControls() // 创建控件对象
  
        this.render() // 渲染
      },
      // 创建场景
      createScene() {
        this.scene = new THREE.Scene()
        const publicPath = process.env.BASE_URL
        //创建全景贴图设置为场景背景
        this.scene.background = new THREE.CubeTextureLoader()
          .setPath(`${publicPath}img/Park2/`)
          .load([
            'posx.jpg',
            'negx.jpg',
            'posy.jpg',
            'negy.jpg',
            'posz.jpg',
            'negz.jpg'
          ])
      },
      // 创建模型
      createModels() {
        const material = new THREE.MeshPhongMaterial()
        material.envMap = this.scene.background //场景背景设置为材质的环境贴图
  
        //创建方块
        const boxGeometry = new THREE.BoxGeometry(15, 15, 15)
        this.cube = new THREE.Mesh(boxGeometry, material)
  
        this.cube.position.set(-22, 0, 0)
        this.scene.add(this.cube)
  
        //构建圆环
        const torusGeometry = new THREE.TorusGeometry(8, 3, 16, 100)
        this.torus = new THREE.Mesh(torusGeometry, material)
        this.torus.position.set(22, 0, 0)
        this.scene.add(this.torus)
  
        //创建球体
        this.renderer.renderTarget
        const dynamicEnvMapMaterial = new THREE.MeshPhongMaterial({
          envMap: this.cubeRenderTarget.texture
        })
        const sphereGeometry = new THREE.SphereGeometry(10, 15, 15)
        this.sphere = new THREE.Mesh(sphereGeometry, dynamicEnvMapMaterial)
        this.scene.add(this.sphere)
      },
  
      // 创建光源
      createLight() {
        // 环境光
        const ambientLight = new THREE.AmbientLight(0xffffff) // 创建环境光
        this.scene.add(ambientLight) // 将环境光添加到场景
  
        const spotLight = new THREE.SpotLight(0xffffff) // 创建聚光灯
        spotLight.position.set(0, 50, 50)
        spotLight.intensity = 2.2
        this.scene.add(spotLight)
      },
  
      // 创建相机
      createCamera() {
        const element = document.getElementById('container')
        const width = element.clientWidth // 窗口宽度
        const height = element.clientHeight // 窗口高度
        const k = width / height // 窗口宽高比
        // PerspectiveCamera( fov, aspect, near, far )
        this.camera = new THREE.PerspectiveCamera(45, k, 0.1, 1000)
        this.camera.position.set(0, 12, 68) // 设置相机位置
  
        this.camera.lookAt(new THREE.Vector3(0, 0, 0)) // 设置相机方向
        this.scene.add(this.camera)
        const renderTarget = this.renderer.getRenderTarget()
  
        //创建立方体渲染器目标对象
        this.cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
          format: THREE.RGBFormat,
          generateMipmaps: true,
          minFilter: THREE.LinearMipmapLinearFilter
        })
  
        //创建立方体相机
        this.cubeCamera = new THREE.CubeCamera(1, 100000, this.cubeRenderTarget)
        this.scene.add(this.cubeCamera)
      },
      // 创建渲染器
      createRender() {
        const element = document.getElementById('container')
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        this.renderer.setSize(element.clientWidth, element.clientHeight) // 设置渲染区域尺寸
        this.renderer.shadowMap.enabled = true // 显示阴影
        // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this.renderer.setClearColor(0xeeeeee, 1) // 设置背景颜色
        element.appendChild(this.renderer.domElement)
      },
  
      propertiesChange() {
        const publicPath = process.env.BASE_URL
        //如果不为none为方块加载纹理贴图
        if (this.properties.textureType !== 'none') {
          const texture = new THREE.TextureLoader().load(
            `${publicPath}img/sprites/ball.png`
          )
          this.cube.material.map = texture
  
          const normal = new THREE.TextureLoader().load(
            `${publicPath}img/sprites/circle.png`
          )
  
          this.cube.material.normalMap = normal
  
          // 更新法线缩放
          this.cube.material.normalScale.set(
            this.properties.normalScale.value,
            this.properties.normalScale.value
          ) // normalScale(x,y)
        } else {
          this.cube.material = new THREE.MeshPhongMaterial({
            envMap: this.scene.background
          })
        }
  
        // 克隆方块材质赋值给圆环材质
        this.torus.material = this.cube.material.clone()
  
        //更新模型的材质折射率
        this.cube.material.reflectivity = this.properties.reflectivity.value
        this.torus.material.reflectivity = this.properties.reflectivity.value
  
        //更新材质中的纹理
        this.cube.material.needsUpdate = true
        this.torus.material.needsUpdate = true
      },
  
      //模型旋转更新
      updateRotation() {
        if (this.properties.rotate) {
          this.cube.rotation.x += 0.01
          this.cube.rotation.y += 0.01
          this.torus.rotation.x += 0.01
          this.torus.rotation.y += 0.01
        }
      },
  
      render() {
        requestAnimationFrame(this.render)
        this.updateRotation() //模型旋转更新
        this.cubeCamera.update(this.renderer, this.scene) //立方体相机更新
        this.renderer.render(this.scene, this.camera)
      },
      // 创建控件对象
      createControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .SkyBoxViewPage{
    width: 100%;
    height: 100%;
    position: relative;
  }
  #container {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .controls-box {
    position: absolute;
    right: 5px;
    top: 5px;
    width: 300px;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #c3c3c3;
  }
  .label-col {
    padding: 8px 5px;
  }
  
  .vertice-span {
    line-height: 38px;
    padding: 0 2px 0 10px;
  }
  </style>
  
  