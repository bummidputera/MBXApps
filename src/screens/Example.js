import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';

import {
    useLoading,
    usePopup,
    useColor
} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';

const ExampleScreen = ({ navigation, route }) => {
    const [state, setState] = useState();

    const [popupProps, showPopup] = usePopup();
    const [loadingProps, showLoading] = useLoading();

    const { Color } = useColor();

    const ref = useRef();

    useEffect(() => {

    }, []);

    return (
        <Scaffold
            headerTitle='Example'
            fallback={false}
            empty={false}
            popupProps={popupProps}
            loadingProps={loadingProps}
        >
        </Scaffold>
    )
}

export default ExampleScreen;