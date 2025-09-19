import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Tile } from '@/types/game';
import HexCell from '@/components/HexCell';
import HexTile from '@/components/HexTile';
import { generateGridPositions } from '@/utils/hexGrid';
import { GRID_SIZE } from '@/constants/game';

interface HexGridProps {
  grid: Tile[];
}

export default function HexGrid({ grid }: HexGridProps) {
  // Generate all valid positions for the grid
  const positions = generateGridPositions(GRID_SIZE);
  
  return (
    <View style={styles.container}>
      {/* Render the grid cells (empty spaces) */}
      {positions.map((position) => (
        <HexCell key={`cell-${position.q}-${position.r}`} position={position} />
      ))}
      
      {/* Render the tiles */}
      {grid.map((tile, index) => (
        <HexTile 
          key={tile.id} 
          tile={tile} 
          zIndex={index + 10} // Ensure tiles are above cells
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: 400, // Adjust based on your grid size
    alignItems: 'center',
    justifyContent: 'center',
  },
});