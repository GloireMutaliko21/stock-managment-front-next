import { Cart } from '@/screens/myProducts/CartModal';
import { atom } from 'jotai';

import { atomWithStorage } from 'jotai/utils';

export const reloadAtom = atom(false);
export const showCartAtom = atom(false);
export const loadingCartAtom = atom(false);
export const finaliseAtom = atom(false);
export const cartAtom = atomWithStorage<Cart[]>('cart', []);
export const totalCartAtom = atom((get) =>
  get(cartAtom).reduce((prev, current) => prev + +current.sellingPrice * +current.quantity, 0)
);
export const countCartAtom = atom((get) => get(cartAtom).reduce((prev, current) => prev + +current.quantity, 0));
