import { listsOverviewAtom, settingsAtom } from '@/atoms';
import { ISettings } from '@/interfaces';
import { useSQLiteContext } from 'expo-sqlite';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Index() {
  const db = useSQLiteContext();
  const [settings] = useAtom<ISettings | undefined>(settingsAtom as any);
  const [listsOverview, setListsOverview] = useAtom<string[] | undefined>(listsOverviewAtom as any);

  useEffect(() => {
    async function getLists() {
      try {
        for await (const row of db.getEachAsync('select tableName from toc where type = "shoppingList";') as any) {
          if (typeof row === 'undefined') {
            return null;
          }
          if (!listsOverview?.includes(row.tableName)) {
            setListsOverview((old: any) => (old !== undefined ? [...old, row.tableName] : [row.tableName]));
          }
        }
      }
      catch (error) {
        console.log(error);
      }
    }
    getLists();
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

  return (
    <View style={styles.container}>
      {listsOverview?.map((listItem, i) => {
        return (
          <Text style={styles.text} key={listItem + i}>
            {listItem}
          </Text>
        );
      })}
    </View>
  );
};
