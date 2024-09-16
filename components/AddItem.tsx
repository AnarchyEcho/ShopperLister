import { addItemOpenAtom, listsOverviewAtom, selectedListAtom, selectedPageAtom, settingsAtom, shoppingListAtom } from '@/atoms';
import { updateListsOverview, updateShoppingList } from '@/utils';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import { useAtom } from 'jotai';
import { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, TouchableOpacity, View, Text, TextInput, Keyboard } from 'react-native';

interface IForm {
  name: string
  amount: string
}

export const AddItem = () => {
  const db = useSQLiteContext();
  const [settings] = useAtom(settingsAtom);
  const [pickedList] = useAtom(selectedListAtom);
  const [shoppingList, setShoppingList] = useAtom(shoppingListAtom);
  const [listsOverview, setListsOverview] = useAtom(listsOverviewAtom);
  const [page] = useAtom(selectedPageAtom);
  const [open, setOpen] = useAtom(addItemOpenAtom);
  const { control, handleSubmit, reset, formState: { errors } } = useForm<IForm>({
    defaultValues: {
      name: '',
      amount: '',
    },
  });
  const amountRef: any = useRef();

  const styles = StyleSheet.create({
    buttonWrapperClosed: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      backgroundColor: '#FFA500',
      padding: 10,
      borderRadius: 100,
      borderStyle: 'solid',
      borderWidth: 4,
      borderColor: '#FFA50080',
    },
    buttonWrapperOpen: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      borderRadius: 10,
      backgroundColor: '#FFA500',
      height: 200,
      width: '95%',
    },
    openForm: {
      backgroundColor: settings?.theme ? settings?.theme[settings?.chosenTheme].modalBackground : '#404040',
      width: '100%',
      height: 173,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      paddingTop: 20,
    },
    button: {
      backgroundColor: settings?.theme ? settings?.theme[settings?.chosenTheme].modalTrim : '#FFA500',
      width: 100,
      height: 35,
      borderRadius: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 10,
    },
    formWrapper: {
      display: 'flex',
      flexDirection: 'row',
      height: 35,
      alignItems: 'center',
      alignSelf: 'flex-start',
      left: 5,
    },
    formInput: {
      height: 35,
      width: 250,
      textAlign: 'left',
      paddingLeft: 5,
      paddingRight: 5,
      color: '#fefefe',
      backgroundColor: '#505050',
      borderRadius: 5,
    },
    formText: {
      color: '#FEFEFE',
      width: 50,
    },
    errorText: {
      position: 'absolute',
      top: 3,
      color: '#FF3333',
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    if (page === 'lists') {
      await db.runAsync(`insert or ignore into toc values (null, "${data.name}", "shoppingList", null, null)`);
      await db.runAsync(`create table if not exists ${data.name} (id INTEGER PRIMARY KEY UNIQUE NOT NULL, name text, amount integer, checked text)`);
      updateListsOverview(db, listsOverview, setListsOverview);
      Keyboard.dismiss();
      reset();
      setOpen(false);
    }
    else {
      await db.runAsync(`insert or ignore into ${pickedList} values (null, "${data.name}", "${data.amount}", "false")`);
      updateShoppingList(db, shoppingList, setShoppingList, pickedList);
      Keyboard.dismiss();
      reset();
    }
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={open ? styles.buttonWrapperOpen : styles.buttonWrapperClosed}
      onPress={() => {
        if (open) { return; }
        else {
          reset();
          setOpen(true);
        }
      }}
    >
      {open ?
        <TouchableOpacity
          activeOpacity={1}
          onPress={Keyboard.dismiss}
        >
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingTop: 5, paddingBottom: 5 }}>
            <Text style={{ left: 5, fontSize: 16 }}>Add {page === 'lists' ? 'list' : 'item'}</Text>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                reset();
                Keyboard.dismiss();
                setOpen(false);
              }}
            >
              <Entypo name="chevron-thin-down" size={24} color="black" style={{ right: 5, fontSize: 20 }} />
            </TouchableOpacity>
          </View>
          <View style={styles.openForm}>
            {(errors.amount?.type || errors.name?.type) === 'required' && <Text style={styles.errorText}>
              Please fill in all the fields.
            </Text>}
            {(errors.amount?.type || errors.name?.type) === 'pattern' && <Text style={styles.errorText}>
              Only valid characters allowed. {errors.name && `(Name, allowed: - _ )${errors.amount ? ', ' : ''}`}{errors.amount && 'Amount'}
            </Text>}
            <Controller
              name='name'
              control={control}
              rules={{
                minLength: 1,
                maxLength: 17,
                required: true,
                pattern: /^[\w_-]+$/,
              }}
              render={({ field: { onChange, onBlur, value } }) => {
                return (
                  <View style={styles.formWrapper}>
                    <Text style={styles.formText}>Name: </Text>
                    <TextInput
                      placeholder={page === 'lists' ? 'List name' : 'Bread'}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      style={styles.formInput}
                      maxLength={17}
                      returnKeyType={page === 'lists' ? 'done' : 'next'}
                      onSubmitEditing={() => {
                        if (page === 'lists') {
                          Keyboard.dismiss();
                          return;
                        }
                        amountRef.current.focus();
                      }}
                    />
                  </View>
                );
              }}
            />
            {page !== 'lists' &&
              <Controller
                name='amount'
                control={control}
                rules={{
                  minLength: 1,
                  maxLength: 5,
                  required: true,
                  pattern: /^[\d]+$/,
                }}
                render={({ field: { onChange, onBlur, value } }) => {
                  return (
                    <View style={styles.formWrapper}>
                      <Text style={styles.formText}>Amount: </Text>
                      <TextInput
                        placeholder={'1'}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        style={[styles.formInput, { width: 50 }]}
                        maxLength={5}
                        ref={amountRef}
                        keyboardType='number-pad'
                        returnKeyType='done'
                        onSubmitEditing={Keyboard.dismiss}
                      />
                    </View>
                  );
                }}
              />
            }
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.button}
              onPress={onSubmit}
            >
              <Text>Add to list</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        :
        <View>
          <MaterialIcons name="playlist-add" size={50} color="#000000" />
          <MaterialIcons name="playlist-add" size={50} color="#00000040" style={{ position: 'absolute', left: 2, top: 2 }} />
        </View>
      }
    </TouchableOpacity>
  );
};
