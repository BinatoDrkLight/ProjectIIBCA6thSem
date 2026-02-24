const FindOpponent = (index, cols, total) => {
  const opponents = [];
  const rows = Math.ceil(total / cols);

  const row = Math.floor(index / cols);
  const col = index % cols;

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;

      const newRow = row + dr;
      const newCol = col + dc;

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols
      ) {
        const newIndex = newRow * cols + newCol;

        // Only include valid indices
        if (newIndex < total) {
          opponents.push(newIndex);
        }
      }
    }
  }

  return opponents;
}

export default FindOpponent;