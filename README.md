# Digital Circus - React Native con Expo SDK 54

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Instalar Expo CLI globalmente (si no lo tienes):
```bash
npm install -g @expo/cli
```

3. Ejecutar el proyecto:
```bash
npx expo start
```

## Estructura del Proyecto

- `App.js` - Componente principal con navegación
- `src/screens/` - Pantallas del juego:
  - `LoadingScreen.js` - Pantalla de carga con barra progresiva
  - `MinigamesScreen.js` - Selección de minijuegos
  - `JaxGameScreen.js` - Minijuego Whack-a-Mole
  - `PomniGameScreen.js` - Minijuego de alimentar a Pomni
  - `HistoryScreen.js` - Historia del juego
  - `CharactersScreen.js` - Personajes del juego

## Características

- ✅ Navegación entre pantallas con React Navigation
- ✅ Pantalla de carga con animación de barra progresiva
- ✅ Minijuego Jax (Whack-a-Mole) con temporizador y puntuación
- ✅ Minijuego Pomni (Alimentarla) con drag & drop
- ✅ Pantallas de Historia y Personajes
- ✅ Almacenamiento local de récords con AsyncStorage
- ✅ Diseño responsive para diferentes tamaños de pantalla
- ✅ Gradientes y efectos visuales psicodélicos

## Solución de Errores 500

Los errores 500 suelen ser por:
1. **Dependencias faltantes** - Ya agregué `@react-native-async-storage/async-storage`
2. **Imports incorrectos** - Corregí todos los imports
3. **Funciones async mal manejadas** - Agregué try/catch en todas las funciones async
4. **Sonidos sin archivos** - Los sonidos ahora son simulados (console.log)

## Comandos Útiles

- `npx expo start` - Iniciar servidor de desarrollo
- `npx expo start --android` - Ejecutar en Android
- `npx expo start --ios` - Ejecutar en iOS
- `npx expo start --web` - Ejecutar en navegador web

## Notas

- Los sonidos están simulados por ahora (console.log)
- Para agregar sonidos reales, crea la carpeta `assets/sounds/` con archivos MP3
- El proyecto está optimizado para Expo SDK 54