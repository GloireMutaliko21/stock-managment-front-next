// create a hook to use TypedSelector in all components with react-redux/toolkit
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { RootState } from '@/redux/store';
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
