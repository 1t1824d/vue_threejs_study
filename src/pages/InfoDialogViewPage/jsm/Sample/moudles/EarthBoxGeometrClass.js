import { Group } from 'three';
class EarthBoxGeometrClass {
    constructor(ParameterConfig) {
        this.ParameterConfig = {
            ...ParameterConfig,
            areas: [{
                name: "中国",
                position: [116.20, 39.55]
            }, {
                name: "中非共和国",
                position: [18.35, 4.23]
            }, {
                name: "智利",
                position: [-70.40, -33.24]
            }, {
                name: "乍得",
                position: [14.59, 12.10]
            }, {
                name: "赞比亚",
                position: [28.16, -15.28]
            }, {
                name: "越南",
                position: [105.55, 21.05]
            }, {
                name: "约旦",
                position: [35.52, 31.57]
            }, {
                name: "维尔京群岛",
                position: [-64.37, 18.27]
            }, {
                name: "英国",
                position: [-0.05, 51.36]
            }],
            radius: 50
        }
        this.DrawFun()

    }
    DrawFun() {
        this.CreateGeometry().CreateAreaPoint().AddToSeneFun()
        window.addEventListener('click', (event) => {
            this.clickMouse(event)
        }, false);
    }
    AddToSeneFun() {
        this.ParameterConfig.scene.add(this.ParameterConfig.Group);
        // this.ParameterConfig.scene.Group.scale(0.2, 0.2, 0.2);
    }
    CreateGeometry() {
        this.ParameterConfig.Group = new Group()
        const geometry = new THREE.SphereGeometry(this.ParameterConfig.radius, 50, 50); //球体
        // geometry.scale(0.2, 0.2, 0.2);
        console.log('uv', geometry.attributes.uv);
        //纹理贴图加载器TextureLoader
        const texLoader = new THREE.TextureLoader();
        // .load()方法加载图像，返回一个纹理对象Texture
        const texture = texLoader.load(require('@/assets/img/earth.png'));
        const material = new THREE.MeshLambertMaterial({
            // 设置纹理贴图：Texture对象作为材质map属性的属性值
            map: texture,//map表示材质的颜色贴图属性
            transparent: true, //使用背景透明的png贴图，注意开启透明计算
            flipY: false,
        });

        this.ParameterConfig.GeometryBox = new THREE.Mesh(geometry, material);
        this.ParameterConfig.GeometryBox.name = "MyEarthBoxGeometrClass";
        this.ParameterConfig.GeometryBox.position.set = (0, 0, 0)
        this.ParameterConfig.Group.add(this.ParameterConfig.GeometryBox);
        return this
    }
    // 创建地标
    CreateAreaPoint() {
        // 循环创建地标，文字标签
        let areas = this.ParameterConfig.areas
        for (let i = 0, length = areas.length; i < length; i++) {
            const name = areas[i].name
            const position = this.CreatePosition(areas[i].position)
            this.CreateHexagon(position); // 地标函数
            this.CreateTxt(position, name); // 精灵标签函数
            //this.CreateTextCanvas(position,name) // 贴图标签函数
        }
        return this
    }
    // 经纬度转坐标
    CreatePosition(lnglat) {
        let spherical = new THREE.Spherical()
        spherical.radius = this.ParameterConfig.radius;
        const lng = lnglat[0]
        const lat = lnglat[1]
        const theta = (lng + 90) * (Math.PI / 180)
        const phi = (90 - lat) * (Math.PI / 180)
        spherical.phi = phi; // phi是方位面（水平面）内的角度，范围0~360度
        spherical.theta = theta; // theta是俯仰面（竖直面）内的角度，范围0~180度
        let position = new THREE.Vector3()
        position.setFromSpherical(spherical)
        return position
    }
    // 创建地标标记
    CreateHexagon(position) {
        var hexagon = new THREE.Object3D()
        let hexagonLine = new THREE.CircleGeometry(2, 6)
        let hexagonPlane = new THREE.CircleGeometry(1, 6)
        let vertices = hexagonLine.vertices
        let material = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            side: THREE.DoubleSide, //让材质单面或者双面显示,前面FrontSide ,背面：BackSide ,双面：DoubleSide
            opacity: 0.5
        })
        let circleLine = new THREE.LineLoop(hexagonLine, material)
        let circlePlane = new THREE.Mesh(hexagonPlane, material)
        circleLine.position.copy(position)
        circlePlane.position.copy(position)
        circlePlane.lookAt(new THREE.Vector3(0, 0, 0))
        circleLine.lookAt(new THREE.Vector3(0, 0, 0))

        hexagon.add(circleLine)
        hexagon.add(circlePlane)
        this.ParameterConfig.Group.add(hexagon);
    }
    //贴图标签，标签与球面融为一体
    CreateTextCanvas(position, name) {
        //用canvas生成图片
        let w = 200;
        let h = 100;
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext('2d');
        canvas.width = w;
        canvas.height = h;
        //左右翻转
        ctx.scale(-1, 1);
        ctx.translate(-w, 0);
        //制作矩形
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, w, h)
        //设置文字						
        ctx.fillStyle = "black";
        ctx.font = h / 2 + 'px "微软雅黑"';
        ctx.textAlign = 'center';
        ctx.fillText(name, h, h / 2 + 20);

        //生成图片
        let url = canvas.toDataURL('image/png');
        //几何体--长方形
        let geometry1 = new THREE.PlaneGeometry(6, 3);
        //将图片构建到纹理中
        let material1 = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(url),
            side: THREE.DoubleSide, //两面可见
            opacity: 1
        });
        let txtMesh = new THREE.Mesh(geometry1, material1);
        txtMesh.position.copy(position);
        txtMesh.lookAt(new THREE.Vector3(0, 0, 0));
        this.ParameterConfig.Group.add(txtMesh);
    }
    //精灵标签--标签永远面向相机
    CreateTxt(position, name) {
        var texture = new THREE.CanvasTexture(getCanvasFont());
        var fontMesh = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture }));
        /***设置mesh的name属性，用于鼠标点击标签弹出对应的名称***/
        fontMesh.name = name;
        // 放大
        fontMesh.scale.x = 10;
        fontMesh.scale.y = 5;
        // 在原位置各加 2px ,避免文字与地标重叠
        fontMesh.position.x = (position.x > 0 ? position.x + 2 : position.x - 2);
        fontMesh.position.y = (position.y > 0 ? position.y + 2 : position.y - 2);
        fontMesh.position.z = (position.z > 0 ? position.z + 2 : position.z - 2);
        // fontMesh.position.copy(position);	//原位置			
        this.ParameterConfig.Group.add(fontMesh);
        // canvas生成图片实现文字函数
        function getCanvasFont() {
            let w = 600;
            let h = 300;
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext('2d');
            canvas.width = w;
            canvas.height = h;
            //制作矩形
            ctx.fillStyle = "red";
            ctx.fillRect(0, 0, w, h)
            //设置文字						
            ctx.fillStyle = "black";
            ctx.font = h / 3 + 'px "微软雅黑"';
            ctx.textAlign = 'center';
            ctx.fillText(name, w / 2, h / 2 + 20)
            return canvas;
        }
    }

    AnimationFun() {

    }

    // 鼠标点击标记的事件
    clickMouse(event) {
        event.preventDefault();
        console.log(`1233`, 1233);
        let raycaster = new THREE.Raycaster();
        let mouse = new THREE.Vector2();
        let dom = this.ParameterConfig.renderer.domElement
        // 通过鼠标点击位置,计算出 raycaster 所点的位置,以屏幕为中心点,范围 -1 到 1
        let getBoundingClientRect = dom.getBoundingClientRect();
        mouse.x = ((event.clientX - getBoundingClientRect.left) / dom.offsetWidth) * 2 - 1;
        mouse.y = -((event.clientY - getBoundingClientRect.top) / dom.offsetHeight) * 2 + 1;

        //通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
        raycaster.setFromCamera(mouse, this.ParameterConfig.camera);

        // 获取与射线相交的对象数组，其中的元素按照距离排序，越近的越靠前
        let intersects = raycaster.intersectObjects(this.ParameterConfig.scene.children);

        this.deleteDiv(); //调用清除弹窗函数

        // 获取点击对象的值
        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].object.type == 'Sprite') {
                let countryName = intersects[i].object.name; // 国家						
                let V3 = intersects[i].object.position; // 三维坐标	
                console.log(`intersects[i].object`, intersects[i].object);
                if (countryName != '') {
                    console.log(`countryName`, countryName);
                    this.divPop(countryName, V3); //调用弹窗函数							
                }
            }
        }
    }

    // 弹窗内容与样式	
    divPop(countryName, V3) {
        let rs = this.WorldToScreen(V3.x, V3.y, V3.z); // 调用世界坐标转屏幕坐标函数								
        let div = document.createElement("divCell"); //创建一个div				    
        div.id = "divCell";  //设置ID
        div.innerHTML = countryName; //div的内容  
        div.style.padding = '5px';
        div.style.position = 'absolute';
        div.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        div.style.left = rs.x + "px";
        div.style.top = rs.y + "px";
        this.ParameterConfig.ThreeJsContainer.appendChild(div); //添加到页面 
    }

    // 清除弹窗
    deleteDiv() {
        //如果原来有“divCell”这个图层，先删除这个图层
        let d = document.getElementById("divCell");
        if (d != null) {
            d.parentNode.removeChild(d);
        }
    }

    // 世界坐标转屏幕坐标
    WorldToScreen(x, y, z) {
        let worldVector = new THREE.Vector3(x, y, z);
        let vector = worldVector.project(this.ParameterConfig.camera); //世界坐标转标准设备坐标
        let w = this.ParameterConfig.WBGLCanvasWidth / 2;
        let h = this.ParameterConfig.WBGLCanvasHeight / 2;
        return {
            x: Math.round(vector.x * w + w),
            y: Math.round(-vector.y * h + h)
        }
    }



}
export { EarthBoxGeometrClass }