<template>
  <div class="VideoTextureViewPage">
    <video src="./video/sintel.mp4" id="video" autoplay loop style="display:none">
    </video>
    <div class="Container" ref="ContainerRef"></div>
  </div>
</template>
  
<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
//GUI
export default {
  name: "VideoTextureViewPage",
  data() {
    return {
      renderer: null,
      scene: null,
      camera: null,
      orbit: null,
      control: null,
      videoTexture: null,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.InitFun()
    })
  },
  methods: {
    InitFun() {
      let ContainerRefDiv = this.$refs.ContainerRef
      let Width = ContainerRefDiv.getBoundingClientRect().width
      let Height = ContainerRefDiv.getBoundingClientRect().height
      console.log("ContainerRefDiv", ContainerRefDiv);
      console.log("ContainerRefDiv-getClientRects()", ContainerRefDiv.getClientRects());
      console.log("ContainerRefDiv--getBoundingClientRect()", ContainerRefDiv.getBoundingClientRect());
      var video = document.getElementById('video');
      this.videoTexture = new THREE.Texture(video);
      this.videoTexture.minFilter = THREE.LinearFilter;
      this.videoTexture.magFilter = THREE.LinearFilter;
      this.videoTexture.format = THREE.RGBFormat;
      this.videoTexture.generateMipmaps = false;
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(45, Width / Height, 0.1, 1000);
    
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setClearColor(0xcccccc, 1.0);
      this.renderer.setSize(Width, Height);
      ContainerRefDiv.appendChild(this.renderer.domElement);
      this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
      /////
      var cubeGeometry = new THREE.BoxGeometry(1, 10, 20);
      var cubeMaterial = new THREE.MeshBasicMaterial({ map: this.videoTexture });
    
      var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.set(-10.05, 0, 0);
      cube.rotation.x = -0.3;
      cube.rotation.y = 23.5;
      cube.name = 'cube';
      this.scene.add(cube);

      var cubetwoGeometry = new THREE.BoxGeometry(1, 10, 20);
      var cubetwoMaterial = new THREE.MeshBasicMaterial({ map: this.videoTexture });
     
      var cubetwo = new THREE.Mesh(cubetwoGeometry,cubetwoMaterial);
      cubetwo.position.set(10.05, 0, 0);
      cubetwo.rotation.x = -0.3;
      cubetwo.rotation.y = 23.5;
      this.scene.add(cubetwo);
      var dirLightLeft = new THREE.DirectionalLight();
      dirLightLeft.position.set(15, 20, 20);
      this.scene.add(dirLightLeft);

      var dirLightRight = new THREE.DirectionalLight();
      dirLightRight.position.set(-15, 20, 20);
      this.scene.add(dirLightRight);
      this.camera.position.x = 0;
      this.camera.position.y = 12;
      this.camera.position.z = 30;
      this.camera.lookAt(this.scene.position);

      this.control = () => {
        //this.rotationSpeed = 0.005;
        this.scale = 1;
      };
     //addControls(this.control);
  
      function addControls(controlObject) {
        var gui = new GUI();
        gui.add(controlObject, 'scale', 0.01, 5);
      }

     let render=()=> {
      this.renderer.render(this.scene, this.camera);
        //scene.getObjectByName('cube').rotation.y += control.rotationSpeed;
        this.scene.getObjectByName('cube').scale.set(this.control.scale, this.control.scale, this.control.scale);

        this.videoTexture.needsUpdate = true;

        requestAnimationFrame(()=>{
          render
        });
      }
      render();
    }
  }
}
</script>
  
<style lang="scss" scoped>
.VideoTextureViewPage {
  width: 100%;
  height: 100%;

  .Container {
    width: 100%;
    height: 100%;
  }

}
</style>
  
  