import { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
// Fix the import - CameraType is now different
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * CameraComponent - A modular camera component with photo preview functionality
 * 
 * Features:
 * - Live camera feed
 * - Camera permissions handling
 * - Take photos
 * - Preview captured photos
 * - Switch between front and back cameras
 * - Retake or confirm photos
 */
const CameraComponent = ({ onPhotoConfirm, onClose }) => {
  // State management
  const [hasCameraPermission, setCameraPermission] = useState(null);
  const [photo, setPhoto] = useState(null);
  // Fix: Use string values directly instead of enum
  const [type, setType] = useState("back");
  const cameraRef = useRef(null);

  // Request camera permissions on component mount
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === "granted");
    })();
  }, []);

  // Toggle between front and back cameras
  const toggleCameraType = () => {
    setType((prevType) =>
      prevType === "back" ? "front" : "back"
    );
  };

  // Capture a photo using the camera reference
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        setPhoto(data.uri);
      } catch (error) {
        console.error("Failed to take picture:", error);
        // Maybe show an error toast/alert here
      }
    }
  };

  // Handle closing the camera component
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // Handle confirming the taken photo
  const handleConfirmPhoto = () => {
    if (onPhotoConfirm && photo) {
      onPhotoConfirm(photo);
    }
    setPhoto(null);
  };

  // Return loading view while checking for camera permissions
  if (hasCameraPermission === null) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-white text-lg">Checking camera permissions...</Text>
      </View>
    );
  }

  // Return error view if camera permissions are denied
  if (hasCameraPermission === false) {
    return (
      <View className="flex-1 bg-black justify-center items-center p-4">
        <Text className="text-white text-lg text-center mb-4">
          No access to camera. Please enable camera permissions in settings.
        </Text>
        <TouchableOpacity 
          className="bg-white py-3 px-6 rounded-lg" 
          onPress={handleClose}
        >
          <Text className="text-black font-medium">Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      {!photo ? (
        // Camera live feed view
        <View className="flex-1">
          <Camera 
            ref={cameraRef} 
            type={type} 
            className="flex-1"
            ratio="16:9" // Optional: Add ratio if needed on certain devices
          >
            <View className="flex-1">
              {/* Top control bar */}
              <View className="flex-row justify-between p-4">
                <TouchableOpacity
                  className="p-3 rounded-full bg-black/50"
                  onPress={handleClose}
                >
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
                
                <TouchableOpacity
                  className="p-3 rounded-full bg-black/50"
                  onPress={toggleCameraType}
                >
                  <Ionicons name="camera-reverse" size={24} color="white" />
                </TouchableOpacity>
              </View>

              {/* Camera capture button */}
              <View className="flex-row justify-center items-center absolute bottom-10 w-full">
                <TouchableOpacity
                  className="w-18 h-18 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center"
                  onPress={takePicture}
                >
                  <View className="w-16 h-16 rounded-full border-2 border-gray-400" />
                </TouchableOpacity>
              </View>
            </View>
          </Camera>
        </View>
      ) : (
        // Photo preview view
        <View className="flex-1">
          <Image
            source={{ uri: photo }}
            className="flex-1 w-full h-full"
            resizeMode="cover"
          />
          
          {/* Photo preview controls */}
          <View className="absolute top-0 left-0 right-0 p-4 flex-row justify-between bg-black/30">
            <Text className="text-white text-lg font-bold">Photo Preview</Text>
          </View>
          
          {/* Action buttons */}
          <View className="absolute bottom-10 w-full flex-row justify-evenly">
            <TouchableOpacity
              className="bg-red-500/80 p-4 rounded-full flex-row items-center"
              onPress={() => setPhoto(null)}
            >
              <Ionicons name="refresh" size={24} color="white" />
              <Text className="text-white ml-2 font-medium">Retake</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="bg-green-500/80 p-4 rounded-full flex-row items-center"
              onPress={handleConfirmPhoto}
            >
              <Ionicons name="checkmark" size={24} color="white" />
              <Text className="text-white ml-2 font-medium">Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CameraComponent;