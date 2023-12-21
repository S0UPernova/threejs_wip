import * as THREE from "three"

// todo make this multiple lights that work together to make the desired effect
export class MyLight {
  private timeSinceLastColorUpdate: number = 0
  private lastUpdate: number
  public pointLight: THREE.PointLight
  public ambientLight: THREE.AmbientLight
  public lights: (THREE.AmbientLight | THREE.PointLight | THREE.SpotLight | THREE.DirectionalLight)[]
  constructor(layer?: number) {
    this.lastUpdate = Date.now()
    this.pointLight = new THREE.PointLight(0xff8888, 50, 300, 1.8)
    this.ambientLight = new THREE.AmbientLight(0xff8888, 20)
    this.lights = [this.pointLight, this.ambientLight]
    this.pointLight.position.x = 0
    this.pointLight.position.y = 0
    this.pointLight.position.z = 0
    if (layer) {
      this.pointLight.layers.set(layer)
      this.ambientLight.layers.set(layer)
    }
  }
  private getNumInRange(max: number, min?: number,) {
    if (!min) min = 0
    const n = Math.max(Math.random() * max, min)
    return n
  }
  public update(timestamp: number = Date.now()) {
    const delta = this.lastUpdate - timestamp

    const timeBetweenUpdates = 1000
    if (this.timeSinceLastColorUpdate > timeBetweenUpdates) {
      // Add flicker
      this.pointLight.intensity = this.getNumInRange(1000, 900)
      this.timeSinceLastColorUpdate = 0
      this.lastUpdate = Date.now()
    }
    else {
      this.timeSinceLastColorUpdate += delta
    }
  }
}