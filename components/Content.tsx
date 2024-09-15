import { settingsAtom } from '@/atoms';
import { ISettings } from '@/interfaces';
import { useAtom } from 'jotai';
import { View, Text, StyleSheet } from 'react-native';

export const Content = () => {
  const [settings] = useAtom<ISettings | undefined>(settingsAtom as any);

  const styles = StyleSheet.create({
    content: {
      width: '100%',
      height: '100%',
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 5,
      paddingRight: 5,
      display: 'flex',
      flexDirection: 'column',
    },
    text: {
      color: settings?.theme ? settings?.theme[settings?.chosenTheme].color : '#FEFEFE',
    },
  });

  return (
    <View style={styles.content}>
      <Text style={styles.text}>placeholder text for items list</Text>
    </View>
  );
};
