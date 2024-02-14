import { StyleSheet, Text, View, TextInput, Pressable, ScrollView } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { useRef } from 'react';
import { wait } from '../../helpers/wait';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Form = (props: any) => {
  const nameRef: any = useRef();
  const quantityRef: any = useRef();
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      item: '',
      quantity: '',
    },
  });

  const onSubmit = async (data: any) => {
    await AsyncStorage.setItem(`@${data.item}`, JSON.stringify(data));
    reset({ item: '', quantity: '' });
    props.setRefreshing(true);
    wait(1000).then(() => props.setRefreshing(false));
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={styles.form}
      scrollEnabled={false}
    >
      {(errors.quantity || errors.item) && <Text style={styles.Text}>
        Please fill in all the fields.
      </Text>}

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.wrapper}>
            <Text style={styles.inputLabel}>Item name: </Text>
            <TextInput
              style={styles.itemInput}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              blurOnSubmit={false}
              returnKeyType="next"
              onSubmitEditing={() => {
                quantityRef.current.focus();
              }}
              ref={nameRef}
              placeholder='Bread'
            />
          </View>
        )}
        name="item"
      />

      <Controller
        control={control}
        rules={{
          maxLength: 4,
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.wrapper}>
            <Text style={styles.inputLabel}>Quantity: </Text>
            <TextInput
              style={styles.quantityInput}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType='number-pad'
              onSubmitEditing={() => {
                handleSubmit(onSubmit)();
                nameRef.current.focus();
              }}
              ref={quantityRef}
              placeholder='1'
              maxLength={4}
            />
          </View>
        )}
        name="quantity"
      />

      <Pressable
        onPress={handleSubmit(onSubmit)}
        style={() => [{ backgroundColor: (props.refresh || props.isLoading) ? '#767676' : '#ffa500' }, styles.Button]}
        disabled={(props.refresh || props.isLoading) ? true : false}
      >
        <Text style={styles.Submit}>Add Item</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  form: {
    width: '100%',
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  wrapper: {
    flexDirection: 'row',
  },
  Text: {
    color: '#fefefe',
    textAlign: 'center',
  },
  inputLabel: {
    height: 35,
    fontSize: 14,
    color: '#fefefe',
    textAlignVertical: 'center',
  },
  Submit: {
    textAlign: 'center',
  },
  itemInput: {
    width: 200,
    height: 35,
    color: '#fefefe',
    backgroundColor: '#505050',
    borderRadius: 5,
    marginBottom: 5,
    paddingLeft: 5,
  },
  quantityInput: {
    width: 50,
    height: 35,
    textAlign: 'center',
    color: '#fefefe',
    backgroundColor: '#505050',
    borderRadius: 5,
    marginBottom: 15,
  },
  Button: {
    alignSelf: 'center',
    color: '#000',
    padding: 10,
    width: 100,
    borderRadius: 5,
  },
});
