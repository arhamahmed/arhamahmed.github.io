// Generated: Natural Earth 1:50m land minus the large lakes, sampled on a 6px grid.

export const MAP = { w: 560, h: 300, step: 6 }

const rad = Math.PI / 180
// Albers equal-area conic, standard parallels 35°/50°, centred on 98°W
const N = 0.669810439735012, C = 1.4393850417707048, R0 = 1.0825407505617393
const K = 600, TX = 285, TY = 130

/** [lon, lat] → map px */
export function project([lon, lat]: [number, number]): [number, number] {
  const r = Math.sqrt(C - 2 * N * Math.sin(lat * rad)) / N
  const t = N * (lon + 98) * rad
  return [K * r * Math.sin(t) + TX, K * (r * Math.cos(t) - R0) + TY]
}

/** [lon, lat] by IATA code */
export const AIRPORTS: Record<string, [number, number]> = {YYZ: [-79.63, 43.68], YOW: [-75.67, 45.32], SEA: [-122.31, 47.45], SJC: [-121.93, 37.36]}

/** one string per grid row, 'o' = land */
export const LAND = [
  '................oooooooooooooooooooooooooooooooooooooooooooooooo...oo.ooooooooooooooooo....oo',
  '................oooooooooooooooooooooooooooooooooooooooooooooooo...ooooooooooooooooo.......oo',
  '................ooooooooooooooooooooooooooooooo.oooooooooooooooooo..oooooooooooooo...oo....oo',
  '...............ooooooooooooooooooooooooooooooo..ooooooooooooooooo...oooooo.ooooooo',
  '................o.ooooooooooooooooooooooooooooo.oooooooooooooooooo.oooooooooooooo.ooo',
  '................oo.oooooooooooooooooooooooooooo..ooooooooooooooooooooooooooooooo.oooo.....o',
  '.................o.ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo.oooo.....oo',
  '..................o.oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo.oo.o',
  '.................oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo.ooooooooooo',
  '.................o.ooooooooooooooooooooooooooooooooooooooo.oooooooooooooooooooooooooooo.oo',
  '.................oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo..oo',
  '.................ooooooooooooooooooooooooooooooooooooooooo...oooooooooooo.ooooooooooo.oo',
  '................ooooooooooooooooooooooooo.ooooooooooooooo......ooooooooooooooooooooo..oo',
  '................ooooooooooooooooooooooooooo.oooooooooooo........ooooo.ooooooooooooo',
  '................ooooooooooooooooooooooooooooooooooooooo..ooo.ooo....ooooooooo.oooo',
  '...............ooooooooooooooooooooooooooooooooooooooooooooooo.......ooooooooooo.o',
  '...............ooooooooooooooooooooooooooooooooooooooooooooo...oo......oo.ooooooo',
  '..............ooooooooooooooooooooooooooooooooooooooooooooooo.oooo..ooo...oooooooo',
  '..............oooooooooooooooooooooooooooooooooooooooooooooo..ooo.o.oo.ooooooooooo',
  '..............oooooooooooooooooooooooooooooooooooooooooooooo..ooooo.oo.oooooooooo',
  '.............ooooooooooooooooooooooooooooooooooooooooooooooo..oooooo...ooooooo',
  '.............ooooooooooooooooooooooooooooooooooooooooooooooo..oooo...oooooooooo',
  '..............oooooooooooooo.oooooooooooooooooooooooooooooooo.ooooo.ooooooooooo',
  '.............ooooooooooooooo.oooooooooooooooooooooooooooooooooooooooooooooooooo',
  '..............oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo',
  '..............oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo.o',
  '..............oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo.o',
  '..............ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo',
  '..............oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo',
  '...............ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo',
  '...............oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo',
  '...............ooooooooo.ooooooooooooooooooooooooooooooooooooooooooooooooooooo',
  '................oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo',
  '................oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo',
  '...................oooooooooooooooooooooooooooooooooooooooooooooooooooooooo',
  '...................oooooooooooooooooooooooooooooooooooooooooooooooooooooooo',
  '...................ooooooooooooooooooooooooooooooooooooooooooooooooooooooo',
  '....................ooooooooooooooooooooooooooooooooooooooooooooooooooooo',
  '....................ooooooooooooooooooooooooooooooooooooooooooooooooooooo',
  '....................oo.ooooooooooooooooooooooooooooooooooooooooooooooooo',
  '....................oo...ooooooooooooooooooooooooooooooooooooooooooooooo',
  '....................oo...oooooooooooooooooooooooooooooooooooooooooooooooo',
  '.....................oo..oooooooooooooooooooooooooooooooooooooooooooooooo',
  '......................o..oooooooooooooooooooooooooooooooooo...........oooo',
  '.......................o..oooooooooooooooooooooooooooooooooo...........ooo',
  '......................oo...ooooooooooooooooooooooooo...................oooo',
  '......................ooo...ooooooooooooooooooooooo.....................oooo..o.o',
  '.......................oo...oooooooooooooooooooooo.......................ooo',
  '........................oo...oooooooooooooooooooo........................ooo',
  '.........................oo...ooooooooooooooooooo..........................o...o',
]
