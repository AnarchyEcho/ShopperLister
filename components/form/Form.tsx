import { StyleSheet, Text, View, TextInput, Pressable, ScrollView } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useRef } from 'react';
import { wait } from '../../helpers/wait';
import { Request } from '../../api/Requests';

export const Form = (props: any) => {
  const quantityRef: any = useRef();
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      item: '',
      quantity: '',
    },
  });

  const onSubmit = (data: any) => {
    Request('POST', data.item, data.quantity);
    reset({ item: '', quantity: '' });
    props.setRefreshing(true);
    wait(1000).then(() => props.setRefreshing(false));
  };

  useEffect(() => {
    if (props.refresh) {
      reset({
        item: '',
        quantity: '',
      });
    }
  }, [props.refresh]);

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
              ref={quantityRef}
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
    marginBottom: 15,
    padding: 20,
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
    textAlign: 'center',
    color: '#fefefe',
    backgroundColor: '#505050',
    borderRadius: 5,
    marginBottom: 5,
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
