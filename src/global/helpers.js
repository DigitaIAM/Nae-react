export const writeToLocalStorage = (key, value) => {
  const prevValue = JSON.parse(localStorage.getItem('excel'));

  localStorage.setItem('excel', JSON.stringify({
    ...(prevValue || {}),
    [key]: value,
  }));
};

export const getFromLocalStorage = (key) => {
  return (JSON.parse(localStorage.getItem('excel')) || {})[key];
};
