import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '@/constants/colors';
import { CELL_SIZE } from '@/constants/game';
import { HexPosition } from '@/types/game';
import { hexToPixel } from '@/utils/hexGrid';

interface HexCellProps {
  position: HexPosition;
}

export default function HexCell({ position }: HexCellProps) {
  // Calculate pixel position from hex coordinates
  const { x, y } = hexToPixel(position, CELL_SIZE);
  
  return (
    <View
      style={[
        styles.cell,
        {
          transform: [
            { translateX: x },
            { translateY: y }
          ]
        }
      ]}
    />
  );
}

const styles = StyleSheet.create({
  cell: {
    position: 'absolute',
    width: CELL_SIZE * 2,
    height: CELL_SIZE * Math.sqrt(3),
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    // Using a rounded rectangle for better compatibility
  },
});