import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';  // Add this import at the top



export default function InfoScreen() {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleReportBug = () => {
        Linking.openURL('mailto:support@relaxtron.com?subject=Bug%20Report');
    };

    const handleBack = () => {
        router.replace('/');
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
                <View className="flex-row items-center p-4">
                    <TouchableOpacity 
                        className="bg-blue-500 py-2 px-4 rounded-lg"
                        onPress={handleBack}
                    >
                        <Text className="text-white font-semibold">← Back</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView className="p-5">
                    <Text className="text-3xl font-bold mb-6">About ReLaxTron</Text>
                    
                    <Text className="text-xl font-semibold mb-3">Overview</Text>
                    <Text className="text-gray-700 mb-4">
                        ReLaxTron is an innovative relaxation and meditation app designed to help you manage stress and improve your mental well-being.
                    </Text>

                    <Text className="text-xl font-semibold mb-3">Features</Text>
                    <View className="mb-4">
                        <Text className="text-gray-700 mb-2">• Guided breathing exercises</Text>
                        <Text className="text-gray-700 mb-2">• Relaxing soundscapes</Text>
                        <Text className="text-gray-700 mb-2">• Progress tracking</Text>
                        <Text className="text-gray-700 mb-2">• Customizable sessions</Text>
                    </View>

                    <Text className="text-xl font-semibold mb-3">How to Use</Text>
                    <Text className="text-gray-700 mb-4">
                        Simply select your preferred relaxation technique from the home screen and follow the on-screen instructions. You can customize the duration and intensity of each session to suit your needs.
                    </Text>

                    <Text className="text-xl font-semibold mb-3">Support</Text>
                    <Text className="text-gray-700 mb-2">
                        If you encounter any issues or have suggestions, please don't hesitate to contact our support team.
                    </Text>
                    <TouchableOpacity 
                        className="bg-blue-500 py-2 px-4 rounded-lg w-32 mt-2 mb-4"
                        onPress={handleReportBug}
                    >
                        <Text className="text-white font-semibold text-center">Report Bug</Text>
                    </TouchableOpacity>

                    <Text className="text-xl font-semibold mb-3">Version</Text>
                    <Text className="text-gray-700 mb-4">1.0.0</Text>

                    <Text className="text-gray-500 text-sm text-center mt-4 mb-6">
                        © 2025 ReLaxTron. All rights reserved.
                    </Text>
                </ScrollView>
            </Animated.View>
        </SafeAreaView>
    );
}
