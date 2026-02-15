import CartCheckbox from '@/components/CartCheckbox'
import CartItem from '@/components/CartItem'
import CustomButton from '@/components/CustomButton'
import CustomHeader from '@/components/CustomHeader'
import { images } from '@/constants/icons'
import { useCartStore } from '@/store/cart.store'
import { PaymentInfoStripeProps } from '@/type'
import cn from "clsx"
import { Link } from 'expo-router'
import React, { useState } from 'react'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
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

    const [showDropdown, setShowDropdown] = useState(false);
    const [address, setAddress] = useState("Home Address");
    const addresses = ["Home Address", "Work Address", "Custom Address 1", "Custom Address 2"];

    // Get the global state & objects
    const { 
        items, 
        getSelectedTotalPrice, 
        selectedIds,
        toggleSelect,
        toggleAll,
    } = useCartStore();

    // Only calculate checkout for selected items
    const selectedItems = items.filter(item => selectedIds.includes(item.id));

    // Get total number of selected items
    const totalItems = items
        // ensures that if an item is unchecked, it is completely ignored by the counter
        .filter((item) => selectedIds.includes(item.id))
        // ensures that if "Pizza" is selected and the quantity is 3, the counter adds 3 to the total, not just 1
        .reduce((total, item) => total + item.quantity, 0);

    // Get total price of selected items
    const totalPrice = getSelectedTotalPrice();

    // Check if all items are selected
    const isAllSelected = items.length > 0 && selectedIds.length === items.length;

    return (
        <SafeAreaView className='bg-gray-50 h-full'>
            <FlatList 
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <CartItem 
                        item={item}
                        isSelected={selectedIds.includes(item.id)}
                        onToggle={() => toggleSelect(item.id)} 
                    />
                )}
                contentContainerClassName='pb-28 px-5 pt-5'
                ListHeaderComponentStyle={{ zIndex: 999, marginBottom: 30 }}
                ListHeaderComponent={() => (
                    <View className='w-full'>
                        <CustomHeader title='Your Cart' />

                        <View className='flex-row items-center justify-between'>
                            <View className='gap-y-2'>
                                <Text className='text-primary font-quicksand-bold text-sm'>DELIVERY LOCATION</Text>
                                <Text className='font-bold text-xl'>{address}</Text>
                            </View>

                            <TouchableOpacity 
                                className='border-[1px] rounded-3xl border-primary px-5 py-3 mt-2'
                                onPress={() => setShowDropdown(!showDropdown)}
                            >
                                <Text className='text-primary font-medium'>Change Location</Text>
                            </TouchableOpacity>

                            {showDropdown && (
                                <View 
                                    className="absolute top-16 right-0 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-[100]"
                                    style={{ elevation: 20 }}
                                >
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
                                                address === item ? "text-primary font-bold" : "text-dark-100"
                                            )}>
                                                {item}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        {/* Toggle All Selection */}
                        {items.length > 0 && (
                            <View className="flex-row items-center gap-x-2 mt-5">
                                <Text className="paragraph-medium text-gray-200">
                                    {isAllSelected ? "Unselect All" : "Select All"}
                                </Text>
                                <CartCheckbox 
                                    isChecked={isAllSelected} 
                                    onToggle={toggleAll} 
                                />
                            </View>
                        )}
                    </View>
                )}
                ListEmptyComponent={() => (
                    <View className='self-center flex-col justify-center items-center gap-y-2'>
                        <Image source={images.emptyState} className='size-56' resizeMode='contain' />

                        <Text className='font-quicksand-bold text-2xl'>Your Cart is Empty 🛒</Text>

                        <Text className='text-gray-200 font-quicksand-light text-lg'>
                            Find your favorite menu <Link href="/(tabs)/search" className="text-blue-500 underline">here</Link>
                        </Text>
                    </View>
                )}
                ListFooterComponent={() => selectedIds.length > 0 && (
                    <View className='gap-5'>
                        <View className='mt-6 border border-gray-300 p-5 rounded-2xl'>
                            <Text className='h3-bold text-dark-100 mb-5'>
                                Payment Summary
                            </Text>

                            <PaymentInfoStripe 
                                label={`Total items (${totalItems})`} 
                                value={`$${totalPrice.toFixed(2)}`}
                            />

                            <PaymentInfoStripe 
                                label={`Delivery Fee`} 
                                value={`$5.00`}
                            />

                            <PaymentInfoStripe 
                                label={`Discount`} 
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

                            <CustomButton title='Order Now' style='mt-10' disabled={selectedIds.length === 0} />
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

export default Cart