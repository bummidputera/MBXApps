import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, Image, SafeAreaView, TextInput, TouchableOpacity, Switch } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useNavigation, useRoute } from '@react-navigation/native';
import RNFetchBlob from 'rn-fetch-blob';

import AntDesign from 'react-native-vector-icons/AntDesign';
import DocumentPicker from 'react-native-document-picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNSimpleCrypto from "react-native-simple-crypto";
import { initialLatitude, initialLongitude } from 'src/utils/constants';

import {
	Text,
	// TouchableOpacity,
	
	useLoading,
	Scaffold,
	Row,
	Col,
	HeaderBig,
	useColor,
	Header
} from '@src/components';
import ListForum from '@src/screens/MainForum/ListForum';

import { shadowStyle } from '@src/styles';

import Client from '@src/lib/apollo';
import { queryContentProduct } from '@src/lib/query';
import ImagesPath from 'src/components/ImagesPath';
import client from '@src/lib/apollo';
import { mutatuinEventManage } from 'src/lib/query/event';
var crypto = require('crypto-js')

function sha1(data) {
}

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const Content = Styled(View)`
    margin: 16px
    padding: 12px
    borderRadius: 8px
`;

const CreateEventSecond = ({navigation}) => {
    const user = useSelector((state) => state['user.auth'].login.user);
    console.log(user)
	const loading = useSelector((state) => state['user.auth'].loading);
    const route = useRoute();

	const [ loadingProps, showLoading, hideLoading ] = useLoading();
    const [name, setName] = useState(user ? user.firstName+' '+user.lastName : '');
    const [isTicket, setSwitch] = useState();
    const [refresh, setRefresh] = useState('');
    const [tnc, setTnc] = useState('');
    const [refundPolicy, setRefundPolicy] = useState(0);
    const [tickets, setTickets] = useState([{
            name: '',
            quota: 1,
            type: "FREE",
            refund: true,
            reservation: true,
            discountType: null,
            discountValue: 0,
            price: 1,
            userId: user.userId,
            categories: ["REGULER I"]
        }
    ])
	const { Color } = useColor();
    const [coords, setCoords] = useState({
      latitude: initialLatitude,
      longitude: initialLongitude,
    });


  const [openProductUnit, setOpenProductUnit] = useState([false]);
  const [valueProductUnit, setValueProductUnit] = useState(null);
  const [itemsProductUnit, setItemsProductUnit] = useState([
    {label: 'Percentage', value: 'PERCENTAGE'},
    {label: 'Price', value: 'PRICE'},
  ]);


  const [modalSelectMap, setModalSelectMap] = useState(false);
  const [isPinnedMap, setIsPinnedMap] = useState(false);
  const [locationPinnedMap, setLocationPinnedMap] = useState('');

	useEffect( () => {
        // submit()
    }, []);

    const valueproductunits = (value, id) => {
        setValueProductUnit(value)
            console.log(valueProductUnit, value)
            onChange(valueProductUnit,'discountType', id)
    }

    const setOpenProductUnitAct = (value, id) => {
        const tempx = openProductUnit
        tempx[id] = !value
        console.log(tempx, id)
        setOpenProductUnit(tempx)
        setRefresh(refresh + 1);

    }

    const addTicket = () => {
        const temp = tickets;
        const tempb = openProductUnit
        temp.push({
            name: '',
            quota: 1,
            type: "FREE",
            refund: true,
            reservation: true,
            discountType: null,
            discountValue: null,
            price: '',
            userId: user.userId,
            categories: ["REGULER I"]
        })
        tempb.push(false)
        setTickets(temp)
        setOpenProductUnit(tempb)
        setRefresh(refresh + 1);
    }

    const submit = async () => {
        showLoading()
        const updateData = tickets.map(val => {
            return{
                ...val,
                quota: parseFloat(val.quota),
                discountType: null,
                discountValue: parseFloat(val.discountValue),
                price: parseFloat(val.price),
                userId: user.userId,
                categories: ["REGULER I"]
            }
        })
        const variables = {
            type: 'CREATE',
            newEvent: {
                ...route.params.item,
                category: user.isDirector ? "OFFICIAL" : "UNOFFICIAL",
                // refundPolicy: refundPolicy ? 'data:application/pdf;base64,'+refundPolicy : null,
                // tnc: tnc ? 'data:application/pdf;base64,'+tnc : null,
                tickets: updateData
            }
        }
        console.log(variables, "varrr");
        client.mutate({mutation: mutatuinEventManage, variables})
        .then(res => {
            hideLoading();
            console.log(res, "hasil");

            if (res.data.eventManage) {
                alert('Event berhasil dibuat')
                setTimeout(() => {
                    navigation.pop(2)
                }, 1000);
            }
        })
        .catch(reject => {
            hideLoading();
            console.log(reject.message, 'reject');
        });
      };

      const onChange = (value,name, id) => {
        console.log(value, name , id)
        const tempx = tickets
        tickets[id][name] = value
        setTickets(tempx)
        setRefresh(refresh + 1);
        
      }

      const getDocument = async(name) => {
        const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.pdf],
            allowMultiSelection: false,
        });

        console.log(res, 'res get document');

        let objOrigin;
        let uri;

        if (Array.isArray(res) && res.length > 0) {
           
            RNFetchBlob.fs
            .readFile(res[0].uri, 'base64')
            .then((data) => {
                if(name == 'tnc') setTnc(data)
                else setRefundPolicy(data)
            })
            .catch((err) => {});
        }
    }

  return (
    <Scaffold
    loadingProps={loadingProps}
		header={<Header customIcon title="" type="regular" centerTitle={false} />}
		onPressLeftButton={() => navigation.pop()}
	>
        <ScrollView style={{  }}>
            {/* <Text onPress={() => navigation.navigate('Ecommerce')}>E-commerce</Text> */}
            <View style={{flexDirection: 'row',}}>
                <Image source={ImagesPath.survey2} style={{marginHorizontal: 10}}/>
                <View style={{alignItems: 'flex-start', paddingVertical: 5}}>
                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>Tiket Event</Text>
                    <Text style={{fontSize: 10, color: Color.secondary}}>Informasi mengenai tiket dan jumlah pengunjung</Text>
                </View>
            </View>
            <Text style={{fontSize: 10, fontWeight: 'bold', marginTop: 10, marginLeft: 10}} align='left'>Kategori Event</Text>
            {tickets.map((val ,id) => (
                <View key={id} style={{ margin: 10, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#CCC' }}>
                    <Row style={{ marginBottom: 10, alignItems: 'center' }}>
                        <Text size={14} type='semibold' color='#000'>Tiket {id+1}</Text>
                        <Col style={{ alignItems: 'flex-end' }}>
                            <Row style={{ alignItems: 'center' }}>
                                <Text size={10}>Tiket Berbayar</Text>
                                <Switch 
                                    value={val.type == 'PAID' ? true : false}
                                    onChangeText={(val) => console.log(val, 'text')}
                                    onValueChange={(val) => { console.log(val); onChange(val ? 'PAID' : 'FREE','type', id) }}
                                />
                            </Row>
                        </Col>
                    </Row>
                    <View style={{marginBottom: 10}}>
                        <TextInput
                            placeholder='Regulelr A, VIP 1 . . .'
                            style={{
                                borderWidth: 1, borderColor: Color.border, color: Color.text,
                                width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47
                            }}
                            onChangeText={(value) => onChange(value,'name', id)}
                            value={val.name}
                        />
                        <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Nama Tiket</Text>
                    </View>
                    <View  style={{marginBottom: 10}}>
                        <TextInput
                            placeholder='0'
                            keyboardType='numeric'
                            style={{
                                borderWidth: 1, borderColor: Color.border, color: Color.text,
                                width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47
                            }}
                            onChangeText={(value) => onChange(value,'quota', id)}
                            value={val.quota}
                        />
                        <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Kuota Tiket</Text>
                    </View>
                    {val.type == 'PAID' && <View
                        style={{marginBottom: 10, }}>
                        <Text
                        style={{
                            paddingHorizontal: 15,
                            paddingTop: 5,
                            color: Color.secondary,
                            fontSize: 8,
                            fontWeight: '400',
                            textAlign: 'left',
                        }}>
                        Tipe Diskon
                        </Text>
                        <DropDownPicker
                        placeholder="- Pilih Type Diskon -"
                        open={openProductUnit[id]}
                        value={val.discountType}
                        items={itemsProductUnit}
                        setOpen={(vals) => setOpenProductUnitAct(openProductUnit[id], id)}
                        setValue={(val) => valueproductunits(val, id)}
                        setItems={setItemsProductUnit}
                        style={{
                            height: 28,
                            borderWidth: 0,
                            width: '99%',
                            marginHorizontal: 2,
                        }}
                        />
                        <View
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: 47,
                            borderWidth: 1,
                            borderColor: Color.border,
                            borderRadius: 5,
                        }}
                        />
                    </View>}
                    {val.type == 'PAID' && <View  style={{marginBottom: 10}}>
                        <TextInput
                            placeholder='0'
                            keyboardType='numeric'
                            style={{
                                borderWidth: 1, borderColor: Color.border, color: Color.text,
                                width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47
                            }}
                            onChangeText={(value) => onChange(value,'discountValue', id)}
                            value={val.discountValue}
                        />
                        <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Diskon</Text>
                    </View>}
                     <View  style={{marginBottom: 10}}>
                        <TextInput
                            placeholder='0'
                            keyboardType='numeric'
                            style={{
                                borderWidth: 1, borderColor: Color.border, color: Color.text,
                                width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47
                            }}
                            onChangeText={(value) => onChange(value,'price', id)}
                            value={val.price}
                        />
                        <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Harga Tiket</Text>
                    </View>
                    <Text type='semibold' size={10} align='left' style={{marginBottom: 5 }}>Bisa Refund?</Text>
                    <Row style={{ marginBottom: 10 }}>
                        <Row style={{ marginRight: 10 }}>
                            <TouchableOpacity onPress={() => onChange(false,'refund', id)} style={{ borderColor: '#6A7479', borderWidth: 1, width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginRight: 6, borderRadius: 14 }}>
                                {!val.refund && <View style={{ backgroundColor: '#F3771D', width: 14, height: 14, borderRadius: 7 }} />}
                            </TouchableOpacity>
                            <Text color={Color.text}>Tidak</Text>
                        </Row>
                        <Row style={{ marginRight: 10 }}>
                            <TouchableOpacity onPress={() => onChange(true,'refund', id)} style={{ borderColor: '#6A7479', borderWidth: 1, width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginRight: 6, borderRadius: 14 }}>
                                {val.refund && <View style={{ backgroundColor: '#F3771D', width: 14, height: 14, borderRadius: 7 }} />}
                            </TouchableOpacity>
                            <Text color={Color.text}>Ya</Text>
                        </Row>
                    </Row>
                    {/* <Text type='semibold' color={Color.text} size={10} align='left' style={{marginBottom: 5 }}>Bisa Reservasi?</Text>
                    <Row>
                        <Row style={{ marginRight: 10 }}>
                            <TouchableOpacity onPress={() => onChange(false,'reservation', id)} style={{ borderColor: '#6A7479', borderWidth: 1, width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginRight: 6, borderRadius: 14 }}>
                                {!val.reservation && <View style={{ backgroundColor: '#F3771D', width: 14, height: 14, borderRadius: 7 }} />}
                            </TouchableOpacity>
                            <Text color={Color.text}>Tidak</Text>
                        </Row>
                        <Row style={{ marginRight: 10 }}>
                            <TouchableOpacity onPress={() => onChange(true,'reservation', id)} style={{ borderColor: '#6A7479', borderWidth: 1, width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginRight: 6, borderRadius: 14 }}>
                                {val.reservation && <View style={{ backgroundColor: '#F3771D', width: 14, height: 14, borderRadius: 7 }} />}
                            </TouchableOpacity>
                            <Text color={Color.text}>Ya</Text>
                        </Row>
                    </Row> */}
                </View>
            ))}
            <TouchableOpacity onPress={() => addTicket()} style={{borderColor: Color.primary, borderWidth: 3, alignSelf: 'center', width: '95%', height: 50, borderRadius: 50, marginBottom: 16, justifyContent: 'center'}}>
                <Text style={{color: Color.primary}} type='semibold'>Tambah Kategori Lainnya</Text>
            </TouchableOpacity>

            <Text style={{color: Color.text,marginLeft: 10}} align='left' type='semibold'>Kebijakan Refund</Text>
            <TouchableOpacity onPress={() => getDocument('refundPolicy')} style={{ borderWidth: 1, margin: 10, paddingVertical: 23, paddingHorizontal: 13, borderRadius: 8, borderColor: '#CDD1D2' }}>
                <Row>
                    <Col>
                        <Text color='#3C58C1' align='left' size={15} type='medium'>Upload PDF</Text>
                        <Text align='left' size={10}>Ukuran file tidak boleh melebihi 10MB</Text>
                    </Col>
                </Row>
            </TouchableOpacity>

            <Text style={{color: Color.text,marginLeft: 10}} align='left' type='semibold'>Syarat & Ketentuan</Text>
            <TouchableOpacity  onPress={() => getDocument('tnc')} style={{ borderWidth: 1, margin: 10, paddingVertical: 23, paddingHorizontal: 13, borderRadius: 8, borderColor: '#CDD1D2' }}>
                <Row>
                    <Col>
                        <Text color='#3C58C1' align='left' size={15} type='medium'>Upload PDF</Text>
                        <Text align='left' size={10}>Ukuran file tidak boleh melebihi 10MB</Text>
                    </Col>
                </Row>
            </TouchableOpacity>
            
            

        </ScrollView>
        <View style={{width: '100%',  height: 70, alignItems: 'center', borderRadius: 10}}>
            <TouchableOpacity onPress={() => submit()} style={{backgroundColor: Color.primary, width: '90%', height: 45, borderRadius: 50, justifyContent: 'center'}}>
                <Text style={{color: Color.textInput}}>Lanjut</Text>
            </TouchableOpacity>
        </View>
    </Scaffold>
  )
}

export default CreateEventSecond