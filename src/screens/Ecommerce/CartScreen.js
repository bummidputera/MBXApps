import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, SafeAreaView } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TopBar from '../Auction/TopBar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Text,
  // TouchableOpacity,
  Loading, useLoading,
  Scaffold,
  Row, Col,
  HeaderBig,
  useColor,
  Header
} from '@src/components';
import { TouchableOpacity } from '@src/components/Button';
import ListForum from '@src/screens/MainForum/ListForum';

import { shadowStyle } from '@src/styles';

import Client from '@src/lib/apollo';
import { queryContentProduct } from '@src/lib/query';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const CartScreen = ({ navigation, route }) => {
  // selector
  const user = useSelector(state => state['user.auth'].login.user);
  const loading = useSelector(state => state['user.auth'].loading);

  const [loadingProps, showLoading, hideLoading] = useLoading();
  const { Color } = useColor();

  
  useEffect(() => {
  }, []);

  return (
    <Scaffold
          header={<Header customIcon title='Keranjang' type='regular' color={Color.white} backgroundColor='primary' centerTitle={false} />}
          color='white'
          onPressLeftButton={() => navigation.pop()}
        >
        <TopBar style={{borderRadius: 10}} />
      {/* <Loading {...loadingProps} /> */}
    </Scaffold>
  );
}

export default CartScreen;