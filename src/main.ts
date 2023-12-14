import './style.css'
import * as THREE from "three"
import fragment from "./shader/fragment.glsl"
import vertex from "./shader/vertex.glsl"


import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene()
// Create sphere
const geometry = new THREE.SphereGeometry(3, 64, 64)
// const vertices = new Float32Array( [
//   -1.0, -1.0,  1.0, // v0
//    1.0, -1.0,  1.0, // v1
//    1.0,  1.0,  1.0, // v2

//    1.0,  1.0,  1.0, // v3
//   -1.0,  1.0,  1.0, // v4
//   -1.0, -1.0,  1.0  // v5
// ] );
// const geometry = new THREE.BufferGeometry()
// geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
const material = new THREE.ShaderMaterial({
  extensions: { derivatives: true, fragDepth: true },
  // side: THREE.DoubleSide,
  // wireframe: true, 
  uniforms: {
    time: { value: 100 },
    uPerlin: { value: null },
    resolution: { value: new THREE.Vector4() }
  },
  vertexShader: vertex,
  fragmentShader: fragment
})

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
camera.position.z = 10
// scene.add(camera)

// Renderer
const canvas: HTMLCanvasElement = document.querySelector<HTMLCanvasElement>('#canvas')!
const renderer = new THREE.WebGL1Renderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(2)
renderer.render(scene, camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
// controls.enablePan = false
// controls.enableZoom = false
// controls.autoRotate = true

// Resize
window.addEventListener('resize', () => {
  // Update Sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})

// Loop
const loop = (timestamp: number) => {
  // controls.update()
  camera.updateProjectionMatrix()
  material.defines ={time: Date.now()}
  renderer.render(scene, camera)
  material.uniforms.time.value = ((timestamp / 1000))
  window.requestAnimationFrame(loop)
}
loop(0)