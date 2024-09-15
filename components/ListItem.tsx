import { settingsAtom } from '@/atoms';
import { ISettings } from '@/interfaces';
import { MaterialIcons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { useAtom } from 'jotai';
import { Text, StyleSheet, Pressable, View } from 'react-native';

interface IProps {
  name: string
  onClick: () => void
  cogPress: () => void
  amount?: string
  pickedList?: string
}

export const ListItem = (props: IProps) => {
  const {
    name,
    onClick,
    cogPress,
    amount,
    pickedList,
  } = props;
  const [settings] = useAtom<ISettings | undefined>(settingsAtom as any);

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
    <Pressable
      style={({ pressed }) => [{
        backgroundColor: pressed ?
          settings?.theme ? `${settings?.theme[settings?.chosenTheme].listItemBackgroundColor}50` : '#30303050'
          :
          settings?.theme ? settings?.theme[settings?.chosenTheme].listItemBackgroundColor : '#303030',
      },
      styles.listItem]}
      onPress={onClick}
    >
      <Pressable
        onPress={cogPress}
      >
        <MaterialIcons
          name="settings"
          style={[
            styles.icon,
            styles.cog,
          ]}
        />
      </Pressable>
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
          value={pickedList === name ? true : false}
          style={styles.checkbox}
          pointerEvents='none'
        />
      </View>
    </Pressable>
  );
};
