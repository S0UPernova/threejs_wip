import * as THREE from "three"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture.js'

export class Spoon {
  public group: THREE.Group
  private loader: THREE.Loader
  private lastUpdate: number
  private spoon?: THREE.Mesh
  constructor() {
    this, this.lastUpdate = Date.now()
    this.group = new THREE.Group()

    const texture = new THREE.CanvasTexture(new FlakesTexture())
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.x = 10
    texture.repeat.y = 6

    const material = new THREE.MeshPhysicalMaterial({
      emissive: 0x99ffff,
      emissiveIntensity: .1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      metalness: 0.7,
      roughness: 0.5,
      color: 0xaaffff,
      normalMap: texture,
      normalScale: new THREE.Vector2(2, 4)
    })
    
    this.loader = new GLTFLoader()
    this.loader.load('models/spoon.glb', (gltf: any) => {
      gltf.scene.position.x = 0;
      gltf.scene.position.y = 0;
      gltf.scene.position.z = 0;

      gltf.scene.rotation.y = Math.PI * 1.25;
      gltf.scene.scale.set(0.1, 0.1, 0.1);

      gltf.scene.traverse((node: any) => {
        if (node instanceof THREE.Mesh) {
          node.material = material
          node.castShadow = true;
          node.receiveShadow = true;
          node.translateX(20)
          this.spoon = node
        } else {
          node.layers.disableAll();
        }
        this.group.add(node)
      })
    })
  }
  public update(timestamp: number = Date.now()) {
    const delta: number = timestamp - this.lastUpdate

    this.group.rotateY((0.0001) * delta)
    this?.spoon?.rotateX((0.0003) * delta)
    this?.spoon?.rotateZ((0.0004) * delta)
    this.lastUpdate = timestamp
  }
}