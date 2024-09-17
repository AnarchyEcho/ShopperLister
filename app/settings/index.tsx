import { settingsAtom } from '@/atoms';
import { ISettings } from '@/interfaces';
import { getSettings } from '@/utils';
import { Feather } from '@expo/vector-icons';
import { ErrorMessage } from '@hookform/error-message';
import { useSQLiteContext } from 'expo-sqlite';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Keyboard } from 'react-native';

export default function Index() {
  const db = useSQLiteContext();
  const [settings, setSettings] = useAtom(settingsAtom);
  const [formData, setFormData] = useState<Set<ISettings['theme']['dark']> | undefined>(new Set());
  const { control, handleSubmit, reset, formState: { errors } } = useForm<ISettings['theme']['dark']>();

  useEffect(() => {
    setFormData(undefined);
    [settings?.theme[settings?.chosenTheme]].forEach((x) => {
      for (const obj in x) {
        // @ts-expect-error expected
        if (!formData?.has({ [obj]: x[obj] })) {
          // @ts-expect-error expected
          setFormData((old: any) => (old !== undefined ? new Set([...old, { [obj]: x[obj] }]) : new Set([{ [obj]: x[obj] }])));
        }
      }
    });
  }, []);

  const styles = StyleSheet.create({
    container: {
      height: '100%',
      backgroundColor: settings?.theme ? settings?.theme[settings?.chosenTheme].background : '#232323',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: settings?.theme ? settings?.theme[settings?.chosenTheme].color : '#FEFEFE',
    },
    button: {
      backgroundColor: settings?.theme ? settings?.theme[settings?.chosenTheme].modalTrim : '#FFA500',
      width: 100,
      height: 35,
      borderRadius: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    flatList: {
      width: '100%',
    },
    settingsList: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 5,
      paddingBottom: 5,
    },
    formWrapper: {
      display: 'flex',
      flexDirection: 'row',
      height: 35,
      alignItems: 'center',
    },
    formInput: {
      height: 35,
      width: 100,
      right: 5,
      textAlign: 'left',
      color: '#fefefe',
      backgroundColor: '#505050',
      borderRadius: 5,
    },
    formText: {
      color: settings?.theme ? settings?.theme[settings?.chosenTheme].color : '#FEFEFE',
      width: 160,
      left: 5,
    },
    formSubmitText: {
      color: settings?.theme ? settings?.theme[settings?.chosenTheme].modalColor : '#000000',
    },
    errorText: {
      color: '#FF3333',
    },
    icon: {
      color: settings?.theme ? settings?.theme[settings?.chosenTheme].color : '#FEFEFE',
      fontSize: 30,
      margin: 0,
      padding: 0,
      width: 100,
      textAlign: 'center',
      right: 8,
    },
  });

  const saveSettings = handleSubmit(async (data) => {
    if (settings?.chosenTheme === 'dark') {
      setSettings({
        chosenTheme: settings.chosenTheme,
        theme: { dark: data, light: settings.theme.light },
      });
      await db.runAsync(`update or ignore settings set value = '${JSON.stringify({ dark: data, light: settings.theme.light })}' where name = "theme"`);
      setFormData(new Set([]));
      for (const x in data) {
        // @ts-expect-error expected
        setFormData((old: any) => (old !== undefined ? new Set([...old, { [x]: data[x] }]) : new Set([{ [x]: data[x] }])));
      }
    }
    if (settings?.chosenTheme === 'light') {
      setSettings({
        chosenTheme: settings.chosenTheme,
        theme: { dark: settings.theme.dark, light: data },
      });
      await db.runAsync(`update or ignore settings set value = '${JSON.stringify({ dark: settings.theme.dark, light: data })}' where name = "theme"`);
      setFormData(new Set([]));
      for (const x in data) {
        // @ts-expect-error expected
        setFormData((old: any) => (old !== undefined ? new Set([...old, { [x]: data[x] }]) : new Set([{ [x]: data[x] }])));
      }
    }
    Keyboard.dismiss();
  });

  return (
    <TouchableOpacity activeOpacity={1} style={styles.container} onPress={Keyboard.dismiss}>
      <Text style={[styles.text, { alignSelf: 'flex-start', fontSize: 25, left: 5 }]}>Theme settings:</Text>
      <View style={{ alignSelf: 'flex-start', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.formText}>Toggle mode: </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={async () => {
            db.runSync(`update or ignore settings set value = '${settings?.chosenTheme === 'dark' ? 'light' : 'dark'}' where name = "chosenTheme" `);
            await getSettings(db, settings, setSettings);
          }}
        >
          {settings?.chosenTheme === 'dark' ?
            <Feather
              name="sun"
              size={24}
              color="white"
              style={styles.icon}
            />
            :
            <Feather
              name="moon"
              size={24}
              color="white"
              style={styles.icon}
            />
          }
        </TouchableOpacity>
      </View>
      <FlatList
        style={styles.flatList}
        data={Array.from(formData as Set<ISettings['theme']['dark']>)}
        renderItem={(item) => {
          return (
            <View style={styles.settingsList}>
              <Text style={styles.formText}>{Object.keys(item.item)[0]}: </Text>
              <Controller
                // @ts-expect-error expected
                name={Object.keys(item.item)[0]}
                defaultValue={Object.values(item.item)[0]}
                control={control}
                rules={{
                  minLength: {
                    value: 4,
                    message: 'Too short.',
                  },
                  maxLength: 9,
                  required: {
                    value: true,
                    message: 'Please fill in the field',
                  },
                  pattern: {
                    value: /^#\w{3,6}\d{0,2}$/,
                    message: 'Only legal hexcodes.',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => {
                  return (
                    <View style={styles.formWrapper}>
                      <TextInput
                        placeholder={Object.values(item.item)[0]}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        style={styles.formInput}
                        maxLength={9}
                        returnKeyType='next'
                      />
                      <View>
                        <ErrorMessage
                          errors={errors}
                          // @ts-expect-error expected
                          name={Object.keys(item.item)[0]}
                          render={({ message }) => {
                            return (
                              <Text style={styles.errorText}>{message}</Text>
                            );
                          }}
                        />
                      </View>
                    </View>
                  );
                }}
              />
            </View>
          );
        }}
      />
      <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', position: 'absolute', bottom: 10 }}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => reset()}
        >
          <Text style={styles.formSubmitText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={saveSettings}
        >
          <Text style={styles.formSubmitText}>Save settings</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
