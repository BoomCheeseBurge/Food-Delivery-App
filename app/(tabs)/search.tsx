import CartButton from '@/components/CartButton'
import Filter from '@/components/Filter'
import MenuCard from '@/components/MenuCard'
import SearchBar from '@/components/SearchBar'
import { images } from '@/constants/icons'
import { getMenu, getMenuCategory } from '@/lib/appwrite'
import useAppwrite from '@/lib/useAppwrite'
import { Category, MenuItem } from '@/type'
import cn from "clsx"
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect } from 'react'
import { FlatList, Image, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Search = () => {

    // Expo params
    const { query, category } = useLocalSearchParams<{query: string; category: string}>();

    // Retrieve menu items
    const { data, refetch, loading } = useAppwrite({

        fn: getMenu,
        params: {
            category,
            query,
            // limit: 6
        }
    });

    // Retrieve menu categories
    const { data: categories } = useAppwrite({
        fn: getMenuCategory
    });

    // Refetch the menu items in case of changes to category or query
    useEffect(() => {

      refetch({ 
        category, 
        query, 
        // limit: 6 
    });
    
    }, [category, query]);

    // console.log("Menu: ", JSON.stringify(data, null, 2));
    
    return (
        <SafeAreaView className='bg-gray-50'>
            <FlatList 
                data={data}
                renderItem={({ item, index }) => {

                    const isFirstRightColItem = index % 2 === 0;

                    return (
                        <View className={cn('flex-1 max-w-[48%]', !isFirstRightColItem ? 'mt-10' : 'mt-0')}>
                            <MenuCard item={item as MenuItem} />
                        </View>
                    )
                }}
                keyExtractor={item => item.$id}
                numColumns={2}
                columnWrapperClassName='gap-7'
                contentContainerClassName='gap-7 px-5 pb-32'
                ListHeaderComponent={() => (
                    <View className='my-5 gap-5'>
                        <View className='flex-between flex-row w-full'>
                            <View className='flex-start'>
                                <Text className='small-bold uppercase text-primary'>Search</Text>

                                <View className='flex-start flex-row gap-x-1 mt-0.5'>
                                    <Text className='paragraph-semibold text-dark-100'>
                                        Got a favorite menu on your mind?
                                    </Text>
                                </View>
                            </View>

                            <CartButton />
                        </View>

                        {/* Search Input */}
                        <SearchBar />

                        {/* Filter Menu Category */}
                        <Filter categories={categories as unknown as Category[]} />
                    </View>
                )}
                ListEmptyComponent={() => !loading && (
                    <View className='self-center flex-col justify-center items-center gap-y-2'>
                        <Image source={images.emptyState} className='size-56' resizeMode='contain' />

                        <Text className='font-quicksand-bold text-2xl'>Nothing matched your search</Text>

                        <Text className='text-gray-200 font-quicksand-light text-lg'>
                            Try a different search term or check for typos.
                        </Text>
                    </View>
                )}
            />
        </SafeAreaView>
    )
}

export default Search