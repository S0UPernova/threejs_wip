import * as THREE from "three"
interface Input {
  color?: THREE.ColorRepresentation
  layer?: number
}
export class Star {
  private geometry: THREE.SphereGeometry
  private material: THREE.MeshStandardMaterial
  public mesh: THREE.Mesh
  public group: THREE.Group
  private color: THREE.ColorRepresentation

  constructor(input?: Input) {
    // this.lastUpdate = Date.now()
    this.geometry = new THREE.SphereGeometry(this.getNumInRange(0.5, 2.5), 1, 1)
    this.color = input?.color ?? this.setRandomIshColor()
    this.material = new THREE.MeshStandardMaterial({
      side: THREE.FrontSide,
      emissive: this.color,
      emissiveIntensity: 1,
      dithering: true,
      // stencilRef: 1,
      
      // depthTest: true,
      // dithering: true,
      // stencilFunc: THREE.AlwaysStencilFunc,
      // stencilFail: THREE.DecrementStencilOp,
      // stencilZFail: THREE.DecrementStencilOp,
      // stencilZPass: THREE.IncrementStencilOp,
      // stencilFail: THREE.KeepStencilOp,
      // stencilZFail: THREE.KeepStencilOp,
      // stencilZPass: THREE.ReplaceStencilOp

      // stencilFail: THREE.DecrementWrapStencilOp,
      // stencilZFail: THREE.DecrementWrapStencilOp,
      // stencilZPass: THREE.DecrementWrapStencilOp
      // stencilFuncMask: THREE.AlwaysStencilFunc,
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.translateX(2000)
    this.group = new THREE.Group()
    this.group.add(this.mesh)
    this.group.rotateX(Math.random() * 360)
    this.group.rotateY(Math.random() * 360)
    this.group.rotateZ(Math.random() * 360)
    if (input?.layer) {
      this.mesh.layers.set(input.layer)
      this.group.layers.set(input.layer)
    }
  }
  private getNumInRange(max: number, min?: number,) {
    if (!min) min = 0
    const n = Math.max(Math.random() * max, min)
    return n
  }
  private setRandomIshColor() {
    return new THREE.Color(
      this.getNumInRange(200, 190), // Red
      this.getNumInRange(200, 190), // Green
      this.getNumInRange(200, 190)  // Blue
    )
  }

}