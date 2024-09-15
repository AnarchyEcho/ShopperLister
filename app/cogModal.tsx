import { cogModalVisibleAtom, settingsAtom } from '@/atoms';
import { ISettings } from '@/interfaces';
import { router, useLocalSearchParams } from 'expo-router';
import { useAtom } from 'jotai';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function cogModal() {
  const [settings] = useAtom<ISettings | undefined>(settingsAtom as any);
  const [_, setModalVisible] = useAtom<boolean>(cogModalVisibleAtom);
  const params = useLocalSearchParams();

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
  });

  const closeModal = () => {
    setModalVisible(false);
    router.back();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.modal}
      onPress={closeModal}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={styles.container}
        onPress={() => { return; }}
      >
        <View style={styles.title}>
          <Text style={styles.text}>
            {params.itemName}
          </Text>
        </View>


        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.button}
          onPress={closeModal}
        >
          <Text style={[styles.text, { textAlign: 'center' }]}>Close menu</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
