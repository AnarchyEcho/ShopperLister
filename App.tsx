import { StatusBar } from 'expo-status-bar';
import { StyleSheet, RefreshControl, View, ScrollView } from 'react-native';
import { useCallback, useState } from 'react'
import { Form, Content } from './components'

const wait = (timeout: any) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const App = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <ScrollView
    contentContainerStyle={styles.container}
    keyboardShouldPersistTaps='handled'
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    }>
      <StatusBar style="light" />
      <Content refresh={refreshing} />
      <Form refresh={refreshing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#232323',
  }
});

export default App;

// Toro potetmos, Gilde grillpølser, Høvding pølsebrød, Toro kjøttdeigsaus, karbonadedeig, Sopps spaghetti, Sopps makaroni, Toro tomatsuppe.