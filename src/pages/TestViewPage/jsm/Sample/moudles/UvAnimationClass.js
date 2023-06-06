class UvAnimationClass {
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
        const planeGeometry = new THREE.PlaneGeometry(this.ParameterConfig.WBGLCanvasWidth*0.2 , this.ParameterConfig.WBGLCanvasHeight*0.2, 1, 1);
        const planeMaterial = new THREE.MeshLambertMaterial({
            color: 0x080631,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide,
        });
        const texLoader = new THREE.TextureLoader();
        this.ParameterConfig.Texture = texLoader.load(require('@/assets/img/tube.png'));
        const material = new THREE.MeshLambertMaterial({
            map: this.ParameterConfig.Texture,
            side: THREE.DoubleSide,
        });
        this.ParameterConfig.Texture.wrapS = THREE.RepeatWrapping;
        this.ParameterConfig.Texture.repeat.x = 50;
        const plane = new THREE.Mesh(planeGeometry, material);
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.set(0, 0, 2);
        this.ParameterConfig.scene.add(plane);
    }
    AnimationFun() {
        this.ParameterConfig.Texture.offset.x += 0.05;
    }

}
export { UvAnimationClass }