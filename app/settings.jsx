import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const router = useRouter();
    const [settings, setSettings] = useState({
        notifications: true,
        darkMode: false,
        soundEnabled: true,
        vibrationEnabled: true,
        dailyReminder: true,
        dataSync: true,
        privacyMode: false,
    });
    
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Load settings on component mount
    useEffect(() => {
        loadSettings();
    }, []);

    // Load all settings from AsyncStorage
    const loadSettings = async () => {
        try {
            setIsLoading(true);
            
            // Load username
            const storedUsername = await AsyncStorage.getItem('username');
            if (storedUsername) setUsername(storedUsername);
            
            // Load settings
            const storedSettings = await AsyncStorage.getItem('appSettings');
            if (storedSettings) {
                setSettings(JSON.parse(storedSettings));
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
            Alert.alert('Error', 'Failed to load settings');
        } finally {
            setIsLoading(false);
        }
    };

    // Save a specific setting
    const updateSetting = async (key, value) => {
        try {
            const newSettings = { ...settings, [key]: value };
            setSettings(newSettings);
            await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
        } catch (error) {
            console.error('Failed to save setting:', error);
            Alert.alert('Error', 'Failed to save your setting');
        }
    };

    // Reset all settings to default
    const resetSettings = async () => {
        Alert.alert(
            'Reset Settings',
            'Are you sure you want to reset all settings to default?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Reset', 
                    style: 'destructive',
                    onPress: async () => {
                        const defaultSettings = {
                            notifications: true,
                            darkMode: false,
                            soundEnabled: true,
                            vibrationEnabled: true,
                            dailyReminder: true,
                            dataSync: true,
                            privacyMode: false,
                        };
                        
                        try {
                            setSettings(defaultSettings);
                            await AsyncStorage.setItem('appSettings', JSON.stringify(defaultSettings));
                            Alert.alert('Success', 'Settings have been reset to default');
                        } catch (error) {
                            console.error('Failed to reset settings:', error);
                            Alert.alert('Error', 'Failed to reset settings');
                        }
                    }
                }
            ]
        );
    };

    // Clear user data
    const clearUserData = () => {
        Alert.alert(
            'Clear User Data',
            'Are you sure you want to clear all your data? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Clear', 
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AsyncStorage.clear();
                            setUsername('');
                            loadSettings(); // Reload default settings
                            Alert.alert('Success', 'All user data has been cleared');
                        } catch (error) {
                            console.error('Failed to clear user data:', error);
                            Alert.alert('Error', 'Failed to clear user data');
                        }
                    }
                }
            ]
        );
    };

    // Handle navigation back to home
    const handleBack = () => {
        router.replace('/');
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
                <TouchableOpacity 
                    className="p-2"
                    onPress={handleBack}
                >
                    <Ionicons name="arrow-back" size={24} color="#3b82f6" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-800">Settings</Text>
                <View style={{ width: 24 }} /> {/* Empty view for alignment */}
            </View>

            <ScrollView className="flex-1">
                {isLoading ? (
                    <View className="flex-1 items-center justify-center p-4">
                        <Text className="text-gray-500">Loading settings...</Text>
                    </View>
                ) : (
                    <View className="p-4">
                        {/* User section */}
                        <View className="mb-6 bg-white rounded-xl p-4 shadow-sm">
                            <Text className="text-lg font-semibold text-gray-800 mb-3">User Account</Text>
                            <View className="flex-row items-center justify-between">
                                <Text className="text-gray-600">Username</Text>
                                <Text className="font-medium text-primary-600">{username || 'Guest User'}</Text>
                            </View>
                        </View>

                        {/* App Settings section */}
                        <View className="mb-6 bg-white rounded-xl p-4 shadow-sm">
                            <Text className="text-lg font-semibold text-gray-800 mb-3">App Settings</Text>
                            
                            <SettingItem 
                                title="Dark Mode" 
                                description="Enable dark theme for the app"
                                value={settings.darkMode}
                                onChange={(value) => updateSetting('darkMode', value)}
                            />
                            
                            <SettingItem 
                                title="Notifications" 
                                description="Receive app notifications"
                                value={settings.notifications}
                                onChange={(value) => updateSetting('notifications', value)}
                            />
                            
                            <SettingItem 
                                title="Daily Reminder" 
                                description="Get reminded to relax every day"
                                value={settings.dailyReminder}
                                onChange={(value) => updateSetting('dailyReminder', value)}
                            />
                        </View>

                        {/* Robot Settings section */}
                        <View className="mb-6 bg-white rounded-xl p-4 shadow-sm">
                            <Text className="text-lg font-semibold text-gray-800 mb-3">Robot Settings</Text>
                            
                            <SettingItem 
                                title="Sound Effects" 
                                description="Enable sound feedback from robot"
                                value={settings.soundEnabled}
                                onChange={(value) => updateSetting('soundEnabled', value)}
                            />
                            
                            <SettingItem 
                                title="Vibration" 
                                description="Enable vibration feedback from robot"
                                value={settings.vibrationEnabled}
                                onChange={(value) => updateSetting('vibrationEnabled', value)}
                            />
                        </View>

                        {/* Privacy & Data section */}
                        <View className="mb-6 bg-white rounded-xl p-4 shadow-sm">
                            <Text className="text-lg font-semibold text-gray-800 mb-3">Privacy & Data</Text>
                            
                            <SettingItem 
                                title="Data Synchronization" 
                                description="Sync your data across devices"
                                value={settings.dataSync}
                                onChange={(value) => updateSetting('dataSync', value)}
                            />
                            
                            <SettingItem 
                                title="Privacy Mode" 
                                description="Enhanced privacy for sensitive data"
                                value={settings.privacyMode}
                                onChange={(value) => updateSetting('privacyMode', value)}
                            />
                        </View>

                        {/* Data Management Actions */}
                        <View className="mb-6 bg-white rounded-xl p-4 shadow-sm">
                            <Text className="text-lg font-semibold text-gray-800 mb-3">Data Management</Text>
                            
                            <TouchableOpacity 
                                className="flex-row items-center justify-between py-3"
                                onPress={resetSettings}
                            >
                                <Text className="text-primary-600 font-medium">Reset Settings to Default</Text>
                                <Ionicons name="refresh" size={20} color="#3b82f6" />
                            </TouchableOpacity>
                            
                            <View className="h-px bg-gray-200 my-2" />
                            
                            <TouchableOpacity 
                                className="flex-row items-center justify-between py-3"
                                onPress={clearUserData}
                            >
                                <Text className="text-red-500 font-medium">Clear All User Data</Text>
                                <Ionicons name="trash-bin" size={20} color="#ef4444" />
                            </TouchableOpacity>
                        </View>

                        {/* About section */}
                        <View className="mb-6 bg-white rounded-xl p-4 shadow-sm">
                            <Text className="text-lg font-semibold text-gray-800 mb-3">About</Text>
                            
                            <View className="flex-row items-center justify-between py-3">
                                <Text className="text-gray-600">Version</Text>
                                <Text className="text-gray-500">1.0.0</Text>
                            </View>
                            
                            <TouchableOpacity 
                                className="flex-row items-center justify-between py-3"
                                onPress={() => router.push('/info')}
                            >
                                <Text className="text-primary-600 font-medium">About ReLaxTron</Text>
                                <Ionicons name="information-circle-outline" size={20} color="#3b82f6" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

// Component for individual settings items with toggle switch
function SettingItem({ title, description, value, onChange }) {
    return (
        <View className="py-3 border-b border-gray-100 last:border-b-0">
            <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-4">
                    <Text className="text-gray-800">{title}</Text>
                    {description && (
                        <Text className="text-gray-500 text-sm mt-1">{description}</Text>
                    )}
                </View>
                <Switch
                    value={value}
                    onValueChange={onChange}
                    trackColor={{ false: "#d1d5db", true: "#bfdbfe" }}
                    thumbColor={value ? "#3b82f6" : "#f3f4f6"}
                    ios_backgroundColor="#d1d5db"
                />
            </View>
        </View>
    );
}