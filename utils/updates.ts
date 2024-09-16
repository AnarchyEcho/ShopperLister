import { IList, IShoppingList } from '@/interfaces';
import { SQLiteDatabase } from 'expo-sqlite';

export const updateListsOverview = async (db: SQLiteDatabase, state: Set<IList> | undefined, setState: any) => {
  setState(undefined);
  for await (const row of db.getEachAsync('select tableName from toc where type = "shoppingList";') as any) {
    if (typeof row === 'undefined') {
      return null;
    }
    if (!state?.has(row.tableName)) {
      setState((old: any) => (old !== undefined ? new Set([...old, row]) : new Set([row])));
    }
  }
};

export const updateShoppingList = (db: SQLiteDatabase, state: Set<IShoppingList> | undefined, setState: any, pickedList: string) => {
  setState(undefined);
  for (const row of db.getEachSync(`select name,amount,checked from ${pickedList}`) as any) {
    if (typeof row === 'undefined') {
      return null;
    }
    if (!state?.has(row.tableName)) {
      setState((old: any) => (old !== undefined ? new Set([...old, row]) : new Set([row])));
    }
  }
};
