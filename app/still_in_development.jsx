import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import tw from 'twrnc';

export default function StillInDevelopment({ extraText = "This page is currently under active development. Our team is working diligently to bring you new features and improvements. We appreciate your patience as we build this section of the application. Check back soon for updates!" }) {
    const [showMore, setShowMore] = useState(false);
    const router = useRouter();
    
    const toggleShowMore = () => {
        setShowMore(!showMore);
    };
    
    return (
        <View style={tw`flex-1 bg-gray-50`}>
            {/* Back button - now using expo-router */}
            <TouchableOpacity
                style={tw`absolute top-12 left-4 z-10`}
                onPress={() => router.replace('/')}
            >
                <Ionicons name="arrow-back" size={28} color="#4B5563" />
            </TouchableOpacity>
            
            <View style={tw`flex-1 items-center justify-center p-4`}>
                <View style={tw`max-w-md w-full p-6 bg-white rounded-lg shadow-md`}>
                    <View style={tw`items-center`}>
                        <Text style={tw`text-2xl font-bold text-gray-800 mb-4`}>
                            Still in Development
                        </Text>
                        
                        <View style={tw`p-4 bg-blue-50 rounded-md mb-4`}>
                            <Text style={tw`text-blue-700`}>
                                This page is currently under development. Please check back later.
                            </Text>
                        </View>
                        
                        <TouchableOpacity 
                            onPress={toggleShowMore}
                            style={tw`flex-row items-center justify-center p-2.5 border border-gray-300 rounded-md w-full`}
                        >
                            <Text style={tw`text-sm font-medium text-gray-600`}>Show {showMore ? 'Less' : 'More'}</Text>
                            <Ionicons 
                                name={showMore ? "chevron-up" : "chevron-down"} 
                                size={16} 
                                color="#4B5563" 
                                style={tw`ml-2`}
                            />
                        </TouchableOpacity>
                        
                        {showMore && (
                            <View style={tw`mt-4 p-4 bg-gray-50 rounded-md`}>
                                <Text style={tw`text-gray-600 text-sm`}>{extraText}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
}
