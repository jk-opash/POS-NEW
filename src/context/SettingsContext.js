import { useSelector, useDispatch } from 'react-redux';
import { updateSetting as updateSettingAction, updateNestedSetting as updateNestedSettingAction } from '../store/slices/settingsSlice';

export function useSettings() {
  const dispatch = useDispatch();
  const settings = useSelector(state => state.settings.settings);

  const updateSetting = (category, key, value) => dispatch(updateSettingAction({ category, key, value }));
  const updateNestedSetting = (category, subCategory, key, value) => dispatch(updateNestedSettingAction({ category, subCategory, key, value }));

  return {
    settings,
    updateSetting,
    updateNestedSetting,
  };
}
