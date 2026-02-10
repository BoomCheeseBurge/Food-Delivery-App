import { images } from "@/constants/icons";
import { useCartStore } from "@/store/cart.store";
import { CartItemType } from "@/type";
import { Image, Text, TouchableOpacity, View } from "react-native";
import CartCheckbox from "./CartCheckbox";


const CartItem = ({ item, isSelected, onToggle }: { item: CartItemType; isSelected: boolean; onToggle: () => void; }) => {

    // Get the global state
    const { increaseQty, decreaseQty, removeItem } = useCartStore();

    return (
        <View className="cart-item">
            <View className="flex flex-row justify-center items-center gap-x-2">
                <View className="ml-1">
                    {/* Menu Item Checkbox */}
                    <CartCheckbox isChecked={isSelected} onToggle={onToggle} />
                </View>

                {/* Menu Item Image */}
                <View className="cart-item__image">
                    <Image
                        source={{ uri: item.image_url }}
                        className="size-4/5 rounded-lg"
                        resizeMode="cover"
                    />
                </View>

                {/* Menu Item Details */}
                <View>
                    {/* Menu Item Name */}
                    <Text className="base-bold text-dark-100">
                        {item.name}
                    </Text>

                    {/* Menu Item Price */}
                    <Text className="paragraph-bold text-primary mt-1">
                        ${item.price}
                    </Text>

                    {/* Menu Item Quantity */}
                    <View className="flex flex-row items-center gap-x-4 mt-2">
                        {/* Decrease Quantity */}
                        <TouchableOpacity
                            onPress={() => decreaseQty(item.id, item.customizations!)}
                            className="cart-item__actions"
                        >
                            <Image
                                source={images.minus}
                                className="size-1/2"
                                resizeMode="contain"
                                tintColor={"#FF9C01"}
                            />
                        </TouchableOpacity>

                        {/* Total Quantity for this specific item */}
                        <Text className="base-bold text-dark-100">{item.quantity}</Text>

                        {/* Increase Quantity */}
                        <TouchableOpacity
                            onPress={() => increaseQty(item.id, item.customizations!)}
                            className="cart-item__actions"
                        >
                            <Image
                                source={images.plus}
                                className="size-1/2"
                                resizeMode="contain"
                                tintColor={"#FF9C01"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Remove this specific item from the cart */}
            <TouchableOpacity
                onPress={() => removeItem(item.id, item.customizations!)}
                className="flex-center mb-1"
            >
                <Image source={images.trash} className="size-5" resizeMode="contain" />
            </TouchableOpacity>
        </View>
    );
};

export default CartItem;