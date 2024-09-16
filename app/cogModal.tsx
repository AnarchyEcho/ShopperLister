import { cogModalVisibleAtom, listsOverviewAtom, selectedListAtom, selectedPageAtom, settingsAtom, shoppingListAtom } from '@/atoms';
import { updateListsOverview, updateShoppingList } from '@/utils';
import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, StyleSheet, TouchableOpacity, View, TextInput, Keyboard } from 'react-native';

interface IForm {
  name: string
  amount: string
}

export default function cogModal() {
  const db = useSQLiteContext();
  const params = useLocalSearchParams();
  const [settings] = useAtom(settingsAtom);
  const [listsOverview, setListsOverview] = useAtom(listsOverviewAtom);
  const [shoppingList, setShoppingList] = useAtom(shoppingListAtom);
  const [pickedList, setPickedList] = useAtom(selectedListAtom);
  const [_, setModalVisible] = useAtom(cogModalVisibleAtom);
  const [page] = useAtom(selectedPageAtom);
  const [del, setDel] = useState(false);
  const [name, setName] = useState<string>(params.itemName as string);
  const [amount, setAmount] = useState<string>(params.amount as string);
  const { control, handleSubmit, reset } = useForm<IForm>({
    defaultValues: {
      name: name,
      amount: amount,
    },
  });

  const styles = StyleSheet.create({
    modal: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      height: '50%',
      width: '80%',
      borderRadius: 10,
      backgroundColor: settings?.theme ? settings?.theme[settings?.chosenTheme].modalBackground : '#404040',
      elevation: 10,
    },
    text: {
      color: settings?.theme ? settings?.theme[settings?.chosenTheme].modalColor : '#000000',
    },
    title: {
      backgroundColor: settings?.theme ? settings?.theme[settings?.chosenTheme].modalTrim : '#FFA500',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 25,
    },
    titleText: {
      fontSize: 20,
    },
    button: {
      backgroundColor: settings?.theme ? settings?.theme[settings?.chosenTheme].modalTrim : '#FFA500',
      width: '100%',
      height: 25,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      display: 'flex',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 0,
    },
    form: {
      display: 'flex',
      height: '100%',
      gap: 10,
      top: 5,
      left: 5,
    },
    formWrapper: {
      display: 'flex',
      flexDirection: 'row',
      height: 35,
      alignItems: 'center',
    },
    formInput: {
      height: 35,
      width: 150,
      textAlign: 'left',
      paddingLeft: 5,
      paddingRight: 5,
      color: '#fefefe',
      backgroundColor: '#505050',
      borderRadius: 5,
    },
    formText: {
      color: '#FEFEFE',
    },
    formSubmit: {
      height: 35,
      width: 80,
      borderRadius: 5,
      backgroundColor: settings?.theme ? settings?.theme[settings?.chosenTheme].modalTrim : '#FFA500',
      position: 'absolute',
      right: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    formSubmitText: {
      color: settings?.theme ? settings?.theme[settings?.chosenTheme].modalColor : '#000000',
    },
  });

  const closeModal = () => {
    Keyboard.dismiss();
    reset();
    setModalVisible(false);
    router.back();
  };

  const onSubmit = handleSubmit(async (data) => {
    if (page === 'lists') {
      await db.runAsync(`alter table ${name} rename to ${data.name}`);
      await db.runAsync(`update or ignore toc set tableName = "${data.name}" where tableName = "${name}"`);
      await db.runAsync(`update or ignore toc set pickedList = "${data.name}" where tableName = "home"`);
      updateListsOverview(db, listsOverview, setListsOverview);
      if (pickedList === name) {
        setPickedList(data.name);
      }
    }
    setName(data.name);
    if (page === pickedList) {
      setAmount(data.amount);
      await db.runAsync(`update or ignore ${pickedList} set name = "${data.name}", amount = "${data.amount}" where name = "${name}"`);
      updateShoppingList(db, shoppingList, setShoppingList, pickedList);
    }
  });

  const onDelete = handleSubmit(async () => {
    if (page === 'lists') {
      const firstList = await db.getFirstAsync('select tableName from toc where type = "shoppingList"') as any;
      await db.runAsync(`update or ignore toc set pickedList = "${firstList.tableName}" where tableName = "home"`);
      await db.runAsync(`delete from toc where tableName = "${name}"`);
      await db.runAsync(`drop table ${name}`);
      updateListsOverview(db, listsOverview, setListsOverview);
      if (pickedList === name) {
        setPickedList(firstList.tableName);
      }
    }
    if (page === pickedList) {
      await db.runAsync(`delete from ${pickedList} where name = "${name}"`);
      updateShoppingList(db, shoppingList, setShoppingList, pickedList);
    }
    setDel(false);
    closeModal();
  });

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.modal}
      onPress={closeModal}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={styles.container}
        onPress={Keyboard.dismiss}
      >
        <View style={styles.title}>
          <Text style={[styles.text, styles.titleText]}>
            {name}
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            name='name'
            control={control}
            rules={{ maxLength: amount ? 28 : 17, minLength: 1 }}
            render={({ field: { onChange, onBlur, value } }) => {
              return (
                <View style={styles.formWrapper}>
                  <Text style={styles.formText}>List name: </Text>
                  <TextInput
                    placeholder={params.itemName as string ?? 'name'}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={styles.formInput}
                    maxLength={amount ? 28 : 17}
                  />
                  <TouchableOpacity
                    style={styles.formSubmit}
                    onPress={onSubmit}
                  >
                    <Text style={[styles.formText, styles.formSubmitText]}>Save</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
          {amount &&
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
                      keyboardType='number-pad'
                      returnKeyType='done'
                      onSubmitEditing={Keyboard.dismiss}
                    />
                    <TouchableOpacity
                      style={styles.formSubmit}
                      onPress={onSubmit}
                    >
                      <Text style={[styles.formText, styles.formSubmitText]}>Save</Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          }
          <View style={styles.formWrapper}>
            <Text style={styles.formText}>Delete list</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.formSubmit, { right: 100 }]}
              onPress={() => setDel(!del)}
            >
              <Text style={[styles.formText, styles.formSubmitText]}>Safety</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.formSubmit, {
                backgroundColor: !del ?
                  settings?.theme ? `${settings?.theme[settings?.chosenTheme].modalDisabled}` : '#767676'
                  :
                  settings?.theme ? `${settings?.theme[settings?.chosenTheme].modalTrim}` : '#FFA500',
              }]}
              onPress={onDelete}
              disabled={!del}
            >
              <Text style={[styles.formText, styles.formSubmitText]}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.button}
          onPress={closeModal}
        >
          <Text style={[styles.text, { textAlign: 'center', fontSize: 18 }]}>Close menu</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
