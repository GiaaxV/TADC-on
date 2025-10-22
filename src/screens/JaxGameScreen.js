import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const GAME_DURATION = 30000; // 30 segundos
const JAX_APPEAR_INTERVAL = 800; // frecuencia de aparición

export default function JaxGameScreen({ navigation }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(true);
  const [jaxPosition, setJaxPosition] = useState({ x: 0, y: 0 });
  const [showResult, setShowResult] = useState(false);
  const [isRecord, setIsRecord] = useState(false);
  
  const jaxAnim = useRef(new Animated.Value(0)).current;
  const holes = [
    { x: width * 0.18, y: height * 0.3 },
    { x: width * 0.4, y: height * 0.55 },
    { x: width * 0.62, y: height * 0.28 },
    { x: width * 0.78, y: height * 0.64 },
    { x: width * 0.26, y: height * 0.76 },
  ];

  useEffect(() => {
    if (gameActive) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const jaxTimer = setInterval(() => {
        moveJax();
      }, JAX_APPEAR_INTERVAL);

      return () => {
        clearInterval(timer);
        clearInterval(jaxTimer);
      };
    }
  }, [gameActive]);

  const moveJax = () => {
    const randomHole = holes[Math.floor(Math.random() * holes.length)];
    setJaxPosition(randomHole);
    
    Animated.sequence([
      Animated.timing(jaxAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(jaxAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const playSound = async (type = 'click') => {
    try {
      // Simular sonido sin archivos reales por ahora
      console.log(`Playing sound: ${type}`);
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const handleJaxPress = async () => {
    if (!gameActive) return;
    
    setScore(prev => prev + 1);
    await playSound('hit');
    moveJax();
  };

  const endGame = async () => {
    setGameActive(false);
    try {
      const bestScore = parseInt(await AsyncStorage.getItem('jaxBest') || '0');
      const newRecord = score > bestScore;
      
      if (newRecord) {
        await AsyncStorage.setItem('jaxBest', score.toString());
        setIsRecord(true);
      }
      
      setShowResult(true);
      playSound('end');
    } catch (error) {
      console.log('Error saving score:', error);
      setShowResult(true);
    }
  };

  return (
    <LinearGradient
      colors={['#2b1b4f', '#0b0b18']}
      style={styles.container}
    >
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>⟵ Volver</Text>
      </TouchableOpacity>

      <View style={styles.hud}>
        <Text style={styles.hudText}>Tiempo: {timeLeft}s</Text>
        <Text style={styles.hudText}>Puntos: {score}</Text>
      </View>

      <View style={styles.gameBoard}>
        {holes.map((hole, index) => (
          <View
            key={index}
            style={[styles.hole, { left: hole.x - 45, top: hole.y - 45 }]}
          />
        ))}
        
        <Animated.View
          style={[
            styles.jax,
            {
              left: jaxPosition.x - 35,
              top: jaxPosition.y - 35,
              opacity: jaxAnim,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.jaxTouchable}
            onPress={handleJaxPress}
            disabled={!gameActive}
          />
        </Animated.View>
      </View>

      {showResult && (
        <View style={styles.resultContainer}>
          <View style={styles.resultContent}>
            <View style={[styles.sprite, styles.jaxSprite]} />
            <Text style={styles.resultText}>
              {isRecord ? '¡Nuevo récord!' : '¡Buen trabajo!'}
            </Text>
            <Text style={styles.resultScore}>Puntaje: {score}</Text>
          </View>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    zIndex: 10,
  },
  backButtonText: {
    color: '#fff6ff',
    fontSize: 16,
  },
  hud: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 20,
  },
  hudText: {
    color: '#fff6ff',
    fontSize: 18,
    fontWeight: '600',
  },
  gameBoard: {
    flex: 1,
    position: 'relative',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
  },
  hole: {
    position: 'absolute',
    width: 90,
    height: 90,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderStyle: 'dashed',
    borderRadius: 45,
  },
  jax: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ffd166',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  jaxTouchable: {
    width: '100%',
    height: '100%',
  },
  resultContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  sprite: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  jaxSprite: {
    backgroundColor: '#ffd166',
  },
  resultText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff6ff',
    marginBottom: 8,
  },
  resultScore: {
    fontSize: 18,
    color: '#fff6ff',
    opacity: 0.9,
  },
});