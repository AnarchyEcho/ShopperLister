import { ISettings } from '@/interfaces';
import { View, Text, StyleSheet } from 'react-native';
import { Entypo, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useAtom } from 'jotai';
import { selectedListAtom, selectedPageAtom, settingsAtom } from '@/atoms';
import { useSQLiteContext } from 'expo-sqlite';

export const Header = () => {
  const db = useSQLiteContext();
  const [settings] = useAtom<ISettings | undefined>(settingsAtom as any);
  const [page, setPage] = useAtom<string>(selectedPageAtom);
  const [pickedList] = useAtom<string>(selectedListAtom);

  const styles = StyleSheet.create({
    header: {
      width: '100%',
      backgroundColor: settings?.theme ? settings?.theme[settings?.chosenTheme].headerBackground : '#232323',
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 10,
      paddingRight: 10,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignContent: 'center',
    },
    text: {
      color: settings?.theme ? settings?.theme[settings?.chosenTheme].headerColor : '#FEFEFE',
      textAlign: 'center',
      fontSize: 25,
    },
    icon: {
      color: settings?.theme ? settings?.theme[settings?.chosenTheme].headerColor : '#000000',
      fontSize: 30,
      margin: 0,
      padding: 0,
    },
    offset: {
      top: 1,
    },
  });

  const pressHandler = async (nextPage: string, home: boolean) => {
    home ? setPage(pickedList) : setPage(nextPage);
    await db.runAsync('update toc set selected = "false" where selected = "true"');
    await db.runAsync(`update toc set selected = "true" where tableName = "${nextPage}"`);
  };

  return (
    <View style={styles.header}>
      <Link
        href={page.includes('lists') ? '/' : '/lists'}
        style={styles.offset}
        onPress={async () => {
          page.includes('lists') ? await pressHandler('home', true) : await pressHandler('lists', false);
        }}>
        {page.includes('lists') ?
          <Entypo name="home" style={styles.icon} />
          :
          <FontAwesome6 name="list-ul" style={styles.icon} />
        }
      </Link>

      <Text style={styles.text}>
        {page}
      </Text>

      <Link
        href={page.includes('settings') ? '/' : '/settings'}
        onPress={async () => {
          page.includes('settings') ? await pressHandler('home', true) : await pressHandler('settings', false);
        }}>
        {page.includes('settings') ?
          <Entypo name="home" style={styles.icon} />
          :
          <MaterialIcons name="settings" style={styles.icon} />
        }
      </Link>
    </View>
  );
};
