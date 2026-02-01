import useAuthStore from '@/store/auth.store';
import { Redirect, Slot } from 'expo-router';
import React from 'react';

export default function BaseLayout() {

    const { isAuthenticated } = useAuthStore();

    // Redirect to sign in screen
    if(!isAuthenticated)   return <Redirect href="/sign-in" />
    
    return <Slot />
}