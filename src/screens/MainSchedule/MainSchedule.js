import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import Config from 'react-native-config';

import {
    useLoading,
    usePopup,
    useColor
} from '@src/components';
import Text from '@src/components/Text';
import HeaderBig from '@src/components/HeaderBig';
import Scaffold from '@src/components/Scaffold';

import Client from '@src/lib/apollo';
import { queryContentProduct } from '@src/lib/query';
import HighlightContentProduct from 'src/components/Content/HighlightContentProduct';

export default ({ navigation, route }) => {
  // state
  const [fallback, setFallback] = useState(true);
  const [listCategory, setListCategory] = useState([]);
  const [listProduct, setListProduct] = useState([]);

  // selector
  const user = useSelector(
    state => state['user.auth'].login.user
  );

  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();

  const { Color } = useColor();

  useEffect(() => {
      fecthData();
  }, []);

  const fecthData = async() => {
    setFallback(true);

    const newListCategory = await fetchContentProduct(Config.PRODUCT_TYPE, '', '');
    setListCategory(newListCategory);

    const newListProduct = await fetchContentProduct(Config.PRODUCT_TYPE, '', 'TRIBES_BUSSINESS_DIRECTORY');
    setListProduct(newListProduct);

    setFallback(false);
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
        <HeaderBig title='Jadwal' style={{paddingTop: 16}} />
      }
      fallback={fallback}
      empty={false}
      popupProps={popupProps}
      loadingProps={loadingProps}
  >
      {user && user.isDirector === 1 && <Text
        color={Color.textInput}
        style={{backgroundColor: Color.primary, paddingTop: 2, paddingBottom: 6}}
        onPress={() => navigation.navigate('CreateThreadScreen', {
          title: 'Artikel',
          productType: Config.PRODUCT_TYPE,
          productCategory: '',
          productSubCategory: 'POSTING',
        })}
      >
        Buat
      </Text>}

      <HighlightContentProduct
        productCategory='POSTING'
        name='Artikel'
        title='Postingan Artikel'
        nav='NewsScreen'
        refresh={false}
      />
    </Scaffold>
  )
}