class EarthBoxGeometrClass {
    constructor(ParameterConfig) {
        this.ParameterConfig = {
            ...ParameterConfig
        }
        this.DrawFun()

    }
    DrawFun() {
        this.CreateGeometry()
    }
    CreateGeometry() {
        const geometry = new THREE.SphereGeometry(200, 200, 200); //球体
        geometry.scale(0.2, 0.2, 0.2);
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
        this.ParameterConfig.GeometryBox.position.set = (0,0,0)
        this.ParameterConfig.scene.add(this.ParameterConfig.GeometryBox);
    }
    AnimationFun() {

    }

}
export { EarthBoxGeometrClass }