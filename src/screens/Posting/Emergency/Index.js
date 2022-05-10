import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import Config from 'react-native-config';

import {
    useLoading,
    usePopup,
    useColor,
    Header,
    Row
} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import ListNews from 'src/components/Posting/ListNews';

import Client from '@src/lib/apollo';
import { queryContentProduct } from '@src/lib/query';
import ListEmergency from 'src/components/Posting/ListEmergency';

const EmergencyScreen = ({ navigation, route }) => {
    const [state, changeState] = useState({
        listProduct: [],
        fallback: true,
    });

    const setState = (obj) => {
        changeState({ ...state, ...obj });
    };

    // selector
    const user = useSelector(
      state => state['user.auth'].login.user
    );

    const [popupProps, showPopup] = usePopup();
    const [loadingProps, showLoading, hideLoading] = useLoading();

    const { Color } = useColor();

    const ref = useRef();

    useEffect(() => {
        fecthData();
    }, []);

    const fecthData = async() => {
        setState({
          fallback: true,
        });

        const listProduct = await fetchContentProduct(Config.PRODUCT_TYPE, 'EMERGENCY', '');
    
        setState({
            listProduct,
            fallback: false,
        });
    }

    const fetchContentProduct = async(productType, productCategory, productSubCategory) => {
        const variables = {
          page: 0,
          itemPerPage: 6,
        };
    
        if (productType !== '') {
          variables.productType = productType;
        }
    
        if (productCategory !== '') {
          variables.productCategory = productCategory;
        }
    
        if (productSubCategory !== '') {
          variables.productSubCategory = productSubCategory;
        }
        
        const result = await Client.query({
          query: queryContentProduct,
          variables,
        });
    
        if (result && result.data && result.data.contentProduct && Array.isArray(result.data.contentProduct)) {
          return result.data.contentProduct;
        } else {
          return [];
        }
    }

    return (
        <Scaffold
          header={
            <Header
              title={route.params && route.params.title ? route.params.title : ''}
                actions={
                  <Row justify='center' align='center'>
                    {/* <Ionicons
                      name='search'
                      color={Color.primary}
                      size={22}
                      onPress={() => navigation.navigate('MainSearch')}
                    />
                    <Divider /> */}
                    <MaterialIcons
                      name='add'
                      color={Color.primary}
                      size={26}
                      onPress={() => {
                        const isJoinMember = user && user.organizationId;;
                        if (!isJoinMember) {
                          showLoading('error', 'Fitur ini hanya untuk anggota komunitas');
                          return;
                        }

                        navigation.navigate('CreateThreadScreen', {
                          title: route.params && route.params.title ? route.params.title : '',
                          productType: Config.PRODUCT_TYPE,
                          productCategory: '',
                          productSubCategory: 'EMERGENCY',
                        });
                      }}
                    />
                  </Row>
                }
              />
            }
            fallback={state.fallback}
            empty={!state.fallback && state.listProduct.length === 0}
            popupProps={popupProps}
            loadingProps={loadingProps}
        >
            {/* {user && user.isDirector === 1 && <Text
                color={Color.textInput}
                style={{backgroundColor: Color.primary, paddingTop: 2, paddingBottom: 6}}
                onPress={() => navigation.navigate('CreateThreadScreen', {
                  title: route.params && route.params.title ? route.params.title : '',
                  productType: Config.PRODUCT_TYPE,
                  productCategory: '',
                  productSubCategory: 'EMERGENCY',
                })}
              >
                Buat
            </Text>} */}

            <ListEmergency
                data={state.listProduct}
                showHeader={false}
                onPress={(item) => {
                  navigation.navigate('EmergencyDetail', { item });
                }}
                style={{
                  paddingBottom: 76
                }}
            />
        </Scaffold>
    )
}

export default EmergencyScreen;