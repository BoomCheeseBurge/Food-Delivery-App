import CustomButton from '@/components/CustomButton';
import { images } from '@/constants/icons';
import useAuthStore from '@/store/auth.store';
import { Redirect, router } from 'expo-router';
import React from 'react';
import { Dimensions, Image, ImageBackground, Modal, ScrollView, Text, View } from 'react-native';

const LoginSuccess = () => {

    const { isAuthenticated } = useAuthStore();

    // Redirect to sign in screen
    if(!isAuthenticated) return <Redirect href="/sign-in" />

    const isVisible = true;

    return (
        <View>
            <Modal
                animationType="slide" // "slide up" effect
                transparent={true}
                visible={isVisible}
                onRequestClose={() => {}} // Disables Android back button
            >
                <View className="flex-1 justify-end bg-black/40"> 
                    
                    <View className="bg-white w-full rounded-t-[40px] p-4 pb-12 items-center shadow-lg">
                        {/* Decorative handle at the top of the modal */}
                        <View className="w-20 h-1 bg-gray-100/50 rounded-full mb-8" />

                        <View className='w-full'>
                            <Image source={images.success} className="size-52 mb-6 self-center" resizeMode='contain' />
                        </View>
                        
                        <Text className="text-2xl font-quicksand-bold text-black text-center mb-2">
                            Login Successful
                        </Text>
                        <Text className="text-gray-500 font-quicksand-medium text-center mb-8 px-4">
                            You're all set to continue where you left off.
                        </Text>

                        <CustomButton 
                            title="Go to Homepage" 
                            onPress={() => { router.replace("/") }}
                            textStyle='text-xl'
                        />
                    </View>
                </View>
            </Modal>

            {/* Background Content */}
            <ScrollView className='h-full'>
                <View className='w-full relative rounded-e-3xl overflow-hidden' style={{ height: Dimensions.get("screen").height / 2.45 }}>
                    <ImageBackground source={images.holdBurger} className='size-full' resizeMode='stretch' />
                </View>

                <Image source={images.logo} className='self-center size-48 absolute -bottom-16 z-10' />
            </ScrollView>
        </View>
    )
}

export default LoginSuccess