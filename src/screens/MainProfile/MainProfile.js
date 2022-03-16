import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  Image,
  useWindowDimensions,
  Linking,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {useDispatch, useSelector} from 'react-redux';
import QRCode from 'react-native-qrcode-svg';
import messaging from '@react-native-firebase/messaging';

import {
  Alert,
  Text,
  Row,
  Col,
  HeaderBig,
  useColor,
  Scaffold,
  useLoading,
} from '@src/components';
import {redirectTo} from '@src/utils';
import {shadowStyle} from '@src/styles';
import {iconSplash, imageCardOrnament} from '@assets/images';
import {Box, Container, Divider} from 'src/styled';
import Clipboard from '@react-native-community/clipboard';
import ModalinputCode from 'src/components/ModalInputCode';
import Client from '@src/lib/apollo';
import { queryOrganizationMemberManage } from '@src/lib/query/organization';
import { getCurrentUserProfile } from 'src/state/actions/user/auth';
import { accessClient } from 'src/utils/access_client';

const MainProfile = ({navigation, route}) => {
  const [modalVirtual, setModalVirtual] = useState(false);
  const [modalInputCode, setModalInputCode] = useState(false);
  const [responseMemberManage, setResponseMemberManage] = useState({
    data: null,
    success: false,
    message: '',
  });

  const dispatch = useDispatch();
  const [loadingProps, showLoading] = useLoading();
  const user = useSelector(state => state['user.auth'].login.user);

  console.log('user', useSelector(state => state['user.auth']));

  const {Color} = useColor();
  const {width} = useWindowDimensions();

  useEffect(() => {
    // hit cuurent user profile
    dispatch(getCurrentUserProfile());
  }, []);

  useEffect(() => {
    if (route.params && route.params.refresh) {
      navigation.setParams({refresh: false});
    }
  }, [route]);

  const onPressExit = () => {
    Alert('Logout', 'Apakah Anda yakin akan logout?', () => onPressLogout());
  };

  const onPressLogout = () => {
    dispatch({type: 'USER.LOGOUT'});
    redirectTo('LoginScreen');
  };

  const fetchOrganizationMemberManage = () => {
    // const variables = {
    //   "userId": user.userId,
    //   "organizationInitialCode": accessClient.InitialCode,
    //   "type": "INSERT"
    // };

    // console.log(variables);

    Client.mutate({
      mutation: queryOrganizationMemberManage,
      // variables,
    }).then((res) => {
      console.log('test', res);

      setModalInputCode(false);

      const data = res.data.organizationMemberManage;

      setResponseMemberManage({
        data: data,
        success: data ? true : false,
        message: '',
      });

      showLoading(
        data ? 'success' : 'error',
        data ? 'Berhasil bergaung ke komunitas ' + data.organization.name : 'Gagal untuk bergabung'
      );

      // hit cuurent user profile
      dispatch(getCurrentUserProfile());
    }).catch((err) => {
      console.log('err', err);

      setResponseMemberManage({
        data: null,
        success: false,
        message: Array.isArray(err.graphQLErrors) && err.graphQLErrors[0].message ? err.graphQLErrors[0].message : 'Terjadi kesalahan'
      });
    });
  }

  const menuList = [
    {
      code: 'history',
      title: 'Riwayat',
      show: user && !user.guest,
      icon: <Ionicons name="receipt-outline" size={20} color={Color.text} style={{}} />,
      // onPress: () => navigation.navigate('ChangeProfile'),
    },
    {
      code: 'coupon',
      title: 'Kuponku',
      show: user && !user.guest,
      icon: <MaterialCommunityIcons name="ticket-confirmation-outline" size={20} color={Color.text} style={{}} />,
      // onPress: () => navigation.navigate('ChangeProfile'),
    },
    {
      code: 'myshop',
      title: 'Toko Saya',
      show: user && !user.guest,
      icon: <MaterialCommunityIcons name="storefront-outline" size={20} color={Color.text} style={{}} />,
      onPress: () => navigation.navigate('MyShopHomepage'),
    },
    {
      code: 'setting',
      title: 'Pengaturan',
      show: user && !user.guest,
      icon: <AntDesign name="setting" size={20} color={Color.text} style={{}} />,
      onPress: () => navigation.navigate('SettingScreen'),
    },
    {
      code: 'critics_opinion',
      title: 'Kritik & Saran',
      show: true,
      icon: <AntDesign name="carryout" size={20} color={Color.text} style={{}} />,
      onPress: () => Linking.openURL('mailto:bummitbs@gmail.com?subject=Kritik dan saran&Body'),
    },
    {
      code: 'help',
      title: 'Bantuan',
      show: true,
      icon: <MaterialCommunityIcons name="headphones" size={20} color={Color.text} style={{}} />,
      onPress: () => Linking.openURL('mailto:bummitbs@gmail.com?subject=Kritik dan saran&Body'),
    },
    {
      code: 'termandcondition',
      title: 'Ketentuan Aplikasi',
      show: true,
      icon: <Ionicons name="md-information-circle-outline" size={20} color={Color.text} style={{}} />,
      // onPress: () => Linking.openURL('mailto:bummitbs@gmail.com?subject=Kritik dan saran&Body'),
    },
    // {
    //   code: 'terms_condition',
    //   title: 'Syarat & Ketentuan',
    //   show: true,
    //   icon: <Ionicons name="newspaper-outline" size={20} color={Color.text} style={{}} />,
    //   onPress: () => navigation.navigate('TermsCondition'),
    // },
    {
      code: 'join_community',
      title: 'Gabung Komunitas',
      show: accessClient.MainProfile.showMenuJoinCommunity && user && !user.organizationId,
      icon: <AntDesign name="form" size={20} color={Color.text} style={{}} />,
      onPress: () => navigation.navigate('JoinCommunity'),
    },
    {
      code: 'community_admin',
      title: 'Community Admin',
      show: accessClient.MainProfile.showMenuJoinCommunity && user && !user.organizationId,
      icon: <AntDesign name="form" size={20} color={Color.text} style={{}} />,
      onPress: () => navigation.navigate('CommunityAdminPage'),
    },
    {
      code: 'ref_code',
      title: 'Kode Referal',
      show: false,
      icon: <AntDesign name="user" size={20} color={Color.text} style={{}} />,
      onPress: () => navigation.navigate('ReferralCodeScreen'),
    },
    {
      code: 'device_token',
      title: 'Device Token',
      show: false,
      icon: <AntDesign name="form" size={20} color={Color.text} style={{}} />,
      onPress: async() => {
        const token = await messaging().getToken();
        Clipboard.setString(token);
        Alert('Berhasil disalin', token);
      },
    },
    {
      code: 'logout',
      title: 'Keluar',
      show: user && !user.guest,
      icon: <Ionicons name="exit-outline" size={20} color={Color.error} style={{}} />,
      onPress: () => onPressExit(),
    },
    {
      code: 'login',
      title: 'Masuk',
      show: user && user.guest,
      icon: <Ionicons name="exit-outline" size={20} color={Color.info} style={{}} />,
      onPress: () => navigation.navigate('LoginScreen'),
    },
    // wekdor
  ];

  return (
    <Scaffold
      loadingProps={loadingProps}
      header={<HeaderBig title="Profile" style={{paddingTop: 16}} />}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {/* <View style={{alignItems: 'center'}}>
          <TouchableOpacity onPress={() => setModalVirtual(true)}>
            <View
              style={{
                padding: 8,
                marginBottom: 8,
                borderRadius: 8,
                backgroundColor: Color.textInput,
                justifyContent: 'center',
                alignItems: 'center',
                ...shadowStyle,
              }}>
              {user && <QRCode value={user.code} />}
              <View
                style={{
                  position: 'absolute',
                  height: 50,
                  width: 50,
                  borderRadius: 25,
                  backgroundColor: Color.textInput,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Ionicons name="person" color={Color.primary} size={35} />
              </View>
            </View>

            {user && !user.guest ? (
              <>
                <Text type="bold" letterSpacing={0.18}>
                  {user.firstName} {user.lastName}
                </Text>
                <Text size={12} letterSpacing={0.18}>
                  {user.userName || '082216981621'}
                </Text>
              </>
            ) : (
              <Text type="bold" letterSpacing={0.18}>
                Halo Tamu, Silakan Login
              </Text>
            )}
          </TouchableOpacity>
        </View> */}

        {/* user fast info */}
        <Container paddingHorizontal={16} marginTop={16}>
          <View
            style={{
              backgroundColor: Color.textInput,
              borderRadius: 8,
              padding: 16,
              ...shadowStyle,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'flex-start',
              }}
            >
              {user && <Image
                source={{ uri: user.photoProfile }}
                style={{
                  width: width * 0.12,
                  height: width * 0.12,
                  backgroundColor: Color.border,
                  borderRadius: 50,
                }}
              />}
            </View>

            <TouchableOpacity
              onPress={() => {
                
              }}
              style={{
                width: '100%',
                marginTop: 16,
                flexDirection: 'row',
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}
              >
                {user && !user.guest ? (
                  <Text
                    type='bold'
                    letterSpacing={0.18}
                  >
                    {user.firstName} {user.lastName}
                  </Text>
                ) : (
                  <Text type="bold" letterSpacing={0.18}>
                    Halo Tamu, Silakan Login
                  </Text>
                )}

                {accessClient.MainProfile.showStatusMember && user && !user.guest && (
                  <Text
                    size={8} 
                    letterSpacing={0.18}
                  >
                    Status Member:&nbsp;
                    <Text
                      size={8}
                      letterSpacing={0.18}
                      color={user.organizationId ? Color.success : Color.error}
                    >
                      {user.organizationId ? 'Anggota ' + user.organizationName : 'Belum Terdaftar'}
                    </Text>
                  </Text>
                )}
              </View>

              {accessClient.MainProfile.showButtonJoinCommunity && user && !user.organizationId && <View
                style={{
                  flex: 1,
                  paddingLeft: 16,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setModalInputCode(true);
                  }}
                  style={{
                    paddingVertical: 10,
                    borderRadius: 120,
                    backgroundColor: Color.primary,
                  }}
                >
                  <Text size={12} type='bold' color={Color.textInput}>Gabung Komunitas</Text>
                </TouchableOpacity>
              </View>}
            </TouchableOpacity>
          </View>
        </Container>
        
        {/* card */}
        <Container paddingHorizontal={16} marginTop={16}>
          <View
            style={{
              width: '100%',
              aspectRatio: 16/9,
              justifyContent: 'space-between',
              backgroundColor: Color.textInput,
              borderRadius: 8,
              padding: 16,
              ...shadowStyle,
            }}
          >
            <Image
              source={imageCardOrnament}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                borderTopRightRadius: 8,
                height: Image.resolveAssetSource(imageCardOrnament).height,
                width: Image.resolveAssetSource(imageCardOrnament).width,
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'flex-start',
              }}
            >
              <Image
                source={iconSplash}
                resizeMode='contain'
                style={{
                  width: width / 6,
                  height: width / 6,
                }}
              />
            </View>

            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View
                style={{
                  alignItems: 'flex-start',
                  justifyContent: 'flex-end',
                }}
              >
                {user && !user.guest ? (
                  <>
                    <Text
                      size={12} 
                      letterSpacing={0.18}>
                      {user.firstName} {user.lastName}
                    </Text>
                    {user.idCardNumber !== '' && user.idCardNumber !== null && <Text
                      type="bold"
                      letterSpacing={0.9}
                      style={{marginTop: 2}}
                    >
                      {user.idCardNumber}
                    </Text>}
                  </>
                ) : (
                  <Text type="bold" letterSpacing={0.18}>
                    Halo Tamu, Silakan Login
                  </Text>
                )}
              </View>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  setModalVirtual(true);
                }}
              >
                <View
                  style={{
                    backgroundColor: Color.textInput,
                    width: width / 6 + 16,
                    height: width / 6 + 16,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...shadowStyle,
                  }}
                >
                  {user && <QRCode
                    value={user.userCode}
                    size={width / 6}
                  />}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Container>

        <Container paddingHorizontal={16}>
          <View
            style={{
              ...shadowStyle,
              backgroundColor: Color.textInput,
              marginHorizontal: 1,
              borderRadius: 8,
              marginBottom: 16,
              marginTop: 16,
              paddingTop: 16,
            }}
          >
            {menuList.map((item, idx) => {
              if (!item.show) return <View key={idx} />;

              return (
                <Container
                  key={idx}
                  paddingHorizontal={16}
                  marginTop={8}
                  marginBottom={16}
                >
                  <TouchableOpacity
                    onPress={() => item.onPress()}
                  >
                    <Row style={{borderBottomWidth: 0.5, borderColor: Color.placeholder, paddingBottom: 16}}>
                      <Col justify="center" size={0.75}>
                        {item.icon}
                      </Col>
                      <Col size={0.25} />
                      <Col align="flex-start" size={9} justify="center">
                        <Text
                          color={
                            item.code === 'logout' ? Color.error :
                            item.code === 'login' ? Color.info : Color.text
                          }
                        >
                          {item.title}
                        </Text>
                      </Col>
                      <Col align="flex-end" size={2} justify="center">
                        <FontAwesome
                          name="angle-right"
                          color={Color.text}
                          size={20}
                        />
                      </Col>
                    </Row>
                  </TouchableOpacity>
                </Container>
              )
            })}
            {/* wekdor */}
          </View>
        </Container>

        <Divider />
      </ScrollView>

      {/* android - untuk mencegah klik laundry bag yang belakang ikut ter klik */}
      <Box size={70} style={{position: 'absolute', bottom: -40}} />

      <ModalinputCode
        visible={modalInputCode}
        onClose={() => setModalInputCode(false)}
        onSubmit={(text) => {
          fetchOrganizationMemberManage(text);
        }}
        errorMessage={responseMemberManage.message}
      />

      <Modal
        visible={modalVirtual}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVirtual(false)}
      >
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            backgroundColor: Color.overflow,
          }}
        >
          <View
            style={{
              width: '100%',
              aspectRatio: 1,
              padding: 16,
              backgroundColor: Color.theme,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <QRCode value={user ? user.userCode : ''} size={width - 70} />
          </View>

          <Divider height={32} />

          <TouchableOpacity
            onPress={() => setModalVirtual(false)}
            style={{
              padding: 12,
              backgroundColor: Color.error,
              borderRadius: 50,
            }}
          >
            <AntDesign
              name="close"
              color={Color.textInput}
              size={24}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </Scaffold>
  );
};

export default MainProfile;