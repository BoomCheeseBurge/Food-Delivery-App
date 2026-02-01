import AuthButton from '@/components/AuthButton'
import AuthInput from '@/components/AuthInput'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Text, View } from 'react-native'

const SignUp = () => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '' });

    const submit = async () => {
        if (!form.name || !form.email || !form.password) return Alert.alert('Missing Field(s)', 'Please enter a valid email address & password.');

        setIsSubmitting(true);

        try {
            Alert.alert('Success', 'You have signed-up successfully!');

            router.replace('/');

        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View className='gap-10 bg-white rounded-lg p-5 mt-5'>
            <AuthInput 
                placeholder='Enter your full name'
                value={form.name}
                onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
                label='Full Name'
            />

            <AuthInput 
                placeholder='Enter your email'
                value={form.email}
                onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
                label='Email'
                keyboardType='email-address'
            />

            <AuthInput 
                placeholder='Enter your password'
                value={form.password}   
                onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
                label='Password'
                secureTextEntry={true}
            />

            <AuthButton 
                title='Sign In'
                isLoading={isSubmitting}
                onPress={submit}
            />

            <View className='flex justify-center mt-5 flex-row gap-2'>
                <Text className='base-regular text-gray-100'>
                    Already have an account?
                </Text>

                <Link href="/sign-in" className='base-bold text-primary'>
                    Sign In
                </Link>
            </View>
        </View>
    )
}

export default SignUp