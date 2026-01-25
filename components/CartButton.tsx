import { images } from '@/constants/icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const CartButton = () => {
    // Hardcode the total number of cart items temporarily
    const totalItems = 10;
    
    return (
        <TouchableOpacity 
            className='cart-btn' 
            onPress={() => {}}
        >
            {/* Cart Icon */}
            <Image source={images.bag} className='size-5' resizeMode='contain' />

            {totalItems > 0 && (
                <View className='cart-badge'>
                    <Text className='small-bold text-white'>{totalItems}</Text>
                </View>
            )}
        </TouchableOpacity>
    )
}

export default CartButton