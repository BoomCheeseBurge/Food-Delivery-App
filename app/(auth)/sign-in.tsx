import AuthButton from '@/components/AuthButton'
import AuthInput from '@/components/AuthInput'
import { signInUser } from '@/lib/appwrite'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Text, View } from 'react-native'

const SignIn = () => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({ email: '', password: '' });

    const submit = async () => {

        // Ease of reusability
        const { email, password } = form;

        if (!email || !password) return Alert.alert('Missing Field(s)', 'Please enter a valid email address & password.');

        setIsSubmitting(true);

        try {
            // Sign in the user into Appwrite
            await signInUser({
                email,
                password
            });

            // Redirect the user back to home screen
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
                    Don't have an account?
                </Text>

                <Link href="/sign-up" className='base-bold text-primary'>
                    Sign Up
                </Link>
            </View>
        </View>
    )
}

export default SignIn