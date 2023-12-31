import React, {useState, useEffect, useRef} from 'react';
import {View, ScrollView, Platform, SafeAreaView} from 'react-native';
import Styled from 'styled-components';
import {useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Text,
  // TouchableOpacity,
  Loading,
  useLoading,
  Scaffold,
  Row,
  Col,
  useColor,
  Header,
} from '@src/components';
import {TouchableOpacity} from '@src/components/Button';
import ListForum from '@src/screens/MainForum/ListForum';

import {shadowStyle} from '@src/styles';

import Client from '@src/lib/apollo';
import {queryContentProduct} from '@src/lib/query';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const CartAuction = ({navigation, route}) => {
  // selector
  const user = useSelector(state => state['user.auth'].login.user);
  const loading = useSelector(state => state['user.auth'].loading);

  const [loadingProps, showLoading, hideLoading] = useLoading();
  const {Color} = useColor();

  useEffect(() => {}, []);

  return (
    <Scaffold header={<View />} style={{backgroundColor: Color.semiwhite}}>
        {[1, 2, 3, 4].map((val, id) => (
          <View
            style={{
              marginHorizontal: 15,
              marginTop: 10,
              padding: 15,
              borderRadius: 5,
              backgroundColor: Color.theme,
            }}>
            <Row style={{}}>
              <View
                style={{
                  height: 74,
                  width: 74,
                  marginRight: 14,
                  backgroundColor: Color.semiwhite,
                  borderRadius: 8,
                }}
              />
              <Col>
                <Row>
                  <Col size={8} alignItems="flex-start">
                    <Text
                      color={Color.text}
                      style={{
                        textAlign: 'left',
                        marginBottom: 15,
                        width: '80%',
                      }}
                      type="bold">
                      ZIPPO Pemantik Armor 5 Sisi . . .
                    </Text>
                  </Col>
                  <Col>
                    <View
                      style={{
                        height: 28,
                        width: 65,
                        borderRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginHorizontal: 22,
                        backgroundColor: '#E7F5D0',
                        borderColor: '#558617',
                        borderWidth: 1,
                      }}>
                      <Text size={10} color="#558617">
                        Menang
                      </Text>
                    </View>
                  </Col>
                </Row>
                <View style={{justifyContent: 'flex-end', flex: 1}}>
                  <Row>
                    <View
                      style={{
                        alignItems: 'flex-start',
                        marginTop: 4,
                        justifyContent: 'flex-end',
                      }}>
                      <Text size={10} color={Color.gray}>
                        Harga
                      </Text>
                      <Text
                        size={14}
                        color={Color.text}
                        type="bold"
                        style={{marginRight: 5}}>
                        Rp. 100.000
                      </Text>
                    </View>
                    <AntDesign
                      name={'questioncircle'}
                      size={10}
                      style={{
                        color: Color.secondary,
                        alignSelf: 'flex-end',
                        marginBottom: 3,
                      }}
                    />
                    <Col>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('CheckoutScreen')}
                        style={{
                          flex: 1,
                          justifyContent: 'flex-end',
                          alignItems: 'flex-end',
                          flexDirection: 'row',
                        }}>
                        <Text
                          size={10}
                          style={{color: Color.primary, marginHorizontal: 5}}>
                          Checkout
                        </Text>
                        <AntDesign
                          name={'arrowright'}
                          style={{color: Color.primary}}
                        />
                      </TouchableOpacity>
                    </Col>
                  </Row>
                </View>
              </Col>
            </Row>
          </View>
        ))}

      {/* <Loading {...loadingProps} /> */}
    </Scaffold>
  );
};

export default CartAuction;
