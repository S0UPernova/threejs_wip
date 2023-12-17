import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
type Sizes = { width: number, height: number }
export class MyRenderer {
  public camera: THREE.PerspectiveCamera
  public renderer: THREE.WebGLRenderer
  private controls: OrbitControls
  // private sizes: Sizes
  public scene: THREE.Scene
  private canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement, scene: THREE.Scene, sizes: Sizes) {
    this.canvas = canvas
    // this.sizes = sizes
    this.scene = scene

    this.camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
    this.camera.position.z = 50
    this.camera.position.y = 10
    this.camera.rotation.x = 5

    this.renderer = new THREE.WebGLRenderer({ canvas })
    this.renderer.outputColorSpace = "srgb-linear"
    this.renderer.setSize(sizes.width, sizes.height)
    this.renderer.setPixelRatio(2)
    this.renderer.render(this.scene, this.camera)
    
    this.controls = new OrbitControls(this.camera, this.canvas)
    this.controls.enableDamping = true
    this.controls.enableZoom = false
    this.controls.autoRotate = true
  }

  public resize(sizes: Sizes) {
    this.camera.aspect = sizes.width / sizes.height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(sizes.width, sizes.height)
  }

  public draw() {
    this.controls.update()
    this.camera.updateProjectionMatrix()
    this.renderer.render(this.scene, this.camera)
  }
}