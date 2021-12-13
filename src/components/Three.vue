<template>
  <div ref="container" class="three"></div>
</template>

<script>
import * as THREE from "three";

const vertex = `
uniform float uTime;
varying vec2 vUv;
varying vec3 vPosition;
void main() {
  vPosition = position.xyz;
  vUv = uv;
  vec3 delta = normal * sin(position.x/5.5 * position.y/12.0 + uTime*30.0 + position.z/10.0);
  vec3 newPosition = position + delta;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;
const fragment = `
uniform float uTime;
varying vec2 vUv;
varying vec3 vPosition;
void main() {
   //gl_FragColor = vec4(0.173, 0.635, 1., sin(uTime*30.0)/16.0+(1.0-vUv.y*1.6)-(vUv.x*0.0));
   gl_FragColor = vec4(0.75, 0.35-vPosition.y/32.0, 0.70, sin(uTime*30.0)/16.0+(1.0-vUv.y*1.6)-(vUv.x*0.0));
}
`;

export default {
  name: "Three",
  data() {
    return {
      mouseSpeedX: null,
      mouseSpeedY: null,
      noiseTexture: null,
      rAF: null,
      camera: null,
      scene: null,
      renderer: null,
      composer: null,
      sphere_small: null,
      sphere_big: null,
      uniforms: null,
      geometry: null,
      geometry_small: null,
      material: null,
      container: null,
      pointLight: null,
      pointLight2: null,
      pointLight3: null,
      controls: null,
      renderPass: null,
      bloomPass: null,
      shaderPass: null,
      time: 0,
      bg_color: 0x010a18,
      materialPhong_color: 0x31c41,
      materialPhong_emissive: 0x180819,
      intersectionObserver: null,
      onScreen: true,
    };
  },
  mounted() {
    this.init();
    this.animate();
    this.initIntersectionObserver();
  },
  methods: {
    init() {
      this.container = this.$refs.container;
      this.initScene();
      this.initCamera();
      this.initRenderer();
      this.initEventListeners();
      this.createObjects();

      this.container.appendChild(this.renderer.domElement);
    },
    initIntersectionObserver() {
      this.intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.onScreen = true;
          } else {
            this.onScreen = false;
          }
        });
      });
      this.intersectionObserver.observe(this.container);
    },
    initScene() {
      this.scene = new THREE.Scene();
      this.initTexture();
      this.initLights();
    },
    initTexture() {
      this.noiseTexture = new THREE.TextureLoader().load(
        "../assets/img/clouds_DXT1_512.dds"
      );
    },
    initLights() {
      this.pointLight = new THREE.PointLight(0x94dce3, 2, 0);
      this.pointLight.position.set(-100, 300, 100);
      this.scene.add(this.pointLight);
      this.pointLight2 = new THREE.PointLight(0xedb095, 1.7, 0);
      this.pointLight2.position.set(250, 150, -360);
      this.scene.add(this.pointLight2);
      this.pointLight3 = new THREE.PointLight(0x94ffe3, 0.7, 0);
      this.pointLight3.position.set(-250, 150, -160);
      this.scene.add(this.pointLight3);
    },
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        45,
        this.container.offsetWidth / this.container.offsetHeight,
        1,
        2000
      );
      this.camera.position.y = 30;
      this.camera.position.z = 100;
    },
    initRenderer() {
      this.renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(
        this.container.offsetWidth,
        this.container.offsetHeight
      );
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMapSort = true;
      this.renderer.setClearColor(this.bg_color, 1);
    },
    initComposer() {
      this.composer.addPass(this.bloomPass);
    },
    initEventListeners() {
      this.onWindowResize();
      window.addEventListener("resize", this.onWindowResize, false);
    },
    onWindowResize() {
      this.camera.aspect =
        this.container.offsetWidth / this.container.offsetHeight;
      this.renderer.setSize(
        this.container.offsetWidth,
        this.container.offsetHeight
      );
      this.camera.updateProjectionMatrix();
    },
    createObjects() {
      this.uniforms = {
        uTime: { type: "f", value: this.time },
      };

      this.geometry_small = new THREE.SphereBufferGeometry(26, 64, 64);
      this.geometry = new THREE.SphereBufferGeometry(31, 64, 64);

      this.materialPhong = new THREE.MeshPhongMaterial({
        color: 0x050113,
        emissive: 0x050113,
        specular: 0xccddff,
        shininess: 3.0,
        transparent: true,
        opacity: 0.5,
      });
      this.material = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        map: this.noiseTexture,
        overdraw: true,
        transparent: true,
        side: THREE.DoubleSide,
        vertexShader: vertex,
        fragmentShader: fragment,
      });
      //this.material.uniforms.map.value = this.noiseTexture;
      //this.material.map = this.noiseTexture;

      this.sphere_small = new THREE.Mesh(
        this.geometry_small,
        this.materialPhong
      );
      this.sphere_big = new THREE.Mesh(this.geometry, this.material);

      this.scene.add(this.sphere_big);
      this.scene.add(this.sphere_small);
    },
    animate() {
      this.raF = requestAnimationFrame(this.animate);
      this.time += 0.005;
      this.updateUniforms();
      this.render();
    },
    updateUniforms() {
      this.scene.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material.type === "ShaderMaterial"
        ) {
          child.material.uniforms.uTime.value = this.time;
          child.material.needsUpdate = true;
        }
      });
    },
    render() {
      this.camera.lookAt(this.scene.position);
      this.renderer.render(this.scene, this.camera);
    },
  },
};
</script>

<style lang="scss" scoped>
.three {
  width: 100%;
  height: 100%;
}
</style>
