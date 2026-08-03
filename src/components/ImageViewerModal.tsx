import React from 'react';
import { Modal, Pressable, Image, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function ImageViewerModal({
  uri,
  visible,
  onClose,
}: {
  uri: string | null;
  visible: boolean;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible && !!uri} transparent animationType="fade" onRequestClose={onClose}>
      <SafeAreaView style={styles.backdrop}>
        <Pressable style={styles.closeArea} onPress={onClose}>
          <View style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </View>
        </Pressable>
        {uri && (
          <Pressable style={styles.imageWrap} onPress={onClose}>
            <Image source={{ uri }} style={styles.image} resizeMode="contain" />
          </Pressable>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
  },
  closeArea: {
    alignItems: 'flex-end',
    padding: 16,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 18,
  },
  imageWrap: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: '100%',
  },
});
