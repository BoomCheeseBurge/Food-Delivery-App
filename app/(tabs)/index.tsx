import CartButton from "@/components/CartButton";
import { offers } from "@/constants";
import { images } from "@/constants/icons";
import useAuthStore from "@/store/auth.store";
import cn from "clsx";
import { Fragment } from "react";
import { FlatList, Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
 
export default function Index() {

    const { user } = useAuthStore();

    // console.log("USER: ", JSON.stringify(user, null, 2));

    return (
        <SafeAreaView className="flex-1 bg-white" >
            {/* Recommended Menu */}
            <FlatList
                data={offers}
                ListHeaderComponent={() => (
                    // Header Navigation
                    <View className="flex-between flex-row w-full my-5" >
                        <View className="flex-start" >
                            <Text className="small-bold text-primary" >DELIVER TO</Text>

                            <TouchableOpacity className="flex-center flex-row gap-x-1 mt-0.5" >
                                <Text className="paragraph-bold text-dark-100" >Croatia</Text>

                                <Image source={images.arrowDown} className="size-3" resizeMode="contain" />
                            </TouchableOpacity>
                        </View>

                        <CartButton />
                    </View>
                )}
                renderItem={({item, index}) => {

                    return (
                        <View>
                            <Pressable 
                                className={cn("offer-card", (index % 2 == 0) ? 'flex-row-reverse' : 'flex-row')} 
                                style={{ backgroundColor: item.color }}
                                onPress={() => {}}
                                android_ripple={{ color: 'rgba(0, 0, 0, 0.2)', foreground: true }}
                            >
                                {() => (
                                    <Fragment>
                                        <View className="h-full w-1/2">
                                            <Image source={item.image} className="size-full" resizeMode="contain"/>
                                        </View>

                                        <View className={cn("offer-card_info", (index % 2 == 0) ? 'pl-10' : 'pr-10')}>
                                            <Text className="h1-bold text-white leading-tight">
                                                {item.title}
                                            </Text>

                                            <Image 
                                                source={images.arrowRight} 
                                                className="size-10" 
                                                resizeMode="contain" 
                                                tintColor='#ffffff'
                                            />
                                        </View>
                                    </Fragment>
                                )}
                            </Pressable>
                        </View>
                    )
                }}
                contentContainerClassName="pb-28 px-5"
            />
        </SafeAreaView>
    );
}