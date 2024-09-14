import { ISettings } from '@/interfaces';
import { View, Text, StyleSheet } from 'react-native';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';

interface IProps {
  settings: ISettings | undefined
}

export const Header = (props: IProps) => {
  const { settings } = props;

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

  return (
    <View style={styles.header}>
      <Link href={'/lists'}>
        <Entypo name="list" style={styles.icon} />
      </Link>
      <Text style={styles.text}>ListTitle(PH)</Text>
      <Link href={'/settings'}>
        <MaterialIcons name="settings" style={styles.icon} />
      </Link>
    </View>
  );
};
