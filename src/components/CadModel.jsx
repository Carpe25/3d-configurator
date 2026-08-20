import React, { useMemo, useLayoutEffect } from 'react'
import { useGLTF, MeshRefractionMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { METAL_CONFIGS } from '../constants/metalMaterials'

/**
 * Checks if a mesh node or material in a CAD model is a gemstone/diamond.
 */
function isGemMesh(mesh) {
  if (!mesh) return false
  const meshName = (mesh.name || '').toLowerCase()
  const matName = (mesh.material && mesh.material.name ? mesh.material.name : '').toLowerCase()
  
  return (
    meshName.includes('gem') ||
    meshName.includes('diamond') ||
    meshName.includes('stone') ||
    matName.includes('gem') ||
    matName.includes('diamond') ||
    matName.includes('stone')
  )
}

/**
 * Procedural Fallback Ring Setting (Used if CAD model URL is empty or fails)
 */
function ProceduralRingSetting({ metalConfig, finishType, diamondConfig, cubeTexture, diamondPlacement, metalEnvMap, metalEnvIntensity = 1.0 }) {
  const { nodes } = useGLTF('/dflat.glb')
  const roughnessOffset = finishType === 'satin' ? 0.18 : 0;
  
  const material = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(metalConfig.color),
      metalness: metalConfig.metalness,
      roughness: Math.min(1.0, metalConfig.roughness + roughnessOffset),
      envMapIntensity: metalConfig.envMapIntensity * metalEnvIntensity,
      clearcoat: finishType === 'polished' ? 0.1 : 0,
      clearcoatRoughness: 0.1,
    })
    if (metalEnvMap) {
      mat.envMap = metalEnvMap
    }
    return mat
  }, [metalConfig, finishType, roughnessOffset, metalEnvMap, metalEnvIntensity]);

  return (
    <group position={[0, -0.65, 0]}>
      {/* Main Ring Band */}
      <mesh castShadow receiveShadow material={material} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.18, 32, 100]} />
      </mesh>
      
      {/* Gem Socket / Crown Base */}
      <mesh castShadow receiveShadow material={material} position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.55, 0.35, 0.4, 32]} />
      </mesh>

      {/* 4 Prongs Holding the Diamond */}
      {[-0.35, 0.35].map((x) =>
        [-0.35, 0.35].map((z) => (
          <mesh
            key={`${x}-${z}`}
            castShadow
            receiveShadow
            material={material}
            position={[x, 1.45, z]}
            rotation={[z * 0.2, 0, -x * 0.2]}
          >
            <cylinderGeometry args={[0.06, 0.08, 0.5, 16]} />
          </mesh>
        ))
      )}

      {/* Fallback Diamond */}
      {nodes?.Diamond_1_0 && (
        <mesh
          castShadow
          geometry={nodes.Diamond_1_0.geometry}
          position={[diamondPlacement?.posX ?? 0, (diamondPlacement?.posY ?? 1.45), diamondPlacement?.posZ ?? 0]}
          rotation={[diamondPlacement?.rotX ?? 0, diamondPlacement?.rotY ?? 0, diamondPlacement?.rotZ ?? 0]}
          scale={diamondPlacement?.scale ?? 1}
        >
          <MeshRefractionMaterial
            key={cubeTexture?.texture?.uuid || cubeTexture?.uuid || 'fallback_diamond_mat'}
            envMap={cubeTexture}
            bounces={diamondConfig?.bounces ?? 3}
            aberrationStrength={diamondConfig?.aberrationStrength ?? 0.01}
            ior={diamondConfig?.ior ?? 2.417}
            fresnel={diamondConfig?.fresnel ?? 0.25}
            color={diamondConfig?.color ?? '#ffffff'}
            fastChroma={false}
            toneMapped={true}
          />
        </mesh>
      )}
    </group>
  );
}

/**
 * GLB CAD Model Loader Component
 * Traverses external CAD models:
 * - Metal parts receive dynamic PBR MeshPhysicalMaterial (Yellow Gold, White Gold, Rose Gold).
 * - Embedded Diamond parts receive MeshRefractionMaterial with live controls from app.js.
 */
function ExternalCadModel({ modelUrl, metalConfig, finishType, diamondConfig, cubeTexture, diamondPlacement, metalEnvMap, metalEnvIntensity = 1.0 }) {
  const safeUrl = useMemo(() => encodeURI(modelUrl), [modelUrl])
  const { scene } = useGLTF(safeUrl)

  // Separate scene into metal meshes and gem geometries
  const { metalScene, gemGeometries } = useMemo(() => {
    const cloned = scene.clone(true)
    cloned.updateMatrixWorld(true)

    const gems = []

    cloned.traverse((child) => {
      if (child.isMesh) {
        if (isGemMesh(child)) {
          // Hide gem mesh in cloned metal scene so it is not rendered as metal
          child.visible = false

          // Extract geometry with world matrix transform applied
          const geo = child.geometry.clone()
          geo.applyMatrix4(child.matrixWorld)
          gems.push(geo)
        } else {
          child.visible = true
        }
      }
    })

    if (gems.length > 0) {
      console.log(`💎 [CadModel] Found ${gems.length} original diamond/gem mesh(es) in CAD model '${modelUrl}'. Rendering original CAD diamond with MeshRefractionMaterial.`)
    } else {
      console.log(`⚠️ [CadModel] No mesh named 'gem', 'diamond', or 'stone' found in CAD model '${modelUrl}'. Using procedural fallback ring & diamond.`)
    }

    return { metalScene: cloned, gemGeometries: gems }
  }, [scene, modelUrl])

  // Apply PBR MeshPhysicalMaterial to all metal meshes in cloned scene
  useLayoutEffect(() => {
    if (!metalScene) return
    const roughnessOffset = finishType === 'satin' ? 0.18 : 0
    const targetColor = new THREE.Color(metalConfig.color)

    metalScene.traverse((child) => {
      if (child.isMesh && child.visible) {
        child.castShadow = true
        child.receiveShadow = true
        
        if (!child.material || child.material.type !== 'MeshPhysicalMaterial') {
          child.material = new THREE.MeshPhysicalMaterial({
            color: targetColor,
            metalness: metalConfig.metalness,
            roughness: Math.min(1.0, metalConfig.roughness + roughnessOffset),
            envMapIntensity: metalConfig.envMapIntensity * metalEnvIntensity,
            clearcoat: finishType === 'polished' ? 0.1 : 0,
            clearcoatRoughness: 0.1,
            envMap: metalEnvMap || null
          })
        } else {
          child.material.color.copy(targetColor)
          child.material.metalness = metalConfig.metalness
          child.material.roughness = Math.min(1.0, metalConfig.roughness + roughnessOffset)
          child.material.envMapIntensity = metalConfig.envMapIntensity * metalEnvIntensity
          child.material.clearcoat = finishType === 'polished' ? 0.1 : 0
          if (metalEnvMap) {
            child.material.envMap = metalEnvMap
          }
          child.material.needsUpdate = true
        }
      }
    })
  }, [metalScene, metalConfig, finishType, metalEnvMap, metalEnvIntensity])

  return (
    <group>
      {/* 1. Metal Ring Body */}
      <primitive object={metalScene} />

      {/* 2. Embedded Diamond Meshes from CAD model rendered with MeshRefractionMaterial */}
      {gemGeometries.length > 0 ? (
        gemGeometries.map((geo, index) => (
          <mesh
            key={index}
            geometry={geo}
            castShadow
            position={[diamondPlacement?.posX ?? 0, diamondPlacement?.posY ?? 0, diamondPlacement?.posZ ?? 0]}
            rotation={[diamondPlacement?.rotX ?? 0, diamondPlacement?.rotY ?? 0, diamondPlacement?.rotZ ?? 0]}
            scale={diamondPlacement?.scale ?? 1}
          >
            <MeshRefractionMaterial
              key={cubeTexture?.texture?.uuid || cubeTexture?.uuid || `gem_${index}`}
              envMap={cubeTexture}
              bounces={diamondConfig?.bounces ?? 3}
              aberrationStrength={diamondConfig?.aberrationStrength ?? 0.01}
              ior={diamondConfig?.ior ?? 2.417}
              fresnel={diamondConfig?.fresnel ?? 0.25}
              color={diamondConfig?.color ?? '#ffffff'}
              fastChroma={false}
              toneMapped={true}
            />
          </mesh>
        ))
      ) : (
        /* Fallback if CAD model has no embedded diamond mesh */
        <ProceduralRingSetting
          metalConfig={metalConfig}
          finishType={finishType}
          diamondConfig={diamondConfig}
          cubeTexture={cubeTexture}
          diamondPlacement={diamondPlacement}
          metalEnvMap={metalEnvMap}
          metalEnvIntensity={metalEnvIntensity}
        />
      )}
    </group>
  )
}

class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.warn('Failed to load CAD model, falling back to procedural setting:', error)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.modelUrl !== this.props.modelUrl) {
      this.setState({ hasError: false })
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

export default function CadModel({
  modelUrl,
  activeMetal,
  finishType = 'polished',
  diamondConfig,
  cubeTexture,
  diamondPlacement,
  metalEnvMap,
  metalEnvIntensity
}) {
  const metalConfig = METAL_CONFIGS[activeMetal] || METAL_CONFIGS.yellow_gold

  if (!modelUrl) {
    return (
      <ProceduralRingSetting
        metalConfig={metalConfig}
        finishType={finishType}
        diamondConfig={diamondConfig}
        cubeTexture={cubeTexture}
        diamondPlacement={diamondPlacement}
        metalEnvMap={metalEnvMap}
        metalEnvIntensity={metalEnvIntensity}
      />
    )
  }

  const fallbackUI = (
    <ProceduralRingSetting
      metalConfig={metalConfig}
      finishType={finishType}
      diamondConfig={diamondConfig}
      cubeTexture={cubeTexture}
      diamondPlacement={diamondPlacement}
      metalEnvMap={metalEnvMap}
      metalEnvIntensity={metalEnvIntensity}
    />
  )

  return (
    <ModelErrorBoundary key={modelUrl} modelUrl={modelUrl} fallback={fallbackUI}>
      <React.Suspense fallback={fallbackUI}>
        <ExternalCadModel
          modelUrl={modelUrl}
          metalConfig={metalConfig}
          finishType={finishType}
          diamondConfig={diamondConfig}
          cubeTexture={cubeTexture}
          diamondPlacement={diamondPlacement}
          metalEnvMap={metalEnvMap}
          metalEnvIntensity={metalEnvIntensity}
        />
      </React.Suspense>
    </ModelErrorBoundary>
  )
}

