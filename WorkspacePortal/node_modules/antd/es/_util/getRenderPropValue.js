export const getRenderPropValue = propValue => {
  if (!propValue) {
    return null;
  }
  if (typeof propValue === 'function') {
    return propValue();
  }
  return propValue;
};