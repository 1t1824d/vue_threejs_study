class BoxGeometryClass {
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
        const geometry = new THREE.BoxGeometry(10, 10, 10);
        this.ParameterConfig.BoxGeometryCubes = [
            this.MakeInstance(geometry, 0x8844aa, -20),
            this.MakeInstance(geometry, 0x44aa88, 0),
            this.MakeInstance(geometry, 0xaa8844, 20),
        ];
    }
    MakeInstance(geometry, color, x) {
        const material = new THREE.MeshPhongMaterial({ color });
        const cube = new THREE.Mesh(geometry, material);
        this.ParameterConfig.scene.add(cube);
        cube.position.x = x;
        return cube;
    }
    AnimationFun() {
    }

}
export { BoxGeometryClass }