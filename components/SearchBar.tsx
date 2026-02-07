import { images } from '@/constants/icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';

const SearchBar = () => {
    
    const params = useLocalSearchParams<{ query?: string }>();

    // Set the query state
    const [query, setQuery] = useState(params.query);

    // Handle the menu search
    const handleSearch = (text: string) => {

        // Set displayed search query
        setQuery(text);

        // Clear the search filter when the user deletes everything in the search box (and show all menu)
        if(!text) router.setParams({ query: undefined });
    }

    // Search for a menu
    const handleSubmit = () => {

        // Clean whitespaces before setting the search query
        if(query?.trim()) router.setParams({ query });
    }
    
    return (
        <View className='searchbar'>
            <TextInput 
                className='flex-1 p-5'
                placeholder='Search for your favorite menu ❤️'
                value='query'
                onChangeText={handleSearch}
                onSubmitEditing={handleSubmit}
                placeholderTextColor='#A0A0A0'
                returnKeyType='search'
            />

            {/* Alternative search button instead of pressing search on keyboard */}
            <TouchableOpacity 
                className='pr-5' 
                onPress={() => router.setParams({ query })}
            >
                <Image 
                    source={images.search}
                    className='size-6'
                    resizeMode='contain'
                    tintColor='#5D5F6D'
                />
            </TouchableOpacity>
        </View>
    );
}

export default SearchBar