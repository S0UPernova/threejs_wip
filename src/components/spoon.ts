import * as THREE from "three"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture.js'
export class Spoon {
  public group: THREE.Group
  private loader: THREE.Loader
  private lastUpdate: number
  // private stencilRef
  public mesh?: THREE.Mesh
  constructor(layer?: number) {
    this, this.lastUpdate = Date.now()
    this.group = new THREE.Group()
    // this.stencilRef = 1

    const texture = new THREE.CanvasTexture(new FlakesTexture())
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.x = 100
    texture.repeat.y = 100

    const material = new THREE.MeshPhysicalMaterial({
      emissive: 0x99ffff,
      emissiveIntensity: .054,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
      metalness: .8,
      roughness: 0.4,
      color: 0xaaffff,
      normalMap: texture,
      normalScale: new THREE.Vector2(4, 4),
      bumpMap: texture,
      bumpScale: 1,
      aoMap: texture,
      aoMapIntensity: 1,
      anisotropyMap: texture,
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
          node.translateX(30)
          if (layer) {
            node.layers.set(layer)
          }
          this.mesh = node
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
    this?.mesh?.rotateX((0.0003) * delta)
    this?.mesh?.rotateZ((0.0004) * delta)
    this.lastUpdate = timestamp
  }
}