
import * as THREE from 'three';
window.THREE = THREE
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { LightClass } from './Light/index'
import { UvAnimationClass, BoxGeometryClass } from './Sample/index'
import { debounce, ScreenTransToThreeCoord, ThreeTransToScreenCoord, GetXYToCanvas } from './uitls/index'
///////////
// 引入后处理扩展库EffectComposer.js
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js"
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js"
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
///////////
class DrawThreeJsClass {
    constructor(ThreeJsContainer) {
        this.ThreeJsContainer = ThreeJsContainer
        this.ParameterConfig = { ThreeJsContainer, RequestAnimationFrameVal: null, clock: new THREE.Clock() }
        this.DrawThreeJsFun()
    }
    DrawThreeJsFun() {
        this.CreateRender().CreateScene().CreateCamera().RendererSceneCamera().InitDrawFun()
        this.ThreeJsContainer.addEventListener('click', event => {
            this.ClickEvent(event)
        });

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
        // let textureLoader = new THREE.TextureLoader();
        // // let bgtexture = textureLoader.load('img/back.jpg');
        // let bgtexture = textureLoader.load(require('@/assets/img/back.jpg'));
        // this.ParameterConfig.scene.background = bgtexture // 纹理对象Texture赋值给场景对象的背景属性.background
        //////
        let cubeTextureLoader = new THREE.CubeTextureLoader();
        cubeTextureLoader.setPath('img/Park3/');
        let cubeTexture = cubeTextureLoader.load([
            'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg'
        ]);
        this.ParameterConfig.scene.background = cubeTexture;
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
        this.GridHelperFun()
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
            this.ParameterConfig.InitBoxGeometryClass = new BoxGeometryClass(this.ParameterConfig)
            this.EffectComposerFun()
        }
        return this
    }
    //设置动画
    UpdateFun() {
        this.ParameterConfig.RequestAnimationFrameVal = requestAnimationFrame(() => {
            this.UpdateFun()
        })
        this.ParameterConfig.InitUvAnimationClass.AnimationFun()
        this.ParameterConfig.controls.update();
        this.ParameterConfig.stats.update();
        this.ParameterConfig.renderer.render(this.ParameterConfig.scene, this.ParameterConfig.camera);
        if (this.composer) {
            if (this.displacementPass) {
                const elapsedTime = this.ParameterConfig.clock.getElapsedTime()
                // Update passes
                this.displacementPass.material.uniforms.uTime.value = elapsedTime
            }
            this.composer.render()
        }
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
        if (this.ThreeJsContainer) {
            this.CancelAnimationFun()
            this.ThreeJsContainer.parentNode.removeChild(this.ThreeJsContainer);
            this.ThreeJsContainer = null
        }
    }
    //画布自适应
    WindowResizeResetViewFun() {
        //更新摄像机的宽高比
        this.ParameterConfig.camera.aspect = this.ParameterConfig.WBGLCanvasWidth / this.ParameterConfig.WBGLCanvasHeight
        //更新摄像机的投影矩阵
        this.ParameterConfig.camera.updateProjectionMatrix()
        //设置渲染器的像素比
        this.ParameterConfig.renderer.setPixelRatio(window.devicePixelRatio);
        //更新渲染器宽度和高度
        this.ParameterConfig.renderer.setSize(this.ParameterConfig.WBGLCanvasWidth, this.ParameterConfig.WBGLCanvasHeight)
        console.log("画面变化了")
        // Update effect composer
        this.composer.setSize(this.ParameterConfig.WBGLCanvasWidth, this.ParameterConfig.WBGLCanvasHeight)
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
    //////////////////////////////
    ClickEvent(event) {
        let canvasDom = this.ParameterConfig.renderer.domElement
        let mouse = ScreenTransToThreeCoord(canvasDom, event, new THREE.Vector2())
        let raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.ParameterConfig.camera);
        let intersects = raycaster.intersectObjects(this.ParameterConfig.scene.children);
        console.log(`intersects `, intersects)
        if (intersects && intersects.length > 0) {
            console.log(`[intersects[0].object`, intersects[0].object);
            this.OutlineObj([intersects[0].object])

        }
    }
    //高亮显示模型（呼吸灯）
    OutlineObj(selectedObjects) {
        // 创建一个EffectComposer（效果组合器）对象，然后在该对象上添加后期处理通道。
        this.composer = new EffectComposer(this.ParameterConfig.renderer)
        // 新建一个场景通道  为了覆盖到原理来的场景上
        this.renderPass = new RenderPass(this.ParameterConfig.scene, this.ParameterConfig.camera)
        this.composer.addPass(this.renderPass);
        // 物体边缘发光通道
        this.outlinePass = new OutlinePass(new THREE.Vector2(this.ParameterConfig.WBGLCanvasWidth, this.ParameterConfig.WBGLCanvasHeight), this.ParameterConfig.scene, this.ParameterConfig.camera, selectedObjects)
        this.outlinePass.selectedObjects = selectedObjects
        this.outlinePass.edgeStrength = 15.0 // 边框的亮度
        this.outlinePass.edgeGlow = 2// 光晕[0,1]
        this.outlinePass.usePatternTexture = false // 是否使用父级的材质
        this.outlinePass.edgeThickness = 5.0 // 边框宽度
        this.outlinePass.downSampleRatio = 1 // 边框弯曲度
        this.outlinePass.pulsePeriod = 5 // 呼吸闪烁的速度
        this.outlinePass.visibleEdgeColor.set(parseInt(0xff0000)) // 呼吸显示的颜色
        this.outlinePass.hiddenEdgeColor = new THREE.Color(0, 0, 0) // 呼吸消失的颜色
        this.outlinePass.clear = true
        this.composer.addPass(this.outlinePass)
        // 自定义的着色器通道 作为参数
        let effectFXAA = new ShaderPass(FXAAShader)
        effectFXAA.uniforms.resolution.value.set(1 / this.ParameterConfig.WBGLCanvasWidth, 1 / this.ParameterConfig.WBGLCanvasHeight)
        effectFXAA.renderToScreen = true
        this.composer.addPass(effectFXAA)
    }
    EffectComposerFun() {
        let GeometryList = []
        this.ParameterConfig.scene.children.map((ele) => {
            if (ele.isMesh) {
                //geometry
                GeometryList.push(ele)
            }
        })
        const renderTarget = new THREE.WebGLRenderTarget(
            this.ParameterConfig.WBGLCanvasWidth, this.ParameterConfig.WBGLCanvasHeight,
            {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
            }
        )

        // 创建一个EffectComposer（效果组合器）对象，然后在该对象上添加后期处理通道。
        this.composer = new EffectComposer(this.ParameterConfig.renderer, renderTarget)
        // 新建一个场景通道  为了覆盖到原理来的场景上
        this.renderPass = new RenderPass(this.ParameterConfig.scene, this.ParameterConfig.camera)
        this.composer.addPass(this.renderPass);
        // 物体边缘发光通道
        this.outlinePass = new OutlinePass(new THREE.Vector2(this.ParameterConfig.WBGLCanvasWidth, this.ParameterConfig.WBGLCanvasHeight), this.ParameterConfig.scene, this.ParameterConfig.camera, GeometryList)
        this.outlinePass.selectedObjects = GeometryList
        this.outlinePass.edgeStrength = 15.0 // 边框的亮度
        this.outlinePass.edgeGlow = 2// 光晕[0,1]
        this.outlinePass.usePatternTexture = false // 是否使用父级的材质
        this.outlinePass.edgeThickness = 5.0 // 边框宽度
        this.outlinePass.downSampleRatio = 1 // 边框弯曲度
        this.outlinePass.pulsePeriod = 5 // 呼吸闪烁的速度
        this.outlinePass.visibleEdgeColor.set(parseInt(0xff0000)) // 呼吸显示的颜色
        this.outlinePass.hiddenEdgeColor = new THREE.Color(0, 0, 0) // 呼吸消失的颜色
        this.outlinePass.clear = true
        this.composer.addPass(this.outlinePass)
        // 自定义的着色器通道 作为参数
        let effectFXAA = new ShaderPass(FXAAShader)
        effectFXAA.uniforms.resolution.value.set(1 / this.ParameterConfig.WBGLCanvasWidth, 1 / this.ParameterConfig.WBGLCanvasHeight)
        effectFXAA.renderToScreen = true
        // this.composer.addPass(effectFXAA)
        // //
        // const dotScreenPass = new DotScreenPass()
        // this.composer.addPass(dotScreenPass)
        // //
        // const glitchPass = new GlitchPass()
        //  .goWild = true  // 开启持续不间断的故障闪烁
        // this.composer.addPass(glitchPass)
        //
        // const rgbShiftPass = new ShaderPass(RGBShiftShader)
        // this.composer.addPass(rgbShiftPass)
        //
        // const smaaPass = new SMAAPass()
        // this.composer.addPass(smaaPass)
        //
        // const unrealBloomPass = new UnrealBloomPass()
        // unrealBloomPass.strength = 0.3
        // unrealBloomPass.radius = 1
        // unrealBloomPass.threshold = 0.6
        // this.composer.addPass(unrealBloomPass)
        //
        // 自定义着色通道
        // const TintShader = {
        //     uniforms:
        //     {
        //         tDiffuse: { value: null },
        //         uTint: { value: null }
        //     },
        //     vertexShader: `
        //         varying vec2 vUv;

        //         void main()
        //         {
        //             gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

        //             vUv = uv;
        //         }
        //     `,
        //     fragmentShader: `
        //         uniform sampler2D tDiffuse;
        //         uniform vec3 uTint;

        //         varying vec2 vUv;

        //         void main()
        //         {
        //             vec4 color = texture2D(tDiffuse, vUv);
        //             color.rgb += uTint;
        //             gl_FragColor = color;
        //         }
        //     `
        // }
        // const tintPass = new ShaderPass(TintShader)
        // tintPass.material.uniforms.uTint.value = new THREE.Vector3()
        // this.composer.addPass(tintPass)
        ///
        // const DisplacementShader = {
        //     uniforms:
        //     {
        //         tDiffuse: { value: null },
        //         uTime: { value: null },
        //         uNormalMap: { value: null }
        //     },
        //     vertexShader: `
        //         varying vec2 vUv;

        //         void main()
        //         {
        //             gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

        //             vUv = uv;
        //         }
        //     `,
        //     fragmentShader: `
        //         uniform sampler2D tDiffuse;
        //         uniform float uTime;
        //         uniform sampler2D uNormalMap;

        //         varying vec2 vUv;

        //         void main()
        //         {
        //             vec3 normalColor = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;
        //             vec2 newUv = vUv + normalColor.xy * 0.1;
        //             vec4 color = texture2D(tDiffuse, newUv);

        //             vec3 lightDirection = normalize(vec3(- 1.0, 1.0, 0.0));
        //             float lightness = clamp(dot(normalColor, lightDirection), 0.0, 1.0);
        //             color.rgb += lightness * 2.0;

        //             gl_FragColor = color;
        //         }
        //     `
        // }
        // // 自定义位移通道
        // this.displacementPass = new ShaderPass(DisplacementShader)
        // this.displacementPass.material.uniforms.uTime.value = 0
        // let textureLoader = new THREE.TextureLoader()
        // this.displacementPass.material.uniforms.uNormalMap.value = textureLoader.load(require('@/assets/img/back.jpg'))
        // this.composer.addPass(this.displacementPass)


    }
    //////////////////////////////
}
export { DrawThreeJsClass }