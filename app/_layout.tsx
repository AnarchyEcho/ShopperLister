import { Stack } from 'expo-router/stack';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)/index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)/settings" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)/lists" options={{ headerShown: false }} />
    </Stack>
  );
}
