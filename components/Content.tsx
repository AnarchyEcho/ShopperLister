import { ISettings } from '@/interfaces';
import { View, Text, StyleSheet } from 'react-native';

interface IProps {
  settings: ISettings | undefined
}

export const Content = (props: IProps) => {
  const { settings } = props;

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
      <Text>placeholder text for items list</Text>
    </View>
  );
};
