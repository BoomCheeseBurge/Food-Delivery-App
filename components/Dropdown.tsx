import { images } from '@/constants/icons';
import cn from "clsx";
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const Dropdown = () => {

    const [showDropdown, setShowDropdown] = useState(false);
    const [address, setAddress] = useState("Home Address");

    /**
     * Still don't know whether to let users add custom addresses or limit the number of addresses
     * OR
     * Keep these Home Address and Work Address as default and let users decide whether to use one of those or search for a new address
     */
    const addresses = ["Home Address", "Work Address", "Custom Address 1", "Custom Address 2"];

    return (
        <View className="z-50"> 
            <TouchableOpacity 
                className="flex-center flex-row gap-x-1 mt-0.5"
                onPress={() => setShowDropdown(!showDropdown)}
            >
                <Text className="paragraph-bold text-dark-100">{address}</Text>
                <Image 
                    source={images.arrowDown} 
                    className={cn("size-3", showDropdown && "rotate-180")} 
                    resizeMode="contain" 
                />
            </TouchableOpacity>

            {showDropdown && (
                <View className="absolute top-8 left-0 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                    {addresses.map((item) => (
                        <TouchableOpacity 
                            key={item}
                            className="px-4 py-3 active:bg-gray-50"
                            onPress={() => {
                                setAddress(item);
                                setShowDropdown(false);
                            }}
                        >
                            <Text className={cn(
                                "paragraph-medium", 
                                address === item ? "text-primary" : "text-dark-100"
                            )}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    )
}

export default Dropdown