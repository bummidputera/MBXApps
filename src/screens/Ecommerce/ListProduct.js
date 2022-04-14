import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import ImagesPath from '../../components/ImagesPath';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  Row,
  Col,
  // TouchableOpacity,
  useColor,
} from '@src/components';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import { shadowStyle } from 'src/styles';
import { queryGetProduct } from 'src/lib/query/ecommerce';
import Client from 'src/lib/apollo';
import { FormatMoney } from 'src/utils';
import CardEcomerceProduct from 'src/screens/Ecommerce/CardEcomerceProduct';
import { statusBarHeight } from 'src/utils/constants';

const ListProduct = (props) => {
  const [listProduct, setListProduct] = useState([]);
  const [page, setPage] = useState(1);
  const { Color } = useColor();
  const navigation = useNavigation();
  const { height, width } = useWindowDimensions();
  const isFocused = useIsFocused();

  useEffect(() => {
    getProduct();
  }, [isFocused]);

  const getProduct = () => {
    let variables = {
      page: page,
      itemPerPage: 10
    }
    console.log(variables)
    Client.query({ query: queryGetProduct, variables })
      .then(res => {
        console.log(res)
        if (res.data.ecommerceProductList.length != 0) {
          setListProduct(listProduct.concat(res.data.ecommerceProductList));
          setPage(page+1)
        }

        // hideLoading();
        // navigation.navigate('TopUpScreen');
      })
      .catch(reject => {
        console.log(reject);
      });
  };

  const onEndReached = async () => {
    // setPage(page+1);
      getProduct()
    
  }

  return (
    <>
      {/* hide category */}
      {/* <FlatList
        showsHorizontalScrollIndicator={false}
        style={{ height: 35, marginHorizontal: 20 }}
        data={[
          { kategori: 'Semua Produk' },
          { kategori: 'Fashion' },
          { kategori: 'Gadget' },
          { kategori: 'Semua Produk' },
          { kategori: 'Frozen Food' },
          { kategori: 'Electronics' },
        ]}
        horizontal
        renderItem={({ item }) =>
          <TouchableOpacity style={{ borderRadius: 20, justifyContent: 'center', alignItems: 'center', width: 90, height: 30, borderWidth: 1, borderColor: Color.secondary, marginHorizontal: 5 }}>
            <Text style={{ fontSize: 10 }}>{item.kategori}</Text>
          </TouchableOpacity>
        }
      /> */}

      <FlatList
        style={{ marginVertical: 10, }}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        data={listProduct}
        onEndReachedThreshold={0.3}
        onEndReached={() => onEndReached()}
        renderItem={({ item, index }) => <CardEcomerceProduct item={item} index={index} />}
        contentContainerStyle={{
          paddingHorizontal: 8,
          paddingBottom: statusBarHeight,
        }}
      />
    </>
  );
};

export default ListProduct;

const styles = StyleSheet.create({
  txtTitle: {
    fontWeight: '700',
    fontSize: 14,
  },
  txtCategory: {
    fontWeight: '400',
    fontSize: 11,
  },
  txtRating: {
    fontWeight: '400',
    fontSize: 11,
    paddingRight: 5,
  },
  txtSold: {
    fontWeight: '400',
    fontSize: 11,
    paddingLeft: 5,
  },
  txtPrice: {
    fontWeight: '700',
    fontSize: 14,
  },
});
