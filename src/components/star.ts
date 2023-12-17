import * as THREE from "three"

export class Star {
  private geometry: THREE.SphereGeometry
  private material: THREE.MeshStandardMaterial
  public mesh: THREE.Mesh
  public group: THREE.Group
  private color: THREE.ColorRepresentation

  constructor(color?: THREE.ColorRepresentation) {
    // this.lastUpdate = Date.now()
    this.geometry = new THREE.SphereGeometry(.1, 8, 8)
    this.color = color ?? this.setRandomIshColor()
    this.material = new THREE.MeshStandardMaterial({
      emissive: this.color,
      emissiveIntensity: 1
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.translateX(100)
    this.group = new THREE.Group()
    this.group.add(this.mesh)
    this.group.rotateX(Math.random() * 360)
    this.group.rotateY(Math.random() * 360)
    this.group.rotateZ(Math.random() * 360)
  }
  private getNumInRange(max: number, min?: number,) {
    if (!min) min = 0
    const n = Math.max(Math.random() * max, min)
    return n
  }
  private setRandomIshColor() {
    return new THREE.Color(
      this.getNumInRange(200, 150), // Red
      this.getNumInRange(5),        // Green
      this.getNumInRange(3)         // Blue
    )
  }
  // public update(timestamp: number = Date.now()) {
  //   // todo add twinkle

  // }
}