import { useSelector, useDispatch } from 'react-redux';
import { updatePrinterConfig as updatePrinterConfigAction } from '../store/slices/hardwareSlice';

export function usePrinterConfig() {
  const dispatch = useDispatch();
  const config = useSelector(state => state.hardware.printerConfig);

  const updateConfig = (key, value) => {
    dispatch(updatePrinterConfigAction({ key, value }));
  };

  return { config, updateConfig };
}
