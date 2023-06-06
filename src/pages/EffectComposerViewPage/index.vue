<template>
    <div class="EffectComposerViewPage">
        <div id="map"></div>
    </div>
</template>
  
<script>
import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    DirectionalLight,
    MeshBasicMaterial,
    Mesh,
    TextureLoader,
    CylinderGeometry,
    RepeatWrapping
} from 'three';

import * as THREE from 'three'
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js"
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

export default {
    name: 'EffectComposerViewPage',
    components: {},
    data() {
        return {
            baseY: -20,
            composer: null,
            outlinePass: null,
            renderPass: null,

        }
    },
    mounted() {
        let scene = new Scene();
        let camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        // fov — 摄像机视锥体垂直视野角度
        // aspect — 摄像机视锥体长宽比
        // near — 摄像机视锥体近端面
        // far — 摄像机视锥体远端面
        let renderer = new WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        let app = document.getElementById("map")
        app.appendChild(renderer.domElement);
        //加载场景控制插件
        let controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enableZoom = true;
        controls.autoRotate = false;
        controls.autoRotateSpeed = 3;
        controls.enablePan = true;
        controls.enableKeys = true;
        controls.keyPanSpeed = 7;
        controls.keys = {
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            BOTTOM: 40
        }
        this.controls = controls;
        //添加一个光源
        let light = new DirectionalLight(0xffffff);//光源颜色
        light.position.set(200, 100, 1305);//光源位置
        scene.add(light);//光源添加到场景中

        camera.position.y = 30;
        camera.position.z = 100;
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;


        window.addEventListener('click', event => {
            this.clickEvent(event)
        });

        this.addBottom(scene)

        //渲染场景
        let animate = () => {
            requestAnimationFrame(animate);
            //渲染外发光
            renderer.render(scene, camera);
            if (this.composer) {
                this.composer.render()
            }

        };

        animate();
    },
    methods: {
        clickEvent(event) {
            //获取在射线上的接触点
            //获取鼠标坐标
            let mouse = new THREE.Vector2();
            let raycaster = new THREE.Raycaster();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, this.camera);
            let intersects = raycaster.intersectObjects(this.scene.children);
            if (intersects && intersects.length > 0) {
                this.outlineObj([intersects[0].object])

            }

        },
        //高亮显示模型（呼吸灯）
        outlineObj(selectedObjects) {
            // 创建一个EffectComposer（效果组合器）对象，然后在该对象上添加后期处理通道。
            this.composer = new EffectComposer(this.renderer)
            // 新建一个场景通道  为了覆盖到原理来的场景上
            this.renderPass = new RenderPass(this.scene, this.camera)
            this.composer.addPass(this.renderPass);
            // 物体边缘发光通道
            this.outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this.scene, this.camera, selectedObjects)
            this.outlinePass.selectedObjects = selectedObjects
            this.outlinePass.edgeStrength = 15.0 // 边框的亮度
            this.outlinePass.edgeGlow = 2// 光晕[0,1]
            this.outlinePass.usePatternTexture = false // 是否使用父级的材质
            this.outlinePass.edgeThickness = 1.0 // 边框宽度
            this.outlinePass.downSampleRatio = 1 // 边框弯曲度
            this.outlinePass.pulsePeriod = 5 // 呼吸闪烁的速度
            this.outlinePass.visibleEdgeColor.set(parseInt(0xff0000)) // 呼吸显示的颜色
            this.outlinePass.hiddenEdgeColor = new THREE.Color(0, 0, 0) // 呼吸消失的颜色
            this.outlinePass.clear = true
            this.composer.addPass(this.outlinePass)
            // 自定义的着色器通道 作为参数
            let effectFXAA = new ShaderPass(FXAAShader)
            effectFXAA.uniforms.resolution.value.set(1 / window.innerWidth, 1 / window.innerHeight)
            effectFXAA.renderToScreen = true
            this.composer.addPass(effectFXAA)
        },

        addBottom(scene) {

            let loader = new TextureLoader()
            let texture = loader.load(require('@/assets/img/back.jpg'),  (texture)=> {
                texture.wrapS = texture.wrapT = RepeatWrapping;
                texture.offset.set(0, 0);
                texture.repeat.set(1.57, 1);
            });
            let material = new MeshBasicMaterial({
                map: texture    // 通过map 属性引入图片
            })

            let bar = new CylinderGeometry(20, 20, 20, 40, 40, false);

            //  THREE.CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded)
            //  radiusTop：顶面的半径；
            // radiusBottom：底面的半径；
            //  height：是圆柱体的高度；
            //  radiusSegments：两底面的分段切片；
            //  heightSegments：侧面的分段切片；
            //  openEnded：是一个布尔值，表示是否没有顶面和底面，缺省值为false，表示有顶面和底面。

            let cubeBar = new Mesh(bar, material);
            cubeBar.position.x = 0
            cubeBar.position.y = this.baseY
            scene.add(cubeBar);
        },
    }
}
</script>
  
<style lang="scss" scoped>
.EffectComposerViewPage {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;

    #map {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
    }
}
</style>
  
  