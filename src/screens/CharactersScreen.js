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

const characters = [
  { name: 'Jax', color: '#ffd166' },
  { name: 'Pomni', color: '#c77dff' },
  { name: 'Kaufmo', color: '#7effa1' },
  { name: 'Ragatha', color: '#6ea8ff' },
];

export default function CharactersScreen({ navigation }) {
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

        <Text style={styles.title}>Personajes</Text>
        
        <View style={styles.charactersGrid}>
          {characters.map((character, index) => (
            <View key={index} style={styles.characterCard}>
              <View 
                style={[
                  styles.characterSprite, 
                  { backgroundColor: character.color }
                ]} 
              />
              <Text style={styles.characterName}>{character.name}</Text>
            </View>
          ))}
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
  charactersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  characterCard: {
    width: (width - 80) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  characterSprite: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  characterName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff6ff',
  },
});