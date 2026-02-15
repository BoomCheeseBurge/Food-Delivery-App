import { SelectionListProps } from '@/type';
import cn from "clsx";
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import SelectionItem from './SelectionItem';

const SelectionList = ({ 
    title, 
    selections, 
    wrapperStyle, 
    imageStyle, 
    handleIncreaseCount,
    handleDecreaseCount, 
}: SelectionListProps) => {
    
    return (
        <View className={cn(wrapperStyle)}>
            <Text className='text-black font-quicksand-bold text-xl mb-3'>{title}</Text>

            <FlatList
                data={selections}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName='gap-x-10 pb-3 px-2'
                renderItem={({ item }) => {
                    
                    console.log('Item Quantity', item);

                    return (
                    <SelectionItem 
                        {...item}
                        currentCount={item.quantity || 0}
                        imageStyle={imageStyle} 
                        handleIncreaseCount={handleIncreaseCount} 
                        handleDecreaseCount={handleDecreaseCount} 
                    />
                )}}
            />
        </View>
    )
}

export default SelectionList