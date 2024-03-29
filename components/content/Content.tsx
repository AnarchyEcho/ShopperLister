import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View, StatusBar } from 'react-native';
import Checkbox from 'expo-checkbox';
import { ItemModal } from '../itemModal/ItemModal';
import { wait } from '../../helpers/wait';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Content = (props: any) => {
  const [data, setData]: any[] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemName, setItemName] = useState('');
  const [quantityNumber, setQuantityNumber] = useState('');
  const [checked, setChecked]: any[] = useState([]);

  const onRefresh = useCallback(() => {
    props.setRefreshing(true);
    wait(300).then(() => props.setRefreshing(false));
  }, []);

  const getShoppingList = async () => {
    try {
      const arr: any[] = [];
      const keys: any = await AsyncStorage.getAllKeys();
      const json = await AsyncStorage.multiGet([...keys]);
      json.forEach((item: any) => {
        arr.push(JSON.parse(item[1]));
      });
      setData(arr);
    }
    catch (error) {
      console.error(error);
    }
    finally {
      props.setLoading(false);
    }
  };

  useEffect(() => {
    getShoppingList();
  }, [props.refresh]);

  return (
    <View style={styles.content}>
      <Text style={styles.Title}>Shopping List</Text>
      {props.isLoading ?
        <View>
          <ActivityIndicator size='large' color='#ffa500' />
          <Text style={styles.Text}>Please wait, loading list...</Text>
        </View> : (
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={props.refresh}
                onRefresh={onRefresh}
                colors={['#ffa500']}
                progressBackgroundColor='#303030'
              />
            }
            data={data}
            renderItem={({ item }: any) => (
              <Pressable
                key={item.item}
                style={[styles.item, { backgroundColor: checked.includes(item.item) ? '#30303050' : '#303030' }]}
                onPress={() => {
                  if (!checked.includes(item.item)) {
                    const tempArr = checked.slice();
                    tempArr.push(item.item);
                    setChecked(tempArr);
                  }
                  else {
                    checked.forEach((id: any) => {
                      if (id === item.item) {
                        const tempArr = checked.filter((x: any) => x !== id);
                        setChecked(tempArr);
                      }
                    });
                  }
                }}
                onLongPress={() => {
                  setModalVisible(true);
                  setItemName(item.item);
                  setQuantityNumber(item.quantity);
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[styles.Text1, { color: checked.includes(item.item) ? '#009688' : '#fefefe' }]}>{item.item}</Text>
                  <Text style={[styles.Text2, { color: checked.includes(item.item) ? '#009688' : '#fefefe' }]}>({item.quantity})</Text>
                  <Checkbox value={checked.includes(item.item)} style={styles.checkbox} pointerEvents='none' />
                </View>
              </Pressable>
            )}
          />
        )}
      <ItemModal
        refresh={props.refresh}
        setRefresh={props.setRefreshing}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        itemName={itemName}
        quantityNumber={quantityNumber}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    width: '100%',
    marginTop: StatusBar.currentHeight,
    flex: 3,
  },
  Title: {
    marginBottom: 10,
    fontSize: 30,
    paddingBottom: 5,
    paddingTop: 5,
    color: '#232323',
    textAlign: 'center',
    backgroundColor: '#ffa500',
  },
  item: {
    flex: 1,
    maxWidth: 'auto',
    height: 'auto',
    backgroundColor: '#303030',
    marginBottom: 10,
    borderRadius: 5,
    paddingVertical: 4,
  },
  Text: {
    marginLeft: 10,
    fontSize: 24,
    color: '#fefefe',
    textAlign: 'center',
  },
  Text1: {
    width: '60%',
    marginLeft: 10,
    fontSize: 24,
    color: '#fefefe',
  },
  Text2: {
    width: '20%',
    marginLeft: 10,
    fontSize: 24,
    color: '#fefefe',
  },
  checkbox: {
    borderWidth: 2,
  },
});
