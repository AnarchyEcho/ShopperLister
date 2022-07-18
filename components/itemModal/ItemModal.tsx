import { Controller, useForm } from 'react-hook-form';
import { Alert, Modal, StyleSheet, Text, Pressable, View, TouchableOpacity, TouchableWithoutFeedback, TextInput } from 'react-native';
import { wait } from '../../helpers/wait';

export const ItemModal = (props: any) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      quantity: '',
      delete: '',
    },
  });

  const put = (quantity: any) => {
    fetch('https://echo-restful.herokuapp.com/api/shopping', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        item: props.itemName,
        quantity: parseInt(quantity),
      }),
    });
  };

  const del = () => {
    fetch('https://echo-restful.herokuapp.com/api/shopping', {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        item: props.itemName,
      }),
    });
  };

  const onDelete = () => {
    del();
    reset({ quantity: '', delete: '' });
    props.setModalVisible(!props.modalVisible);
    props.setRefresh(true);
    wait(1000).then(() => props.setRefresh(false));
  };

  const onSubmit = (data: any) => {
    put(data.quantity);
    reset({ quantity: '', delete: '' });
    props.setModalVisible(!props.modalVisible);
    props.setRefresh(true);
    wait(1000).then(() => props.setRefresh(false));
  };

  return (
    <Modal
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        props.setModalVisible(!props.modalVisible);
      }}
    >
      <TouchableOpacity style={styles.centeredView} activeOpacity={1} onPressOut={() => props.setModalVisible(!props.modalVisible)}>
        <TouchableWithoutFeedback>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Item: {props.itemName}</Text>
            <Text style={styles.modalQuantity}>Quantity: {props.quantityNumber}</Text>
            <Controller
              control={control}
              rules={{
                maxLength: 4,
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.wrapper}>
                  <Text style={styles.inputLabel}>Change quantity: </Text>
                  <TextInput
                    style={styles.quantityEdit}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType='number-pad'
                  />
                  <Pressable
                    style={() => [{ backgroundColor: value ? '#ffa500' : '#767676' }, styles.submitButton]}
                    onPress={handleSubmit(onSubmit)}
                    disabled={value ? false : true}
                  >
                    <Text style={styles.buttonText}>Submit</Text>
                  </Pressable>
                </View>
              )}
              name="quantity"
            />
            <Controller
              control={control}
              rules={{
                required: false,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.wrapper}>
                  <Text style={styles.inputLabel}>Type "Del" </Text>
                  <TextInput
                    style={styles.deleteField}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  <Pressable
                    style={() => [{ backgroundColor: value != 'Del' ? '#767676' : '#ffa500' }, styles.deleteButton]}
                    onPress={() => {onDelete();}}
                    disabled={value != 'Del'}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </Pressable>
                </View>
              )}
              name="delete"
            />
            <Pressable
              style={({ pressed }) => [{ backgroundColor: pressed ? '#c58612' : '#ffa500' }, styles.closeButton]}
              onPress={() => {
                props.setModalVisible(!props.modalVisible);
              }}
            >
              <Text style={styles.buttonText}>Close Menu</Text>
            </Pressable>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '50%',
    paddingBottom: '50%',
    backgroundColor: '#00000075',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#353535',
    borderRadius: 20,
    height: 250,
    width: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  wrapper: {
    flexDirection: 'row',
    marginTop: 15,
  },
  inputLabel: {
    height: 35,
    fontSize: 16,
    color: '#fefefe',
    textAlignVertical: 'center',
  },
  quantityEdit: {
    width: 50,
    height: 35,
    textAlign: 'center',
    color: '#fefefe',
    backgroundColor: '#505050',
    borderRadius: 5,
  },
  submitButton: {
    alignSelf: 'center',
    color: '#000',
    padding: 10,
    width: 100,
    borderRadius: 5,
    marginLeft: 20,
    elevation: 2,
  },
  deleteField: {
    width: 50,
    height: 35,
    textAlign: 'center',
    color: '#fefefe',
    backgroundColor: '#505050',
    borderRadius: 5,
  },
  deleteButton: {
    alignSelf: 'center',
    color: '#000',
    padding: 10,
    width: 100,
    borderRadius: 5,
    marginLeft: 20,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'center',
    color: '#000',
    padding: 10,
    width: 100,
    borderRadius: 5,
    marginTop: 25,
    elevation: 2,
  },
  buttonText: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  modalTitle: {
    color: '#232323',
    backgroundColor: '#ffa500',
    width: '100%',
    borderRadius: 20,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    fontSize: 32,
    textAlign: 'center',
  },
  modalQuantity: {
    color: '#fefefe',
    fontSize: 20,
  },
});
