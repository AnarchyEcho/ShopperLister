import { IList, ISettings } from '@/interfaces';
import { atom } from 'jotai';

export const settingsAtom = atom<ISettings | undefined>();
export const selectedPageAtom = atom<string>('ShopperLister');
export const listsOverviewAtom = atom<Set<IList> | undefined>();
export const selectedListAtom = atom<string>('');
export const cogModalVisibleAtom = atom<boolean>(false);
