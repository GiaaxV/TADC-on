import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const GAME_DURATION = 30000; // 30 segundos

export default function PomniGameScreen({ navigation }) {
  const [happiness, setHappiness] = useState(50);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [isRecord, setIsRecord] = useState(false);
  
  const foodPosition = useRef(new Animated.ValueXY({ x: width * 0.2, y: height * 0.6 })).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        playSound('grab');
      },
      onPanResponderMove: Animated.event(
        [null, { dx: foodPosition.x, dy: foodPosition.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (evt, gestureState) => {
        checkCollision();
      },
    })
  ).current;

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

      return () => clearInterval(timer);
    }
  }, [gameActive]);

  const playSound = async (type = 'click') => {
    try {
      // Simular sonido sin archivos reales por ahora
      console.log(`Playing sound: ${type}`);
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const checkCollision = () => {
    const pomniX = width * 0.82;
    const pomniY = height * 0.48;
    const pomniRadius = 60;
    
    foodPosition.extractOffset();
    const foodX = foodPosition.x._value;
    const foodY = foodPosition.y._value;
    
    const distance = Math.sqrt(
      Math.pow(foodX - pomniX, 2) + Math.pow(foodY - pomniY, 2)
    );
    
    if (distance < pomniRadius + 25) {
      // Colisión exitosa
      setHappiness(prev => Math.min(100, prev + 10));
      playSound('success');
    } else {
      // Colisión fallida
      setHappiness(prev => Math.max(0, prev - 8));
      playSound('fail');
    }
    
    // Resetear posición de la comida
    foodPosition.setValue({ x: width * 0.2, y: height * 0.6 });
  };

  const endGame = async () => {
    setGameActive(false);
    try {
      const bestHappiness = parseInt(await AsyncStorage.getItem('pomniBest') || '0');
      const newRecord = happiness > bestHappiness;
      
      if (newRecord) {
        await AsyncStorage.setItem('pomniBest', happiness.toString());
        setIsRecord(true);
      }
      
      setShowResult(true);
      playSound('end');
    } catch (error) {
      console.log('Error saving happiness:', error);
      setShowResult(true);
    }
  };

  return (
    <LinearGradient
      colors={['#331a62', '#0b0b18']}
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
        <Text style={styles.hudText}>Felicidad: {happiness}</Text>
      </View>

      <View style={styles.gameArea}>
        {/* Pomni */}
        <View style={[styles.pomni, { right: width * 0.18, top: height * 0.48 }]} />
        
        {/* Comida */}
        <Animated.View
          style={[
            styles.food,
            {
              transform: [
                { translateX: foodPosition.x },
                { translateY: foodPosition.y },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        />
      </View>

      <Text style={styles.hint}>
        Arrastra la comida hasta Pomni. Soltar fuera baja felicidad.
      </Text>

      {showResult && (
        <View style={styles.resultContainer}>
          <View style={styles.resultContent}>
            <View style={[styles.sprite, styles.pomniSprite]} />
            <Text style={styles.resultText}>
              {isRecord ? '¡Nuevo récord!' : '¡Buen trabajo!'}
            </Text>
            <Text style={styles.resultScore}>Felicidad: {happiness}</Text>
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
  gameArea: {
    flex: 1,
    position: 'relative',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
  },
  pomni: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#c77dff',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  food: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#7effa1',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  hint: {
    textAlign: 'center',
    color: '#fff6ff',
    opacity: 0.8,
    fontSize: 14,
    paddingHorizontal: 24,
    marginBottom: 24,
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
  pomniSprite: {
    backgroundColor: '#c77dff',
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