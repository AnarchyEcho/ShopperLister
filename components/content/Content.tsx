import { StyleSheet, Text, View } from 'react-native';

export const Content = (props: any) => {

  return (
    <View style={styles.content}>
      <Text style={styles.Text} >Content</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    marginTop: 50,
    flex: 3,
  },
  Text: {
    color: "white",
    textAlign: 'center'
  }
})
