import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Form, Content } from './components';

const App = () => {
  const [refreshing, setRefreshing] = useState(false);
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Content
        refresh={refreshing}
        setRefreshing={setRefreshing}/>
      <Form
        refresh={refreshing}
        setRefreshing={setRefreshing}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#232323',
  },
});

export default App;
