import { Text, View, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import WellnessMeter from '../components/Wellness-Meter';

export default function App() {
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(1));
  const [username, setUsername] = useState('Heman');
  const [streak, setStreak] = useState(0);
  const [initialRender, setInitialRender] = useState(true);
  
  // Relaxation score state (0-100)
  const [relaxScore, setRelaxScore] = useState(50); // Added placeholder value
  
  // Animation refs
  const statsOpacity = useRef(new Animated.Value(0)).current;
  const welcomeOpacity = useRef(new Animated.Value(0)).current;
  const dashboardOpacity = useRef(new Animated.Value(0)).current;

  // On initial mount, set all animations to default state
  useEffect(() => {
    // Run animations only on first render
    if (initialRender) {
      fadeAnim.setValue(0);
      statsOpacity.setValue(0);
      welcomeOpacity.setValue(0);
      dashboardOpacity.setValue(0);
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.sequence([
          Animated.timing(welcomeOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true
          }),
          Animated.timing(dashboardOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true
          }),
          Animated.timing(statsOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true
          })
        ])
      ]).start(() => {
        setInitialRender(false);
      });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Just load data when screen gets focus, no animations
      loadUserData();
      
      // If returning from another screen, make sure everything is visible
      if (!initialRender) {
        fadeAnim.setValue(1);
        statsOpacity.setValue(1);
        welcomeOpacity.setValue(1);
        dashboardOpacity.setValue(1);
      }
    }, [initialRender])
  );

  useEffect(() => {
    // Simulate changes in relax score
    const interval = setInterval(() => {
      setRelaxScore(prev => {
        const newScore = prev + (Math.random() > 0.5 ? 5 : -5);
        return Math.min(100, Math.max(0, newScore));
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const loadUserData = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) setUsername(storedUsername);
      
      // Load streak data
      // Skipping lastDate processing for now
      await AsyncStorage.getItem('lastSessionDate'); // Still retrieving for future use
      const streakCount = await AsyncStorage.getItem('streak');
      if (streakCount) {
        setStreak(parseInt(streakCount));
      } else {
        setStreak(0); // Default value if no streak found
      }
    } catch (error) {
      console.error('Failed to load user data', error);
    }
  };

  const handleInfoPress = () => {
    router.push({
      pathname: './info',
      params: { hideHeader: true }
    });
  };

  const goToDevelopmentPage = (title, message) => {
    router.push({ 
      pathname: './still_in_development', 
      params: { 
        hideHeader: true,
        title: title,
        message: message
      }
    });
  };

  return (
    <Animated.View style={{ opacity: fadeAnim }} className="flex-1 bg-tertiary-50">
      <ScrollView>
      <View className="flex-1 px-5 pt-12">
        {/* Header */}
        <Animated.View style={{ opacity: welcomeOpacity }} className="flex-row justify-between items-center mb-8">
          <Text className="text-3xl font-bold text-primary-500">reLaxTron</Text>
          <TouchableOpacity onPress={handleInfoPress}>
            <AntDesign name="infocirlceo" size={22} color="var(--primary-500)" />
          </TouchableOpacity>
        </Animated.View>

        {/* Rest of the code remains the same... */}
        <Animated.View style={{ opacity: welcomeOpacity }} className="mb-8">
          <Text className="text-2xl text-secondary-700">Welcome back, <Text className="text-2xl font-bold text-primary-500">{username}</Text></Text>
        </Animated.View>

        <Animated.View style={{ opacity: dashboardOpacity }}>
          <WellnessMeter percentage={relaxScore} />
          <View className="bg-white rounded-2xl p-6 shadow-lg mb-6 elevation-3">
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-2xl font-bold text-primary-500">{streak}</Text>
                <Text className="text-sm text-secondary-500">Day Streak</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-primary-400">20</Text>
                <Text className="text-sm text-secondary-500">Minutes</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-primary-600">3</Text>
                <Text className="text-sm text-secondary-500">Sessions</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: statsOpacity }} className="items-center mb-9">
          <TouchableOpacity 
            className="bg-blue-500 w-48 h-14 rounded-2xl items-center justify-center shadow-lg"
            onPress={router.push.bind(null, { pathname: './massage_onboarding', params: { hideHeader: true } })}
          >
            <Text className="text-white font-bold text-center">Start Now!</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ opacity: statsOpacity }}>
          <Text className="text-lg font-semibold text-secondary-600 mb-4">Quick Actions</Text>
          <View className="flex-row flex-wrap justify-between">
            {[
              ['Schedule session', 'Set up time to get relaxed', './still_in_development'],
              ['Sleep', 'Ready to dive deep with soothing music', './still_in_development'],
              ['Progress', 'Track your mental wellness journey', './still_in_development'],
              ['Settings', 'Customize your experience', './settings']
            ].map((action, index) => (
              <TouchableOpacity 
                key={action[0]}
                className={`bg-white w-[48%] rounded-xl p-4 mb-4 shadow-sm
                  ${index % 2 === 0 ? 'bg-primary-50' : 'bg-primary-100'}`}
                onPress={() => router.push({ pathname: action[2], params: { hideHeader: true } })}
              >
                <Text className={`text-lg font-semibold mb-2 
                  ${index % 2 === 0 ? 'text-primary-600' : 'text-primary-700'}`}>
                  {action[0]}
                </Text>
                <Text className="text-sm text-secondary-500">{action[1]}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>
      </ScrollView>
    </Animated.View>
  );
}
