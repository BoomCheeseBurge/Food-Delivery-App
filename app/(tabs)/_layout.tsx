import { images } from '@/constants/icons';
import useAuthStore from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { TabBarIconProps } from '@/type';
import cn from "clsx";
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Image, Text, View } from 'react-native';

const TabBarIcon = ({ focused, icon, title, badgeCount }: TabBarIconProps) => (

    <View className='tab-icon relative'>
        {/* Badge: Only show on the Cart tab if the count > 0 */}
        {title === 'Cart' && badgeCount !== undefined && badgeCount > 0 && (
            <View 
                className="absolute bg-[#FE8C00] rounded-full px-1 py-0.5 flex items-center justify-center z-10"
                style={{ top: -16, right: 8, elevation: 3 }} // Shadow for Android
            >
                <Text className="text-white font-bold px-1">
                    {badgeCount > 99 ? '99+' : badgeCount}
                </Text>
            </View>
        )}

        <Image source={icon} className='size-7' resizeMode='contain' tintColor={focused ? '#FE8C00' : '#5D5F6D'} />

        <Text className={cn('text-sm font-bold', focused ? 'text-primary' : 'text-gray-200')}>
            {title}
        </Text>
    </View>
);

export default function TabLayout() {

    const { isAuthenticated } = useAuthStore();

    // Select the items array so this component listens for changes
    const items = useCartStore((state) => state.items);

    // Calculate the count based on the observed items
    const cartCount = items.reduce((total, item) => total + item.quantity, 0);

    // Redirect to sign in screen
    if(!isAuthenticated) return <Redirect href="/sign-in" />
    
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    borderTopLeftRadius: 50,
                    borderTopRightRadius: 50,
                    borderBottomLeftRadius: 50,
                    borderBottomRightRadius: 50,
                    marginHorizontal: 20,
                    height: 80,
                    position: 'absolute',
                    bottom: 40,
                    backgroundColor: 'white',
                    shadowColor: '#1a1a1a',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 5
                }
            }}
        >
            <Tabs.Screen 
                name='index'
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused }) => <TabBarIcon title='Home' icon={images.home} focused={focused} />
                }}
            />

            <Tabs.Screen 
                name='search'
                options={{
                    title: 'Search',
                    tabBarIcon: ({ focused }) => <TabBarIcon title='Search' icon={images.search} focused={focused} />
                }}
            />

            <Tabs.Screen 
                name='cart'
                options={{
                    title: 'Cart',
                    tabBarIcon: ({ focused }) => <TabBarIcon title='Cart' icon={images.bag} badgeCount={cartCount} focused={focused} />
                }}
            />

            <Tabs.Screen 
                name='profile'
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ focused }) => <TabBarIcon title='Profile' icon={images.person} focused={focused} />
                }}
            />
        </Tabs>
    );
}