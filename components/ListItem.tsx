import { settingsAtom } from '@/atoms';
import { MaterialIcons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { useAtom } from 'jotai';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';

interface IProps {
  name: string
  onClick: () => void
  cogPress: () => void
  amount?: string
  checked?: string
  pickedList?: string
}

export const ListItem = (props: IProps) => {
  const {
    name,
    onClick,
    cogPress,
    amount,
    pickedList,
    checked,
  } = props;
  const [settings] = useAtom(settingsAtom);

  const styles = StyleSheet.create({
    icon: {
      color: settings?.theme ? settings?.theme[settings?.chosenTheme].listCogColor : '#FFA500',
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
      justifyContent: 'space-between',
      backgroundColor: checked === 'true' ? '#01968950' : settings?.theme ? settings?.theme[settings?.chosenTheme].listItemBackgroundColor : '#303030',
    },
    text: {
      fontSize: 20,
      color: settings?.theme ? settings?.theme[settings?.chosenTheme].listItemTextColor : '#FEFEFE',
    },
    name: {
      width: amount ? '60%' : '80%',
    },
    amount: {
      width: '20%',
      fontSize: 20,
      color: settings?.theme ? settings?.theme[settings?.chosenTheme].listItemTextColor : '#FEFEFE',
    },
    cog: {
      marginLeft: 5,
      marginRight: 5,
      zIndex: 2,
    },
    boxWrapper: {
      right: 10,
    },
    checkbox: {
      borderWidth: 2,
    },
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.listItem}
      onPress={onClick}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={cogPress}
      >
        <MaterialIcons
          name="settings"
          style={[
            styles.icon,
            styles.cog,
          ]}
        />
      </TouchableOpacity>
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
          ({+amount < 0 ? '∞' : amount})
        </Text>}
      <View style={styles.boxWrapper}>
        <Checkbox
          value={amount ?
            checked === 'true' ? true : false
            :
            pickedList === name ? true : false
          }
          style={styles.checkbox}
          pointerEvents='none'
        />
      </View>
    </TouchableOpacity>
  );
};
