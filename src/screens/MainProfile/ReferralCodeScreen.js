import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  TextInput,
  SafeAreaView,
  Image,
  Keyboard,
  BackHandler,
  useWindowDimensions,
} from 'react-native';
import Styled from 'styled-components';
import Entypo from 'react-native-vector-icons/Entypo';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  Header,
  Text,
  Popup,
  usePopup,
  Loading,
  useLoading,
  Submit,
  TouchableOpacity,
  useColor,
} from '@src/components';
import {TouchSelect} from '@src/components/Form';
import ModalSelectStatus from '@src/components/Modal/ModalSelectStatus';
import validate from '@src/lib/validate';

import Client from '@src/lib/apollo';
import { queryProductManage } from '@src/lib/query';

import {
  iconSplash,
} from '@assets/images';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const LabelInput = Styled(View)`
  width: 100%;
  justifyContent: flex-start;
  alignItems: flex-start;
`;

const EmailRoundedView = Styled(View)`
  width: 100%;
  height: 40px;
  alignItems: flex-start;
  justifyContent: center;
  flexDirection: column;
`;

const CustomTextInput = Styled(TextInput)`
  width: 100%;
  height: 100%;
  fontFamily: Inter-Regular;
  backgroundColor: transparent;
  borderBottomWidth: 1px;
  borderColor: #666666;
  fontSize: 14px;
`;

const ErrorView = Styled(View)`
  width: 100%;
  paddingVertical: 4px;
  alignItems: flex-start;
`;


const ReferralCode = (props) => {
  //   const {navigation, route} = props;
  //   const {params} = route;

  const {height} = useWindowDimensions();
  const {Color} = useColor();

  const [userData, setUserData] = useState({
    code: '',
    name: '',
    image: '',
    status: 'PUBLISH', // PUBLISH | DRAFT | PRIVATE | REMOVE
    method: 'INSERT', // UPDATE | DELETE
    // type: params.productType,
    // category: params.productSubCategory,
    description: '',
  });
  const [error, setError] = useState({
    name: null,
    image: null,
    description: null,
  });
  const [thumbImage, setThumbImage] = useState('');
  const [mimeImage, setMimeImage] = useState('image/jpeg');
  const [selectedStatus, setSelectedStatus] = useState({
    id: 1,
    value: 'PUBLISH',
    iconName: 'globe',
  });

  //   // ref
  //   const modalSelectStatusRef = useRef();

  //   // hooks
  //   const [loadingProps, showLoading, hideLoading] = useLoading();
  //   const [popupProps, showPopup] = usePopup();

  //   useEffect(() => {
  //     BackHandler.addEventListener('hardwareBackPress', handleBackPress);

  //     return () => {
  //       BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
  //     };
  //   }, []);

  //   const handleBackPress = () => {
  //     backToSelectVideo();
  //     return true;
  //   };

  //   const backToSelectVideo = () => {
  //     setThumbImage('');
  //     setMimeImage('image/jpeg');
  //   };

  const isValueError = (name) => {
    const newError = validate(name, userData[name]);
    setError({...error, [name]: newError});
  };

  //   const onChangeUserData = (key, val) => {
  //     setUserData({...userData, [key]: val});
  //   };

  const onSubmit = () => {
    Keyboard.dismiss();

    // if (thumbImage === '') {
    //   showPopup('Silahkan pilih gambar terlebih dulu', 'warning');
    //   return;
    // }

    // if (userData.name === '') {
    //   showPopup('Silahkan isi judul terlebih dulu', 'warning');
    //   return;
    // }

    // if (userData.description === '') {
    //   showPopup('Silahkan isi deskripsi terlebih dulu', 'warning');
    //   return;
    // }

    showLoading();

    // let variables = {
    //   products: [
    //     {
    //       ...userData,
    //       image: thumbImage,
    //     },
    //   ],
    // };

    // console.log(variables, 'variables');

    Client.query({
      query: queryProductManage,
      variables,
    })
      .then((res) => {
        console.log(res, '=== Berhsail ===');
        showLoading('success', 'Thread berhasil dibuat!');

        setTimeout(() => {
          // navigation.navigate('ForumSegmentScreen', {
          //   ...params,
          //   componentType: 'LIST',
          //   refresh: true,
          // });
          navigation.popToTop();
        }, 2500);
      })
      .catch((err) => {
        console.log(err, 'errrrr');
        showLoading('error', 'Gagal membuat thread, Harap ulangi kembali');
      });
  };

  return (
    <MainView style={{backgroundColor: Color.theme}}>
      {/* <Header title={`Buat Thread ${params.title}`} /> */}
      <Header title={`Masuk Komunitas `} />

      <ScrollView>
        {/* <View
          style={{paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12}}>
          <LabelInput>
            <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>
              Gambar
            </Text>
          </LabelInput>
          <TouchableOpacity
            onPress={() => {
              const options = {
                mediaType: 'photo',
                maxWidth: 640,
                maxHeight: 640,
                quality: 1,
                includeBase64: true,
              };

              launchImageLibrary(options, (callback) => {
                setThumbImage(callback.base64);
                setMimeImage(callback.type);
              });
            }}
            style={{
              width: '100%',
              height: 70,
              borderRadius: 4,
              marginTop: 16,
              backgroundColor: Color.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Entypo name="folder-images" size={22} style={{marginBottom: 4}} />
            <Text size={10}>Pilih gambar</Text>
          </TouchableOpacity>
        </View> */}

        {/* {thumbImage !== '' && (
          <TouchableOpacity
            onPress={() => {}}
            style={{
              width: '100%',
              height: height / 3,
              borderRadius: 4,
              alignItems: 'center',
            }}>
            <Image
              style={{
                height: '100%',
                aspectRatio: 1,
                borderRadius: 4,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              source={{uri: `data:${mimeImage};base64,${thumbImage}`}}
            />
          </TouchableOpacity>
        )} */}
        <View style={{ marginLeft:15 }}>
              <Image source={iconSplash} style={{width: 80, height: 40}} resizeMode='contain' />
            </View>
        <View style={{paddingHorizontal: 16}}>
          <LabelInput>
            <Text
              size={12}
              letterSpacing={0.08}
              style={{
                opacity: 0.6,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              Masukan Code
            </Text>
          </LabelInput>
          <EmailRoundedView>
            <CustomTextInput
              placeholder=""
              keyboardType="default"
              placeholderTextColor={Color.gray}
              underlineColorAndroid="transparent"
              autoCorrect={false}
              //   onChangeText={(text) => onChangeUserData('name', text)}
              selectionColor={Color.text}
              //   value={userData.name}
              onBlur={() => isValueError('name')}
              style={{color: Color.text}}
            />
          </EmailRoundedView>
          <ErrorView>
            {/* <Text type='medium' color={Color.error}>error</Text> */}
          </ErrorView>
        </View>

        {/* <View style={{paddingHorizontal: 16, paddingTop: 24}}>
          <LabelInput>
            <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>
              Deskripsi
            </Text>
          </LabelInput>
          <EmailRoundedView>
            <CustomTextInput
              placeholder=""
              keyboardType="default"
              placeholderTextColor={Color.gray}
              underlineColorAndroid="transparent"
              autoCorrect={false}
              //   onChangeText={(text) => onChangeUserData('description', text)}
              selectionColor={Color.text}
              //   value={userData.description}
              onBlur={() => isValueError('description')}
            />
          </EmailRoundedView>
          <ErrorView>
            <Text type="medium" color={Color.error}>
              error
            </Text>
          </ErrorView>
        </View> */}

        {/* <TouchSelect
          title="Siapa yang dapat melihat ini?"
          value={userData.status}
          iconName={selectedStatus.iconName}
          onPress={() => modalSelectStatusRef.current.open()}
        /> */}
      </ScrollView>

      <Submit
        buttonLabel="Lanjutkan"
        buttonColor={Color.green}
        type="bottomSingleButton"
        buttonBorderTopWidth={0.5}
        onPress={() => {
          onSubmit();
        }}
      />

      {/* <Loading {...loadingProps} /> */}

      {/* <Popup {...popupProps} /> */}

      {/* <ModalSelectStatus
        ref={modalSelectStatusRef}
        selected={selectedStatus}
        onPress={(e) => {
          onChangeUserData('status', e.value);
          setSelectedStatus(e);
          modalSelectStatusRef.current.close();
        }}
      /> */}
    </MainView>
  );
};

export default ReferralCode;
