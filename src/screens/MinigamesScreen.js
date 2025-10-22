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

export default function MinigamesScreen({ navigation }) {
  const playSound = async () => {
    try {
      // Simular sonido sin archivos reales por ahora
      console.log('Playing click sound');
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const handleNavigation = async (screenName) => {
    await playSound();
    navigation.navigate(screenName);
  };

  return (
    <LinearGradient
      colors={['#2e0b2b', '#0b1f3a', '#40116d', '#2e0b2b']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>⟵ Volver</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Selecciona un Minijuego</Text>

        <View style={styles.minigamesContainer}>
          <TouchableOpacity 
            style={styles.minigameCard}
            onPress={() => handleNavigation('JaxGame')}
          >
            <View style={[styles.sprite, styles.jaxSprite]} />
            <Text style={styles.minigameTitle}>Jax – Whack-a-Mole</Text>
            <Text style={styles.minigameDesc}>
              Haz clic sobre Jax cuando aparezca. Dura 30s. ¡Sé rápido!
            </Text>
            <View style={styles.startButton}>
              <Text style={styles.startButtonText}>Iniciar</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.minigameCard}
            onPress={() => handleNavigation('PomniGame')}
          >
            <View style={[styles.sprite, styles.pomniSprite]} />
            <Text style={styles.minigameTitle}>Pomni – Alimentarla</Text>
            <Text style={styles.minigameDesc}>
              Arrastra la comida hacia Pomni para subir la felicidad. Evita soltarla fuera.
              Dura 30s.
            </Text>
            <View style={styles.startButton}>
              <Text style={styles.startButtonText}>Iniciar</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.additionalSections}>
          <TouchableOpacity 
            style={styles.sectionCard}
            onPress={() => handleNavigation('History')}
          >
            <Text style={styles.sectionTitle}>Historia</Text>
            <Text style={styles.sectionDesc}>Descubre el trasfondo</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.sectionCard}
            onPress={() => handleNavigation('Characters')}
          >
            <Text style={styles.sectionTitle}>Personajes</Text>
            <Text style={styles.sectionDesc}>Conoce al elenco</Text>
          </TouchableOpacity>
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
  minigamesContainer: {
    gap: 20,
    marginBottom: 40,
  },
  minigameCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  sprite: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  jaxSprite: {
    backgroundColor: '#ffd166',
  },
  pomniSprite: {
    backgroundColor: '#c77dff',
  },
  minigameTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff6ff',
    marginBottom: 8,
  },
  minigameDesc: {
    fontSize: 14,
    color: '#fff6ff',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: '#ff2bd6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  startButtonText: {
    color: '#0b0b11',
    fontSize: 16,
    fontWeight: '700',
  },
  additionalSections: {
    flexDirection: 'row',
    gap: 16,
  },
  sectionCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff6ff',
    marginBottom: 8,
  },
  sectionDesc: {
    fontSize: 14,
    color: '#fff6ff',
    opacity: 0.9,
  },
});