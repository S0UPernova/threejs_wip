import * as THREE from "three"

import './style.css'

import { MyLight } from './components/light'
import { Spoon } from './components/spoon'
import { Sun } from './components/sun'
import { MyRenderer } from './components/renderer'
import { Star } from './components/star'

const scene = new THREE.Scene()
const canvas: HTMLCanvasElement = document.querySelector<HTMLCanvasElement>('#canvas')!

const renderer = new MyRenderer(canvas, scene, { width: window.innerWidth, height: window.innerHeight })

const myLight = new MyLight()
const spoon = new Spoon()
const sun = new Sun()
const stars = new Array(2000).fill(true).map(() => new Star())

scene.add(...[sun.group, spoon.group, ...myLight.lights], ...stars.map(star => star.group))


// Resize
window.addEventListener('resize', () => {
  // Update Sizes
  renderer.resize({ height: window.innerHeight, width: window.innerWidth })
})

// Loop
const loop = (timestamp: number) => {
  myLight.update(timestamp)
  spoon.update(timestamp)
  sun.update(timestamp)
  renderer.draw()
  window.requestAnimationFrame(loop)
}
loop(0)