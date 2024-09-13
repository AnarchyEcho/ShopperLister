import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet } from "react-native";
import * as sqlite from 'expo-sqlite'
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Suspense, useEffect, useState } from "react";
import { ISettings } from "@/interfaces";

const db = sqlite.openDatabaseSync('ShopperListerDB');

export default function Index() {
  const [settings, setSettings]: [ISettings, React.Dispatch<any>] = useState<any>({})

  useEffect(() => {
    db.execAsync(`
      PRAGMA journal_mode = WAL;
      create table if not exists toc (id INTEGER PRIMARY KEY UNIQUE NOT NULL, tableName text UNIQUE, type text);
      create table if not exists settings (id INTEGER PRIMARY KEY UNIQUE NOT NULL, name text, value text);
      insert or ignore into toc values (null, "settings", "settings");
      create table if not exists list_1 (id INTEGER PRIMARY KEY UNIQUE NOT NULL, name text, amount integer, checked text);
      insert or ignore into toc values (null, "list_1", "shoppingList");
      `);
    async function getSettings() {
      for await (const row of db.getEachAsync('select name,value from settings;') as any) {
        setSettings((old: any) => ({
          ...old,
          [row.name]: row.value
        }))
      }
    }
    getSettings()
  }, [])

  const styles = StyleSheet.create({
    container: {
      height: '100%',
      backgroundColor: '#232323',
    }
  })

  useDrizzleStudio(db);
  return (
    <View style={styles.container}>
      <Suspense fallback={<Text>Loading...</Text>}>
        <sqlite.SQLiteProvider databaseName="ShopperListerDB" useSuspense>
          <StatusBar style="dark" />
          <Text>{settings.chosenTheme}</Text>
        </sqlite.SQLiteProvider>
      </Suspense>
    </View>
  );
}