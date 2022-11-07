import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, Image, Modal, SafeAreaView, TextInput, TouchableOpacity, Switch } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import DatePicker from 'react-native-date-picker';
import { connect, useDispatch, useStore } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useNavigation, useRoute } from '@react-navigation/native';
import RNFetchBlob from 'react-native-blob-util';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DocumentPicker from 'react-native-document-picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNSimpleCrypto from "react-native-simple-crypto";
import { initialLatitude, initialLongitude } from 'src/utils/constants';

import {
    Text,
    useLoading,
    Scaffold,
    Row,
    Col,
    useColor,
    Header,
    Button
} from '@src/components';
import ImagesPath from 'src/components/ImagesPath';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import FormSelect from 'src/components/FormSelect';
import { FormatMoney } from 'src/utils';
import ModalizeVisitor from './ModalizeVisitor';
import { Container, Divider } from 'src/styled';
import imageAssets from 'assets/images';
import { postAPI } from 'src/api-rest/httpService';
import WebViewScreen from 'src/components/WebViewScreen';

const CheckoutEvent = ({ navigation, route }) => {
    const auth = useSelector((state) => state['auth']);

    const dispatch = useDispatch();
    const { params } = route;
    console.log(params, 'paramsss');

    const [listVisitors, setListVisitors] = useState(new Array(1).fill({
        phone: null,
        email: null,
        name: null,
        title: null,
        ktp: null
    }));
    const [currentIndexVisitor, setCurrentIndexVisitor] = useState(0);
    const [isSamaDgPemesan, setIsSamaDgPemesan] = useState(false);
    const [sourceURL, setSourceURL] = useState('');

    const [loadingProps, showLoading, hideLoading] = useLoading();
    const modalVisitorRef = useRef();

    const { Color } = useColor();

    console.log('params.item', params.item);

    const submit = async () => {
        showLoading();

        const body = {
            "event_ticket_id": params.item.id,
            "selected_date": params.selectedDate.format('YYYY-MM-DD'),
            "amount": params.qty,
            "visitor": listVisitors,
        };

        console.log('body', body);

        const result = await postAPI('ticket-order/create', body);
        console.log('result', result);
        if (result.status) {
            showLoading('success', result.message);
            // // navigation.navigate('PaymentScreen', { back: true });
            // navigation.navigate('EventScreen');

            if (result.paymentResponse && result.paymentResponse.data && result.paymentResponse.data.redirect_url) {
                setSourceURL(result.paymentResponse.data.redirect_url);
            } else {
                navigation.navigate('PaymentSucceed');
            }
        } else {
            showLoading('error', result.message);
        }
    };

    const onCloseWebview = (status) => {
        setSourceURL('');
        if (status === 'paymentPaid') navigation.navigate('PaymentSucceed');
        else navigation.navigate('EventScreen', { title: 'EVENT' });
    }

    return (
        <Scaffold
            header={<Header title="Detail Pemesanan" centerTitle={false} />}
            loadingProps={loadingProps}
        >
            <ScrollView>
                <Container paddingHorizontal={16} paddingBottom={16}>
                    <View style={{ backgroundColor: Color.theme, borderWidth: 1, borderColor: Color.primary, paddingVertical: 10 }}>
                        <View style={{ paddingHorizontal: 10 }}>
                            <Container align='center' style={{ flexDirection: 'row' }}>
                                <Image source={{ uri: '' }} style={{ height: 48, width: 48, marginRight: 8, backgroundColor: Color.border }} />
                                <Text type='semibold' align='left'>{params.item.event.title}</Text>
                            </Container>
                        </View>

                        <View style={{ height: 1, backgroundColor: Color.primary, marginVertical: 10 }} />

                        <View style={{ paddingHorizontal: 10 }}>
                            <Row style={{ marginBottom: 4, justifyContent: 'space-between' }}>
                                <Text type='bold' size={11}>{params.item.name}</Text>
                                <Text size={11} color={Color.disabled} type='medium'>{moment(params.selectedDate).format('DD MMM YYYY')}</Text>
                            </Row>

                            <Text size={10} align='left' color={Color.disabled}>{params.qty} Tiket • {params.qty} Pax</Text>
                        </View>

                        <View style={{ height: 1, backgroundColor: Color.primary, marginVertical: 10 }} />

                        <Row style={{ paddingHorizontal: 10 }}>
                            <Row style={{ marginRight: 10, alignItems: 'center' }}>
                                {/* <View style={{ width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginRight: 4 }}>
                                    <Image
                                        source={ImagesPath.refund}
                                        style={{ width: 15, height: 15, tintColor: Color.text }}
                                    />
                                </View> */}
                                <Text size={11}>{params.item.isRefundable ? 'Refundable' : 'Not Refundable'}</Text>
                            </Row>
                            {/* <Row style={{ marginRight: 10, alignItems: 'center' }}>
                                <View style={{ width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginRight: 4 }}>
                                    <Image source={imageAssets.calendar} style={{ width: 16, height: 16 }} />
                                </View>
                                <Text color={Color.text} size={11}>{params.item.reservation ? 'Bisa Reservasi' : 'Tidak Bisa Reservasi'}</Text>
                            </Row> */}
                        </Row>
                    </View>

                    <Divider />

                    <Text type='bold' align='left'>Detail Pemesan</Text>

                    <View style={{ marginTop: 8, padding: 10, borderWidth: 1, borderColor: Color.primary, backgroundColor: Color.theme }}>
                        <Row>
                            <Col>
                                <Text type='bold' align='left'>{auth.user.name}</Text>
                                <Divider height={8} />
                                <Row style={{ alignItems: 'center' }}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center', marginRight: 6 }}>
                                        <Image
                                            source={imageAssets.call}
                                            resizeMode='contain'
                                            style={{ width: 14, height: 14, tintColor: Color.text }}
                                        />
                                    </View>
                                    <Text color={Color.text} size={12}>+{auth.user.phone}</Text>
                                </Row>
                                <Divider height={6} />
                                <Row style={{ alignItems: 'center' }}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center', marginRight: 6 }}>
                                        <Image
                                            source={imageAssets.mail}
                                            style={{ width: 14, height: 14, tintColor: Color.text }} />
                                    </View>
                                    <Text color={Color.text} size={12}>{auth.user.email}</Text>
                                </Row>
                            </Col>
                            <Col size={2} style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                                <AntDesign name='right' size={18} color={Color.text} />
                            </Col>
                        </Row>
                    </View>

                    <Divider />

                    <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text type='bold' align='left'>Detail Pengunjung</Text>
                        <Row style={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Text size={12} color={Color.disabled}>Sama dengan pemesan</Text>
                            <Switch
                                value={isSamaDgPemesan}
                                onValueChange={(val) => {
                                    let newArr = [...listVisitors];
                                    const itemVisitor = {
                                        title: val ? (auth.user.gender === 'male' ? 0 : 1) : null,
                                        name: val ? auth.user.name : null,
                                        phone: val ? auth.user.phone : null,
                                        email: val ? auth.user.email : null,
                                        ktp: val ? auth.user.ktp : null,
                                    }
                                    newArr[0] = itemVisitor;
                                    setListVisitors(newArr);
                                    setIsSamaDgPemesan(val);
                                }}
                                thumbColor={isSamaDgPemesan ? Color.primary : Color.text}
                                trackColor={{
                                    true: Color.border,
                                    false: Color.border,
                                }}
                                style={{
                                    marginLeft: 8,
                                    transform: [{ scaleX: .8 }, { scaleY: .8 }]
                                }}
                            />
                        </Row>
                    </Row>

                    {listVisitors.map((itemVisitor, idx) => {
                        let hisTitle = 'Mr';
                        if (itemVisitor.title === 1) hisTitle = 'Mrs';
                        if (itemVisitor.title === 2) hisTitle = 'Ms';

                        return (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => {
                                    modalVisitorRef.current.open();
                                    setCurrentIndexVisitor(idx);
                                }}
                                style={{
                                    marginTop: 8,
                                    paddingHorizontal: 10,
                                    paddingVertical: 12,
                                    borderWidth: 1,
                                    borderColor: Color.primary,
                                    backgroundColor: Color.theme,
                                }}
                            >
                                <Container align='center' justify='space-between' style={{ flexDirection: 'row' }}>
                                    <Text color={Color.text} type='bold' align='left'>{itemVisitor.name ? `${idx + 1}. ${hisTitle} ${itemVisitor.name}` : `Tiket ${idx + 1} (Pax)`}</Text>
                                    <AntDesign name='right' size={18} color={Color.text} />
                                </Container>
                            </TouchableOpacity>
                        )
                    })}

                    <Divider />

                    <Text type='bold' align='left'>Detail Harga</Text>
                    <View style={{ backgroundColor: Color.border, marginTop: 12, padding: 10 }}>
                        <Row style={{ marginBottom: 8 }}>
                            <Col>
                                <Text size={12} align='left'>Subtotal</Text>
                            </Col>
                            <Col size={4} style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                                <Text size={12} align='left'>{FormatMoney.getFormattedMoney(params.item.price * params.qty)}</Text>
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: 8 }}>
                            <Col>
                                <Text size={12} align='left'>Ppn 10%</Text>
                            </Col>
                            <Col size={4} style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                                <Text size={12} align='left'>{FormatMoney.getFormattedMoney(params.item.ppn)}</Text>
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: 0 }}>
                            <Col>
                                <Text size={12} align='left'>Total</Text>
                            </Col>
                            <Col size={4} style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                                <Text size={12} align='left'>{params.item.price <= 0 ? 'GRATIS' : FormatMoney.getFormattedMoney((params.item.price * params.qty) + params.item.ppn)}</Text>
                            </Col>
                        </Row>
                    </View>

                    <Divider />

                    {/* <Text type='bold' align='left'>Kode Promo</Text>
                    <TouchableOpacity
                        onPress={() => { }}
                        style={{ marginTop: 8, borderWidth: 1, borderColor: Color.primary, paddingHorizontal: 10, paddingVertical: 12 }}
                    >
                        <Container align='center' style={{flexDirection: 'row'}}>
                            <Image
                                source={imageAssets.discount}
                                style={{
                                    width: 20,
                                    height: 16,
                                    marginRight: 12,
                                }}
                            />
                            <Col>
                                <Text color={Color.text} type='bold' align='left' letterSpacing={0.25}>QWERTY</Text>
                            </Col>
                            <Col size={2} style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                                <Text size={12} color={Color.primaryDark} type='medium'>Gunakan</Text>
                            </Col>
                        </Container>
                    </TouchableOpacity> */}
                </Container>
            </ScrollView>

            <Container padding={16}>
                <Button
                    onPress={() => submit()}
                >
                    Pesan Tiket
                </Button>
            </Container>

            <ModalizeVisitor
                ref={modalVisitorRef}
                selected={currentIndexVisitor !== -1 ? listVisitors[currentIndexVisitor] : null}
                onSave={(itemVisitor) => {
                    let newArr = [...listVisitors];
                    newArr[currentIndexVisitor] = itemVisitor;
                    setListVisitors(newArr);
                    modalVisitorRef.current.close();
                }}
                onClose={() => {
                    modalVisitorRef.current.close();
                }}
            />

            <Modal
                transparent
                animationType="fade"
                onRequestClose={onCloseWebview}
                visible={sourceURL !== ''}
            >
                <WebViewScreen
                    url={sourceURL}
                    onClose={onCloseWebview}
                />
            </Modal>
        </Scaffold>
    )
}

export default CheckoutEvent