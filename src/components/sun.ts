import * as THREE from "three"
import fragment from "../shader/fragment.glsl"
import vertex from "../shader/vertex.glsl"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture.js'
interface SunInput {
  sunLayer?: number,
  bowlLayer?: number
}
export class Sun {
  private loader: THREE.Loader
  private geometry: THREE.SphereGeometry
  private material: THREE.ShaderMaterial
  private bowlMaterial: THREE.MeshStandardMaterial
  private lastUpdate: number
  private texture: THREE.CanvasTexture

  public sunMesh: THREE.Mesh
  public group: THREE.Group
  public bowlGroup: THREE.Group
  public bowlMesh?: THREE.Mesh
  /**
   * 
   * @param renderTarget This is for the reflections
   */
  constructor(input?: SunInput) {
    this.lastUpdate = Date.now()
    this.geometry = new THREE.SphereGeometry(3, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2)

    this.texture = new THREE.CanvasTexture(new FlakesTexture())
    this.texture.wrapS = THREE.RepeatWrapping
    this.texture.wrapT = THREE.RepeatWrapping
    this.texture.repeat.x = 2
    this.texture.repeat.y = 20
    this.bowlMaterial = new THREE.MeshStandardMaterial({
      color: 0x427f7f,
      normalMap: this.texture,
      normalScale: new THREE.Vector2(-0.05, -0.05),
      emissive: 0x386f6f,
      // metalness: .5,
      roughness: 0.05,
      // flatShading: true,
      emissiveIntensity: 0.3,
      // aoMap: this.texture
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
          node.translateY(.6)
          const scale = 7.4
          node.scale.set(scale, scale + 0.1, scale)
          if (input?.bowlLayer) {
            node.layers.set(input.bowlLayer)
          }
          this.bowlMesh = node
        } else {
          node.layers.disableAll();
        }
        // this.bowlMesh = node
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
    this.sunMesh = new THREE.Mesh(this.geometry, this.material)
    this.sunMesh.scale.set(2,2,2)
    if (input?.sunLayer) {
      this.sunMesh.layers.set(input.sunLayer)
    }
    this.group = new THREE.Group()
    this.group.add(this.sunMesh, this.bowlGroup)
  }
  public update(timestamp: number = Date.now()) {
    const delta = this.lastUpdate - timestamp
    this.lastUpdate = timestamp
    const rotateBy: number = (-0.00008 * delta)

    this.group.rotateY(rotateBy)
    this.material.uniforms.time.value = ((timestamp / 1000))
  }
}