<template>
    <div class="BackUpsViewOnePage">
        <div class="BackUpsViewOnePageOutbox">
            <div class="mythreedemojsdiv" ref="MyThreeJsContainer">
            </div>
        </div>
    </div>
</template>
<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
export default {
    name: "BackUpsViewOnePage",
    data() {
        return {
            MyThreeJsContainer: null,
            ThreeJsConfig: {
                WBGLCanvasWidth: null,
                WBGLCanvasHeight: null,
                scene: null,
                camera: null,
                renderer: null,
                clock: null,
                controls: null
            },
            RequestAnimationFrameVal: null
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.Draw()

        })
    },
    beforeDestroy() {
        this.dispose();
    },
    methods: {
        InitThreeJsRendererFun() {
            this.MyThreeJsContainer = this.$refs.MyThreeJsContainer
            this.ThreeJsConfig.WBGLCanvasWidth = this.MyThreeJsContainer.getBoundingClientRect().width
            this.ThreeJsConfig.WBGLCanvasHeight = this.MyThreeJsContainer.getBoundingClientRect().height
            console.log(`this.ThreeJsConfig.WBGLCanvasWidth `, this.ThreeJsConfig.WBGLCanvasWidth);
            this.ThreeJsConfig.scene = new THREE.Scene()
            const light = new THREE.DirectionalLight(0xFFFFFF, 1);
            light.position.set(-1, 2, 4);
            this.ThreeJsConfig.scene.add(light);
            this.ThreeJsConfig.camera = new THREE.PerspectiveCamera(75, this.ThreeJsConfig.WBGLCanvasWidth / this.ThreeJsConfig.WBGLCanvasHeight, 0.1, 1000);
            this.ThreeJsConfig.camera.position.z = 5
            this.ThreeJsConfig.camera.lookAt(this.ThreeJsConfig.scene.position)
            this.ThreeJsConfig.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
            this.ThreeJsConfig.renderer.setSize(this.ThreeJsConfig.WBGLCanvasWidth, this.ThreeJsConfig.WBGLCanvasHeight)
            this.ThreeJsConfig.renderer.setClearColor('#fff')
            this.ThreeJsConfig.renderer.shadowMap.enabled = true; // 显示阴影
            this.ThreeJsConfig.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.MyThreeJsContainer.appendChild(this.ThreeJsConfig.renderer.domElement);
            this.ThreeJsConfig.clock = new THREE.Clock(); //创建THREE.Clock对象，用于计算上次调用经过的时间
            this.ThreeJsConfig.controls = new OrbitControls(this.ThreeJsConfig.camera, this.ThreeJsConfig.renderer.domElement);
            this.ThreeJsConfig.controls.autoRotate = true; //是否自动旋转
            return this.ThreeJsConfig
        },
        PromiseFun(fun = fun()) {
            return new Promise((resolve, reject) => {
                let res = fun()
                resolve(res)
            })
        },
        Draw() {
            this.PromiseFun(this.InitThreeJsRendererFun)
                .then(() => {
                    console.log(`this.ThreeJsConfig`, this.ThreeJsConfig);
                    this.PromiseFun(this.AllDrawFun)
                        .then(() => {
                            this.ThreeJsConfig.renderer.render(this.ThreeJsConfig.scene, this.ThreeJsConfig.camera);
                            this.UpdateFun()
                        })
                })

        },
        //所有绘制图形方法
        AllDrawFun() {
            this.CreatePlaneGeometry()
            this.CreateBoxGeometry()
            this.CreateLine()
            this.OnWindowResize()
            this.DblclickFullscreenFun()
        },
        //设置动画
        UpdateFun() {
            this.ThreeJsConfig.PlaneGeometryTexture.offset.x += 0.05;
            this.ThreeJsConfig.renderer.render(this.ThreeJsConfig.scene, this.ThreeJsConfig.camera);
            this.RequestAnimationFrameVal = requestAnimationFrame(() => {
                this.UpdateFun()
            })
        },
        //销毁
        dispose() {
            if (this.MyThreeJsContainer) {
                this.CancelAnimationFun()
                this.MyThreeJsContainer.parentNode.removeChild(this.MyThreeJsContainer);
                this.MyThreeJsContainer = null

            }
        },
        //取消动画
        CancelAnimationFun() {
            cancelAnimationFrame(this.RequestAnimationFrameVal)
            this.RequestAnimationFrameVal = null
        },
        //画布自适应
        OnWindowResize() {
            //监听画面变化，更新渲染画面，（自适应的大小）
            window.addEventListener('resize', () => {
                this.ThreeJsConfig.WBGLCanvasWidth = this.MyThreeJsContainer.getBoundingClientRect().width
                this.ThreeJsConfig.WBGLCanvasHeight = this.MyThreeJsContainer.getBoundingClientRect().height
                this.WindowResizeResetViewFun()
            })
        },
        WindowResizeResetViewFun() {
            //更新摄像机的宽高比
            this.ThreeJsConfig.camera.aspect = this.ThreeJsConfig.WBGLCanvasWidth / this.ThreeJsConfig.WBGLCanvasHeight
            //更新摄像机的投影矩阵
            this.ThreeJsConfig.camera.updateProjectionMatrix()
            //设置渲染器的像素比
            // this.ThreeJsConfig.renderer.setPixelRatio(window.devicePixelRatio);
            this.ThreeJsConfig.renderer.setPixelRatio(2);
            //更新渲染器宽度和高度
            this.ThreeJsConfig.renderer.setSize(this.ThreeJsConfig.WBGLCanvasWidth, this.ThreeJsConfig.WBGLCanvasHeight)
            console.log("画面变化了")
        },
        //画布全屏
        DblclickFullscreenFun() {
            window.addEventListener("dblclick", () => {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    //document.documentElement.requestFullscreen();
                    this.ThreeJsConfig.renderer.domElement.requestFullscreen();
                }
            })
        },
        //绘制几何图形
        CreatePlaneGeometry() {
            const planeGeometry = new THREE.PlaneGeometry(50, 50, 1, 1);
            const planeMaterial = new THREE.MeshLambertMaterial({
                color: 0x080631,
                transparent: true,
                opacity: 0.8
            });
            const texLoader = new THREE.TextureLoader();
            this.ThreeJsConfig.PlaneGeometryTexture = texLoader.load(require('@/assets/img/tube.png'));
            const material = new THREE.MeshLambertMaterial({
                map: this.ThreeJsConfig.PlaneGeometryTexture,
            });
            this.ThreeJsConfig.PlaneGeometryTexture.wrapS = THREE.RepeatWrapping;
            this.ThreeJsConfig.PlaneGeometryTexture.repeat.x = 50;
            const plane = new THREE.Mesh(planeGeometry, material);
            plane.rotation.x = -0.5 * Math.PI;
            plane.position.set(0, -2, 0);
            this.ThreeJsConfig.scene.add(plane);
        },
        CreateBoxGeometry() {
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            this.ThreeJsConfig.BoxGeometryCubes = [
                this.makeInstance(geometry, 0x8844aa, -2),
                this.makeInstance(geometry, 0x44aa88, 0),
                this.makeInstance(geometry, 0xaa8844, 2),
            ];

        },
        makeInstance(geometry, color, x) {
            const material = new THREE.MeshPhongMaterial({ color });
            const cube = new THREE.Mesh(geometry, material);
            this.ThreeJsConfig.scene.add(cube);
            cube.position.x = x;
            return cube;
        },
        CreateLine() {
            const material = new THREE.LineBasicMaterial({
                color: 0x0000ff
            });
            const points = [];
            points.push(new THREE.Vector3(- 10, 0, 0));
            points.push(new THREE.Vector3(0, 10, 0));
            points.push(new THREE.Vector3(10, 0, 0));
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, material);
            line.rotation.x = -0.5 * Math.PI;
            line.position.set(0, -2, 0);
            this.ThreeJsConfig.scene.add(line);

        },
    }
}
</script>

<style lang="scss" scoped>
.BackUpsViewOnePage {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    .BackUpsViewOnePageOutbox {
        width: 60%;
        height: 60%;
        border: 2px red dashed;

        .mythreedemojsdiv {
            width: calc(100% - 0px);
            height: calc(100% - 0px);
        }
    }
}
</style>