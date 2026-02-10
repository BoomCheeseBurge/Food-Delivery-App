import React from 'react';
import BouncyCheckbox from "react-native-bouncy-checkbox";

const CartCheckbox = ({ isChecked, onToggle }: { isChecked: boolean; onToggle: () => void; }) => {
    
    return (
        <BouncyCheckbox 
            isChecked={isChecked}
            onPress={onToggle}
            fillColor='#FE8C00'
            unFillColor="#FFFFFF"
            iconStyle={{ borderColor: "#FE8C00", borderRadius: 5 }} 
            innerIconStyle={{ 
                borderColor: "#FE8C00",
                borderRadius: 5,
                borderWidth: 2
            }}
            size={25}
        />
    )
}

export default CartCheckbox