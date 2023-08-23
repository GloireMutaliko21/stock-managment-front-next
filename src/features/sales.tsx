import { atom } from 'jotai';
import { Facture } from '../screens/salesReport/FactureModal';

export const reloadAtom = atom(false);
export const showFactureAtom = atom(false);
export const showPayeModalAtom = atom(false);
export const loadingFactureAtom = atom(false);
export const factureAtom = atom<Facture | null>(null);
// export const totalCartAtom = atom((get) =>
//   get(factureAtom).reduce((prev, current) => prev + +current.sellingPrice * +current.quantity, 0)
// );
// export const countFactureAtom = atom((get) => get(factureAtom).reduce((prev, current) => prev + +current.quantity, 0));
