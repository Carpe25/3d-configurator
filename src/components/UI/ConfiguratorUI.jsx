import React from 'react'
import { METAL_CONFIGS } from '../../constants/metalMaterials'
import { Sparkles, Layers, Upload, Check } from 'lucide-react'

export default function ConfiguratorUI({
  activeMetal,
  setActiveMetal,
  finishType,
  setFinishType,
  cadFileName,
  setCadFileName,
}) {
  return (
    <div style={{
      position: 'absolute',
      top: '24px',
      right: '24px',
      width: '340px',
      maxHeight: 'calc(100vh - 48px)',
      overflowY: 'auto',
      zIndex: 10,
    }}>
      <div className="glass-panel" style={{ padding: '24px' }}>
        
        {/* Header Title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(229, 193, 88, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={18} color="#E5C158" />
            </div>
            <div>
              <h1 style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '0.4px', color: '#ffffff' }}>
                Jewellery Studio
              </h1>
              <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>3D CAD Configurator</p>
            </div>
          </div>
          <span style={{
            fontSize: '11px',
            background: 'rgba(229, 193, 88, 0.15)',
            color: '#E5C158',
            padding: '3px 9px',
            borderRadius: '10px',
            fontWeight: 500
          }}>
            PBR Realism
          </span>
        </div>

        {/* Metal Color Selector */}
        <div style={{ marginBottom: '22px' }}>
          <label style={{
            display: 'block',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'rgba(255, 255, 255, 0.6)',
            marginBottom: '12px',
            fontWeight: 600
          }}>
            Select Metal Material
          </label>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.values(METAL_CONFIGS).map((metal) => {
              const isActive = activeMetal === metal.id
              return (
                <button
                  key={metal.id}
                  onClick={() => setActiveMetal(metal.id)}
                  className={`swatch-btn ${isActive ? 'active' : ''}`}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: isActive ? '2px solid #E5C158' : '1px solid rgba(255, 255, 255, 0.12)',
                    background: isActive ? 'rgba(229, 193, 88, 0.12)' : 'rgba(0, 0, 0, 0.25)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: metal.swatchGradient,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
                      border: '1.5px solid rgba(255, 255, 255, 0.6)',
                      flexShrink: 0
                    }} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.9)' }}>
                        {metal.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)' }}>
                        18K Solid Alloy
                      </div>
                    </div>
                  </div>
                  {isActive && <Check size={16} color="#E5C158" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Surface Finish Switch */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Layers size={14} color="rgba(255, 255, 255, 0.7)" />
            <label style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: 600
            }}>
              Surface Finish
            </label>
          </div>
          <div style={{
            display: 'flex',
            background: 'rgba(0, 0, 0, 0.35)',
            borderRadius: '10px',
            padding: '4px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <button
              onClick={() => setFinishType('polished')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: finishType === 'polished' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                color: finishType === 'polished' ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: finishType === 'polished' ? 600 : 400,
                transition: 'all 0.2s ease'
              }}
            >
              High Polish
            </button>
            <button
              onClick={() => setFinishType('satin')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: finishType === 'satin' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                color: finishType === 'satin' ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: finishType === 'satin' ? 600 : 400,
                transition: 'all 0.2s ease'
              }}
            >
              Satin Matte
            </button>
          </div>
        </div>

        {/* CAD Model Input */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Upload size={14} color="rgba(255, 255, 255, 0.7)" />
            <label style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: 600
            }}>
              CAD Model GLB
            </label>
          </div>
          <input
            type="text"
            value={cadFileName}
            onChange={(e) => setCadFileName(e.target.value)}
            placeholder="e.g. /models/ring.glb"
            style={{
              width: '100%',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              outline: 'none'
            }}
          />
        </div>

      </div>
    </div>
  )
}

