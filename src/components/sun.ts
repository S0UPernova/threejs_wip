import * as THREE from "three"
import fragment from "../shader/fragment.glsl"
import vertex from "../shader/vertex.glsl"
export class Sun {
  private geometry: THREE.SphereGeometry
  private material: THREE.ShaderMaterial
  public mesh: THREE.Mesh
  private lastUpdate: number

  constructor() {
    this.lastUpdate = Date.now()
    this.geometry = new THREE.SphereGeometry(3, 64, 64)
    this.material = new THREE.ShaderMaterial({
      extensions: { derivatives: true, fragDepth: true },
      // wireframe: true, 
      uniforms: {
        time: { value: 0 },
        uPerlin: { value: null },
        resolution: { value: new THREE.Vector4() }
      },
      clipShadows: false,
      vertexShader: vertex,
      fragmentShader: fragment
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
  }
  public update(timestamp: number = Date.now()) {
    const delta = this.lastUpdate - timestamp
    this.lastUpdate = timestamp
    const rotateBy: number = (-0.00008 * delta)

    this.mesh.rotateY(rotateBy)
    this.material.uniforms.time.value = ((timestamp / 1000))
  }
}