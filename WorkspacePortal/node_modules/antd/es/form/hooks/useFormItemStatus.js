import { useContext } from 'react';
import { FormItemInputContext } from '../context';
import warning from '../../_util/warning';
const useFormItemStatus = () => {
  const {
    status,
    errors = [],
    warnings = []
  } = useContext(FormItemInputContext);
  process.env.NODE_ENV !== "production" ? warning(status !== undefined, 'Form.Item', 'Form.Item.useStatus should be used under Form.Item component. For more information: https://u.ant.design/form-item-usestatus') : void 0;
  return {
    status,
    errors,
    warnings
  };
};
// Only used for compatible package. Not promise this will work on future version.
useFormItemStatus.Context = FormItemInputContext;
export default useFormItemStatus;