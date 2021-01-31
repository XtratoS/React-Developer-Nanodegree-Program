import React from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';

function UdSlider ({ max, unit, step, value, onChange }){
    return (
        <View>
            <Slider
                step={step}
                value={value}
                maximumValue={max}
                minimumValue={0}
                onValueChange={onChange}
            />
            <Text>{value}</Text>
            <Text>{unit}</Text>
        </View>
    )
}

export default UdSlider;