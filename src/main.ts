import * as THREE from "three"



import { MyLight } from './components/light'
import { Spoon } from './components/spoon'
import { Sun } from './components/sun'
import { MyRenderer } from './components/renderer'
import { Star } from './components/star'

const scene = new THREE.Scene()

const canvas: HTMLCanvasElement = document.querySelector<HTMLCanvasElement>('#canvas')!
const renderer = new MyRenderer(canvas, scene, { width: window.innerWidth, height: window.innerHeight})

const myLight = new MyLight()
const spoon = new Spoon()
const sun = new Sun()
const stars = new Array(2000).fill(true).map(() => new Star({layer: 1})).map(star => star.group)

scene.add(...[sun.group, spoon.group, ...myLight.lights], ...stars)



// Resize
window.addEventListener('resize', () => {
  renderer.resize({ height: window.innerHeight, width: window.innerWidth })
})

const loop = (timestamp: number) => {

  // Updating positions
  myLight.update(timestamp)
  spoon.update(timestamp)
  sun.update(timestamp)

  // disabling star layer for bloom pass, since the threshold for the sun is too much for them
  renderer.camera.layers.disable(1)
  renderer.bloomPassRender()

  // reanabling the star layer for a normal render pass
  renderer.camera.layers.enable(1)

  // allows it to be drawn through ... need to rename the class
  renderer.renderer.clearDepth()
  renderer.draw()

  window.requestAnimationFrame(loop)
}
loop(0)