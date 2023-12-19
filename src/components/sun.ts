import * as THREE from "three"
import fragment from "../shader/fragment.glsl"
import vertex from "../shader/vertex.glsl"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture.js'

export class Sun {
  private loader: THREE.Loader
  private geometry: THREE.SphereGeometry
  private material: THREE.ShaderMaterial

  private bowlMaterial: any// THREE.MeshBasicMaterial
  // private bowlGeometry: THREE.SphereGeometry
  // private bowl: THREE.Mesh
  private sun: THREE.Mesh
  private lastUpdate: number
  private renderTarget: THREE.WebGLRenderTarget

  public group: THREE.Group
  public bowlGroup: THREE.Group
  constructor(renderTarget: THREE.WebGLRenderTarget) {
    this.lastUpdate = Date.now()
    this.geometry = new THREE.SphereGeometry(3, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2)
    this.renderTarget = renderTarget

    const texture = new THREE.CanvasTexture(new FlakesTexture())
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.x = 2
    texture.repeat.y = 20
    // this.bowlGeometry = new THREE.SphereGeometry(3.1, 64, 64, 0, Math.PI * 2, Math.PI, Math.PI / 2)
    this.bowlMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      envMap: this.renderTarget.texture,
      
      color: 0xffffff,
      // wireframe: true,
      aoMap: texture,
      aoMapIntensity: -2,
      normalMap: texture,
      bumpMap: texture,
      bumpScale: 1,
      displacementScale: 0.001,
      
      normalScale: new THREE.Vector2(-1.0, -1.0),
      // aoMap: texture,
      emissive: 0x99ffff,
      metalness: .9,
      roughness: 0.3,
      // color: 0xaaffff,
      // metalness: .5,
      // clearcoat: .85,
      // reflectivity: 1,

      // clearcoatRoughness: 0,
      flatShading: true,
      // emissive: 0x00ffff,
      // emissiveMap: texture,
      emissiveIntensity: 0.4,
    })
    this.bowlGroup = new THREE.Group()

    this.loader = new GLTFLoader()
    this.loader.load('models/bowl.glb', (gltf: any) => {
      gltf.scene.position.x = 0;
      gltf.scene.position.y = 0;
      gltf.scene.position.z = 0;

      gltf.scene.rotation.y = Math.PI * 1.25;
      gltf.scene.scale.set(0.1, 0.1, 0.1);

      gltf.scene.traverse((node: any) => {
        if (node instanceof THREE.Mesh) {
          node.material = this.bowlMaterial
          node.castShadow = false;
          node.receiveShadow = false;
          node.translateY(.3)
          const scale = 3.7
          node.scale.set(scale, scale + 0.1, scale)
          // this.bowl = node
        } else {
          node.layers.disableAll();
        }
        this.bowlGroup.add(node)
      })
    })
    this.material = new THREE.ShaderMaterial({
      extensions: { derivatives: true, fragDepth: true },
      // wireframe: true, 
      uniforms: {
        time: { value: 0 },
        uPerlin: { value: null },
        resolution: { value: new THREE.Vector4() }
      },
      clipShadows: false,
      vertexShader: vertex,
      fragmentShader: fragment
    })
    // this.bowl = new THREE.Mesh(this.bowlGeometry, this.bowlMaterial)
    this.sun = new THREE.Mesh(this.geometry, this.material)

    // const light = new THREE.AmbientLight(0xffffff, 100)
    // light.translateX(20)
    this.group = new THREE.Group()
    this.group.add(this.sun, this.bowlGroup)
  }
  public update(timestamp: number = Date.now()) {
    const delta = this.lastUpdate - timestamp
    this.lastUpdate = timestamp
    const rotateBy: number = (-0.00008 * delta)

    this.group.rotateY(rotateBy)
    this.material.uniforms.time.value = ((timestamp * 0.0005))
  }
}