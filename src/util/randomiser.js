export const getRandomItem = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const getRandomFrom = (arr, number) => {
  // Shuffle array
  const shuffled = arr.sort(() => 0.5 - Math.random());
  // Get sub-array of first n elements after shuffled
  return shuffled.slice(0, number);
};
