// Define colors for the game
export const COLORS = {
  background: '#FFF9F2', // Light cream background
  text: '#5D4037', // Dark brown text
  primary: '#FF9800', // Primary orange
  secondary: '#E65100', // Darker orange
  
  // Tile colors based on value
  tile: {
    0: '#EEEEEE',
    2: '#FFFFFF', // White
    4: '#FFF3E0', // Very light orange
    8: '#FFE0B2', // Light orange
    16: '#FFCC80', // Medium light orange
    32: '#FFB74D', // Medium orange
    64: '#FFA726', // Orange
    128: '#FF9800', // Primary orange
    256: '#FB8C00', // Dark orange
    512: '#F57C00', // Darker orange
    1024: '#EF6C00', // Very dark orange
    2048: '#E65100', // Deepest orange
    4096: '#BF360C', // Burnt orange
    8192: '#A52714', // Dark red-orange
    16384: '#8D1D0C', // Darker red-orange
    32768: '#701A04', // Very dark red-orange
    65536: '#5A1400' // Almost black red-orange
  },
  
  // Obstacle colors
  obstacle: {
    wall: '#5D4037', // Dark brown
    portal: '#29B6F6', // Light blue
    multiplier: '#EC407A' // Pink
  },
  
  // Level colors
  level: {
    easy: '#8BC34A', // Light green
    medium: '#FFC107', // Amber
    hard: '#FF5722', // Deep orange
    expert: '#7E57C2' // Purple
  },
  
  // Controls colors
  controls: {
    background: '#F5F5F5', // Light gray
    active: '#FF9800', // Orange
    inactive: '#BDBDBD', // Gray
    shadow: 'rgba(0,0,0,0.1)' // Shadow
  },
  
  // Grid colors
  grid: {
    background: '#BBADA0', // Beige background
    cell: '#CCC0B3', // Light beige cell
  },
  
  // Dark mode colors
  dark: {
    background: '#263238', // Dark blue-gray
    text: '#ECEFF1', // Light gray-blue
    primary: '#FF9800', // Orange
    secondary: '#FFB74D', // Light orange
    
    // Adding obstacle colors for dark mode
    obstacle: {
      wall: '#3E2723', // Darker brown for walls
      portal: '#0277BD', // Darker blue for portals
      multiplier: '#AD1457' // Darker pink for multipliers
    },
    
    controls: {
      background: '#37474F', // Darker blue-gray
      active: '#FF9800', // Orange
      inactive: '#546E7A', // Medium blue-gray
      shadow: 'rgba(0,0,0,0.3)' // Shadow
    }
  },
  
  // Social sharing colors
  social: {
    twitter: '#1DA1F2', // Twitter blue
    facebook: '#4267B2', // Facebook blue
    instagram: '#C13584', // Instagram purple
    whatsapp: '#25D366', // WhatsApp green
    telegram: '#0088CC', // Telegram blue
    email: '#D44638' // Email red
  },
  
  // UI elements
  ui: {
    success: '#4CAF50', // Green
    warning: '#FFC107', // Amber
    error: '#F44336', // Red
    info: '#2196F3', // Blue
    overlay: 'rgba(0,0,0,0.5)', // Modal overlay
    card: '#FFFFFF', // Card background
    divider: '#EEEEEE' // Divider
  }
};