
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
class ModelClass {
    constructor(ParameterConfig) {
        this.ParameterConfig = {
            ...ParameterConfig
        }
        this.DrawFun()

    }
    DrawFun() {
        this.AllLoadGLTFFun()

    }
    PromiseFun(fun = fun()) {
        return new Promise((resolve, reject) => {
            let res = fun()
            resolve(res)
        })
    }
    //
    AllLoadGLTFFun() {
        this.ParameterConfig.Group = new THREE.Group();
        this.ParameterConfig.Group.position.set(0, 0, 0);
        this.ParameterConfig.scene.add(this.ParameterConfig.Group);
        //this.loadGLTF(); // 加载GLTF模型
        //this.loadGLTF2()
        // this.loadGLTF3()
        this.load3D()
    }
    // 加载GLTF模型
    loadGLTF() {
        ////
        const loader = new GLTFLoader();
        const modelLoaded = loader
            .loadAsync("model/shuichang.glb", (xhr) => {
                console.log(`xhr`, xhr);
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            })
            .then((model) => {
                console.log(`加载GLTF模型1--model`, model);
                console.log(`加载GLTF模型1--model.scene`, model.scene);
                let object = model.scene;
                object.receiveShadow = true;
                object.traverse((item) => {
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
            })
            .catch((error) => {
                console.error(error);
            });
        // let promiseVal = new Promise((resolve, reject) => {
        //     let loader = new GLTFLoader();
        //     loader.load(
        //         "model/shuichang.glb",
        //         (model) => {
        //             resolve(model)
        //             reject("model加载失败!")
        //         }
        //     );
        // })
        // //加载成功
        // promiseVal.then((model) => {
        //     console.log(`加载GLTF模型1--model`, model);
        //     console.log(`加载GLTF模型1--model.scene`, model.scene);
        //     let object = model.scene;
        //     object.receiveShadow = true;
        //     object.traverse((item) => {
        //         if (item instanceof THREE.Mesh) {
        //             // item.material.color.set(0x1DA9FC);
        //             // item.material.transparent = true;
        //             // item.material.opacity = 0.5;
        //             this.shaderObj(item);
        //         }
        //     });
        //     object.scale.set(1.5, 1.5, 1.5);
        //     object.rotateY(Math.PI);
        //     object.position.set(0, 0, 30);
        //     object.name = "MyGltfClass1";
        //     this.ParameterConfig.Group.add(object);
        // })
        // //加载失败
        // promiseVal.catch((err) => {
        //     console.log(err);
        // });
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
        let promiseVal = new Promise((resolve, reject) => {
            let loader = new GLTFLoader();
            loader.load(
                "model/water_treament_plant.glb",
                (model) => {
                    resolve(model)
                    reject("model加载失败!")
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
        })
        //加载成功
        promiseVal.then((model) => {
            console.log(`加载GLTF模型2--model`, model);
            console.log(`加载GLTF模型2--model.scene`, model.scene);
            let object = model.scene;
            object.receiveShadow = true;
            object.scale.set(1, 1, 1);
            object.rotateY(Math.PI / 2);
            object.position.set(-25, 0, -70);
            object.name = "MyModelClass2";
            object.traverse((item) => {
                if (item instanceof THREE.Mesh) {
                    // item.material.color.set(0x1DA9FC);
                    // item.material.transparent = true;
                    // item.material.opacity = 0.5;
                    console.log(`item`, item);
                    const texLoader = new THREE.TextureLoader();
                    const texture = texLoader.load(require('@/assets/img/back.jpg'));// 加载手机mesh另一个颜色贴图
                    item.material.map = texture
                    this.shaderObj(item);

                }
            });
            this.ParameterConfig.Group.add(object);

        })
        //加载失败
        promiseVal.catch((err) => {
            console.log(err);
        });

    }
    loadGLTF3() {
        const loader = new GLTFLoader();
        const modelLoaded = loader
            .loadAsync("model/water_treament_plant.glb", (xhr) => {
                console.log(`xhr`, xhr);
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            })
            .then((model) => {
                console.log(`加载GLTF模型2--model`, model);
                console.log(`加载GLTF模型2--model.scene`, model.scene);
                let object = model.scene;
                const { min, max } = new THREE.Box3().setFromObject(object);
                object.position.sub(
                    new THREE.Vector3((min.x + max.x) / 2, min.y, (min.z + max.z) / 2)
                );
                object.castShadow = true
                object.receiveShadow = true
                object.scale.set(1, 1, 1);
                object.rotateY(Math.PI / 2);
                object.position.set(-25, 0, -70);
                object.name = "MyModelClass2";
                object.traverse((item) => {
                    if (item instanceof THREE.Mesh) {
                        // item.material.color.set(0x1DA9FC);
                        // item.material.transparent = true;
                        // item.material.opacity = 0.5;
                        console.log(`item`, item);
                        if (item.name == "Object_4") {
                            const texLoader = new THREE.TextureLoader();
                            const texture = texLoader.load(require('@/assets/img/back.jpg'));// 加载手机mesh另一个颜色贴图
                            item.material.map = texture
                        } else {
                            this.shaderObj(item);
                        }



                    }
                });
                this.ParameterConfig.Group.add(object);


            })
            .catch((error) => {
                console.error(error);
            });
    }
    load3D() {
        const loader = new GLTFLoader()
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('https://threejs.org/examples/jsm/libs/draco/')
        dracoLoader.preload()
        loader.setDRACOLoader(dracoLoader)

        loader.load('https://threejs.org/examples/models/gltf/LittlestTokyo.glb', (gltf) => {
            gltf.scene.scale.set(0.1, 0.1, 0.1);
            gltf.scene.castShadow = true
            gltf.scene.receiveShadow = true
            gltf.scene.name = "加载在线模型";
            gltf.scene.traverse((item) => {
                if (item instanceof THREE.Mesh) {
                    // item.material.color.set(0x1DA9FC);
                    // item.material.transparent = true;
                    // item.material.opacity = 0.5;
                    console.log(`item`, item);
                    this.shaderObj(item);
                }
            });
            this.ParameterConfig.scene.add(gltf.scene)
        }, (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        }, (error) => {
            console.error(error)
        })
    }
    WaterTextureFun() {
        new THREE.TextureLoader().loadAsync(require('@/assets/img/waternormals.jpg')).then((waterNormals) => {
            waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
            this.ParameterConfig.water = new THREE.Water(new THREE.PlaneGeometry(1000, 1000), {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals,
                sunDirection: new THREE.Vector3(),
                sunColor: 0xffffff,
                waterColor: 0x001e0f,
                distortionScale: 3.7,
                fog: !!this.ParameterConfig.scene.fog,
            });
            this.ParameterConfig.water.position.y = 0;
            this.ParameterConfig.water.position.x = -200;
            this.ParameterConfig.water.rotation.x = Math.PI * -0.5;
            this.ParameterConfig.scene.add(this.ParameterConfig.water);

        });
    }
    VideoTextureFun() {
        let planeGeometry = new THREE.PlaneGeometry(10, 5);
        let material = new THREE.MeshPhongMaterial();//MeshBasicMaterial
        material.side = THREE.DoubleSide;
        let mesh = new THREE.Mesh(planeGeometry, material);
        this.ParameterConfig.scene.add(mesh);
        let video = document.createElement("video");
        video.src = require("@/assets/video/sintel.mp4");
        video.loop = true;
        video.muted = true;
        video.playbackRate = 0.6;
        video.play();
        let texture = new THREE.VideoTexture(video);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBFormat;
        material.map = texture;
        // planeGeometry.geometry.attributes.uv = new THREE.BufferAttribute(
        //     new Uint8Array([0, 0, 1, 0, 0, 1, 1, 1]),
        //     2
        // );
    }
    AnimationFun() {
        // this.ParameterConfig.water.material.uniforms['time'].value += 2.0 / 60.0;
    }
}
export { ModelClass }