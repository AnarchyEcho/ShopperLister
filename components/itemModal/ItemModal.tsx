import { Controller, useForm } from 'react-hook-form';
import { Alert, Modal, StyleSheet, Text, Pressable, View, TouchableOpacity, TouchableWithoutFeedback, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wait } from '../../helpers/wait';

export const ItemModal = (props: any) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      quantity: '',
      delete: '',
    },
  });

  const onDelete = async (item: any) => {
    await AsyncStorage.removeItem(item);
    reset({ quantity: '', delete: '' });
    props.setModalVisible(!props.modalVisible);
    props.setRefresh(true);
    wait(1000).then(() => props.setRefresh(false));
  };

  const onSubmit = async (data: any) => {
    reset({ quantity: '', delete: '' });
    props.setModalVisible(!props.modalVisible);
    props.setRefresh(true);
    wait(1000).then(() => props.setRefresh(false));
  };

  function useRegex(input: any) {
    const regex = /[Dd]el/i;
    return regex.test(input);
  }

  return (
    <Modal
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        props.setModalVisible(!props.modalVisible);
      }}
    >
      <TouchableOpacity style={styles.centeredView} activeOpacity={1} onPressOut={() => {
        props.setModalVisible(!props.modalVisible);
        reset({
          delete: '',
          quantity: '',
        });
      }}>
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
                    placeholder={props.quantityNumber.toString()}
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
                  <Text style={styles.inputLabel}>Write "Del": </Text>
                  <TextInput
                    style={styles.deleteField}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder='Del'
                  />
                  <Pressable
                    style={() => [{ backgroundColor: !useRegex(value) ? '#767676' : '#ffa500' }, styles.deleteButton]}
                    onPress={() => {onDelete(`@${props.itemName}`);}}
                    disabled={!useRegex(value)}
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
    height: 'auto',
    width: 300,
    paddingBottom: 15,
    alignItems: 'flex-start',
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
    marginLeft: 5,
  },
  inputLabel: {
    height: 35,
    width: '40%',
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
    textAlign: 'left',
    paddingLeft: 5,
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
    alignSelf: 'center',
  },
});
