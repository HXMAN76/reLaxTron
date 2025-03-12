import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import Svg, { Path, Text as SvgText, Circle } from 'react-native-svg';

const WellnessMeter = ({ percentage = 50 }) => {
    // Clamp percentage between 0-100
    const validPercentage = Math.min(100, Math.max(0, percentage));
    
    // Animation ref
    const needleRotation = useRef(new Animated.Value(-90)).current; // Start at -90 degrees (0%)
    
    useEffect(() => {
        // Convert percentage (0-100) to rotation (-90 to 90 degrees)
        const targetRotation = -90 + (validPercentage * 1.8);
        
        // Animate the needle from starting position to the target
        Animated.sequence([
            Animated.timing(needleRotation, {
                toValue: targetRotation - 15,
                duration: 800,
                useNativeDriver: true
            }),
            Animated.timing(needleRotation, {
                toValue: targetRotation + 10,
                duration: 600,
                useNativeDriver: true
            }),
            Animated.timing(needleRotation, {
                toValue: targetRotation,
                duration: 400,
                useNativeDriver: true
            })
        ]).start();
        
        // Reset to -90 when component unmounts or is refreshed
        return () => {
            needleRotation.setValue(-90);
        };
    }, [validPercentage]);
    
    // Convert rotation value to transform style
    const needleTransform = needleRotation.interpolate({
        inputRange: [-90, 90],
        outputRange: ['-90deg', '90deg']
    });

    // Get color based on relaxation score
    const getScoreColor = () => {
        if (validPercentage < 30) return '#ef4444';
        if (validPercentage < 70) return '#f59e0b';
        return '#10b981';
    };

    // Get text based on relaxation score
    const getRelaxStatus = () => {
        if (validPercentage < 30) return 'Stressed';
        if (validPercentage < 70) return 'Calm';
        return 'Relaxed';
    };

    return (
        <View className="bg-white rounded-2xl p-6 shadow-lg mb-6 elevation-3">
            <Text className="text-xl font-semibold text-gray-700 mb-4 text-center">Mental Wellness Meter</Text>
            
            <View className="items-center justify-center h-48">
                {/* Speed meter */}
                <View className="w-full items-center">
                    <View className="relative h-36 w-full items-center">
                        {/* Meter background */}
                        <Svg height="160" width="300" viewBox="0 0 200 100">
                            {/* Meter arc with shadow */}
                            <Path 
                                d="M20,100 A80,80 0 0,1 180,100" 
                                fill="none" 
                                stroke="#e5e7eb" 
                                strokeWidth="12"
                                strokeLinecap="round"
                            />
                            
                            {/* Red zone - Stressed */}
                            <Path 
                                d="M20,100 A80,80 0 0,1 60,35" 
                                fill="none" 
                                stroke="#ff0000" 
                                strokeWidth="12"
                                strokeLinecap="round"
                            />
                            
                            {/* Yellow zone - Calm */}
                            <Path 
                                d="M60,35 A80,80 0 0,1 140,35" 
                                fill="none" 
                                stroke="#ffcc00" 
                                strokeWidth="12"
                                strokeLinecap="round"
                            />
                            
                            {/* Green zone - Relaxed */}
                            <Path 
                                d="M140,35 A80,80 0 0,1 180,100" 
                                fill="none" 
                                stroke="#00cc44" 
                                strokeWidth="12"
                                strokeLinecap="round"
                            />
                            
                            {/* Labels */}
                            <SvgText x="20" y="120" fontSize="12" fontWeight="bold" fill="#ff0000">Stressed</SvgText>
                            <SvgText x="100" y="120" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#ffcc00">Calm</SvgText>
                            <SvgText x="180" y="120" fontSize="12" fontWeight="bold" textAnchor="end" fill="#00cc44">Relaxed</SvgText>
                            
                            {/* Tick marks */}
                            <Path d="M20,100 L20,90" stroke="#888" strokeWidth="2" />
                            <Path d="M60,35 L55,26" stroke="#888" strokeWidth="2" />
                            <Path d="M100,20 L100,10" stroke="#888" strokeWidth="2" />
                            <Path d="M140,35 L145,26" stroke="#888" strokeWidth="2" />
                            <Path d="M180,100 L180,90" stroke="#888" strokeWidth="2" />
                        </Svg>
                        
                        {/* Black Needle (no color change) */}
                        <Animated.View 
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                width: 4,
                                height: 85,
                                backgroundColor: '#0000ff', // Fixed black color
                                borderTopRightRadius: 4,
                                borderTopLeftRadius: 4,
                                transformOrigin: 'bottom',
                                transform: [{ rotate: needleTransform }],
                                elevation: 8,
                                shadowColor: '#0000ff',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.5,
                                shadowRadius: 4,
                                borderColor: '#ffffff',
                                borderWidth: 0.5,
                            }}
                        />
                    </View>
                    
                    <View className="mt-6 items-center">
                        <Text style={{ color: getScoreColor() }} className="text-2xl font-bold">{getRelaxStatus()}</Text>
                        <Text className="text-gray-500 text-base mt-1">Current wellness: {validPercentage}%</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default WellnessMeter;
