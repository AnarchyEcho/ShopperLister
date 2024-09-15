import { settingsAtom } from '@/atoms';
import { ISettings } from '@/interfaces';
import { MaterialIcons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { useAtom } from 'jotai';
import { Text, StyleSheet, Pressable } from 'react-native';

interface IProps {
  name: string
  onClick: () => void
  amount?: number
  pickedList?: string
}

export const ListItem = (props: IProps) => {
  const {
    name,
    onClick,
    amount,
    pickedList,
  } = props;
  const [settings] = useAtom<ISettings | undefined>(settingsAtom as any);

  const styles = StyleSheet.create({
    icon: {
      color: '#FFA500',
      fontSize: 25,
      margin: 0,
      padding: 0,
    },
    listItem: {
      width: '95%',
      height: 40,
      padding: 0,
      marginTop: 10,
      marginRight: 'auto',
      marginLeft: 'auto',
      borderRadius: 10,
      display: 'flex',
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      fontSize: 20,
      color: settings?.theme ? settings?.theme[settings?.chosenTheme].color : '#FEFEFE',
    },
    name: {
      width: '60%',
    },
    amount: {
      width: '20%',
      fontSize: 20,
      color: settings?.theme ? settings?.theme[settings?.chosenTheme].color : '#FEFEFE',
    },
    cog: {
      marginLeft: 5,
      marginRight: 5,
    },
    checkbox: {
      borderWidth: 2,
    },
  });

  return (
    <Pressable
      style={({ pressed }) => [{ backgroundColor: pressed ? '#30303050' : '#303030' }, styles.listItem]}
      onPress={onClick}
    >
      <MaterialIcons
        name="settings"
        style={[
          styles.icon,
          styles.cog,
        ]}
      />
      <Text
        style={[
          styles.text,
          styles.name,
        ]}
      >
        {name}
      </Text>
      {amount &&
        <Text
          style={[
            styles.amount,
          ]}
        >
          {amount}
        </Text>}
      <Checkbox
        value={pickedList === name ? true : false}
        pointerEvents='none'
      />
    </Pressable>
  );
};
