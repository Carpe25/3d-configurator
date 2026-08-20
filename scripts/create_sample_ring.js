import * as THREE from 'three'
import { GLTFExporter } from 'three-stdlib'
import fs from 'fs'
import path from 'path'

// Create a realistic ring band + prongs setting scene
const group = new THREE.Group()
group.name = 'CAD_Jewellery_Setting'

// Ring Band (Torus)
const bandGeo = new THREE.TorusGeometry(1.2, 0.18, 32, 100)
const bandMat = new THREE.MeshStandardMaterial({ color: 0xe5c158, metalness: 1.0, roughness: 0.15 })
const bandMesh = new THREE.Mesh(bandGeo, bandMat)
bandMesh.rotation.x = Math.PI / 2
bandMesh.position.y = -0.65
group.add(bandMesh)

// Crown Base (Cylinder)
const crownGeo = new THREE.CylinderGeometry(0.55, 0.35, 0.4, 32)
const crownMesh = new THREE.Mesh(crownGeo, bandMat)
crownMesh.position.y = 0.5
group.add(crownMesh)

// Prongs
;[-0.35, 0.35].forEach((x) => {
  ;[-0.35, 0.35].forEach((z) => {
    const prongGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.5, 16)
    const prongMesh = new THREE.Mesh(prongGeo, bandMat)
    prongMesh.position.set(x, 0.8, z)
    prongMesh.rotation.set(z * 0.2, 0, -x * 0.2)
    group.add(prongMesh)
  })
})

// Anchor node for diamond socket
const anchor = new THREE.Object3D()
anchor.name = 'Diamond_Socket'
anchor.position.set(0, 0.8, 0)
group.add(anchor)

const scene = new THREE.Scene()
scene.add(group)

const exporter = new GLTFExporter()
exporter.parse(
  scene,
  (gltf) => {
    const modelsDir = path.join(process.cwd(), 'public', 'models')
    if (!fs.existsSync(modelsDir)) {
      fs.mkdirSync(modelsDir, { recursive: true })
    }
    const filePath = path.join(modelsDir, 'sample_ring.glb')
    fs.writeFileSync(filePath, Buffer.from(gltf))
    console.log('Successfully generated public/models/sample_ring.glb')
  },
  (error) => {
    console.error('Error generating GLB:', error)
  },
  { binary: true }
)
