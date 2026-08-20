import * as THREE from 'three'
import { GLTFExporter } from 'three-stdlib'
import fs from 'fs'
import path from 'path'

/**
 * Creates a photorealistic 57-facet Round Brilliant Cut Diamond geometry.
 */
function createRoundBrilliantDiamondGeometry() {
  const positions = []

  const rTable = 0.28
  const hTable = 0.22
  const rStar = 0.38
  const hStar = 0.16
  const rGirdle = 0.50
  const hGirdleTop = 0.03
  const hGirdleBot = -0.03
  const rPavilionBreak = 0.36
  const hPavilionBreak = -0.22
  const hCulet = -0.45

  const numSectors = 8
  const angleStep = (Math.PI * 2) / numSectors
  const halfStep = angleStep / 2

  // 1. Table Octagon (8 triangles from center (0, hTable, 0))
  for (let i = 0; i < numSectors; i++) {
    const a1 = i * angleStep
    const a2 = (i + 1) * angleStep
    positions.push(
      0, hTable, 0,
      rTable * Math.cos(a2), hTable, rTable * Math.sin(a2),
      rTable * Math.cos(a1), hTable, rTable * Math.sin(a1)
    )
  }

  // 2. Star Facets (8 triangles)
  for (let i = 0; i < numSectors; i++) {
    const a1 = i * angleStep
    const a2 = (i + 1) * angleStep
    const aMid = a1 + halfStep

    const t1 = [rTable * Math.cos(a1), hTable, rTable * Math.sin(a1)]
    const t2 = [rTable * Math.cos(a2), hTable, rTable * Math.sin(a2)]
    const s = [rStar * Math.cos(aMid), hStar, rStar * Math.sin(aMid)]

    positions.push(...t1, ...t2, ...s)
  }

  // 3. Crown Main (Kite) Facets (8 kites -> 2 triangles each = 16 triangles)
  for (let i = 0; i < numSectors; i++) {
    const a1 = i * angleStep
    const aPrevMid = a1 - halfStep
    const aNextMid = a1 + halfStep

    const t = [rTable * Math.cos(a1), hTable, rTable * Math.sin(a1)]
    const sLeft = [rStar * Math.cos(aPrevMid), hStar, rStar * Math.sin(aPrevMid)]
    const sRight = [rStar * Math.cos(aNextMid), hStar, rStar * Math.sin(aNextMid)]
    const gMain = [rGirdle * Math.cos(a1), hGirdleTop, rGirdle * Math.sin(a1)]

    // Triangle 1: t -> sLeft -> gMain
    positions.push(...t, ...sLeft, ...gMain)
    // Triangle 2: t -> gMain -> sRight
    positions.push(...t, ...gMain, ...sRight)
  }

  // 4. Upper Girdle Facets (16 triangles)
  for (let i = 0; i < numSectors; i++) {
    const a1 = i * angleStep
    const a2 = (i + 1) * angleStep
    const aMid = a1 + halfStep

    const s = [rStar * Math.cos(aMid), hStar, rStar * Math.sin(aMid)]
    const gMain1 = [rGirdle * Math.cos(a1), hGirdleTop, rGirdle * Math.sin(a1)]
    const gMain2 = [rGirdle * Math.cos(a2), hGirdleTop, rGirdle * Math.sin(a2)]
    const gBreak = [rGirdle * Math.cos(aMid), hGirdleTop, rGirdle * Math.sin(aMid)]

    // Triangle left: s -> gMain1 -> gBreak
    positions.push(...s, ...gMain1, ...gBreak)
    // Triangle right: s -> gBreak -> gMain2
    positions.push(...s, ...gBreak, ...gMain2)
  }

  // 5. Girdle Facets (16 upper girdle points -> 16 lower girdle points = 32 triangles)
  for (let i = 0; i < numSectors * 2; i++) {
    const a1 = (i * Math.PI) / numSectors
    const a2 = ((i + 1) * Math.PI) / numSectors

    const gt1 = [rGirdle * Math.cos(a1), hGirdleTop, rGirdle * Math.sin(a1)]
    const gt2 = [rGirdle * Math.cos(a2), hGirdleTop, rGirdle * Math.sin(a2)]
    const gb1 = [rGirdle * Math.cos(a1), hGirdleBot, rGirdle * Math.sin(a1)]
    const gb2 = [rGirdle * Math.cos(a2), hGirdleBot, rGirdle * Math.sin(a2)]

    positions.push(...gt1, ...gb1, ...gt2)
    positions.push(...gt2, ...gb1, ...gb2)
  }

  // 6. Pavilion Lower Girdle Facets (16 triangles)
  for (let i = 0; i < numSectors; i++) {
    const a1 = i * angleStep
    const a2 = (i + 1) * angleStep
    const aMid = a1 + halfStep

    const gbMain1 = [rGirdle * Math.cos(a1), hGirdleBot, rGirdle * Math.sin(a1)]
    const gbMain2 = [rGirdle * Math.cos(a2), hGirdleBot, rGirdle * Math.sin(a2)]
    const gbBreak = [rGirdle * Math.cos(aMid), hGirdleBot, rGirdle * Math.sin(aMid)]

    const pBreak1 = [rPavilionBreak * Math.cos(a1), hPavilionBreak, rPavilionBreak * Math.sin(a1)]
    const pBreak2 = [rPavilionBreak * Math.cos(a2), hPavilionBreak, rPavilionBreak * Math.sin(a2)]

    positions.push(...gbMain1, ...pBreak1, ...gbBreak)
    positions.push(...gbBreak, ...pBreak2, ...gbMain2)
  }

  // 7. Pavilion Main Facets (8 kites tapering to Culet tip = 16 triangles)
  const culet = [0, hCulet, 0]
  for (let i = 0; i < numSectors; i++) {
    const a1 = i * angleStep
    const a2 = (i + 1) * angleStep
    const aMid = a1 + halfStep

    const gbBreak = [rGirdle * Math.cos(aMid), hGirdleBot, rGirdle * Math.sin(aMid)]
    const pBreak1 = [rPavilionBreak * Math.cos(a1), hPavilionBreak, rPavilionBreak * Math.sin(a1)]
    const pBreak2 = [rPavilionBreak * Math.cos(a2), hPavilionBreak, rPavilionBreak * Math.sin(a2)]

    positions.push(...gbBreak, ...pBreak1, ...culet)
    positions.push(...gbBreak, ...culet, ...pBreak2)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.computeVertexNormals()
  return geometry
}

const geometry = createRoundBrilliantDiamondGeometry()
const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
const mesh = new THREE.Mesh(geometry, material)
mesh.name = 'Diamond_1_0'

const scene = new THREE.Scene()
scene.add(mesh)

const exporter = new GLTFExporter()
exporter.parse(
  scene,
  (gltf) => {
    const publicDir = path.join(process.cwd(), 'public')
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }
    const filePath = path.join(publicDir, 'dflat.glb')
    fs.writeFileSync(filePath, Buffer.from(gltf))
    console.log('Successfully generated photorealistic Round Brilliant Cut diamond at public/dflat.glb')
  },
  (error) => {
    console.error('Error generating GLB:', error)
  },
  { binary: true }
)
