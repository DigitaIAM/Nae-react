export const getStyles = (fixedPosition) => {
  if (!fixedPosition || (fixedPosition !== 'left' && fixedPosition !== 'right')) {
    return {};
  }

  return {
    position: 'sticky',
    [fixedPosition]: 0,
  };
};
