import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

async function compress(uri: string): Promise<string> {
  const manipulated = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 900 } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  );
  return manipulated.uri;
}

export async function captureJournalPhoto(): Promise<string | null> {
  const perm = await ImagePicker.requestCameraPermissionsAsync();
  if (!perm.granted) return null;
  const result = await ImagePicker.launchCameraAsync({ quality: 0.9 });
  if (result.canceled || !result.assets[0]) return null;
  return compress(result.assets[0].uri);
}

export async function pickJournalPhoto(): Promise<string | null> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) return null;
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.9 });
  if (result.canceled || !result.assets[0]) return null;
  return compress(result.assets[0].uri);
}
