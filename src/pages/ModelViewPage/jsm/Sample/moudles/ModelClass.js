
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
        this.loadGLTF3()
        // this.load3D()
        //  this.VideoTextureFun()
    }
    // 加载GLTF模型
    loadGLTF() {
        ////
        const loader = new GLTFLoader();
        const modelLoaded = loader
            .loadAsync(`model/shuichang.glb`, (xhr) => {
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
            //`model/shuichang.glb`
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
                `model/water_treament_plant.glb`,
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
        /////加载进度//////
        const manager = new THREE.LoadingManager();
        manager.onStart = function (url, itemsLoaded, itemsTotal) {
            console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        };
        manager.onLoad = function () {
            // 所有资源都加载完成后执行事件
            console.log('Loading complete!');
        };
        manager.onProgress = function (url, itemsLoaded, itemsTotal) {
            console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
            const percentComplete = parseInt(Math.round((itemsLoaded / itemsTotal) * 100, 2)) + '%'
            //加载页的进度条百分比交互在这里写
            console.log(`加载页的进度条百分比交互在这里写`, percentComplete);
        };
        manager.onError = function (url) {
            console.log('There was an error loading ' + url);
        };
        //three.js模型及贴图资源预加载 https://blog.csdn.net/qq_33298964/article/details/130636632
        //https://threejs.org/docs/index.html?q=LoadingManager#api/zh/loaders/managers/LoadingManager
        //////////////////////////
        const loader = new GLTFLoader(manager);
        const modelLoaded = loader
            .loadAsync(`model/water_treament_plant.glb`, (xhr) => {
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
                            let texture
                            // let texLoader = new THREE.TextureLoader();
                            // texture = texLoader.load(require('@/assets/img/back.jpg'));// 加载手机mesh另一个颜色贴图
                            // video对象作为VideoTexture参数创建纹理对象 创建video对象
                            let video = document.createElement('video');
                            video.src = require("@/assets/video/pano.webm");//  "video/sintel.mp4"//// 设置视频地址
                            video.autoplay = "autoplay"; //要设置播放
                            // video对象作为VideoTexture参数创建纹理对象
                            texture = new THREE.VideoTexture(video)
                            texture.colorSpace = THREE.SRGBColorSpace;
                            texture.minFilter = THREE.LinearFilter;
                            texture.magFilter = THREE.LinearFilter;
                            texture.needsUpdate = true;
                            texture.update()
                            item.material.map = texture
                            // video.addEventListener('canplaythrough', (event) => {
                            //   console.log('我想我可以播放整个视频，而不必停下来缓冲。');
                            // });
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
        // 创建video对象
        let video = document.createElement('video');
        video.src = require("@/assets/video/sintel.mp4"); // 设置视频地址
        video.autoplay = "autoplay"; //要设置播放
        // video对象作为VideoTexture参数创建纹理对象
        var texture = new THREE.VideoTexture(video)
        var geometry = new THREE.PlaneGeometry(108, 71); //矩形平面
        var material = new THREE.MeshPhongMaterial({
            map: texture, // 设置纹理贴图
            side: THREE.DoubleSide,
        }); //材质对象Material
        var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
        this.ParameterConfig.scene.add(mesh); //网格模型添加到场景中
        //视频作为Three.js纹理贴图(VideoTexture)  https://blog.csdn.net/u014291990/article/details/103026218
    }
    AnimationFun() {
        // this.ParameterConfig.water.material.uniforms['time'].value += 2.0 / 60.0;
    }
}
export { ModelClass }