import useAuthStore from '@/store/auth.store';
import * as Sentry from '@sentry/react-native';
import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";
import "./globals.css";

Sentry.init({
  dsn: 'https://3becdcf090ad18a84d7ce1c74fa36616@o4510809881968640.ingest.de.sentry.io/4510809938329680',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default Sentry.wrap(function RootLayout() {

    const { isLoading, fetchAuthenticatedUser } = useAuthStore();

    const [fontsLoaded, error] = useFonts({
        "Quicksand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
        "Quicksand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
        "Quicksand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
        "Quicksand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
        "Quicksand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
    });

    // Load the fonts as soon as the app is up and running 
    useEffect(() => {
      
        if(error) throw error;
    
        // Hides splash screen once fonts are loaded in the app
        // if(fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded, error]);

    useEffect(() => {
      fetchAuthenticatedUser();
    
    }, []);
    

    if (!fontsLoaded || isLoading) return null;
    
    return <Stack screenOptions={{ headerShown: false }} />;
});