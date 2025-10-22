import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function LoadingScreen({ navigation }) {
  const [progress, setProgress] = useState(0);
  const [showStartButton, setShowStartButton] = useState(false);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Simular carga de 3 segundos
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowStartButton(true);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const playSound = async () => {
    try {
      // Simular sonido sin archivos reales por ahora
      console.log('Playing click sound');
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const handleStart = async () => {
    await playSound();
    navigation.navigate('Minigames');
  };

  return (
    <LinearGradient
      colors={['#2e0b2b', '#0b1f3a', '#40116d', '#2e0b2b']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Digital Circus</Text>
        <Text style={styles.subtitle}>
          {showStartButton ? '¡Listo!' : 'Cargando...'}
        </Text>
        
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        {showStartButton && (
          <Animated.View style={{ opacity: fadeAnim }}>
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.startButtonText}>START</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: width * 0.9,
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: '#fff6ff',
    marginBottom: 16,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff6ff',
    opacity: 0.9,
    marginBottom: 32,
  },
  progressContainer: {
    width: '100%',
    height: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 7,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#ff2bd6',
    borderRadius: 7,
  },
  startButton: {
    backgroundColor: '#ff2bd6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 32,
  },
  startButtonText: {
    color: '#0b0b11',
    fontSize: 20,
    fontWeight: '700',
  },
});