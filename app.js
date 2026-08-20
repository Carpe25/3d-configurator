import React, { useState, Suspense } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import {
    CubeCamera,
    Environment,
    OrbitControls,
    ContactShadows,
    Html
} from '@react-three/drei'
import { useControls } from 'leva'
import { RGBELoader } from 'three-stdlib'
import * as THREE from 'three'
import CadModel from './src/components/CadModel'
import ConfiguratorUI from './src/components/UI/ConfiguratorUI'
import { METAL_TYPES } from './src/constants/metalMaterials'

function Loader() {
    return (
        <Html center>
            <div style={{
                color: '#333333',
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '12px 24px',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                whiteSpace: 'nowrap'
            }}>
                <div style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid #E5C158',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                }} />
                Loading 3D Studio...
            </div>
        </Html>
    )
}

function SceneContent({ activeMetal, finishType, cadFileName, diamondConfig, diamondPlacement }) {
    // Load HDRI texture locally from public/docklands_02_4k.hdr
    const texture = useLoader(RGBELoader, '/studio_small_03_4k.hdr')
    texture.mapping = THREE.EquirectangularReflectionMapping

    return (
        <>
            {/* Pure Crisp White Studio Background */}
            <color attach="background" args={['#ffffff']} />

            {/* Clean Crisp Studio Lighting Setup (Zero Fog / Zero Haze) */}
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 12, 5]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} />
            <directionalLight position={[-5, 8, -5]} intensity={0.5} />

            {/* Dynamic CubeCamera providing sharp environment reflections to CAD Diamond */}
            <CubeCamera resolution={256} frames={1} envMap={texture}>
                {(cubeTexture) => (
                    <CadModel
                        modelUrl={cadFileName}
                        activeMetal={activeMetal}
                        finishType={finishType}
                        diamondConfig={diamondConfig}
                        cubeTexture={cubeTexture}
                        diamondPlacement={diamondPlacement}
                    />
                )}
            </CubeCamera>

            {/* Crisp Clean Contact Shadow Directly Under Ring Base */}
            <ContactShadows
                position={[0, -0.65, 0]}
                opacity={0.35}
                scale={6}
                blur={0.8}
                far={2}
                color="#000000"
            />

            {/* Studio HDRI Environment */}
            <Environment map={texture} background={false} />
            <OrbitControls makeDefault autoRotate autoRotateSpeed={0.3} minPolarAngle={0} maxPolarAngle={Math.PI / 2 + 0.05} />
        </>
    )
}

export default function App() {
    // Configurator state for metal material, finish, and CAD model URL
    const [activeMetal, setActiveMetal] = useState(METAL_TYPES.YELLOW_GOLD)
    const [finishType, setFinishType] = useState('polished')
    const [cadFileName, setCadFileName] = useState('/models/r2 rendering.glb')

    // Leva controls for Diamond material properties
    const diamondConfig = useControls('Diamond Material', {
        bounces: { value: 3, min: 0, max: 8, step: 1 },
        aberrationStrength: { value: 0.01, min: 0, max: 0.1, step: 0.005 },
        ior: { value: 2.417, min: 1.0, max: 3.5, step: 0.001 },
        fresnel: { value: 0.25, min: 0, max: 1 },
        color: '#ffffff',
    })

    // Leva controls to fine-tune diamond position if needed (default [0, 0, 0] locks to CAD native placement)
    const diamondPlacement = useControls('Diamond Placement / Offset', {
        posX: { value: 0, min: -3, max: 3, step: 0.01 },
        posY: { value: 0, min: -3, max: 5, step: 0.01 },
        posZ: { value: 0, min: -3, max: 3, step: 0.01 },
        rotX: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
        rotY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
        rotZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
        scale: { value: 1, min: 0.1, max: 3, step: 0.05 }
    })

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative', backgroundColor: '#ffffff' }}>
            <Canvas
                shadows
                camera={{ position: [-5, 2.5, 5], fov: 45 }}
                gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
            >
                <Suspense fallback={<Loader />}>
                    <SceneContent
                        activeMetal={activeMetal}
                        finishType={finishType}
                        cadFileName={cadFileName}
                        diamondConfig={diamondConfig}
                        diamondPlacement={diamondPlacement}
                    />
                </Suspense>
            </Canvas>

            {/* Right-Hand Sidebar Configuration UI Overlay */}
            <ConfiguratorUI
                activeMetal={activeMetal}
                setActiveMetal={setActiveMetal}
                finishType={finishType}
                setFinishType={setFinishType}
                cadFileName={cadFileName}
                setCadFileName={setCadFileName}
            />
        </div>
    )
}

