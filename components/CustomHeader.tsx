import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { images } from "@/constants/icons";
import { CustomHeaderProps } from "@/type";

const CustomHeader = ({ title }: CustomHeaderProps) => {
    
    const router = useRouter();

    return (
        <View className="custom-header">
            <TouchableOpacity 
                onPress={() => router.back()}
                activeOpacity={0.7}
                className="h-10 w-10 items-center justify-center rounded-full active:bg-primary"
                style={{ overflow: 'hidden' }}
            >
                <Image 
                    source={images.arrowBack}
                    className="size-5" 
                    resizeMode="contain"
                />
            </TouchableOpacity>

            {title && <Text className="base-semibold text-dark-100">{title}</Text>}

            <TouchableOpacity 
                onPress={() => router.replace('/(tabs)/search')}
                activeOpacity={0.7}
                className="h-10 w-10 items-center justify-center rounded-full active:bg-primary"
                style={{ overflow: 'hidden' }}
            >
                <Image 
                    source={images.search}
                    className="size-5" 
                    resizeMode="contain"
                />
            </TouchableOpacity>
        </View>
    );
};

export default CustomHeader;