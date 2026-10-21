// Groups of three: one 2x2 square + two 1x1 squares, big tile alternating sides.
// Leftovers widen to fill the row so the grid never has holes.
export const tileSize = (i: number, count: number) => {
    const full = count - (count % 3);
    if (i < full) return i % 3 ? "" : Math.floor(i / 3) % 2 ? "big right" : "big";
    return count - full === 1 ? "wide-3" : i === full ? "wide-2" : "";
};
