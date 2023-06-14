
import * as THREE from 'three';
window.THREE = THREE
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { LightClass } from './Light/index'
import { UvAnimationClass } from './Sample/index'
import ResourceTracker from "./uitls/TrackResource";
class DrawThreeJsClass {
    constructor(ThreeJsContainer) {
        this.ThreeJsContainer = ThreeJsContainer
        this.ParameterConfig = { ThreeJsContainer, RequestAnimationFrameVal: null }
        this.resMgr = new ResourceTracker();
        this.track = this.resMgr.track.bind(this.resMgr);
        this.DrawThreeJsFun()
    }
    DrawThreeJsFun() {
        this.CreateRender().CreateScene().CreateCamera().RendererSceneCamera().InitDrawFun()
    }
    // 创建渲染器
    CreateRender() {
        let WBGLCanvasWidth = this.ThreeJsContainer.getBoundingClientRect().width
        let WBGLCanvasHeight = this.ThreeJsContainer.getBoundingClientRect().height
        this.ParameterConfig = { ...this.ParameterConfig, WBGLCanvasWidth, WBGLCanvasHeight }
        this.ParameterConfig.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true,
            logarithmicDepthBuffer: true,// 设置对数深度缓冲区，优化深度冲突问题
        });
        this.ParameterConfig.renderer.setSize(WBGLCanvasWidth, WBGLCanvasHeight);
        this.ParameterConfig.renderer.setPixelRatio(window.devicePixelRatio);
        this.ParameterConfig.renderer.setClearColor('rgba(255,255,255,0.54)')
        this.ParameterConfig.renderer.shadowMap.enabled = true; // 显示阴影
        this.ParameterConfig.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.ParameterConfig.renderer.domElement.style.position = "absolute"
        this.ParameterConfig.renderer.domElement.style.zIndex = 0;
        this.ThreeJsContainer.appendChild(this.ParameterConfig.renderer.domElement);
        return this

    }
    // 创建场景
    CreateScene() {
        this.ParameterConfig.scene = new THREE.Scene();
        this.SkyCubeTexture()
        return this

    }
    SkyCubeTexture() {
        let promiseVal = new Promise((resolve, reject) => {
            // let textureLoader = new THREE.TextureLoader();
            // // let bgtexture = textureLoader.load('img/back.jpg');
            // let bgtexture = textureLoader.load(require('@/assets/img/back.jpg'));
            // this.ParameterConfig.scene.background = bgtexture // 纹理对象Texture赋值给场景对象的背景属性.background
            //////
            // let cubeTextureLoader = new THREE.CubeTextureLoader();
            // cubeTextureLoader.setPath('img/Park3/');
            // let cubeTexture = cubeTextureLoader.load([
            //     'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg'
            // ]);
            ///

            var urls = [
                require('@/assets/img/Park3/posx.jpg'),
                require('@/assets/img/Park3/negx.jpg'),
                require('@/assets/img/Park3/posy.jpg'),
                require('@/assets/img/Park3/negy.jpg'),
                require('@/assets/img/Park3/posz.jpg'),
                require('@/assets/img/Park3/negz.jpg'),
            ];
            let cubeTextureLoader = new THREE.CubeTextureLoader();
            let cubeTexture = cubeTextureLoader.load(urls);
            ///
            resolve(cubeTexture)
            reject("天空图加载失败!")
        })
        promiseVal.then((cubeTexture) => {
            this.ParameterConfig.scene.background = cubeTexture;
        })
    }
    // 创建相机
    CreateCamera() {
        this.ParameterConfig.camera = new THREE.PerspectiveCamera(45, this.ParameterConfig.WBGLCanvasWidth / this.ParameterConfig.WBGLCanvasHeight, 0.1, 1000);
        this.ParameterConfig.camera.position.set(0, 30, 160)
        this.ParameterConfig.camera.lookAt(new THREE.Vector3(0, 0, 0)); // 设置相机方向
        this.ParameterConfig.camera.up = new THREE.Vector3(0, 1, 0)
        //this.ParameterConfig.camera.lookAt(this.ParameterConfig.scene.position); // 设置相机方向
        this.ParameterConfig.scene.add(this.ParameterConfig.camera);
        return this
    }
    // 渲染场景和相机
    RendererSceneCamera() {
        this.ParameterConfig.renderer.render(this.ParameterConfig.scene, this.ParameterConfig.camera)
        return this
    }
    InitDrawFun() {
        this.AddonsFun().AllDrawGeometryFun().UpdateFun()
    }
    AddonsFun() {
        this.CreateLight()
        this.CreateControls()
        this.CreateStats()
        // this.GridHelperFun()
        return this
    }
    // 创建光源
    CreateLight() {
        this.ParameterConfig.InitLightClass = new LightClass(this.ParameterConfig)
    }
    // 创建控件对象
    CreateControls() {
        //控制器 第一个参数是相机第二个参数是渲染器 加载场景控制插件
        let controls = new OrbitControls(this.ParameterConfig.camera, this.ParameterConfig.renderer.domElement);
        controls.autoRotate = false // 是否自动旋转
        controls.maxPolarAngle = Math.PI * 0.495;
        controls.target.set(0, 10, 0);
        controls.minDistance = 40.0;
        controls.maxDistance = 200.0;
        this.ParameterConfig.controls = controls;

    }
    //创建性能监视器
    CreateStats() {
        //创建stats对象
        this.ParameterConfig.stats = new Stats();
        this.ParameterConfig.stats.setMode(0)
        let StatsDom = this.ParameterConfig.stats.domElement
        StatsDom.style.position = "fixed"
        StatsDom.style.top = "5px"
        StatsDom.style.right = "5px"
        StatsDom.style.left = "unset"
        this.ThreeJsContainer.appendChild(this.ParameterConfig.stats.domElement);        //stats.domElement:web页面上输出计算结果,一个div元素，
    }
    //坐标轴、地面网格辅助
    GridHelperFun() {
        // AxesHelper：辅助观察的坐标系
        this.ParameterConfig.axesHelper = new THREE.AxesHelper(this.ParameterConfig.WBGLCanvasWidth);
        this.ParameterConfig.scene.add(this.ParameterConfig.axesHelper);
        // 创建地面网格辅助
        this.ParameterConfig.gridHelper = new THREE.GridHelper(this.ParameterConfig.WBGLCanvasWidth, 60, 'red', 'rgb(222, 225, 230)')
        this.ParameterConfig.gridHelper.material.opacity = 0.5;
        this.ParameterConfig.gridHelper.material.depthWrite = false;
        this.ParameterConfig.gridHelper.material.transparent = true;
        this.ParameterConfig.gridHelper.position.y = 0;
        this.ParameterConfig.scene.add(this.ParameterConfig.gridHelper);
    }
    // 渲染所有绘制图形方法
    AllDrawGeometryFun() {
        // console.log(`this,this.ParameterConfig`, this,this.ParameterConfig);
        if (this.ParameterConfig.renderer.domElement) {
            this.DblclickFullscreenFun()
            this.ParameterConfig.InitUvAnimationClass = new UvAnimationClass(this.ParameterConfig)
        }
        return this
    }
    //设置动画
    UpdateFun() {
        this.ParameterConfig.InitUvAnimationClass.AnimationFun()
        this.ParameterConfig.controls.update();
        this.ParameterConfig.renderer.render(this.ParameterConfig.scene, this.ParameterConfig.camera);
        this.ParameterConfig.stats.update();
        this.ParameterConfig.RequestAnimationFrameVal = requestAnimationFrame(() => {
            this.UpdateFun()
        })
    }
    //取消动画
    CancelAnimationFun() {
        if (this.ParameterConfig.RequestAnimationFrameVal) {
            cancelAnimationFrame(this.ParameterConfig.RequestAnimationFrameVal)
            this.ParameterConfig.RequestAnimationFrameVal = null
        }

    }
    //销毁
    dispose() {
        try {
            if (this.ThreeJsContainer) {
                if (this.ParameterConfig.scene) {
                    this.ParameterConfig.scene.clear()
                    this.resMgr && this.resMgr.dispose()
                    this.ParameterConfig.scene = null;
                }
                if (this.ParameterConfig.renderer) {
                    this.ParameterConfig.renderer.dispose();
                    this.ParameterConfig.renderer.forceContextLoss();
                    this.ParameterConfig.renderer.content = null;
                    let gl = this.ParameterConfig.renderer.domElement.getContext("webgl");
                    gl && gl.getExtension("WEBGL_lose_context").loseContext();
                    console.log(this.ParameterConfig.renderer.info)   //查看memery字段即可
                    this.ParameterConfig.renderer = null;
                    this.ParameterConfig.camera = null;

                }
                console.log(this.ParameterConfig.renderer)   //查看memery字段即可
                this.CancelAnimationFun()
                this.ThreeJsContainer.parentNode.removeChild(this.ThreeJsContainer);
                this.ThreeJsContainer = null
                this.ParameterConfig = {}

            }
        } catch (e) {
            console.log(e)
        }
        //Three.js 内存释放问题  https://blog.csdn.net/u014361280/article/details/124309410
    }
    //画布自适应
    WindowResizeResetViewFun() {
        if (this?.ParameterConfig?.renderer) {  //更新摄像机的宽高比
            this.ParameterConfig.camera.aspect = this.ParameterConfig.WBGLCanvasWidth / this.ParameterConfig.WBGLCanvasHeight
            //更新摄像机的投影矩阵
            this.ParameterConfig.camera.updateProjectionMatrix()
            //设置渲染器的像素比
            this.ParameterConfig.renderer.setPixelRatio(window.devicePixelRatio);
            //更新渲染器宽度和高度
            this.ParameterConfig.renderer.setSize(this.ParameterConfig.WBGLCanvasWidth, this.ParameterConfig.WBGLCanvasHeight)
            console.log("画面变化了")
            if (this.ParameterConfig.EffectComposerClass) {
                this.ParameterConfig.EffectComposerClass.WindowResizeResetViewFun()
            }
        }
    }
    //画布全屏
    DblclickFullscreenFun() {
        window.addEventListener("dblclick", () => {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                //document.documentElement.requestFullscreen();
                this.ParameterConfig.renderer.domElement.requestFullscreen();
            }
        })
    }


}
export { DrawThreeJsClass }