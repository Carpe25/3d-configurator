import fs from 'fs'
import path from 'path'
import * as THREE from 'three'
import { GLTFLoader } from 'three-stdlib'

// Read the glb file
const filePath = path.join(process.cwd(), 'public', 'models', 'r2 rendering.glb')
const buffer = fs.readFileSync(filePath)

console.log('GLB File Size:', buffer.length, 'bytes')
