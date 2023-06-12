
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { Group } from '@tweenjs/tween.js';
class GltfClass {
  constructor(ParameterConfig) {
    this.ParameterConfig = {
      ...ParameterConfig
    }
    this.DrawFun()

  }
  DrawFun() {
    this.AllLoadGLTFFun()
    
  }
  //
  AllLoadGLTFFun(){
    this.ParameterConfig.Group= new THREE.Group();
    this.ParameterConfig.Group.position.set(0, 0, 0);
    this.ParameterConfig.scene.add(this.ParameterConfig.Group);
    this.loadGLTF(); // 加载GLTF模型
    this.loadGLTF2()
  }
  // 加载GLTF模型
  loadGLTF() {
    let loader = new GLTFLoader();
    loader.load(
      "model/shuichang.glb",
      (model) => {
        let object = model.scene;
        object.receiveShadow = true;
        //console.log(object);
        object.traverse((item) => {
          //console.log(item.name);
          if (item instanceof THREE.Mesh) {
            // item.material.color.set(0x1DA9FC);
            // item.material.transparent = true;
            // item.material.opacity = 0.5;
            this.shaderObj(item);
          }
        });
        object.scale.set(1.5, 1.5, 1.5);
        object.rotateY(Math.PI);
        object.position.set(0, 0, 30);
        object.name = "MyGltfClass1";
        this.ParameterConfig.Group.add(object);

      }
    );
  }
  shaderObj(selectedObjects) {
    let vertexShader = ` ${THREE.ShaderChunk.logdepthbuf_pars_vertex}
      bool isPerspectiveMatrix(mat4) {
          return true;
      }
        varying vec3 vNormal;
        varying vec3 vPositionNormal;
        void main() 
        {
          vNormal = normalize( normalMatrix * normal ); // 转换到视图空间
          vPositionNormal = normalize(( modelViewMatrix * vec4(position, 1.0) ).xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
           ${THREE.ShaderChunk.logdepthbuf_vertex}
        }
    `
    let fragmentShader = ` ${THREE.ShaderChunk.logdepthbuf_pars_fragment}
      uniform vec3 glowColor;
      uniform float b;
      uniform float p;
      uniform float s;
      varying vec3 vNormal;
      varying vec3 vPositionNormal;
      void main() 
      {
        float a = pow( b + s * abs(dot(vNormal, vPositionNormal)), p );
        gl_FragColor = vec4( glowColor, a );
        ${THREE.ShaderChunk.logdepthbuf_fragment}
      }`
    const customMaterial = new THREE.ShaderMaterial({
      uniforms: {
        s: {
          type: 'f',
          value: -1.0
        },
        b: {
          type: 'f',
          value: 1.0
        }, //bias 颜色最亮的位置
        p: {
          type: 'f',
          value: 1.0
        }, //power决定了透明度变化速度及方向。
        glowColor: {
          type: 'c',
          value: new THREE.Color(0x1da9fc)
        }
      },
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      // transparent: true,
      // opacity: 0.4
    });

    selectedObjects.material = customMaterial;
  }

  // 加载GLTF模型2
  loadGLTF2() {
    let loader = new GLTFLoader();
    loader.load(
      "model/water_treament_plant.glb",
      (model) => {
        //console.log(`加载GLTF模型3--model.scene`, model.scene);
        let object = model.scene;
        object.receiveShadow = true;
        // console.log(object);
        object.scale.set(1, 1, 1);
        object.rotateY(Math.PI / 2);
        object.position.set(-25, 0, -70);
        object.name = "MyGltfClass2";
        this.ParameterConfig.Group.add(object);
      }, (xhr) => {
        // console.log('加载进度--xhr', xhr);
        // console.log('加载进度--xhr.loaded', xhr.loaded);
        // console.log('加载进度---xhr.total', xhr.total);
        // const percent = xhr.loaded / xhr.total;
        // console.log('加载进度', percent);
        // // Math.floor:小数加载进度取整
        // const percent = Math.floor(xhr.loaded / xhr.total * 100) + '%'; //进度百分比
        // console.log('加载进度' + percent);
      }
    );
  }

}
export { GltfClass }