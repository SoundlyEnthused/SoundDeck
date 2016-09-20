function DJ(maxDJs = 4) {
  let active = [];
  const waiting = [];
  // let currentDJ = null;
  return {
    addToWaiting: (id) => {
      if (active.length < maxDJs) {
        active.push(id);
      } else {
        waiting.push(id);
      }
    },
    getNextWaiting: () => waiting.shift(),
    getNextTrack: () => {
      return null;
    },
    getDJs: () => active.slice(),
    getWaiting: () => waiting.slice(),
    removeDJ: (id) => {
      active = active.filter(userId => userId !== id);
      if (active.length < maxDJs && waiting.length > 0) {
        active.push(waiting.shift());
      }
    },
  };
}

module.exports = DJ;
