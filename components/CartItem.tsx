import { images } from "@/constants/icons";
import { useCartStore } from "@/store/cart.store";
import { CartItemType } from "@/type";
import { useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import CartCheckbox from "./CartCheckbox";


const CartItem = ({ item, isSelected, onToggle }: { item: CartItemType; isSelected: boolean; onToggle: () => void; }) => {

    // Modal to confirm cart item deletion
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Dropdown to show associated customizations
    const [isExpanded, setIsExpanded] = useState(false);

    // Check if this cart item has customizations
    const hasCustomizations = item.customizations && item.customizations.length > 0;

    // Get the global state
    const { increaseQty, decreaseQty, removeItem } = useCartStore();

    // Handler to show modal
    const showDeleteModalHandler = () => {
        setShowDeleteModal(true);
    }

    return (
        <View className="mb-4">
            <View className="cart-item">

                <View className="flex-row">
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
                        onPress={() => showDeleteModalHandler()}
                        className="flex-center mb-1"
                    >
                        <Image source={images.trash} className="size-5" resizeMode="contain" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    onPress={() => setIsExpanded(!isExpanded)}
                    activeOpacity={0.8}
                    className="bg-white px-4 pt-2 rounded-b-xl w-full"
                >
                    <Text className="text-[10px] font-quicksand-bold text-gray-500 pt-2 uppercase self-end">
                        {isExpanded ? "Hide Customizations ▲" : "View Customizations ▼"}
                    </Text>
                </TouchableOpacity>
            </View>

            {isExpanded && (
                <View className="bg-white pt-2 pb-3 px-4 rounded-b-2xl w-3/4 self-center">
                    {hasCustomizations ? (
                        item.customizations?.map((custom) => (
                            <View key={custom.id} className="flex-row justify-between py-1 border-b border-gray-200 last:border-0">
                                <Text className="text-lg font-quicksand-medium text-gray-600">
                                    • {custom.name} {custom.quantity > 1 ? `(x${custom.quantity})` : '(x1)'}
                                </Text>
                                <Text className="text-lg font-quicksand-bold text-gray-600">
                                    +${(custom.price * custom.quantity).toFixed(2)}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text className="text-xs italic text-gray-400 text-center">
                            No customizations for this menu item
                        </Text>
                    )}
                </View>
            )}

            {/* Cart Item Deletion Modal */}
            <Modal
                visible={showDeleteModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowDeleteModal(false)} // Android back button support
            >
                <View className="flex-1 justify-center items-center bg-black/50 px-8">
                    <View className="bg-white w-full rounded-3xl p-6 items-center shadow-2xl">
                        <View className="size-16 bg-red-50 rounded-full justify-center items-center mb-4">
                            <Image source={images.trash} className="size-8" tintColor="#EF4444" />
                        </View>

                        <Text className="h3-bold text-dark-100 text-center">Remove Item?</Text>
                        
                        <Text className="paragraph-medium text-gray-400 text-center mt-2 mb-8">
                            Are you sure you want to remove <Text className="font-bold text-dark-100">{item.name}</Text>?
                        </Text>

                        <View className="flex-row gap-x-4 w-full">
                            <TouchableOpacity 
                                onPress={() => setShowDeleteModal(false)}
                                className="flex-1 bg-gray-100 py-4 rounded-2xl items-center"
                            >
                                <Text className="base-bold text-white">Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                onPress={() => removeItem(item.id, item.customizations!)}
                                className="flex-1 bg-red-500 py-4 rounded-2xl items-center"
                            >
                                <Text className="base-bold text-white">Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default CartItem;