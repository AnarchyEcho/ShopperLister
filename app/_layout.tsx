import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import * as sqlite from 'expo-sqlite';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { useEffect } from 'react';
import { ISettings } from '@/interfaces';
import { Header } from '@/components';
import { Stack } from 'expo-router';
import { useAtom } from 'jotai';
import { settingsAtom } from '@/atoms';

const db = sqlite.openDatabaseSync('ShopperListerDB');

export default function RootLayout() {
  const [settings, setSettings] = useAtom<ISettings | undefined>(settingsAtom as any);

  useEffect(() => {
    db.execAsync(`
      PRAGMA journal_mode = WAL;
      create table if not exists toc (id INTEGER PRIMARY KEY UNIQUE NOT NULL, tableName text UNIQUE, type text);
      create table if not exists settings (id INTEGER PRIMARY KEY UNIQUE NOT NULL, name text UNIQUE, value text);
      insert or ignore into settings values (null, "chosenTheme", "dark");
      insert or ignore into settings values (null, "theme", '{"dark":{"background":"#232323","color":"#FEFEFE","headerBackground":"#FEFEFE","headerColor":"#000000"},"light":{"background":"#FEFEFE","color":"#000000","headerBackground":"#FEFEFE","headerColor":"#000000"}}');
      insert or ignore into toc values (null, "settings", "settings");
      create table if not exists list_1 (id INTEGER PRIMARY KEY UNIQUE NOT NULL, name text, amount integer, checked text);
      insert or ignore into toc values (null, "list_1", "shoppingList");
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
          <Stack.Screen name='index' options={{ headerShown: false }} />
          <Stack.Screen name='settings/index' options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name='lists/index' options={{ headerShown: false, animation: 'slide_from_left' }} />
        </Stack>
      </sqlite.SQLiteProvider>
    </View>
  );
}
