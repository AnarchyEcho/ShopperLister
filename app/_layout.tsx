import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import * as sqlite from 'expo-sqlite';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { useEffect } from 'react';
import { ISettings } from '@/interfaces';
import { Header } from '@/components';
import { router, Stack } from 'expo-router';
import { useAtom } from 'jotai';
import { selectedPageAtom, settingsAtom } from '@/atoms';

const db = sqlite.openDatabaseSync('ShopperListerDB');

export default function RootLayout() {
  const [settings, setSettings] = useAtom<ISettings | undefined>(settingsAtom as any);
  const [_, setPage] = useAtom<string>(selectedPageAtom);

  useEffect(() => {
    db.execAsync(`
      PRAGMA journal_mode = WAL;
      create table if not exists toc (id INTEGER PRIMARY KEY UNIQUE NOT NULL, tableName text UNIQUE, type text, selected text, pickedList text UNIQUE);
      create table if not exists settings (id INTEGER PRIMARY KEY UNIQUE NOT NULL, name text UNIQUE, value text);
      insert or ignore into settings values (null, "chosenTheme", "dark");
      insert or ignore into settings values (null, "theme", '{"dark":{"background":"#232323","color":"#FEFEFE","headerBackground":"#FFA500","headerColor":"#000000"},"light":{"background":"#FEFEFE","color":"#000000","headerBackground":"#FFA500","headerColor":"#000000"}}');
      insert or ignore into toc values (null, "settings", "settings", "false", null);
      create table if not exists list_1 (id INTEGER PRIMARY KEY UNIQUE NOT NULL, name text, amount integer, checked text);
      insert or ignore into toc values (null, "home", "listView", "true", "list_1");
      insert or ignore into toc values (null, "lists", "listsOverview", "false", null);
    `);
    async function getSettings() {
      try {
        for await (const row of db.getEachAsync('select name,value from settings;') as any) {
          setSettings((old: any) => ({
            ...old,
            [row.name]: row.name === 'theme' ? JSON.parse(row.value) : row.value,
          }));
        }
      }
      catch (error) {
        console.log(error);
      }
    };
    getSettings();
    async function getPage() {
      try {
        const res = await db.getFirstAsync('select * from toc where selected = "true"') as any;
        setPage(res.tableName === 'home' ? res.pickedList : res.tableName);
        router.replace(res.tableName === 'home' ? '/' : res.tableName);
      }
      catch (error) {
        console.log(error);
      }
    }
    getPage();
  }, []);

  const styles = StyleSheet.create({
    container: {
      height: '100%',
      backgroundColor: settings?.theme ? settings?.theme[settings?.chosenTheme].background : '#232323',
    },
    text: {
      color: settings?.theme ? settings?.theme[settings?.chosenTheme].color : '#FEFEFE',
    },
  });

  useDrizzleStudio(db);
  return (
    <View style={styles.container}>
      <sqlite.SQLiteProvider databaseName="ShopperListerDB" useSuspense>
        <StatusBar
          style={settings?.chosenTheme === 'dark' ? 'light' : 'dark'}
          backgroundColor={settings?.theme ? settings?.theme[settings?.chosenTheme].background : '#232323'}
          translucent={false}
        />
        <Header />
        <Stack>
          <Stack.Screen name='index' options={{ headerShown: false, animationDuration: 200 }} />
          <Stack.Screen name='settings/index' options={{ headerShown: false, animation: 'slide_from_right', animationDuration: 200 }} />
          <Stack.Screen name='lists/index' options={{ headerShown: false, animation: 'slide_from_left', animationDuration: 200 }} />
        </Stack>
      </sqlite.SQLiteProvider>
    </View>
  );
}
