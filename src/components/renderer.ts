import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
type Sizes = { width: number, height: number }
export class MyRenderer {
  private cubeCamera: any
  private renderTarget: THREE.WebGLCubeRenderTarget
  private controls: OrbitControls
  private canvas: HTMLCanvasElement
  private lastUpdate: number
  
  public camera: THREE.PerspectiveCamera
  public renderer: THREE.WebGLRenderer
  public scene: THREE.Scene

  constructor(canvas: HTMLCanvasElement, scene: THREE.Scene, sizes: Sizes) {
    this.lastUpdate = 0
    this.canvas = canvas
    this.scene = scene

    this.renderTarget = new THREE.WebGLCubeRenderTarget(2001, {
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter
    })
    this.renderTarget.texture.type = THREE.HalfFloatType
    this.cubeCamera = new THREE.CubeCamera(10, 2500, this.renderTarget);
    scene.environment = this.renderTarget.texture
    this.scene.add(this.cubeCamera)
    scene.background = new THREE.Color(0x22224f)
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
    this.controls.dampingFactor = 0.02
    this.controls.maxPolarAngle = 10
    this.controls.maxDistance = 600
    this.controls.minTargetRadius = -100
    this.controls.maxTargetRadius = 100
    this.controls.autoRotate = true
    this.controls.autoRotateSpeed = .5
    this.cubeCamera.update(this.renderer, this.scene)
  }

  public resize(sizes: Sizes) {
    this.camera.aspect = sizes.width / sizes.height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(sizes.width, sizes.height)
  }

  public draw(timestamp: number = Date.now()) {
    if (timestamp - this.lastUpdate > 200) {
      this.cubeCamera.update(this.renderer, this.scene)
      this.lastUpdate = timestamp
    }
    this.controls.update()
    this.renderer.render(this.scene, this.camera)

  }
}