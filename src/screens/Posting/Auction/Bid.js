import React, {useState, useEffect, useRef} from 'react';
import {View, Image, useWindowDimensions, SafeAreaView, FlatList, Dimensions} from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity, useColor, Text, useLoading, usePopup} from '@src/components';
import {shadowStyle} from '@src/styles';
import Scaffold from '@src/components/Scaffold';
import { Divider } from '@src/styled';
import ListBidder from 'src/components/Posting/ListBidder';
import ModalBid from 'src/components/Modal/ModalBid';

const { width } = Dimensions.get('window');

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const ButtonView = Styled(View)`
    width: 100%;
    paddingHorizontal: 16;
    paddingVertical: 16;
    flexDirection: column;
    alignItems: center;
    justifyContent: space-between;
`;

const EnterButton = Styled(TouchableOpacity)`
    width: 40%;
    height: 45px;
    borderRadius: 120px;
    justifyContent: center;
    alignItems: center;
    paddingHorizontal: 16;
`;

const ContentView = Styled(View)`
    paddingHorizontal: 16;
    flexDirection: column;
    justifyContent: flex-start;
`;

const BalanceView = Styled(View)`
    paddingTop: 16;
    flexDirection: row;
`;

const Example = Styled(View)`
`;

const data = [
    {name: 'Tantri N', bid: 150000},
    {name: 'Galuh M', bid: 145000},
    {name: 'Galih F', bid: 141000},
    {name: 'Widya H', bid: 134000},
    {name: 'Najib B', bid: 130000},
    {name: 'Tantri N', bid: 150000},
    {name: 'Galuh M', bid: 145000},
    {name: 'Galih F', bid: 141000},
    {name: 'Widya H', bid: 134000},
    {name: 'Najib B', bid: 130000},
    {name: 'Tantri N', bid: 150000},
    {name: 'Galuh M', bid: 145000},
    {name: 'Galih F', bid: 141000},
    {name: 'Widya H', bid: 134000},
    {name: 'Najib B', bid: 130000},
];

export default ({ navigation, route }) => {
    const { item } = route.params;

    const [popupProps, showPopup] = usePopup();
    const [loadingProps, showLoading, hideLoading] = useLoading();

    const { Color } = useColor();
    // const prevState = usePreviousState(state);

    const modalBidRef = useRef();

    return (
        <Scaffold
            headerTitle='Detail'
            fallback={false}
            empty={false}
            popupProps={popupProps}
            loadingProps={loadingProps}
        >
            <MainView style={{ backgroundColor: Color.theme}}>
                <ListBidder
                    data={data}
                    item={item}
                />
                <ButtonView
                    style={{ ...shadowStyle, backgroundColor: Color.textInput, justifyContent: 'flex-start', alignItems: 'flex-start',
                        borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                    <Text size={15} lineHeight={17} style={{ color: Color.text }}>Pasang Tawaran</Text>
                    <Divider height={10}/>
                    <View
                        style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <EnterButton 
                            style={{ borderColor: Color.primary, borderWidth: 1}}>
                            <Text size={16} letterSpacing={0.02} color={Color.primary}>+Rp 5.000</Text>
                        </EnterButton>
                        <EnterButton 
                            style={{ borderColor: Color.primary, borderWidth: 1, marginLeft: 10}}>
                            <Text size={16} letterSpacing={0.02} color={Color.primary}>+Rp 10.000</Text>
                        </EnterButton>
                        <TouchableOpacity
                            style={{ width: '15%', backgroundColor: Color.primary, aspectRatio: 1, marginLeft: 10, borderRadius: 120, alignItems:'center', justifyContent:'center'}}
                            onPress={() => {
                                modalBidRef.current.open();
                            }}
                        >
                            <Ionicons name='chevron-up-outline' color={Color.textInput} size={32}/>
                        </TouchableOpacity>
                    </View>
                </ButtonView>
            </MainView>
            <ModalBid
                ref={modalBidRef}
                data={data}
            />
        </Scaffold>
    )
}