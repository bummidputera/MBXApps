import React, { useState, useEffect, useRef, Component } from 'react';
import { View, AppRegistry, FlatList, ScrollView, Platform, Image, SafeAreaView, TextInput, TouchableOpacity, Pressable } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNSimpleCrypto from "react-native-simple-crypto";
import Octicons from 'react-native-vector-icons/Octicons'
import Swiper from 'react-native-swiper'

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
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import axios from 'axios';
import moment from 'moment';
import { queryGetAuction } from 'src/lib/query/auction';
import { FormatMoney } from 'src/utils';
import { queryGetProduct } from 'src/lib/query/ecommerce';


const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const Content = Styled(View)`
    margin: 16px
    padding: 12px
    borderRadius: 8px
`;

const DATA = [
    {
      id: 1,
      namaProduk: 'Acer Aspire 3 A314',
      hargaAwal: '3.000.000',
      waktuSisa: '06:12',
      image: ImagesPath.lelangecommerce1
    },
    {
        id: 2,
        namaProduk: 'Acer Aspire 3 A314',
        hargaAwal: '3.000.000',
        waktuSisa: '06:12',
        image: ImagesPath.lelangecommerce2
      },
      {
        id: 3,
        namaProduk: 'Acer Aspire 3 A314',
        hargaAwal: '3.000.000',
        waktuSisa: '06:12',
        image: ImagesPath.lelangecommerce1
      },
      {
        id: 4,
        namaProduk: 'Acer Aspire 3 A314',
        hargaAwal: '3.000.000',
        waktuSisa: '06:12',
        image: ImagesPath.lelangecommerce2
      },
      {
        id: 5,
        namaProduk: 'Acer Aspire 3 A314',
        hargaAwal: '3.000.000',
        waktuSisa: '06:12',
        image: ImagesPath.lelangecommerce1
      },
      {
        id: 6,
        namaProduk: 'Acer Aspire 3 A314',
        hargaAwal: '3.000.000',
        waktuSisa: '06:12',
        image: ImagesPath.lelangecommerce2
      },
    
  ];


  const Rekomendasi = [
    {
      id: 1,
      namaProduk: 'Tas Laptop Formal Pria',
      review: '4.5',
      terjual: 450,
      hargaCoret: 'Rp. 300.000',
      hargaAkhir: 'Rp. 278.100',
      image: ImagesPath.lelangecommerce3,
      diskon: '10%'
    },
    {
        id: 1,
        namaProduk: 'Tas Laptop Formal Pria',
        review: '4.5',
        terjual: 450,
        hargaCoret: '300.000',
        hargaAkhir: '278.100',
        image: ImagesPath.lelangecommerce4,
        diskon: '10%'
      },
      {
        id: 1,
        namaProduk: 'Tas Laptop Formal Pria',
        review: '4.5',
        terjual: 450,
        hargaCoret: '300.000',
        hargaAkhir: '278.100',
        image: ImagesPath.lelangecommerce5,
        diskon: '10%'
      },
      {
        id: 1,
        namaProduk: 'Tas Laptop Formal Pria',
        review: '4.5',
        terjual: 450,
        hargaCoret: '300.000',
        hargaAkhir: '278.100',
        image: ImagesPath.lelangecommerce6,
        diskon: '10%'
      },
    
  ];



const Ecommerce = ({navigation}) => {
    const user = useSelector((state) => state['user.auth'].login.user);
	const loading = useSelector((state) => state['user.auth'].loading);

	const [ loadingProps, showLoading, hideLoading ] = useLoading();
    const [listProduct, setListProduct] = useState([]);
    const [liveAuction, setLiveAuction] = useState([]);
	const { Color } = useColor();

    useEffect(() => {
        getAuction();
        getProduct();
    // });
    }, []);

    const getProduct = () => {
        let variables = {
          page: 1,
          itemPerPage: 10
        }
        Client.query({query: queryGetProduct, variables})
          .then(res => {
            console.log(res)
            if (res.data.ecommerceProductList) {
              setListProduct(res.data.ecommerceProductList);
            }
    
            // hideLoading();
            // navigation.navigate('TopUpScreen');
          })
          .catch(reject => {
            console.log(reject);
          });
      };

    const getAuction = () => {
        let variables = {
          page: 1,
          limit: 5
        }
        
        Client.query({query: queryGetAuction, variables})
          .then(res => {
            console.log(res)
            if (res.data.auctionProduct) {
                setLiveAuction(res.data.auctionProduct.data);
            }
    
            // hideLoading();
            // navigation.navigate('TopUpScreen');
          })
          .catch(reject => {
            console.log(reject);
          });
      };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('DetailLelang',{item})} style={{marginHorizontal: 6, marginVertical: 10 }}>
            <Image source={item.image} style={{resizeMode: 'contain', backgroundColor: '#ddd', width: 175, height: 200}}/>
            <View style={{position: 'absolute', marginVertical: 135, marginHorizontal: 20}}>
                <Text style={{color: Color.textInput}}>{item.namaProduk}</Text>
                <Text style={{fontSize: 8, color: Color.border, textAlign: 'left'}}>Harga Awal</Text>
                <View style={{flexDirection: 'row',}}>
                    {/* <Text style={{fontSize: 14, fontWeight: 'bold', color: Color.textInput,}}>Rp.</Text> */}
                    <Text style={{fontSize: 14, fontWeight: 'bold', color: Color.textInput}}>{FormatMoney.getFormattedMoney(item.start_price)}</Text>
                </View>
            </View>
            <View style={{backgroundColor: Color.error, width: 75, height: 20, position: 'absolute', borderRadius: 10,
                marginHorizontal: 80, marginVertical: 7}}>
                <Text style={{fontSize: 8, fontWeight: 'bold', color: Color.textInput, paddingVertical: 5}}>Tersisa {moment.unix((item.time_end/1000) - moment().unix()).format("DD") > 0 ? moment.unix((item.time_end/1000) - moment().unix()).format("DD")+' Hari ' : ''}{moment.unix((item.time_end/1000) - moment().unix()).format("HH:mm")}</Text>
            </View>
        </TouchableOpacity>
      );

      const render = ({ item }) => (
        <Pressable  onPress={() => navigation.navigate('DetailProduct',{item})} style={{marginHorizontal: 10, marginVertical: 10, backgroundColor: Color.textInput, width: '45%', height: 300, borderRadius: 10 }}>
            <Image source={{ uri: item.imageUrl }} style={{resizeMode: 'contain', width: 175, height: 160, marginVertical: 8}}/>
            <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
            <View style={{flexDirection: 'row', marginHorizontal: 12, marginVertical: 5}}>
                <Entypo name={'star'} style={{color: Color.yellow,}}/>
                <Text style={{fontSize: 10, color: Color.secondary, marginHorizontal: 3}}>{item.review}</Text>
                <View style={{backgroundColor: Color.secondary, height: 12, width: 1, marginHorizontal: 5}}></View>
                <Text style={{fontSize: 10, color: Color.secondary, marginHorizontal: 3}}>{item.terjual}</Text>
                <Text style={{fontSize: 10, color: Color.secondary,}}>Terjual</Text>
            </View>
            <View style={{marginHorizontal: 15, marginVertical: 15}}>
                <Text style={{marginVertical: 1, textAlign: 'left',color: Color.secondary, fontSize: 8}}>Harga</Text>
                <Text style={{marginVertical: 1, textAlign: 'left',textDecorationLine: 'line-through', fontSize: 10, color: Color.secondary, fontWeight: 'bold'}}>{item.hargaCoret}</Text>
                <Text style={{marginVertical: 1, textAlign: 'left',color: Color.error, fontWeight: 'bold'}}>{item.price}</Text>
            </View>
            {/* <View style={{paddingVertical: 5, backgroundColor: Color.error, width: 60, height: 42, position: 'absolute', alignSelf: 'flex-end', borderTopRightRadius: 10, borderBottomLeftRadius: 20}}>
                <Text style={{color: Color.textInput, fontSize: 10}}>Diskon</Text>
                <Text style={{fontSize: 14, fontWeight: 'bold', color: Color.textInput}}>{item.diskon}</Text>
            </View> */}
        </Pressable>
      );

  return (
        <ScrollView>
            <View >
            <View style={{position: 'absolute', backgroundColor: Color.primary, width: '100%', height: 130, borderBottomLeftRadius: 40, borderBottomRightRadius: 40}}></View>
            <View style={{flexDirection: 'row'}}>
                <View style={{width: '72%',}} onTouchStart={() => navigation.navigate('SearchScreen')}>
                    <TextInput placeholder='Cari apa hari ini . . .' style={{backgroundColor: Color.textInput, width: '95%',
                    borderRadius: 7, height: 40, marginHorizontal: 10, marginVertical: 10, paddingHorizontal: 10}}></TextInput>
                    
                </View>
                <Octicons name={'search'} size={14} style={{color: Color.placeholder,marginHorizontal: 240,
                    marginVertical: 22, position: 'absolute',}}/>
                <View style={{flexDirection: 'row', marginVertical: 20,marginLeft:35}}> 
                    {/* <Pressable onPress={() => navigation.navigate('Wishlist')}>
                        <MaterialIcons name={'favorite-border'} size={26} style={{marginHorizontal: 3}}/>
                        <View style={{marginHorizontal: 18,marginVertical: 1, position: 'absolute', width: 18, height: 10, backgroundColor: Color.error, borderRadius: 5}}>
                            <Text style={{fontSize: 5, color: Color.textInput, alignSelf: 'center', paddingVertical: 1}}> +99</Text>
                        </View>
                    </Pressable> */}
                    <Pressable onPress={() => navigation.navigate('CartScreen')}>
                        <MaterialCommunityIcons name={'shopping-outline'} size={26} style={{marginHorizontal: 3}}/>
                        <View style={{marginHorizontal: 18,marginVertical: 1, position: 'absolute', width: 18, height: 10, backgroundColor: Color.error, borderRadius: 5}}>
                            <Text style={{fontSize: 5, color: Color.textInput, alignSelf: 'center', paddingVertical: 1}}> +99</Text>
                        </View>
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate('Notification')}>
                        <Ionicons name={'notifications-outline'} size={26} style={{marginHorizontal: 3}}/>
                        <View style={{marginHorizontal: 18,marginVertical: 1, position: 'absolute', width: 18, height: 10, backgroundColor: Color.error, borderRadius: 5}}>
                            <Text style={{fontSize: 5, color: Color.textInput, alignSelf: 'center', paddingVertical: 1}}> +99</Text>
                        </View>
                    </Pressable>
                </View>
            </View>
                <View style={{flexDirection: 'row',backgroundColor: Color.textInput, width: '95%', height: 55, borderRadius: 5,
                alignSelf: 'center', marginVertical: 25, elevation: 3}}>
                    <View style={{marginHorizontal: 12, marginVertical: 8 ,width: '60%',}}>
                        <Text style={{color: Color.secondary, fontSize: 8, textAlign: 'left'}}>Saldoku</Text>
                        <Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'left'}}>Rp. 200.000</Text>
                    </View>
                    <View style={{flexDirection: 'column', marginVertical: 10 ,}}>
                        <View style={{flexDirection: 'row', }}>
                            <View style={{marginHorizontal: 8, backgroundColor: Color.primary, width: 20, height: 20, borderRadius: 3, justifyContent: 'center', alignItems: 'center'}}>
                                <AntDesign name={'plus'} style={{color: Color.textInput}}/>
                            </View>
                            <View style={{marginHorizontal: 8, backgroundColor: Color.primary, width: 20, height: 20, borderRadius: 3, justifyContent: 'center', alignItems: 'center'}}>
                                <AntDesign name={'upload'} style={{color: Color.textInput}}/>
                            </View>
                            <View style={{marginHorizontal: 8, backgroundColor: Color.secondary, width: 20, height: 20, borderRadius: 3, justifyContent: 'center', alignItems: 'center'}}>
                                <Entypo name={'dots-three-vertical'} style={{color: Color.textInput}}/>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', marginVertical: 2}}>
                            <Text style={{fontSize: 8, marginHorizontal: 6,}}>Top Up</Text>
                            <Text style={{fontSize: 8, marginHorizontal: 6}}>Tarik</Text>
                            <Text style={{fontSize: 8, marginHorizontal: 6}}>Lainnya</Text>
                        </View>
                        
                    </View>
                    
                </View>
            </View>
            <View>
                <Text style={{textAlign: 'left', marginHorizontal: 15, fontWeight: 'bold'}}>Tribes Special Deals</Text>
                <Swiper showsButtons={true} style={{height: 200, marginHorizontal: 25, marginVertical: 15}}>
                    <View >
                        <Image source={ImagesPath.ebookbanner} style={{resizeMode: 'contain'}}/>
                    </View>
                    <View>
                        <Image source={ImagesPath.ebookbanner}/>
                    </View>
                    <View>
                        <Image source={ImagesPath.ebookbanner}/>
                    </View>
                </Swiper>
          </View>
          <View style={{ backgroundColor:"#FFFFFE",alignSelf:"center",width:"95%",borderRadius:5}}>
              <View style={{flexDirection:"row",alignSelf:"center"}} >
                  <TouchableOpacity style={{ marginTop:16 }} onPress={() => navigation.navigate('MyShop')}>
                      <Image source={ImagesPath.shop}></Image>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginLeft:46.33,marginTop:16, }}onPress={() => navigation.navigate('ChatRoom')}>
                      <Image source={ImagesPath.chatframe}></Image>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginLeft:46.33,marginTop:16, }} onPress={() => navigation.navigate('Wishlist')}>
                      <Image source={ImagesPath.wishlistframe}></Image>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginLeft: 46.33, marginTop: 16, }} onPress={() => navigation.navigate('LiveLelangScreen')}>
                      <Image source={ImagesPath.scales}></Image>
                  </TouchableOpacity>
              </View>
              <View style={{ flexDirection:"row",marginBottom:16 }}>
                  <TouchableOpacity style={{marginLeft:20, marginTop:8 }}  onPress={() => navigation.navigate('MyShop')}>
                      <Text >Toko Saya</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginLeft:28.33,marginTop:8 }} onPress={() => navigation.navigate('ChatRoom')}>
                      <Text>Chating</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginLeft:36.33,marginTop:8 }} onPress={() => navigation.navigate('Wishlist')}>
                      <Text>Wishlist</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginLeft:39.33,marginTop:8 }} onPress={() => navigation.navigate('LiveLelangScreen')}>
                      <Text>Lelang</Text>
                  </TouchableOpacity>
              </View>
          </View>
            <View style={{marginVertical: 15}}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{width: '70%' ,fontWeight: 'bold', textAlign: 'left', paddingHorizontal: 20}}>Lelang Berlangsung</Text>
                    <Text style={{marginHorizontal: 5, marginVertical: 2,fontSize: 12, color: Color.info, fontWeight: 'bold'}}>Lihat Semua</Text>
                    <AntDesign name={'arrowright'} style={{marginVertical: 4, color: Color.info,}}/>
                </View>
                <FlatList
                    data={liveAuction}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    horizontal
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            <View>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{width: '70%' ,fontWeight: 'bold', textAlign: 'left', paddingHorizontal: 20}}>Rekomendasi</Text>
                    <Text onPress={() => navigation.navigate('MerchScreen')} style={{marginHorizontal: 5, marginVertical: 2,fontSize: 12, color: Color.info, fontWeight: 'bold'}}>Lihat Semua</Text>
                    <AntDesign name={'arrowright'} style={{marginVertical: 4, color: Color.info,}}/>
                </View>
                <FlatList
                    data={listProduct}
                    renderItem={render}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            <Image source={ImagesPath.bannerLelangEcommerce} style={{width: '100%', resizeMode: 'contain', marginVertical: 15}}/>
            <View style={{marginVertical: 15}}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{width: '70%' ,fontWeight: 'bold', textAlign: 'left', paddingHorizontal: 20}}>Paling Laku</Text>
                    <Text style={{marginHorizontal: 5, marginVertical: 2,fontSize: 12, color: Color.info, fontWeight: 'bold'}}>Lihat Semua</Text>
                    <AntDesign name={'arrowright'} style={{marginVertical: 4, color: Color.info,}}/>
                </View>
                <FlatList
                    data={listProduct}
                    renderItem={render}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        </ScrollView>
  )
}

export default Ecommerce