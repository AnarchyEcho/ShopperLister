import { ISettings } from '@/interfaces';
import { SQLiteDatabase } from 'expo-sqlite';

export async function getSettings(db: SQLiteDatabase, state: ISettings | undefined, setState: any) {
  try {
    for await (const row of db.getEachAsync('select name,value from settings;') as any) {
      setState((old: any) => ({
        ...old,
        [row.name]: row.name === 'theme' ? JSON.parse(row.value) : row.value,
      }));
    }
  }
  catch (error) {
    console.log(error);
  }
};
