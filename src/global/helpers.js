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

export const getFocusableElements = () =>
  Array.prototype.filter.call(document.querySelectorAll(process.env.REACT_APP_NAVIGABLE_ELEMENTS),
    (element) => element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement);
