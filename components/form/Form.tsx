import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import { Controller, useForm } from 'react-hook-form'
import { useEffect, useRef } from 'react';

export const Form = (props: any) => {
  const quantityRef: any = useRef();
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      item: '',
      quantity: ''
    }
  });
  const onSubmit = (data: any) => {
    console.log(data)
    reset({ item: '', quantity: '' })
  };

  useEffect(() => {
    if (props.refresh) {
      reset({
        item: '',
        quantity: ''
      })
    }
  }, [props.refresh])

  return (
    <View style={styles.form}>
      {(errors.quantity || errors.item) && <Text style={styles.Text}>
        Please fill in all the fields.
      </Text>}

      <Controller
        control={control}
        rules={{
         required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
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
        )}
        name="item"
      />

      <Controller
        control={control}
        rules={{
         maxLength: 4,
         required: true
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.quantityInput}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType='number-pad'
            ref={quantityRef}
          />
        )}
        name="quantity"
      />

      <Pressable
        onPress={handleSubmit(onSubmit)}
        style={({ pressed }) => [{ backgroundColor: pressed ? '#c58612' : '#ffa500' }, styles.Button]}
      >
        <Text style={styles.Submit}>Submit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
    flex: 1,
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  Text: {
    color: "#fefefe",
    textAlign: 'center'
  },
  Submit: {
    textAlign: 'center'
  },
  itemInput: {
    width: 200,
    height: 35,
    textAlign: 'center',
    color: '#fefefe',
    backgroundColor: '#505050',
    marginBottom: 5,
    borderRadius: 5
  },
  quantityInput: {
    width: 50,
    height: 35,
    textAlign: 'center',
    color: '#fefefe',
    backgroundColor: '#505050',
    marginBottom: 15,
    borderRadius: 5
  },
  Button: {
    alignSelf: 'center',
    color: '#000',
    padding: 10,
    width: 100,
    borderRadius: 5
  }
})
