import CustomButton from '@/components/CustomButton';
import CustomHeader from '@/components/CustomHeader';
import SelectionList from '@/components/SelectionList';
import { images } from '@/constants/icons';
import { getMenuItemBySlug } from '@/lib/appwrite';
import useAppwrite from '@/lib/useAppwrite';
import { useCartStore } from '@/store/cart.store';
import { CartCustomization, CartItemType } from '@/type';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MenuItem = () => {

    // Get menu item ID from URL params
    const { id } = useLocalSearchParams<{ id?: string }>();

    const { addItem } = useCartStore();

    // Retrieve menu categories
    const { data: menuItem } = useAppwrite({
        
        fn: getMenuItemBySlug,
        params: {
            slug: id!
        }
    });

    // Temporary state for menu item and its customization selections (toppings/sides)
    const [selectedItem, setSelectedItem] = useState<Omit<CartItemType, "quantity">>({
        id: "",
        name: "",
        price: 0,
        image_url: "",
        customizations: [],
    });

    // Track quantity of menu item
    const [quantity, setQuantity] = useState(1);

    // Track total price
    const currentTotalPrice = (
        ((menuItem?.price || 0) + 
        (selectedItem.customizations?.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0) || 0)) 
        * quantity
    ).toFixed(2);

    // console.log("Menu Item: ", JSON.stringify(menuItem, null, 2));

    // Create quick lookup for customization quantities based on selected item
    const customizationCounts = Object.fromEntries(
        selectedItem.customizations?.map(c => [c.id, c.quantity]) || []
    );

    // Extract toppings from menu item customizations
    const toppings = useMemo(() => {

        return menuItem?.menuCustomizations
            // Filter to only include customization of type 'topping'
            ?.filter((item: any) => item.customizations?.type === 'topping')
            // Extract the specific fields
            .map((item: any) => ({
                id: item.customizations?.$id, // Extracting the inner customization ID
                name: item.customizations?.name,
                price: item.customizations?.price,
                type: item.customizations?.type,
                imageKey: item.customizations?.imageKey,
                quantity: customizationCounts[item.customizations?.$id] || 0,
        })) || [];
    }, [menuItem, customizationCounts]);

    // Extract side options from menu item customizations
    const sides = useMemo(() => {

        return menuItem?.menuCustomizations
            // Filter to only include customization of type 'side'
            ?.filter((item: any) => item.customizations?.type === 'side')
            // Extract the specific fields
            .map((item: any) => ({
                id: item.customizations?.$id, // Extracting the inner customization ID
                name: item.customizations?.name,
                price: item.customizations?.price,
                type: item.customizations?.type,
                imageKey: item.customizations?.imageKey,
                quantity: customizationCounts[item.customizations?.$id] || 0,
        })) || []; 
    }, [menuItem, customizationCounts]);

    // Handle count increase for a specific customization item (topping/side)
    const handleIncreaseCount = ({ 
        id,
        name,
        price,
        type,
    }: Omit<CartCustomization, "quantity">) => {

        setSelectedItem((prev) => {
            const customizations = prev.customizations || [];
            const existing = customizations.find(c => c.id === id);

            if (existing) {
                // If the customization already exists, just increase the quantity
                return {
                    ...prev,
                    customizations: customizations.map(c => 
                        c.id === id ? { ...c, quantity: (c.quantity || 0) + 1 } : c
                    )
                };
            } else {
                // If it doesn't exist, add it to the customizations array with quantity 1
                return {
                    ...prev,
                    customizations: [
                        ...customizations,
                        { id, name, price, type, quantity: 1 }
                    ]
                };
            }
        });
    };

    // Handle count decrease for a specific customization item (topping/side)
    const handleDecreaseCount = (id: string) => {

        setSelectedItem((prev) => {
            const customizations = prev.customizations || [];
            const existing = customizations.find(c => c.id === id);

            if (!existing) return prev;

            // Remove entirely if quantity is 1 
            if (existing.quantity === 1) {
                return {
                    ...prev,
                    customizations: customizations.filter(c => c.id !== id)
                };
            }

            // Otherwise, decrement the quantity
            return {
                ...prev,
                customizations: customizations.map(c => 
                    c.id === id ? { ...c, quantity: c.quantity - 1 } : c
                )
            };
        });
    };

    // Add the menu item with its customizations to the cart
    const handleAddToCart = () => {

        addItem({  
            id: selectedItem.id, 
            name: selectedItem.name, 
            price: selectedItem.price, 
            image_url: selectedItem.image_url, 
            customizations: selectedItem.customizations }, 
            quantity // Explicitly pass quantity
        );

        // Required guard clause to prevent app from crashing
        if (menuItem) {
            setSelectedItem({
                id: menuItem.$id,
                name: menuItem.name,
                price: menuItem.price,
                image_url: menuItem.image_url,
                customizations: [],
            });

            setQuantity(1); // Reset quantity to 1 after adding to cart
        }

        Alert.alert('Item Added', 'The item has been added to your cart.');
    }

    // Load the menu item details into local state when the data is fetched
    useEffect(() => {

        if (menuItem) {
            setSelectedItem({
                id: menuItem.$id,
                name: menuItem.name,
                price: menuItem.price,
                image_url: menuItem.image_url,
                customizations: [],
            });
        }
    }, [menuItem]);
    
    return (
        <SafeAreaView className='flex-1 bg-gray-50'>
            <ScrollView showsVerticalScrollIndicator={false} className='py-4 px-6'>
                <CustomHeader title='Menu' />

                {/* Menu Item Name */}
                <Text className='font-quicksand-bold text-2xl mb-2'>{menuItem?.name}</Text>

                {/* Menu Item Info */}
                <View className='relative mb-24'>
                    <View>
                        <Text className='font-quicksand-semibold text-gray-400 text-lg'>{menuItem?.categories?.name}</Text>

                        <View className='flex-row gap-x-2 items-center my-4'>
                            <View className='flex-row'>
                                {Array.from({ length: 5 }).map((_, index) => {
                                    // If the index (0-4) is less than the floor of the rating, show filled star
                                    const isFilled = index < Math.floor(menuItem?.rating || 0);

                                    return (
                                        <Image 
                                            key={index}
                                            // Toggle between your filled star and the gray unfilled star
                                            source={isFilled ? images.star : images.starEmpty} 
                                            className="w-5 h-5"
                                        />
                                    );
                                })}
                            </View>

                            <Text className='font-quicksand-semibold text-gray-400 text-lg'>{menuItem?.rating}/5</Text>
                        </View>

                        <Text className='font-quicksand-bold text-2xl text-primary mb-8'>$<Text className='text-black'>{menuItem?.price}</Text></Text>

                        <View className='flex-row gap-x-8'>
                            <View className='gap-y-1'>
                                <Text className='text-gray-400 font-quicksand-semibold'>Calories</Text>

                                <Text className='text-lg text-black font-quicksand-semibold'>{menuItem?.calories} Cal</Text>
                            </View>

                            <View className='gap-y-1'>
                                <Text className='text-gray-400 font-quicksand-semibold'>Protein</Text>

                                <Text className='text-lg text-black font-quicksand-semibold'>{menuItem?.protein}g</Text>
                            </View>
                        </View>

                        {/* <View className='gap-y-2'>
                            <Text className='text-gray-400 font-quicksand-semibold'>Bun Type</Text>

                            <Text className='text-lg text-black'></Text>
                        </View> */}
                    </View>

                    <View 
                        className='self-center absolute -right-6 top-4' 
                        style={{ 
                            width: '50%', // Match the inner width
                            overflow: 'hidden', 
                            paddingBottom: 40 // Only leave room for the bottom shadow
                        }}
                    > 
                        <View 
                            style={{
                                backgroundColor: '#f9fafb',
                                width: '100%', // Now fills the restricted parent
                                height: 200,
                                
                                // iOS: Directional Shadow
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 18 }, 
                                shadowOpacity: 0.25,
                                shadowRadius: 10,
                                
                                // Android: Global Shadow
                                elevation: 20,
                                borderBottomEndRadius: 40,
                                borderBottomStartRadius: 40,
                            }}
                        />
                    </View>

                    {/* Image placed outside/above the clipped container so it isn't cut off */}
                    <Image 
                        source={{ uri: menuItem?.image_url }} 
                        className="size-80 absolute -top-6 -right-20" 
                        resizeMode="contain" 
                    />
                </View>

                {/* Menu Item Delivery Detail */}
                <View className='justify-evenly flex-row mb-10 bg-primary/5 rounded-xl p-3'>
                    <View className='flex-row gap-x-1 items-center'>
                        <Image source={images.dollar} className='size-8' resizeMode='contain' />

                        <Text className='font-quicksand-bold text-base'>Free Delivery</Text>
                    </View>

                    <View className='flex-row gap-x-1.5 items-center'>
                        <Image source={images.clock} className='size-5' resizeMode='contain' />

                        <Text className='font-quicksand-bold text-base'>20 - 30 mins</Text>
                    </View>

                    <View className='flex-row gap-x-1.5 items-center'>
                        <Image source={images.star} className='size-5' resizeMode='contain' />

                        <Text className='font-quicksand-bold text-base'>{menuItem?.rating}</Text>
                    </View>
                </View>

                {/* Menu Item Description */}
                <Text className='font-quicksand-semibold text-gray-400 mb-10'>{menuItem?.description}</Text>

                {/* Menu Item Topping Selection */}
                <SelectionList 
                    title='Toppings' 
                    selections={toppings}
                    wrapperStyle='mb-6' 
                    imageStyle='size-20'
                    handleIncreaseCount={handleIncreaseCount} 
                    handleDecreaseCount={handleDecreaseCount}
                />

                {/* Menu Item Side Selection */}
                <SelectionList 
                    title='Side Options' 
                    selections={sides} 
                    wrapperStyle='mb-8' 
                    imageStyle='size-20' 
                    handleIncreaseCount={handleIncreaseCount}
                    handleDecreaseCount={handleDecreaseCount}
                />

                <View className='mb-12 flex-row items-center justify-center gap-x-10 px-4 w-full bg-white py-4 rounded-2xl' style={{ elevation: 2 }}>
                    <View className='flex-row items-center justify-center gap-x-6'>
                        <TouchableOpacity onPress={() => setQuantity(prev => Math.max(prev - 1, 1))}>
                            <Image source={images.minus} className='size-6' resizeMode='contain' />
                        </TouchableOpacity>

                        <Text className='text-2xl text-black font-quicksand-bold'>{quantity}</Text>

                        <TouchableOpacity onPress={() => setQuantity(prev => Math.min(prev + 1, 99))}>
                            <Image source={images.plus} className='size-6' resizeMode='contain' />
                        </TouchableOpacity>
                    </View>

                    <CustomButton 
                        title={`🛒 Add to cart ($${currentTotalPrice})`} 
                        style='flex-1' 
                        textStyle='text-center text-base'
                        onPress={handleAddToCart} 
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default MenuItem