import { Suspense } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Tab() {

  const styles = StyleSheet.create({
    container: {
      height: '100%',
      backgroundColor: '#232323',
    },
    text: {
      color: '#FEFEFE',
    },
  });

  return (
    <View style={styles.container}>
      <Suspense fallback={<Text>Loading...</Text>}>
        <Text>placeholder text for list of lists</Text>
      </Suspense>
    </View>
  );
};
