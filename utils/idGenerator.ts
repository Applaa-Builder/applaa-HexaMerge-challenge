// Simple ID generator for tiles and obstacles

let lastId = 0;

export function generateId(): string {
  lastId++;
  return `id_${Date.now()}_${lastId}`;
}