import { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import CameraComponent from '../components/CameraComponent';
import { useNavigation } from '@react-navigation/native';

const ScanLeg = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const navigation = useNavigation();
  
  const handlePhotoConfirmed = (photoUri) => {
    setCapturedImage(photoUri);
    setShowCamera(false);
    // Do something with the photo URI
    console.log("Photo captured:", photoUri);
  };
  
  return (
    <View className="flex-1">
      {showCamera ? (
        <CameraComponent 
          onPhotoConfirm={handlePhotoConfirmed}
          onClose={() => setShowCamera(false)}
        />
      ) : (
        <View className="flex-1 justify-center items-center p-4">
          {capturedImage ? (
            <View className="w-full items-center">
              <Image 
                source={{ uri: capturedImage }} 
                className="w-64 h-64 rounded-lg mb-4"
              />
              <Text className="text-lg">Photo captured successfully!</Text>
            </View>
          ) : (
            <Text className="text-lg mb-4">No photo captured yet</Text>
          )}
          
          <TouchableOpacity
            className="bg-blue-500 py-3 px-6 rounded-lg"
            onPress={() => setShowCamera(true)}
          >
            <Text className="text-white font-medium">Open Camera</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ScanLeg;