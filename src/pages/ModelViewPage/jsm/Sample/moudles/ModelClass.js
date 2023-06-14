
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
       this.VideoTextureFun()
        this.WaterTextureFun()
        this.CanvasTextureFun()
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
         // 创建水面材质的参数
         const waterParams = {
            color: '#fff',
            scale: 4,
            flowX: 1,
            flowY: 1,
        };
        // 创建水面材质
        this.ParameterConfig.waterMaterial = new THREE.ShaderMaterial({
            textureWidth: 1512, // 水浑浊程度，密度
            textureHeight: 1512, // 水浑浊程度，密度
            depthWrite:false,
            side: THREE.DoubleSide,
            fog: this.ParameterConfig.scene.fog !== undefined,
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new THREE.Color(waterParams.color) },
                uNormalMap: { value: new THREE.TextureLoader().load('img/waternormals.jpg', (texture) => {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                }), },
                uScale: { value: waterParams.scale },
                uFlowX: { value: waterParams.flowX },
                uFlowY: { value: waterParams.flowY },
            },
            vertexShader: `
      uniform float uTime;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
            fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      uniform sampler2D uNormalMap;
      uniform float uScale;
      uniform float uFlowX;
      uniform float uFlowY;
      varying vec2 vUv;
      void main() {
        // 使用纹理坐标和时间创建水波效果
        vec2 uv = vUv * uScale + vec2(uFlowX, uFlowY) * uTime * 0.1;
        vec3 normal = texture2D(uNormalMap, uv).rgb;
        vec3 color = mix(uColor * 0.8, uColor, smoothstep(0.4, 0.6, normal.y));
        gl_FragColor = vec4(color, 1.0);
      }
    `,
        });

        // 创建水面对象
        const waterGeometry = new THREE.PlaneGeometry(500, 500, 1132, 1132);
        const waterMesh = new THREE.Mesh(waterGeometry, this.ParameterConfig.waterMaterial);
        waterMesh.rotation.x = -Math.PI / 2; // 使水面朝上
        waterMesh.position.x=0
        waterMesh.position.y=-30
        waterMesh.position.z=0
        this.ParameterConfig.scene.add(waterMesh);
        //水面效果 https://blog.csdn.net/baidu_29701003/article/details/131105965
    }
    VideoTextureFun() {
         // 创建video对象
         let video = document.createElement('video');
         video.src = require("@/assets/video/pano.webm");//  "video/sintel.mp4"//// 设置视频地址
         video.autoplay = "autoplay"; //要设置播放
         video.loop = "loop"; //要设置播放
         // video对象作为VideoTexture参数创建纹理对象
         this.texture = new THREE.VideoTexture(video)
         this.texture.colorSpace = THREE.SRGBColorSpace;
         this.texture.minFilter = THREE.LinearFilter;
         this.texture.magFilter = THREE.LinearFilter;
         this.texture.needsUpdate = true;
         this.texture.update()
         let geometry = new THREE.PlaneGeometry(108, 71); //矩形平面
         let material = new THREE.MeshBasicMaterial({
             map: this.texture, // 设置纹理贴图
             side: THREE.DoubleSide,
         }); //材质对象Material
         let mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
         mesh.rotation.y = -Math.PI / 2
         mesh.position.y = 50
         mesh.position.z = 30
         this.ParameterConfig.scene.add(mesh); //网格模型添加到场景中
 
         // video.addEventListener('canplaythrough', (event) => {
         //     console.log('我想我可以播放整个视频，而不必停下来缓冲。');
         // });
 
         //视频作为Three.js纹理贴图(VideoTexture)  https://blog.csdn.net/u014291990/article/details/103026218
    }
    CanvasTextureFun(){
        let canvas = document.createElement('canvas');
        canvas.width = 150;
        canvas.height = 150;
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        let img = new Image();
       // img.src = "https://img0.baidu.com/it/u=3226103969,2404354919&fm=253&fmt=auto&app=138&f=JPEG?w=634&h=500";
        img.src = require("@/assets/img/back.jpg");
        img.crossOrigin = "anonymous";
        img.onload =  ()=> {
            ctx.drawImage(img, 0, 0, 200, 200);
            let texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true; // 不设置needsUpdate为true的话，可能纹理贴图不刷新
            let geometry = new THREE.BoxGeometry(60, 50, 30);
            let material = new THREE.MeshPhongMaterial({
                // color:0x11ff22,
                map: texture,
                side: THREE.DoubleSide
            });
            let mesh = new THREE.Mesh(geometry, material);
            mesh.position.x= 0;
            this.ParameterConfig.scene.add(mesh);
            //three.js 使用canvas加载图片作为模型的纹理贴图 https://blog.csdn.net/yinge0508/article/details/123090525
    }
}
    AnimationFun() {
       // 更新时间和水面材质的相关属性
       const time = performance.now() * 0.001;
       this.ParameterConfig.waterMaterial.uniforms.uTime.value = time;
    }
}
export { ModelClass }