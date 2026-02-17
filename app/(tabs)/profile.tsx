import CustomHeader from '@/components/CustomHeader'
import { images } from '@/constants/icons'
import { signOutUser } from '@/lib/appwrite'
import useAuthStore from '@/store/auth.store'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const ProfileField = ({ label, value, isEditing, onChangeText, iconName }: any) => (
  <View className="mb-6 w-full bg-white p-4 rounded-2xl flex-row items-center gap-x-5">
    <View className='bg-primary/5 rounded-xl self-center p-3'>
        <Image source={images[iconName as keyof typeof images]} className='size-8 ' />
    </View>

    <View>
        <Text className="text-gray-500 font-quicksand-semibold mb-1">{label}</Text>
        
        {isEditing ? (
            <TextInput
                className="text-lg text-black font-quicksand-bold border-b border-primary py-1"
                value={value}
                onChangeText={onChangeText}
                autoFocus={label === "Full Name"} // Optional: focus first field
            />
        ) : (
            <Text className="text-lg text-black font-quicksand-bold">{value}</Text>
        )}
    </View>
  </View>
);

const Profile = () => {

    const { user } = useAuthStore();

    // Show/hide profile edit form
    const [isEditing, setIsEditing] = useState(false);

    // Profile form data
    const [formData, setFormData] = useState({
        fullName: user?.name || "Fullname Not Found",
        email: user?.email || "Email Not Found",
        phoneNumber: user?.phone || "Phone Not Found",
        address1: user?.address1 || "Address 1 Not Found",
        address2: user?.address2 || "Address 2 Not Found"
    });

    const handleToggleEdit = () => {
        if (isEditing) {
        // Logic to save data to Appwrite would go here
            console.log("Saving data:", formData);
        }
        setIsEditing(!isEditing);
    };

    const handleLogout = async () => {

        const result = await signOutUser();

        if (result) {
            // IMPORTANT: Manually reset your store to stop API calls
            useAuthStore.getState().setUser(null);
            useAuthStore.getState().setIsAuthenticated(false);

            Alert.alert('Success', 'You have been logged out successfully.');
            
            // Re-direct to sign-in page
            router.replace('/(auth)/sign-in');
        } else {
            Alert.alert('Error', 'Logout failed. You might already be logged out.');
            // Still redirect to clear the UI
            router.replace('/(auth)/sign-in');
        }
    };

    return (
        <SafeAreaView className='bg-gray-50 h-full w-full'>
            <ScrollView className='p-5'>
                <CustomHeader title='Profile' />

                <View className='mb-14 w-full relative'>
                    <Image source={user?.avatar ? { uri: user.avatar } : images.avatar} className='size-32 self-center rounded-full' />

                    <TouchableOpacity 
                        onPress={() => {}}
                        className='bg-primary p-2 rounded-full self-center absolute right-32 bottom-0'
                    >
                        <Image source={images.pencil} className='size-5' />
                    </TouchableOpacity>
                </View>

                <View className='mb-5'>
                    <ProfileField 
                        label="Full Name" 
                        value={formData.fullName} 
                        isEditing={isEditing}
                        onChangeText={(text: string) => setFormData({ ...formData, fullName: text })}
                        iconName="user"
                    />
   
                    <ProfileField 
                        label="Email" 
                        value={formData.email} 
                        isEditing={isEditing}
                        onChangeText={(text: string) => setFormData({ ...formData, fullName: text })}
                        iconName="envelope"
                    />
 
                    <ProfileField 
                        label="Phone number" 
                        value={formData.phoneNumber} 
                        isEditing={isEditing}
                        onChangeText={(text: string) => setFormData({ ...formData, fullName: text })}
                        iconName="phone"
                    />

                    <ProfileField 
                        label="Address 1 - (Home)" 
                        value={formData.address1} 
                        isEditing={isEditing}
                        onChangeText={(text: string) => setFormData({ ...formData, fullName: text })}
                        iconName="location"
                    />

                    <ProfileField 
                        label="Address 2 - (Work)" 
                        value={formData.address2} 
                        isEditing={isEditing}
                        onChangeText={(text: string) => setFormData({ ...formData, fullName: text })}
                        iconName="location"
                    />
                </View>

                <View className='gap-y-3 mb-44'>
                    <TouchableOpacity 
                        onPress={handleToggleEdit} 
                        className='rounded-full border-2 border-primary bg-orange-100 px-4 py-3'
                    >
                        <Text className='text-lg font-quicksand-bold text-primary text-center'>{isEditing ? "Save Changes" : "Edit Profile"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={handleLogout} 
                        className='rounded-full border-2 border-red-600 gap-x-2 bg-red-100 px-4 py-3 flex-row justify-center items-center'
                    >
                        <Image source={images.logout} className='size-8' />

                        <Text className='text-lg font-quicksand-bold text-red-600 text-center'>Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Profile