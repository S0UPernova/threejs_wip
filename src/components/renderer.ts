import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
type Sizes = { width: number, height: number }
export class MyRenderer {
  public camera: THREE.PerspectiveCamera
  private cubeCamera: any
  public renderTarget: THREE.WebGLCubeRenderTarget

  public renderer: THREE.WebGLRenderer
  private controls: OrbitControls
  // private sizes: Sizes
  public scene: THREE.Scene
  private canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement, scene: THREE.Scene, sizes: Sizes) {
    // const rgbmUrls = ['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'];
    
      // .setPath('../examples/textures/cube/pisaRGBM16/')
      // .loadCubemap(rgbmUrls)

      
      this.canvas = canvas
      this.scene = scene

      this.renderTarget = new THREE.WebGLCubeRenderTarget(256 , { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter })
      this.renderTarget.texture.type = THREE.HalfFloatType
      this.cubeCamera = new THREE.CubeCamera( 10, 2500, this.renderTarget );
      scene.environment = this.renderTarget.texture
      this.scene.add(this.cubeCamera)
    // this.sizes = sizes

    this.camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 3000)
    this.camera.position.z = 50
    this.camera.position.y = 10
    this.camera.rotation.x = 5

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, })
    this.renderer.outputColorSpace = "srgb-linear"
    this.renderer.setSize(sizes.width, sizes.height)
    this.renderer.setPixelRatio(2)

    this.controls = new OrbitControls(this.camera, this.canvas)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05
    this.controls.maxPolarAngle = 10
    this.controls.maxDistance = 800
    this.controls.minTargetRadius = -100
    this.controls.maxTargetRadius = 100
    this.controls.autoRotate = true
  }

  public resize(sizes: Sizes) {
    this.camera.aspect = sizes.width / sizes.height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(sizes.width, sizes.height)
  }

  public draw() {
    this.cubeCamera.update(this.renderer, this.scene)
    this.controls.update()
    this.renderer.render(this.scene, this.camera)

  }
}