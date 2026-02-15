import { useCartStore } from '@/store/cart.store'
import { MenuItem } from '@/type'
import { router } from 'expo-router'
import React from 'react'
import { Image, Platform, Text, TouchableOpacity } from 'react-native'

const MenuCard = ({ item: { $id, slug, name, price, image_url }}: { item: MenuItem }) => {
    
    const { addItem } = useCartStore();

    // Handle card press to navigate to property details
    const handleMenuDetail = (id: string) => router.push(`/menu/${id}`);

    return (
        <TouchableOpacity 
            className='menu-card' style={Platform.OS === 'android' ? { elevation: 10, shadowColor: '#878787'} : {}}
            onPress={() => handleMenuDetail(slug)}
        >
            <Image source={{ uri: image_url }} className='size-32 absolute -top-10' resizeMode='contain' />

            <Text 
                className='text-center base-bold text-dark-100 mb-2'
                numberOfLines={1}
            >
                {name}
            </Text>

            <Text className='body-regular text-gray-200 mb-4'>From ${price}</Text>

            <TouchableOpacity onPress={() => addItem(
                { id: $id, name, price, image_url, customizations: [] }, 
                1 // Explicitly quantity
            )}>
                <Text className='paragraph-bold text-primary'>Add to Cart +</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    )
}

export default MenuCard