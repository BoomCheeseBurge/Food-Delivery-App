import CartHeader from '@/components/CartHeader'
import CartItem from '@/components/CartItem'
import CustomButton from '@/components/CustomButton'
import { images } from '@/constants/icons'
import { useCartStore } from '@/store/cart.store'
import { PaymentInfoStripeProps } from '@/type'
import cn from "clsx"
import { Link } from 'expo-router'
import React from 'react'
import { FlatList, Image, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// Reusable component for payment summary section
const PaymentInfoStripe = ({ label,  value,  labelStyle,  valueStyle, }: PaymentInfoStripeProps) => (
    
    <View className="flex-between flex-row my-1">
        <Text className={cn("paragraph-medium text-gray-200", labelStyle)}>
            {label}
        </Text>
        
        <Text className={cn("paragraph-bold text-dark-100", valueStyle)}>
            {value}
        </Text>
    </View>
);

const Cart = () => {

    // Get the global state & objects
    const { items, getTotalItems, getTotalPrice } = useCartStore();

    // Get total number of items
    const totalItems = getTotalItems();
    // Get total price
    const totalPrice = getTotalPrice();

    return (
        <SafeAreaView className='bg-white h-full'>
            <FlatList 
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <CartItem item={item} />}
                contentContainerClassName='pb-28 px-5 pt-5'
                ListHeaderComponent={() => <CartHeader title='Your Cart' />}
                ListEmptyComponent={() => (
                    <View className='self-center flex-col justify-center items-center gap-y-2'>
                        <Image source={images.emptyState} className='size-56' resizeMode='contain' />

                        <Text className='font-quicksand-bold text-2xl'>Your Cart is Empty 🛒</Text>

                        <Text className='text-gray-200 font-quicksand-light text-lg'>
                            Find your favorite menu <Link href="/(tabs)/search" className="text-blue-500 underline">here</Link>
                        </Text>
                    </View>
                )}
                ListFooterComponent={() => totalItems > 0 && (
                    <View className='gap-5'>
                        <View className='mt-6 border border-gray-200 p-5 rounded-2xl'>
                            <Text className='h3-bold text-dark-100 mb-5'>
                                Payment Summary
                            </Text>

                            <PaymentInfoStripe 
                                label={`Total items (${totalItems})`} 
                                value={`$${totalPrice.toFixed(2)}`}
                            />

                            <PaymentInfoStripe 
                                label={`Total items (${totalItems})`} 
                                value={`$5.00`}
                            />

                            <PaymentInfoStripe 
                                label={`Total items (${totalItems})`} 
                                value={`- $0.50`}
                                valueStyle='!text-success'
                            />

                            <View className='border-t border-gray-300 my-2' />

                            <PaymentInfoStripe 
                                label={`Total`} 
                                value={`$${(totalPrice + 5 - 0.5).toFixed(2)}`}
                                labelStyle='base-bold !text-dark-100'
                                valueStyle='base-bold !text-dark-100 !text-right'
                            />

                            <CustomButton title='Order Now' style='mt-10' />
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

export default Cart