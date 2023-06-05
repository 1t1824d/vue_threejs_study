<template>
    <div class="BackUpsViewTwoPage">
        <div class="BackUpsViewTwoPageOutbox">
            <div class="mythreedemojsdiv" ref="MyThreeJsContainer">
            </div>
        </div>
    </div>
</template>
<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
export default {
    name: "BackUpsViewTwoPage",
    mounted() {
        this.$nextTick(() => {
            this.Draw()
        })
    },
    methods: {
        Draw() {
            let MyThreeJsContainer = this.$refs.MyThreeJsContainer
            let WBGLCanvasWidth = MyThreeJsContainer.getBoundingClientRect().width
            let WBGLCanvasHeight = MyThreeJsContainer.getBoundingClientRect().height
            // 获取画布：canvas
            // Three.js需要使用这个canvas标签来绘制，所以我们要先获取它然后传给three.js
            // 创建场景：Scene，three.js绘制的东西都需要加入到scene中
            const scene = new THREE.Scene()
            {
                // 设置光源：light（光的颜色、亮度），three.js中有很多种类型的灯光
                const light = new THREE.DirectionalLight(0xFFFFFF, 1);
                // 调整光的位置，默认是（0,0,0）
                light.position.set(-1, 2, 4);
                // 添加光源light到场景scene
                scene.add(light);
            }
            // 添加相机：camera
            // 透视摄像机：PerspectiveCamera，作为其他对象的子对象，会继承它父对象的位置和朝向
            // 参数解释(视野角度，长宽比，近截面，远截面)
            // 近平面和远平面的高度由视野范围决定，宽度由视野范围和宽高比决定。
            // 视椎体内部的物体将被绘制，视椎体外的东西将不会被绘制
            let camera = new THREE.PerspectiveCamera(75, WBGLCanvasWidth / WBGLCanvasHeight, 0.1, 1000);
            // 摄像机默认指向Z轴负方向，上方向朝向Y轴正方向。我们将会把立方体放置在坐标原点，所以我们需要往后移一下摄像机才能显示出物体
            camera.position.z = 5
            camera.lookAt(scene.position)
            // 添加渲染器
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
            // 设置渲染器尺寸
            renderer.setSize(WBGLCanvasWidth, WBGLCanvasHeight)
            // 切换背景颜色
            renderer.setClearColor('#fff')
            renderer.shadowMap.enabled = true; // 显示阴影
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            MyThreeJsContainer.appendChild(renderer.domElement);
            let clock = new THREE.Clock(); //创建THREE.Clock对象，用于计算上次调用经过的时间
            let controls = new OrbitControls(camera, renderer.domElement);
            controls.autoRotate = true; //是否自动旋转
            ///
            const planeGeometry = new THREE.PlaneGeometry(50, 50, 1, 1); //创建一个平面几何对象

            //材质
            const planeMaterial = new THREE.MeshLambertMaterial({
                color: 0x080631,
                transparent: true,
                opacity: 0.8
            });
            //纹理贴图加载器TextureLoader
            const texLoader = new THREE.TextureLoader();
            // .load()方法加载图像，返回一个纹理对象Texture
            const texture = texLoader.load(require('@/assets/img/tube.png'));
            const material = new THREE.MeshLambertMaterial({
                // 设置纹理贴图：Texture对象作为材质map属性的属性值
                map: texture,//map表示材质的颜色贴图属性
            });

            // 设置.wrapS也就是U方向，纹理映射模式(包裹模式)
            texture.wrapS = THREE.RepeatWrapping;//对应offste.x偏移
            // uv两个方向纹理重复数量
            texture.repeat.x = 50;//注意选择合适的阵列数量
            const plane = new THREE.Mesh(planeGeometry, material);

            //设置平面位置
            plane.rotation.x = -0.5 * Math.PI;
            plane.position.set(0, -2, 0);

            //平面添加到场景中
            scene.add(plane);
            //             const material = new THREE.LineBasicMaterial({
            // 	color: 0x0000ff
            // });

            // const points = [];
            // points.push(new THREE.Vector3(- 10, 0, 0));
            // points.push(new THREE.Vector3(0, 10, 0));
            // points.push(new THREE.Vector3(10, 0, 0));

            // const geometry2 = new THREE.BufferGeometry().setFromPoints(points);

            // const line = new THREE.Line(geometry2, material);
            // scene.add(line);

            // 添加几何体：Geometry
            // Three.js内置了许多基本几何体 ，也可以创建自定义几何体或从文件中加载几何体
            // 组成三维物体的顶点信息（宽、高、深度）
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            // 函数中带三个参数(几何体、颜色、x轴偏移量)
            function makeInstance(geometry, color, x) {
                // 添加材质：Material
                // 材质可以绘制几何体的表面属性，比如如何绘制物体，光滑还是平整，什么颜色，什么贴图等等
                // 改成会受灯光影响的材质，不然很难看出是三维的：MeshBasicMaterial
                const material = new THREE.MeshPhongMaterial({ color });
                // 添加网格：Mesh，(参数：几何体geometry，材质material)
                // 用一种特定的材质来绘制的一个特定的几何体同时材质和几何体可以被多个网格对象使用只需改变网格轴位置即可
                const cube = new THREE.Mesh(geometry, material);
                // 将网格cube添加到场景中
                scene.add(cube);
                // 将x赋值给x轴偏移量
                cube.position.x = x;
                // 修改各参数后返回最终的cube
                return cube;
            }
            // 定义常量cubes，每个makeInstance都是一个网格
            // 同时材质和几何体可以被多个网格对象使用
            // 生成的网格存在一个数组中，三个网格会调用三次函数makeInstance
            const cubes = [
                makeInstance(geometry, 0x8844aa, -2),
                makeInstance(geometry, 0x44aa88, 0),
                makeInstance(geometry, 0xaa8844, 2),
            ];
            // 渲染循环函数
            function render(time) {
                texture.offset.x += 0.5;//纹理U方向偏移
                time *= 0.001;  // 将默认毫秒转换为秒
                // 给每个网格设置循环，并且每个立方体设置了稍微不同的旋转角度
                cubes.forEach((cube, ndx) => {
                    const speed = 1 + ndx * .1;
                    const rot = time * speed;
                    cube.rotation.x = rot;
                    cube.rotation.y = rot;
                });
                // 将场景和摄像机传递给渲染器来渲染出整个场景
                renderer.render(scene, camera);
                // requestAnimationFrame函数会告诉浏览器你需要显示动画
                // 传入render作为回调函数
                requestAnimationFrame(render);
            }
            // 回调函数之外在主进程中再调用一次requestAnimationFrame来开始整个渲染循环
            requestAnimationFrame(render);
        }
    }
}
</script>

<style lang="scss" scoped>
.BackUpsViewTwoPage {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    .BackUpsViewTwoPageOutbox {
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