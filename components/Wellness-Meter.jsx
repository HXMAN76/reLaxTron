import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';

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
            <Text className="text-lg font-semibold text-gray-600 mb-4">Mental Wellness Meter</Text>
            
            <View className="items-center justify-center h-48">
                {/* Speed meter */}
                <View className="w-full items-center">
                    <View className="relative h-36 w-full items-center">
                        {/* Meter background */}
                        <Svg height="150" width="300" viewBox="0 0 200 100">
                            {/* Meter arc */}
                            <Path 
                                d="M20,100 A80,80 0 0,1 180,100" 
                                fill="none" 
                                stroke="#e5e7eb" 
                                strokeWidth="10" 
                            />
                            
                            {/* Red zone */}
                            <Path 
                                d="M20,100 A80,80 0 0,1 60,35" 
                                fill="none" 
                                stroke="#fee2e2" 
                                strokeWidth="10" 
                            />
                            
                            {/* Yellow zone */}
                            <Path 
                                d="M60,35 A80,80 0 0,1 140,35" 
                                fill="none" 
                                stroke="#fef3c7" 
                                strokeWidth="10" 
                            />
                            
                            {/* Green zone */}
                            <Path 
                                d="M140,35 A80,80 0 0,1 180,100" 
                                fill="none" 
                                stroke="#d1fae5" 
                                strokeWidth="10" 
                            />
                            
                            {/* Labels */}
                            <SvgText x="20" y="115" fontSize="10" fill="#ef4444">Stressed</SvgText>
                            <SvgText x="100" y="115" fontSize="10" textAnchor="middle" fill="#f59e0b">Calm</SvgText>
                            <SvgText x="180" y="115" fontSize="10" textAnchor="end" fill="#10b981">Relaxed</SvgText>
                        </Svg>
                        
                        {/* Needle */}
                        <Animated.View 
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                width: 4,
                                height: 80,
                                backgroundColor: getScoreColor(),
                                transformOrigin: 'bottom',
                                transform: [{ rotate: needleTransform }]
                            }}
                        />
                        
                        {/* Center point */}
                        <View 
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                width: 14,
                                height: 14,
                                borderRadius: 7,
                                backgroundColor: getScoreColor(),
                            }}
                        />
                    </View>
                    
                    <View className="mt-2 items-center">
                        <Text style={{ color: getScoreColor() }} className="text-xl font-bold">{getRelaxStatus()}</Text>
                        <Text className="text-gray-500 text-sm">Current wellness: {validPercentage}%</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default WellnessMeter;