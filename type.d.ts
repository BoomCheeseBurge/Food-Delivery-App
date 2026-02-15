import { Models } from "react-native-appwrite";

interface AuthInputProps {
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    label: string;
    secureTextEntry?: boolean;
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}

interface CustomButtonProps {
    onPress?: () => void;
    title?: string;
    style?: string;
    leftIcon?: React.ReactNode;
    textStyle?: string;
    isLoading?: boolean;
    disabled?: boolean;
}

interface CreateUserParams {
    email: string;
    password: string;
    name: string;
}

interface SignInParams {
    email: string;
    password: string;
}

export interface User extends Models.DefaultRow {
    name: string;
    email: string;
    avatar: string;
}

// -----------

interface TabBarIconProps {
    focused: boolean;
    icon: ImageSourcePropType;
    title: string;
}

// -----------

interface GetMenuParams {
    category?: string;
    query?: string;
    limit?: number;
}

interface GetMenuCategoryParams {
    slug?: string;
    limit?: number;
    select?: string[];
}

export interface MenuItem extends Models.DefaultRow {
    name: string;
    slug: string;
    price: number;
    image_url: string;
    description: string;
    calories: number;
    protein: number;
    rating: number;
    type: string;
}

export interface Category extends Models.DefaultRow {
    name: string;
    description: string;
}

export interface SelectionListProps {
    title: string;
    selections: SelectionItemProps[];
    wrapperStyle?: string;
    imageStyle?: string;
    handleIncreaseCount: (item: Omit<CartCustomization, "quantity">) => void;
    handleDecreaseCount: (id: string) => void;
}

export interface SelectionItemProps {
    id: string;
    name: string;
    type: string;
    price: number;
    quantity: number;
    imageKey: string;
    imageStyle?: string;
    handleIncreaseCount: (item: Omit<CartCustomization, "quantity">) => void;
    handleDecreaseCount: (id: string) => void;
}

// -----------

export interface CartCustomization {
    id: string;
    name: string;
    price: number;
    type: string;
    quantity: number;
}

export interface CartItemType {
    id: string; // menu item id
    name: string;
    price: number;
    image_url: string;
    quantity: number;
    customizations?: CartCustomization[];
}

export interface CartStore {
    items: CartItemType[];
    selectedIds: string[];
    addItem: (item: Omit<CartItemType, "quantity">, quantityToAdd?: number) => void;
    removeItem: (id: string, customizations: CartCustomization[]) => void;
    increaseQty: (id: string, customizations: CartCustomization[]) => void;
    decreaseQty: (id: string, customizations: CartCustomization[]) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    toggleSelect: (id: string) => void;
    toggleAll: () => void;
    getSelectedTotalPrice: () => number;
}

interface CustomHeaderProps {
    title?: string;
}

interface PaymentInfoStripeProps {
    label: string;
    value: string;
    labelStyle?: string;
    valueStyle?: string;
}

// -----------

interface ProfileFieldProps {
    label: string;
    value: string;
    icon: ImageSourcePropType;
}
