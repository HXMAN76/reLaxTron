import React, { useState, useEffect } from 'react';
import { Linking } from 'react-native';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Camera } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';


export default function MassageOnboarding() {
    const router = useRouter();
    const [hasCompletedTutorial, setHasCompletedTutorial] = useState(false);
    const [cameraPermission, setCameraPermission] = useState(null);
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        const checkTutorialStatus = async () => {
            try {
                const tutorialStatus = await AsyncStorage.getItem('hasCompletedMassageTutorial');
                setHasCompletedTutorial(tutorialStatus === 'true');
            } catch (error) {
                console.error('Failed to load tutorial status:', error);
            } finally {
                setLoading(false);
            }
        };

        checkTutorialStatus();
    }, []);

    const requestCameraPermission = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setCameraPermission(status === 'granted');
        return status === 'granted';
    };

    const handleScanLeg = async () => {
        // Check if camera permission is already granted
        if (cameraPermission === null) {
            // Request permission if we don't know the status
            const granted = await requestCameraPermission();
            if (!granted) {
                Alert.alert(
                    "Camera Permission Required",
                    "We need camera access to scan your leg for optimal massage patterns.",
                    [
                        { text: "Cancel", style: "cancel" },
                        { text: "Settings", onPress: Linking.openDeviceSettings }
                    ]
                );
                return;
            }
        } else if (cameraPermission === false) {
            Alert.alert(
                "Camera Permission Required",
                "We need camera access to scan your leg for optimal massage patterns.",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Settings", onPress: Linking.openDeviceSettings }
                ]
            );
            return;
        }

        // If we get here, we have permission
        router.push('./scan_leg');
    };

    const handleTutorial = async () => {
        // router.push('/massage_tutorial');
        router.push('./still_in_development');
    };

    const handleSkipTutorial = async () => {
        try {
            await AsyncStorage.setItem('hasCompletedMassageTutorial', 'true');
            setHasCompletedTutorial(true);
        } catch (error) {
            console.error('Failed to save tutorial status:', error);
        }
    };

    const handleBack = () => {
        router.replace('/');
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-tertiary-50">
                <Text className="text-primary-500 text-lg">Loading...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-tertiary-50">
            <StatusBar style="dark" />
            
            {/* Header */}
            <View className="flex-row items-center justify-between p-4">
                <TouchableOpacity 
                    className="p-2 rounded-full bg-primary-100"
                    onPress={handleBack}
                >
                    <Ionicons name="arrow-back" size={24} color="#3b82f6" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-primary-500">reLaxTron</Text>
                <View style={{ width: 40 }} /> {/*Empty view for alignment} */}
            </View>
            
            <ScrollView className="flex-1 px-5">
                <Animatable.View 
                    animation="fadeIn" 
                    duration={1000} 
                    className="items-center mb-8 mt-4"
                >
                    <Image 
                        source={require('../assets/robot-massage.png')} 
                        className="w-60 h-60 rounded-2xl"
                        resizeMode="contain"
                    />
                </Animatable.View>
                
                <Animatable.View animation="fadeIn" delay={300} duration={1000}>
                    <Text className="text-3xl font-bold text-secondary-800 mb-4">
                        Welcome to Your Relaxation Journey
                    </Text>
                    
                    <Text className="text-lg text-secondary-600 mb-6">
                        reLaxTron is designed to provide personalized massage therapy tailored to your needs. 
                        Let's get started by scanning your leg for optimal massage patterns.
                    </Text>
                    <View className="bg-white p-5 rounded-xl shadow-sm mb-6">
                        <Text className="text-secondary-800 font-semibold mb-3">What to expect:</Text>
                        <View className="flex-row items-center mb-2">
                            <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />
                            <Text className="ml-2 text-secondary-700">Personalized massage patterns</Text>
                        </View>
                        <View className="flex-row items-center mb-2">
                            <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />
                            <Text className="ml-2 text-secondary-700">Stress reduction and relaxation</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />
                            <Text className="ml-2 text-secondary-700">Improved circulation and wellness</Text>
                        </View>
                    </View>

                    {/* Main CTA Button */}
                    <TouchableOpacity 
                        className="bg-primary-500 py-4 rounded-xl items-center mb-4 shadow-sm"
                        onPress={handleScanLeg}
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="scan" size={24} color="black" />
                            <Text className="ml-2 text-black-300 font-bold text-lg">Scan Leg</Text>
                        </View>
                    </TouchableOpacity>
                    
                    {/* Tutorial and Skip options */}
                    {!hasCompletedTutorial && (
                        <View className="flex-row justify-between my-4">
                            <TouchableOpacity 
                                className="bg-white border border-primary-300 py-3 px-6 rounded-xl shadow-sm flex-1 mr-2"
                                onPress={handleTutorial}
                            >
                                <Text className="text-primary-600 font-semibold text-center">Watch Tutorial</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                className="bg-transparent py-3 px-6 flex-1 ml-2"
                                onPress={handleSkipTutorial}
                            >
                                <Text className="text-secondary-500 text-center">Skip Tutorial</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Animatable.View>
                
                <View className="h-12" /> {/* Bottom spacing */}
            </ScrollView>
        </SafeAreaView>
    );
}