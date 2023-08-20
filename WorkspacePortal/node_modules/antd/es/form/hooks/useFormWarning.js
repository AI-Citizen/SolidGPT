import { useEffect } from 'react';
import warning from '../../_util/warning';
const names = {};
export default function useFormWarning(_ref) {
  let {
    name
  } = _ref;
  useEffect(() => {
    if (name) {
      names[name] = (names[name] || 0) + 1;
      process.env.NODE_ENV !== "production" ? warning(names[name] <= 1, 'Form', 'There exist multiple Form with same `name`.') : void 0;
      return () => {
        names[name] -= 1;
      };
    }
  }, [name]);
}