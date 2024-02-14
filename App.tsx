import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Form, Content } from './components';

const App = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setLoading] = useState(true);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Content
        refresh={refreshing}
        setRefreshing={setRefreshing}
        isLoading={isLoading}
        setLoading={setLoading}
      />
      <Form
        refresh={refreshing}
        setRefreshing={setRefreshing}
        isLoading={isLoading}
        setLoading={setLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#232323',
  },
});

export default App;