export const getData = (key) => {
  return localStorage.getItem(key);
};

export const storeData = (key, value) => {
  const data = JSON.stringify(value);
  localStorage.setItem(key, data);
};

export const removeData = (key) => {
  localStorage.removeItem(key);
};
