class LightClass {
    constructor(ParameterConfig) {
        this.ParameterConfig = {
            ...ParameterConfig
        }
        this.DrawFun()

    }
    DrawFun() {
        this.CreateSpotLight()
        this.CreateHemisphereLight()
        this.CreateAmbientLight()
    }
    //创建聚广源SpotLight
    CreateSpotLight() {
        let light = new THREE.SpotLight(0xffffff, 1.0); // 创建聚光灯
        light.position.set(150, 150, 150);
        light.castShadow = true;
        this.ParameterConfig.scene.add(light);//光源添加到场景中
        // 聚广源辅助对象，可视化聚广源
        const spotLightHelper = new THREE.SpotLightHelper(light, 0xffffff)
        this.ParameterConfig.scene.add(spotLightHelper);
    }
    // 创建环境光
    CreateAmbientLight() {
        let light = new THREE.AmbientLight('#ef0038');
        this.ParameterConfig.scene.add(light)
    }
    // 创建平行光
    CreateDirectionalLight() {
        // 平行光
        const light = new THREE.DirectionalLight(0xffffff, 1);
        // 平行光设置产生阴影的光源对象,开启光源阴影的计算功能
        light.castShadow = true;
        this.ParameterConfig.scene.add(light)
        // 可视化平行光阴影对应的正投影相机对象
        const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
        this.ParameterConfig.scene.add(cameraHelper);

    }
    // 创建
    CreateHemisphereLight() {
        let light = new THREE.HemisphereLight('#2cef00', '#ef0038')
        light.position.set(100, 10, 105);//光源位置
        this.ParameterConfig.scene.add(light);//光源添加到场景中
    }


}
export { LightClass }