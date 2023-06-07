import { debounce, ScreenTransToThreeCoord, ThreeTransToScreenCoord, GetXYToCanvas } from '../uitls/index'
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

class EffectComposerClass {
    constructor(ParameterConfig) {
        this.ParameterConfig = {
            ...ParameterConfig
        }
        this.DrawFun()

    }
    DrawFun() {
        this.EffectComposerFun()
        this.ParameterConfig.ThreeJsContainer.addEventListener('click', event => {
            this.ClickEvent(event)
        });
        ////
        this.Creatdiv({ x: 0, y: 0 })
        ////
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
    AnimationFun() {
        if (this.composer) {
            if (this.displacementPass) {
                const elapsedTime = this.ParameterConfig.clock.getElapsedTime()
                // Update passes
                this.displacementPass.material.uniforms.uTime.value = elapsedTime
            }
            this.composer.render()
        }
    }
    //////////////后期处理////////////////
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
            ////
            let screenCoord = ThreeTransToScreenCoord(intersects[0].object.position, this.ParameterConfig.camera, canvasDom)
            this.Resetdiv(screenCoord)
            ///
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
    /////////////后期处理/////////////////
    //ThreeTransToScreenCoord
    Creatdiv(screenCoord) {
        console.log(`screenCoord`, screenCoord);
        //创建一个div
        this.div = document.createElement('div');
        this.div.className = "MyCreatdiv"
        this.div.style.width = "100px"
        this.div.style.height = "100px"
        this.div.style.background = "red"
        this.div.innerHTML = `我创建d一个div,x:${screenCoord.x}px,y:${screenCoord.y}px`
        this.div.style.position = "absolute"
        this.div.style.top = `${screenCoord.x}px`
        this.div.style.left = `${screenCoord.y}px`
        this.ParameterConfig.ThreeJsContainer.appendChild(this.div)
    }
    Resetdiv(screenCoord) {
        // if(this.ParameterConfig.WBGLCanvasWidth, this.ParameterConfig.WBGLCanvasHeight){

        // }
        let rect = this.div.getBoundingClientRect();
        let x = screenCoord.x + rect.width > this.ParameterConfig.WBGLCanvasWidth ? this.ParameterConfig.WBGLCanvasWidth - rect.width : screenCoord.x
        let y = screenCoord.y + rect.height > this.ParameterConfig.WBGLCanvasHeight ? this.ParameterConfig.WBGLCanvasHeight - rect.height : screenCoord.y
        this.div.innerHTML = `我创建d一个div,x:${screenCoord.x}px,y:${screenCoord.y}px`
        this.div.style.top = `${x}px`
        this.div.style.left = `${y}px`
    }
    //画布自适应
    WindowResizeResetViewFun() {
        // Update effect composer
        this.composer.setSize(this.ParameterConfig.WBGLCanvasWidth, this.ParameterConfig.WBGLCanvasHeight)
        console.log("后期处理----画面变化了")
    }
}
export { EffectComposerClass }

///使用
/*
        new EffectComposerClass(this.ParameterConfig)
*/
//import { EffectComposerClass } from './OutlinePassGlitchPass/index'