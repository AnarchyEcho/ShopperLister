import { cogModalVisibleAtom, listsOverviewAtom, selectedListAtom, settingsAtom, shoppingListAtom } from '@/atoms';
import { ListItem } from '@/components';
import { IList } from '@/interfaces';
import { updateListsOverview, updateShoppingList } from '@/utils';
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
  const [shoppingList, setShoppingList] = useAtom(shoppingListAtom);
  const [_, setModalVisible] = useAtom(cogModalVisibleAtom);

  const styles = StyleSheet.create({
    container: {
      height: '100%',
      backgroundColor: settings?.theme ? settings?.theme[settings?.chosenTheme].background : '#232323',
    },
    text: {
      color: settings?.theme ? settings?.theme[settings?.chosenTheme].color : '#FEFEFE',
    },
  });

  useEffect(() => {
    updateListsOverview(db, listsOverview, setListsOverview);
  }, []);

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
                await db.runAsync(`update toc set pickedList = "${item.tableName}" where tableName = "home";`);
                updateShoppingList(db, shoppingList, setShoppingList, item.tableName);
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
