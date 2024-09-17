import { StatusBar } from 'expo-status-bar';
import { BackHandler, SafeAreaView, StyleSheet } from 'react-native';
import * as sqlite from 'expo-sqlite';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { useEffect } from 'react';
import { ISettings } from '@/interfaces';
import { Header, AddItem } from '@/components';
import { router, SplashScreen, Stack } from 'expo-router';
import { useAtom } from 'jotai';
import { cogModalVisibleAtom, listsOverviewAtom, selectedListAtom, selectedPageAtom, settingsAtom, shoppingListAtom } from '@/atoms';
import { getSettings } from '@/utils';

const db = sqlite.openDatabaseSync('ShopperListerDB');
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [settings, setSettings] = useAtom(settingsAtom);
  const [page, setPage] = useAtom(selectedPageAtom);
  const [pickedList, setPickedList] = useAtom(selectedListAtom);
  const [listsOverview, setListsOverview] = useAtom(listsOverviewAtom);
  const [_, setShoppingList] = useAtom(shoppingListAtom);
  const [modalVisible, setModalVisible] = useAtom(cogModalVisibleAtom);

  const initConfig: ISettings['theme'] = {
    dark: {
      background: '#232323',
      color: '#FEFEFE',
      headerBackground: '#FFA500',
      headerColor: '#000000',
      listCogColor: '#FFA500',
      listItemTextColor: '#FEFEFE',
      listItemBackgroundColor: '#303030',
      modalBackground: '#404040',
      modalColor: '#000000',
      modalTrim: '#FFA500',
      modalDisabled: '#767676',
    },
    light: {
      background: '#FEFEFE',
      color: '#000000',
      headerBackground: '#FFA500',
      headerColor: '#000000',
      listCogColor: '#FFA500',
      listItemTextColor: '#FEFEFE',
      listItemBackgroundColor: '#303030',
      modalBackground: '#404040',
      modalColor: '#000000',
      modalTrim: '#FFA500',
      modalDisabled: '#767676',
    },
  };

  async function checkList() {
    const res = await db.getAllAsync('select * from toc where type = "shoppingList"');
    if (res.length === 0) {
      await db.execAsync(`
          create table if not exists list_1 (id INTEGER PRIMARY KEY UNIQUE NOT NULL, name text, amount text, checked text);
          insert or ignore into toc values (null, "list_1", "shoppingList", null, null);
          insert or ignore into toc values (null, "home", "listView", "true", "list_1");
        `);
    }
  }

  useEffect(() => {
    db.execAsync(`
      PRAGMA journal_mode = WAL;
      create table if not exists toc (id INTEGER PRIMARY KEY UNIQUE NOT NULL, tableName text UNIQUE, type text, selected text, pickedList text UNIQUE);
      create table if not exists settings (id INTEGER PRIMARY KEY UNIQUE NOT NULL, name text UNIQUE, value text);
      insert or ignore into settings values (null, "chosenTheme", "dark");
      insert or ignore into settings values (null, "theme", '${JSON.stringify(initConfig)}');
      insert or ignore into toc values (null, "settings", "settings", "false", null);
      insert or ignore into toc values (null, "lists", "listsOverview", "false", null);
    `);
    checkList();
    getSettings(db, settings, setSettings);

    async function getPage() {
      try {
        const picked = await db.getFirstAsync('select pickedList from toc where pickedList is not NULL') as any;
        setPickedList(picked.pickedList);

        async function getShoppingList() {
          setShoppingList(undefined);
          try {
            for await (const row of db.getEachAsync(`select name,amount,checked from ${picked.pickedList}`) as any) {
              if (row === undefined) {
                return;
              }
              setShoppingList((old: any) => (old !== undefined ? new Set([...old, row]) : new Set([row])));
            }
          }
          catch (error) {
            console.log(error);
          }
        }
        getShoppingList();

        const getListsOverview = async () => {
          setListsOverview(undefined);
          for await (const row of db.getEachAsync('select tableName from toc where type = "shoppingList";') as any) {
            if (typeof row === 'undefined') {
              return null;
            }
            if (!listsOverview?.has(row.tableName)) {
              setListsOverview((old: any) => (old !== undefined ? new Set([...old, row]) : new Set([row])));
            }
          }
        };
        getListsOverview();

        const res = await db.getFirstAsync('select * from toc where selected = "true"') as any;
        setPage(res.tableName === 'home' ? res.pickedList : res.tableName);

        router.replace(res.tableName === 'home' ? '/' : res.tableName);
        setTimeout(SplashScreen.hideAsync, 400);
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

  const handleBackBtn = () => {
    async function realBackHandler() {
      const res = await db.getFirstAsync('select * from toc where selected = "true"') as any;
      if (res.tableName === 'home') {
        BackHandler.exitApp();
      }
      else if (modalVisible) {
        setModalVisible(false);
        router.back();
      }
      else {
        setPage(pickedList);
        await db.runAsync('update toc set selected = "false" where selected = "true"');
        await db.runAsync('update toc set selected = "true" where tableName = "home"');
        router.navigate('/');
      }
    }
    realBackHandler();
    return true;
  };
  BackHandler.addEventListener('hardwareBackPress', handleBackBtn);

  // useDrizzleStudio(db);
  return (
    <SafeAreaView style={styles.container}>
      <sqlite.SQLiteProvider databaseName="ShopperListerDB" useSuspense>
        <StatusBar
          style={settings?.chosenTheme === 'dark' ? 'light' : 'dark'}
          backgroundColor={settings?.theme ? settings?.theme[settings?.chosenTheme].background : '#232323'}
          translucent={false}
        />
        <Header />
        <Stack>
          <Stack.Screen name='index' options={{ headerShown: false, animationDuration: 100 }} />
          <Stack.Screen name='cogModal' options={{ headerShown: false, animation: 'fade', animationDuration: 100, presentation: 'transparentModal' }} />
          <Stack.Screen name='settings/index' options={{ headerShown: false, animation: 'slide_from_right', animationDuration: 100 }} />
          <Stack.Screen name='lists/index' options={{ headerShown: false, animation: 'slide_from_left', animationDuration: 100 }} />
        </Stack>
        {(page !== 'settings' && !modalVisible) && <AddItem />}
      </sqlite.SQLiteProvider>
    </SafeAreaView>
  );
}
