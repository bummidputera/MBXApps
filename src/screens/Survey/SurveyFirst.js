import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, Image, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
	Text,
	// TouchableOpacity,
	Loading,
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
import CardListProduk from 'src/components/Card/CardListProduct';
import ImagesPath from 'src/components/ImagesPath';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import axios from 'axios';
import moment from 'moment';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const Content = Styled(View)`
    margin: 16px
    padding: 12px
    borderRadius: 8px
`;
const instance =  axios.create({ baseURL: 'http://panel.sw.tribesocial.id', headers: { 'Content-Type': 'application/x-www-form-urlencoded'} });

const SurveyFirst = ({navigation}) => {
    const user = useSelector((state) => state['user.auth'].login.user);
	const loading = useSelector((state) => state['user.auth'].loading);

	const [ loadingProps, showLoading, hideLoading ] = useLoading();
	const { Color } = useColor();

	useEffect(() => {
        getDetail()
    }, []);

    const getDetail = async () => {
        const dataq = {
            "auth": "sha1("+"SURVEY-20220229-163729"+moment().format('YYYY-MM-DD HH:mm:ss')+")", "survey_code": "SURVEY-20220229-163729"+moment().format('YYYY-MM-DD HH:mm:ss'), "timestamps": moment().format('YYYY-MM-DD HH:mm:ss'),
            "data":[{
                "block": "1",
                "index": "0",
                "name": "Nama Penjual",
                "value": "Riyan Sugih"
            },
            {
                "block": "1",
                "index": "1",
                "name": "Lama Berjualan",
                "value": "10 tahun"
            }]
        }
        console.log(dataq, 'dataq')

        const response = await instance.post('/submit-survey', dataq);
        console.log(response, 'response')
        
      };

  return (
    <Scaffold
		header={<Header customIcon title="Survey" type="regular" centerTitle={false} />}
		onPressLeftButton={() => navigation.pop()}
	>
        <ScrollView>
            <View style={{flexDirection: 'row',}}>
                <Image source={ImagesPath.survey1} style={{marginHorizontal: 10}}/>
                <View style={{alignItems: 'flex-start', paddingVertical: 5}}>
                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>Informasi Dasar</Text>
                    <Text style={{fontSize: 10, color: Color.secondary}}>Masukkan indormasi dasar seputar keperluanmu</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <Text style={{fontSize: 10, fontWeight: 'bold', marginVertical: 10}}>Informasi Pribadi</Text>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='Adang Susanyo' style={{borderWidth: 1, borderColor: Color.border,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}></TextInput>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Nama Responden</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='813-1234-5678' style={{borderWidth: 1, borderColor: Color.border,
                        width: '100%', borderRadius: 5, paddingHorizontal: 40, paddingTop: 20, height: 47}}></TextInput>
                    <Text style={{position: 'absolute', marginVertical: 17, marginHorizontal: 10, fontSize: 13}}>+62</Text>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>No Telepon</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='contoh@gmail.com' style={{borderWidth: 1, borderColor: Color.border,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}></TextInput>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Email</Text>
                </View>
            </View>
            {/* informasi petugas */}
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <Text style={{fontSize: 10, fontWeight: 'bold', marginVertical: 10}}>Informasi Petugas</Text>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='Adang Susanyo' style={{borderWidth: 1, borderColor: Color.border,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}></TextInput>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Nama Petugas</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='813-1234-5678' style={{borderWidth: 1, borderColor: Color.border,
                        width: '100%', borderRadius: 5, paddingHorizontal: 40, paddingTop: 20, height: 47}}></TextInput>
                    <Text style={{position: 'absolute', marginVertical: 17,marginHorizontal: 10, fontSize: 13}}>+62</Text>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>No Telepon</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='Adang Susanyo' style={{borderWidth: 1, borderColor: Color.border,
                        width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47}}></TextInput>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Nama Koordinator Kab/Kota</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput placeholder='812-1234-5678' style={{borderWidth: 1, borderColor: Color.border,
                        width: '100%', borderRadius: 5, paddingHorizontal: 40, paddingTop: 20, height: 47}}></TextInput>
                    <Text style={{position: 'absolute', marginVertical: 17,marginHorizontal: 10, fontSize: 13}}>+62</Text>
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>No. Telepon</Text>
                </View>
            </View>
        </ScrollView>
        <View style={{width: '100%', height: 70, alignItems: 'center', borderRadius: 10}}>
            <TouchableOpacity onPress={() => navigation.navigate('SurveySecond')} style={{backgroundColor: Color.primary, width: '90%', height: 45, borderRadius: 50, justifyContent: 'center'}}>
                <Text style={{color: Color.textInput}}>Lanjut</Text>
            </TouchableOpacity>
        </View>
    </Scaffold>
  )
}

export default SurveyFirst