import { cogModalVisibleAtom, listsOverviewAtom, selectedListAtom, settingsAtom } from '@/atoms';
import { ListItem } from '@/components';
import { IList } from '@/interfaces';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';

export default function Index() {
  const db = useSQLiteContext();
  const [settings] = useAtom(settingsAtom);
  const [listsOverview, setListsOverview] = useAtom(listsOverviewAtom);
  const [pickedList, setPickedList] = useAtom(selectedListAtom);
  const [_, setModalVisible] = useAtom(cogModalVisibleAtom);

  useEffect(() => {
    async function getLists() {
      try {
        for await (const row of db.getEachAsync('select tableName from toc where type = "shoppingList";') as any) {
          if (typeof row === 'undefined') {
            return null;
          }
          if (!listsOverview?.has(row)) {
            setListsOverview((old: any) => (old !== undefined ? new Set([...old, row]) : new Set([row])));
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
    <View>
      <FlatList
        style={styles.container}
        data={listsOverview !== undefined ? Array.from(listsOverview as Set<IList>) : undefined}
        renderItem={({ item }) => {
          return (
            <ListItem
              name={item.tableName}
              pickedList={pickedList.toLowerCase()}
              key={item.tableName}
              onClick={async () => {
                setPickedList(item.tableName);
                db.runAsync(`update toc set pickedList = "${item.tableName}" where tableName = "home";`);
              }}
              cogPress={() => {
                setModalVisible(true);
                router.navigate({
                  pathname: '/cogModal',
                  params: {
                    itemName: item.tableName,
                  },
                });
              }}
            />
          );
        }}
      />
    </View>
  );
};
