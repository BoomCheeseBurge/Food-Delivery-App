import CartButton from "@/components/CartButton";
import Dropdown from "@/components/Dropdown";
import { offers } from "@/constants";
import { images } from "@/constants/icons";
import { getMenuCategory } from "@/lib/appwrite";
import seed from "@/lib/seed";
import useAppwrite from "@/lib/useAppwrite";
import useAuthStore from "@/store/auth.store";
import cn from "clsx";
import { router } from "expo-router";
import { Fragment } from "react";
import { Button, FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
 
export default function Index() {

    const { user } = useAuthStore();

    // console.log("USER: ", JSON.stringify(user, null, 2));

    // Retrieve menu categories
    const { data: categories } = useAppwrite({
        fn: getMenuCategory
    });
        
    // Set which menu category to filter
    const handlePress = (name: string) => {

        // Find the Appwrite object where 'name' matches our local 'item.category'
        const categoryMatch = categories!.find(
            (cat) => cat.name === name
        );

        // Get the ID from the match
        const categoryId = categoryMatch ? categoryMatch.$id : null;

        // Navigate to the search page if category ID exist
        if (categoryId) {

            router.push({
                pathname: '/search',
                params: { category: categoryId }
            });
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50" >
            {/* Recommended Menu */}
            <FlatList
                data={offers}
                ListHeaderComponent={() => (
                    // Header Navigation
                    <View className="flex-between flex-row w-full my-5" >
                        <View className="flex-start z-50" >
                            <Text className="small-bold text-primary" >DELIVER TO</Text>

                            <Dropdown />
                        </View>

                        <Button title="Seed DB" onPress={() => seed().catch((error) => console.error('Failed to seed the database.', error))} />

                        <CartButton />
                    </View>
                )}
                renderItem={({item, index}) => {

                    return (
                        <View>
                            <Pressable 
                                className={cn("offer-card", (index % 2 == 0) ? 'flex-row-reverse' : 'flex-row')} 
                                style={{ backgroundColor: item.color }}
                                onPress={() => handlePress(item.category)}
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
                removeClippedSubviews={false}
                ListHeaderComponentStyle={{ zIndex: 999 }}
            />
        </SafeAreaView>
    );
}