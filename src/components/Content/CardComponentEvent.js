import React, { useState, useEffect } from 'react';
import { View, Image, useWindowDimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Moment from 'moment';
import { useNavigation } from '@react-navigation/native';

import {
    Text,
    TouchableOpacity,
    useColor,
} from '@src/components';
import { shadowStyle } from '@src/styles';

import Client from '@src/lib/apollo';
import { queryAddLike } from '@src/lib/query';

import {
    iconLocation,
    iconCategory,
    iconComment,
    iconLiked,
    iconLike,
    iconverify,
    iconTempat
} from '@assets/images/home';
import { Container, Divider, Row } from 'src/styled';
import { analyticMethods, GALogEvent } from 'src/utils/analytics';
import { useSelector } from 'react-redux';
import CardComponentYoutube from './CardComponentYoutube';
import CardComponentVideo from './CardComponentVideo';
import { FormatMoney } from 'src/utils';
import { accessClient } from 'src/utils/access_client';

const defaultProps = {
    productCategory: '',
    onPress: () => { },
    numColumns: 1,
    horizontal: false,
    style: {},
};

const CardComponentEvent = ({ productCategory, item, numColumns, onPress, horizontal, style }) => {
    const [like, setLike] = useState(item.like);
    const [im_like, setImLike] = useState(item.im_like);
    const [trigger, setTrigger] = useState(false);

    const { Color } = useColor();
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    const user = useSelector(state => state['user.auth'].login.user);

    useEffect(() => {
        setLike(item.like);
        setImLike(item.im_like);
    }, [item]);

    useEffect(() => {
        const timeout = trigger ? setTimeout(() => {
            fetchAddLike();
        }, 500) : null;

        return () => {
            clearTimeout(timeout);
        }
    }, [trigger]);

    const fetchAddLike = () => {
        console.log('trigger emergency');

        Client.query({
            query: queryAddLike,
            variables: {
                productId: item.id
            }
        })
            .then((res) => {
                console.log(res, 'res add like');
                setTrigger(false);
            })
            .catch((err) => {
                console.log(err, 'err add like');
                setTrigger(false);
            });
    }

    const onSubmitLike = () => {
        setLike(!im_like ? like + 1 : like - 1);
        setImLike(!im_like);
        setTrigger(true);
    }

    const isPayProduct = typeof item.price && item.price > 0;
    // const isAdminPost;

    const renderCardEvent = () => {
        let eventDate = !isNaN(parseInt(item.eventDate)) ? parseInt(item.eventDate) : null;
        if (!eventDate) eventDate = !isNaN(parseInt(item.updated_date)) ? parseInt(item.updated_date) : null;

        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('EventDetail', { item });

                    GALogEvent('Event', {
                        id: item.id,
                        product_name: item.productName,
                        user_id: user.userId,
                        method: analyticMethods.view,
                    });
                }}
                style={{
                    width: width / numColumns - (horizontal ? 32 : 16),
                    paddingHorizontal: 8,
                    marginTop: 16,
                    borderRadius: 16,
                    ...style,
                }}
            >
                <View style={{ width: '100%', backgroundColor: Color.textInput, borderRadius: 16 }}>
                    <Image
                        source={{ uri: item.image }}
                        style={{
                            width: '100%',
                            aspectRatio: 3 / 2,
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            borderRadius: 12,
                            backgroundColor: Color.border,
                        }}
                    />

                    {/* hide save */}
                    {/* <View style={{backgroundColor:Color.textInput,width:50,height:50,borderRadius:50,position:'absolute', top: 10, right: 15,}}>
                        <Ionicons name='bookmark-outline' size={25} color={Color.black} style={{position:'absolute',top:10,right:12}} />
                    </View> */}

                    <View style={{ width: '100%', paddingVertical: 8 }}>
                        {/* <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{width: 70, paddingVertical: 4, paddingHorizontal: 16, borderWidth: 0.5, borderRadius: 8, borderColor: Color.primary}}>
                                <Text size={10} color={Color.primary}>{item.productCategory}</Text>
                            </View>
    
                            <Ionicons name='bookmark-outline' size={20} color={Color.primary} />
                        </View> */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text size={10} type="bold" color={Color.success}>Community</Text>

                            <View style={{ flexDirection: 'row' }}>
                                <Text size={12} align='left' numberOfLines={1}>{item.fullname}</Text>
                                {/* hide is admin */}
                                {/* <Image
                                    style={{ height: 16, width: 16, marginLeft: 4 }}
                                    source={iconverify}
                                /> */}
                            </View>
                        </View>

                        <View style={{ paddingTop: 8, width: '100%' }}>
                            <Text type='bold' align='left' numberOfLines={2}>{item.productName}</Text>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name='calendar-outline' size={18} color={Color.grey} style={{ marginRight: 5 }} />
                                    {Moment(eventDate).isValid() && <>
                                        <Text type='bold' size={12} align='left' color={Color.grey}>{Moment(eventDate).format('DD MMM YYYY')}</Text>
                                        <Divider height={8} />
                                    </>}
                                </View>

                                {/* hide location */}
                                {/* <View style={{ flexDirection: 'row' }}>
                                    <Image
                                        style={{ height: 17, width: 17, marginLeft: 5, backgroundColor: Color.gray }}
                                        source={iconTempat}
                                    />

                                    <Text type='bold' size={12} align='left' color={Color.grey}>Bandung</Text>
                                    <Divider height={8} />
                                </View> */}

                                {!accessClient.isMobility && <Text
                                    size={17}
                                    type="bold"
                                    align='left'
                                    numberOfLines={1}
                                    color={isPayProduct ? Color.text : Color.success}
                                >
                                    {isPayProduct ? FormatMoney.getFormattedMoney(item.price) : 'Gratis'}
                                </Text>}
                            </View>
                        </View>

                        {/* <View style={{paddingTop: 24, flexDirection: 'row'}}>
                            <Foundation name='calendar' color={Color.yellow} style={{marginRight: 8}} />
                            <Text size={10} align='left'>3 Bulan</Text>
                        </View> */}

                        {/* <View style={{paddingTop: 6, flexDirection: 'row'}}>
                            <Ionicons name='location' color={Color.error} style={{marginRight: 8}} />
                            <Text size={10} align='left'>Cilandak, Jakarta Selatan</Text>
                        </View> */}

                        {/* <View style={{paddingTop: 6, flexDirection: 'row'}}>
                            <Ionicons name='information-circle-outline' color={Color.error} style={{marginRight: 8}} />
                            <Text size={10} align='left'>3 Hari lagi Pendaftaran Ditutup</Text>
                        </View> */}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return renderCardEvent();
}

CardComponentEvent.defaultProps = defaultProps
export default CardComponentEvent;

