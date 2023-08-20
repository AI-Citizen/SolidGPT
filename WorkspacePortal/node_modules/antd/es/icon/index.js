import warning from '../_util/warning';
const Icon = () => {
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV !== "production" ? warning(false, 'Icon', 'Empty Icon') : void 0;
  }
  return null;
};
export default Icon;