import { cogModalVisibleAtom, selectedListAtom, settingsAtom, shoppingListAtom } from '@/atoms';
import { IShoppingList } from '@/interfaces';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useAtom } from 'jotai';
import { View, StyleSheet, FlatList } from 'react-native';
import { ListItem } from './ListItem';
import { updateShoppingList } from '@/utils';

export const Content = () => {
  const db = useSQLiteContext();
  const [settings] = useAtom(settingsAtom);
  const [shoppingList] = useAtom(shoppingListAtom);
  const [pickedList] = useAtom(selectedListAtom);
  const [_, setShoppingList] = useAtom(shoppingListAtom);
  const [__, setModalVisible] = useAtom(cogModalVisibleAtom);

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
        data={shoppingList !== undefined ? Array.from(shoppingList as Set<IShoppingList>) : undefined}
        renderItem={({ item }) => {
          return (
            <ListItem
              name={item.name}
              amount={item.amount}
              checked={item.checked}
              key={item.name}
              onClick={async () => {
                db.runSync(`update or ignore ${pickedList} set checked = "${item.checked === 'true' ? 'false' : 'true'}" where name = "${item.name}"`);
                updateShoppingList(db, shoppingList, setShoppingList, pickedList);
              }}
              cogPress={() => {
                setModalVisible(true);
                router.navigate({
                  pathname: '/cogModal',
                  params: {
                    itemName: item.name,
                    amount: item.amount,
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
