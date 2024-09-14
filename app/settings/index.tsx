import { settingsAtom } from '@/atoms';
import { ISettings } from '@/interfaces';
import { useAtom } from 'jotai';
import { Suspense } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Index() {
  const [settings] = useAtom<ISettings | undefined>(settingsAtom as any);

  const styles = StyleSheet.create({
    container: {
      height: '100%',
      backgroundColor: '#232323',
    },
    text: {
      color: '#FEFEFE',
    },
  });

  return (
    <View style={styles.container}>
      <Text>placeholder text for settings</Text>
    </View>
  );
};
