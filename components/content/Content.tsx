import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View, StatusBar } from 'react-native';
import Checkbox from 'expo-checkbox';
import { ItemModal } from '../itemModal/ItemModal';
import { wait } from '../../helpers/wait';

export const Content = (props: any) => {
  const [data, setData]: any[] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemName, setItemName] = useState('');
  const [quantityNumber, setQuantityNumber] = useState('');
  const [checked, setChecked]: any[] = useState([]);

  const onRefresh = useCallback(() => {
    props.setRefreshing(true);
    wait(2000).then(() => props.setRefreshing(false));
  }, []);

  const getShoppingList = async () => {
    try {
      const response = await fetch('https://echo-restful.herokuapp.com/api/shopping');
      const json = await response.json();
      setData(json);
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
                key={item._id}
                style={[styles.item, { backgroundColor: checked.includes(item._id) ? '#30303050' : '#303030' }]}
                onPress={() => {
                  if (!checked.includes(item._id)) {
                    const tempArr = checked.slice();
                    tempArr.push(item._id);
                    setChecked(tempArr);
                  }
                  else {
                    checked.forEach((id: any) => {
                      if (id === item._id) {
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
                <View>
                  <Text style={[styles.Text, { color: checked.includes(item._id) ? '#009688' : '#fefefe' }]}>
                    {item.item} ({item.quantity}) <Checkbox value={checked.includes(item._id)} style={styles.checkbox} pointerEvents='none'/>
                  </Text>
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
  Text: {
    marginLeft: 10,
    marginRight: 10,
    fontSize: 24,
    color: '#fefefe',
    textAlign: 'center',
  },
  item: {
    flex: 1,
    maxWidth: 'auto',
    height: 'auto',
    backgroundColor: '#303030',
    marginBottom: 10,
    borderRadius: 5,
  },
  checkbox: {
    borderWidth: 0,
    marginTop: 5,
  },
});
