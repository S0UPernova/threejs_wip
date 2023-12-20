import * as THREE from "three"
import fragment from "../shader/fragment.glsl"
import vertex from "../shader/vertex.glsl"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture.js'

export class Sun {
  private loader: THREE.Loader
  private geometry: THREE.SphereGeometry
  private material: THREE.ShaderMaterial
  private bowlMaterial: THREE.MeshStandardMaterial
  private sun: THREE.Mesh
  private lastUpdate: number
  private texture: THREE.CanvasTexture

  public group: THREE.Group
  public bowlGroup: THREE.Group
  /**
   * 
   * @param renderTarget This is for the reflections
   */
  constructor() {
    this.lastUpdate = Date.now()
    this.geometry = new THREE.SphereGeometry(3, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2)

    this.texture = new THREE.CanvasTexture(new FlakesTexture())
    this.texture.wrapS = THREE.RepeatWrapping
    this.texture.wrapT = THREE.RepeatWrapping
    this.texture.repeat.x = 2
    this.texture.repeat.y = 20
    this.bowlMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      normalMap: this.texture,
      normalScale: new THREE.Vector2(-0.05, -0.05),
      emissive: 0x99ffff,
      metalness: .9,
      roughness: 0.2,
      flatShading: true,
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
        } else {
          node.layers.disableAll();
        }
        this.bowlGroup.add(node)
      })
    })
    this.material = new THREE.ShaderMaterial({
      extensions: { derivatives: true, fragDepth: true },
      uniforms: {
        time: { value: 0 },
        uPerlin: { value: null },
        resolution: { value: new THREE.Vector4() }
      },
      clipShadows: false,
      
      vertexShader: vertex,
      fragmentShader: fragment
    })
    this.sun = new THREE.Mesh(this.geometry, this.material)
    this.group = new THREE.Group()
    this.group.add(this.sun, this.bowlGroup)
  }
  public update(timestamp: number = Date.now()) {
    const delta = this.lastUpdate - timestamp
    this.lastUpdate = timestamp
    const rotateBy: number = (-0.00008 * delta)

    this.group.rotateY(rotateBy)
    this.material.uniforms.time.value = ((timestamp / 1000))
  }
}