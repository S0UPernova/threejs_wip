import * as THREE from "three"
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { FlakesTexture } from "three/examples/jsm/textures/FlakesTexture";

type Sizes = { width: number, height: number }
export class RenderManager {
  private controls: OrbitControls
  private canvas: HTMLCanvasElement
  private lastUpdate: number
  private renderPass: RenderPass

  public cubeCamera: THREE.CubeCamera
  public size: Sizes
  public renderTarget: THREE.WebGLCubeRenderTarget
  public bgTex: THREE.Texture
  public composer: EffectComposer
  public camera: THREE.PerspectiveCamera
  public renderer: THREE.WebGLRenderer
  public scene: THREE.Scene

  constructor(canvas: HTMLCanvasElement, scene: THREE.Scene, sizes: Sizes) {
    this.lastUpdate = 0
    this.canvas = canvas
    this.scene = scene
    this.size = sizes
    this.renderTarget = new THREE.WebGLCubeRenderTarget(2001, {
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter
    })
    this.renderTarget.texture.type = THREE.HalfFloatType
    this.cubeCamera = new THREE.CubeCamera(10, 2500, this.renderTarget);
    this.cubeCamera.layers.enableAll()
    scene.environment = this.renderTarget.texture
    this.scene.add(this.cubeCamera)

    this.bgTex = new THREE.CanvasTexture(new FlakesTexture())
    this.bgTex.wrapS = THREE.RepeatWrapping
    this.bgTex.wrapT = THREE.RepeatWrapping
    this.bgTex.repeat.x = 20
    this.bgTex.repeat.y = 15
    this.bgTex.colorSpace = THREE.LinearSRGBColorSpace
    this.bgTex.anisotropy = 64
    this.scene.background = this.bgTex
    scene.backgroundIntensity = 0.15
    scene.backgroundBlurriness = Math.PI

    this.camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height, 0.1, 3000)
    this.camera.position.z = 50
    this.camera.position.y = 10
    this.camera.rotation.x = 5
    this.camera.layers.enableAll()

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    this.renderer.outputColorSpace = "srgb-linear"
    this.renderer.setSize(sizes.width, sizes.height)
    this.renderer.setPixelRatio(2)
    this.renderer.autoClear = false

    this.composer = new EffectComposer(this.renderer)
    this.renderPass = new RenderPass(this.scene, this.camera)
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(canvas.width, canvas.height), 0.5, 1.5, 0.39)
    this.composer.addPass(this.renderPass)
    this.composer.addPass(bloomPass)

    this.controls = new OrbitControls(this.camera, this.canvas)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.02
    this.controls.maxPolarAngle = 10
    this.controls.maxDistance = 600
    this.controls.minDistance = 10
    this.controls.minTargetRadius = -100
    this.controls.maxTargetRadius = 100
    this.controls.autoRotate = true
    this.controls.autoRotateSpeed = .5
    this.cubeCamera.update(this.renderer, this.scene)
  }
  private updateCubeMap(timestamp: number = Date.now()) {
    if (timestamp - this.lastUpdate > 200) {
      this.renderTarget.clear(this.renderer, true, true, true)
      this.cubeCamera.update(this.renderer, this.scene)
      this.lastUpdate = timestamp
    }
  }

  public resize(sizes: Sizes) {
    
    this.camera.aspect = sizes.width / sizes.height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(sizes.width, sizes.height)
  }
  public bloomPassRender(timestamp: number = Date.now()) {
    this.updateCubeMap(timestamp)
    this.controls.update()
    this.scene.background = this.bgTex
    this.bgTex.rotation += 0.1
    this.composer.render()
    this.scene.background = null

  }
  public draw(timestamp: number = Date.now()) {
    this.updateCubeMap(timestamp)
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }
}