export const METAL_TYPES = {
  YELLOW_GOLD: 'yellow_gold',
  WHITE_GOLD: 'white_gold',
  ROSE_GOLD: 'rose_gold',
};

export const METAL_CONFIGS = {
  [METAL_TYPES.YELLOW_GOLD]: {
    id: METAL_TYPES.YELLOW_GOLD,
    name: '18K Yellow Gold',
    color: '#E5C158',
    metalness: 0.95,
    roughness: 0.10,
    envMapIntensity: 1.2,
    swatchGradient: 'linear-gradient(135deg, #FFF099 0%, #D4AF37 50%, #aa820a 100%)',
    description: 'Classic warm luxury gold with soft natural luster'
  },
  [METAL_TYPES.WHITE_GOLD]: {
    id: METAL_TYPES.WHITE_GOLD,
    name: '18K White Gold',
    color: '#E0E0E6',
    metalness: 0.98,
    roughness: 0.10,
    envMapIntensity: 1.3,
    swatchGradient: 'linear-gradient(135deg, #FFFFFF 0%, #D0D0D0 50%, #8A8A8A 100%)',
    description: 'Sleek platinum white gold finish with crisp specular sheen'
  },
  [METAL_TYPES.ROSE_GOLD]: {
    id: METAL_TYPES.ROSE_GOLD,
    name: '18K Rose Gold',
    color: '#E59D90',
    metalness: 0.95,
    roughness: 0.05,
    envMapIntensity: 1.2,
    swatchGradient: 'linear-gradient(135deg, #FAD6CE 0%, #E0A396 50%, #B76E79 100%)',
    description: 'Elegant copper-blended pink gold with warm reflections'
  },
};

