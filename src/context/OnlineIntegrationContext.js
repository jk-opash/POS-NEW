import { useSelector, useDispatch } from 'react-redux';
import { updatePlatform as updatePlatformAction } from '../store/slices/onlineSlice';

export function useOnlineIntegration() {
  const dispatch = useDispatch();
  const platforms = useSelector(state => state.online.platforms);
  const updatePlatform = (id, updates) => dispatch(updatePlatformAction({ id, updates }));

  return { platforms, updatePlatform };
}
