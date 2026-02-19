import { images } from '@/constants/icons';
import { SelectionItemProps } from '@/type';
import cn from "clsx";
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const SelectionItem = ({ 
    id, 
    name, 
    type, 
    price, 
    imageKey, 
    imageStyle, 
    handleIncreaseCount, 
    handleDecreaseCount, 
    currentCount = 0
}: SelectionItemProps & { currentCount: number }) => {

    // Increase count of selection item
    const handleIncrease = () => {

        // Update count in menu detail page
        handleIncreaseCount({ id, name, price, type });
    }

    // Increase count of selection item
    const handleDecrease = () => {

        // Update count in menu detail page
        handleDecreaseCount(id);
    }
    
    return (
        <View 
            className='relative bg-white rounded-2xl'
            style={{
                // iOS: Directional Shadow
                shadowColor: "#000",
                shadowOpacity: 0.25,
                shadowRadius: 10,
                
                // Android: Global Shadow
                elevation: 5,
            }}
        >
            <View className='justify-center pt-2 items-center bg-white w-full rounded-2xl absolute top-0 z-40'>
                <Image source={images[imageKey as keyof typeof images]} className={cn(imageStyle)} />
            </View>

            {/* Number of Selection Item */}
            {currentCount > 0 && (
                <View className='rounded-full z-50 bg-red-600 px-3 py-0.5 absolute top-0 -left-2'>
                    <Text className='font-quicksand-semibold text-lg text-white'>
                        {currentCount}
                    </Text>
                </View>
            )}

            <View 
                className={cn('px-2 pt-[90] pb-4 bg-gray-800 flex-row gap-x-3 rounded-2xl justify-center items-center')}
            >
                <TouchableOpacity 
                    onPress={(e) => { e.stopPropagation(); handleDecrease(); }}
                    className="p-1"
                >
                    <Image source={images.minusButton} className="size-5" resizeMode="contain" />
                </TouchableOpacity>

                <Text className='body-medium text-white font-quicksand-semibold'>
                    {name}
                </Text>

                <TouchableOpacity onPress={ (e) => { e.stopPropagation(); handleIncrease(); } }>
                    <Image source={images.plusButton} className='size-6' resizeMode="contain" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SelectionItem