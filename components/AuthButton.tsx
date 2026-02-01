import { AuthButtonProps } from '@/type';
import cn from "clsx";
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

const AuthButton = ({
    title = 'Click Me',
    onPress,
    style,
    textStyle,
    leftIcon,
    isLoading = false
}: AuthButtonProps) => {



    return (
        <TouchableOpacity
            className={cn('custom-btn', style)}
            onPress={onPress}
        >
            {leftIcon}

            <View className='flex-center flex-row'>
                {isLoading ? (
                    <ActivityIndicator size='small' color='white' />
                ): (
                    <Text className={cn('text-white-100 paragraph-semibold', textStyle)}>
                        {title}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    )
}

export default AuthButton