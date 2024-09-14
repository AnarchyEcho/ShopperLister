import { ISettings } from '@/interfaces';
import { View, Text, StyleSheet } from 'react-native';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useAtom } from 'jotai';
import { selectedListAtom, selectedPageAtom, settingsAtom } from '@/atoms';
import { useSQLiteContext } from 'expo-sqlite';

export const Header = () => {
  const db = useSQLiteContext();
  const [settings] = useAtom<ISettings | undefined>(settingsAtom as any);
  const [page, setPage] = useAtom<string>(selectedPageAtom);
  const [list] = useAtom<string>(selectedListAtom);

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
  });

  const pressHandler = async (nextPage: string, home: boolean) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    home ? setPage(list) : setPage(nextPage);
    await db.runAsync('update toc set selected = "false" where selected = "true"');
    await db.runAsync(`update toc set selected = "true" where tableName = "${nextPage}"`);
  };

  return (
    <View style={styles.header}>
      <Link href={page.includes('lists') ? '/' : '/lists'} onPress={async () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        page.includes('lists') ? await pressHandler('home', true) : await pressHandler('lists', false);
      }}>
        {page.includes('lists') ?
          <Entypo name="home" style={styles.icon} />
          :
          <Entypo name="list" style={styles.icon} />
        }
      </Link>
      <Text style={styles.text}>{page}</Text>
      <Link href={page.includes('settings') ? '/' : '/settings'} onPress={async () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
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
