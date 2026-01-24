import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import "./globals.css";

export default function RootLayout() {

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
        if(fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded, error]);

    if (!fontsLoaded && !error) return null;
    
    return <Stack screenOptions={{ headerShown: false }} />;
}
