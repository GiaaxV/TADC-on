import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function HistoryScreen({ navigation }) {
  const playSound = async () => {
    try {
      // Simular sonido sin archivos reales por ahora
      console.log('Playing click sound');
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const handleBack = async () => {
    await playSound();
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={['#2e0b2b', '#0b1f3a', '#40116d', '#2e0b2b']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>⟵ Volver</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Historia</Text>
        
        <View style={styles.storyContainer}>
          <View style={styles.storyImage} />
          <Text style={styles.storyText}>
            En un circo digital y psicodélico, personajes excéntricos viven aventuras
            surreales. Únete a Jax y Pomni en minijuegos rápidos mientras descubres
            pistas sobre su mundo virtual.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  backButtonText: {
    color: '#fff6ff',
    fontSize: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff6ff',
    textAlign: 'center',
    marginBottom: 32,
  },
  storyContainer: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  storyImage: {
    width: 180,
    height: 180,
    borderRadius: 16,
    backgroundColor: '#ff2bd6',
  },
  storyText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#fff6ff',
    opacity: 0.9,
  },
});