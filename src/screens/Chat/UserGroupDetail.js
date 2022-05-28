import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView,Image, FlatList,Pressable,useWindowDimensions, AppState } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import { useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import ImagesPath from 'src/components/ImagesPath';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import { usePopup } from '@src/components/Modal/Popup';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import Scaffold from '@src/components/Scaffold';
import { Header } from 'src/components';
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import {ModalListAction } from 'src/components';
import {
	Row,
	Col,
} from '@src/components';
import Client from '@src/lib/apollo';
import { queryContentChatRoomManage, queryContentChatMessage } from '@src/lib/query';
import { Divider } from 'src/styled';
import { currentSocket } from '@src/screens/MainHome/MainHome';

const DATA = [
    {
      id: 1,
      image: ImagesPath.avatar1,
      name: 'Courtney Henry',
      status: 'Admin'
    },
    {
        id: 2,
        image: ImagesPath.avatar1,
        name: 'Courtney Henry',
        status: 'Admin'
      },
      {
        id: 2,
        image: ImagesPath.avatar1,
        name: 'Courtney Henry',
        status: 'Admin'
      },
      {
        id: 2,
        image: ImagesPath.avatar1,
        name: 'Courtney Henry',
        status: 'Admin'
      },
      {
        id: 2,
        image: ImagesPath.avatar1,
        name: 'Courtney Henry',
        status: 'Admin'
      },
  ];


function Anggota(props) {
 
  const modalListActionRef = useRef();

    const {Color} = useColor();
    const renderItem = ({ item }) => (
      <View style={{backgroundColor: Color.theme,}}>
       <Row style={{marginHorizontal: 0, marginVertical: 12, alignItems: 'center'}}>
            <Image source={item.image} style={{borderRadius: 20}}/>
            <View style={{width: '85%'}}>
                <Text style={{textAlign: 'left',fontSize: 14,fontWeight: 'bold', marginHorizontal: 8}}>{item.name}</Text>
                <Text style={{fontSize: 8, color: Color.error, textAlign: 'left', marginHorizontal: 10}}>{item.status}</Text>
            </View>
            <TouchableOpacity onPress={() => {
                            modalListActionRef.current.open();
                        }}>
             <Entypo name={'dots-three-horizontal'} size={15}/>
            </TouchableOpacity>
            
        </Row>

        
      </View>
       
        
       );
  
  
    return (
      <ScrollView style={{backgroundColor: Color.theme}}>
      <View
        style={{
          backgroundColor: Color.theme,
          padding: 16,
          alignItems: 'flex-start',
        }}>
          <FlatList
            data={DATA}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            />
      </View>
      <ModalListAction
                ref={modalListActionRef}
                data={[
                    {
                        id: 0,
                        name: 'Keluarkan dari grup',
                        color: Color.text,
                        onPress: () => {
                            modalListActionRef.current.close();
                        },
                    },
                    {
                        id: 1,
                        name: 'Jadikan Admin',
                        color: Color.red,
                        onPress: () => {
                            modalListActionRef.current.close();
                        },
                    },
                    {
                        id: 2,
                        name: 'Report',
                        color: Color.red,
                        onPress: () => {
                            modalListActionRef.current.close();
                        },
                    },
                ]}
            />
      </ScrollView>
    );
  }


  function Media(props) {
    const {Color} = useColor();
    const render = ({ item }) => (
        <View>
            <Text style={{fontSize: 10, fontWeight: 'bold', color: Color.text, textAlign: 'left', marginVertical: 10}}>{item.waktu}</Text>
            <Row>
                <Image source={item.gallery[0]} style={{width: 60, height: 60, borderRadius: 5, marginRight: 8}}/>
                <Image source={item.gallery[1]} style={{width: 60, height: 60, borderRadius: 5}}/>
            </Row>
        </View>
        
       );


    console.log(props);
  
    return (
      <ScrollView>
      <View
        style={{
          backgroundColor: Color.theme,
          padding: 16,
          alignItems: 'flex-start',
        }}>
          <FlatList
            data={[
                {
                    waktu: 'Minggu ini',
                    gallery: [ImagesPath.productImage, ImagesPath.produklelang]
                },
                {
                    waktu: 'Minggu ini',
                    gallery: [ImagesPath.productImage, ImagesPath.produklelang]
                },
                {
                    waktu: 'Minggu ini',
                    gallery: [ImagesPath.productImage, ImagesPath.produklelang]
                }
            ]}
            renderItem={render}
            keyExtractor={item => item.id}
            />
      </View>
      </ScrollView>
    );
  }

  function Dokumen(props) {
    const {Color} = useColor();
    const tampil = ({ item }) => (
        <View>
            <Text style={{fontSize: 10, fontWeight: 'bold', color: Color.text, textAlign: 'left', marginVertical: 10}}>{item.waktu}</Text>
            <Image source={item.file}/>
        </View>
        
       );

    console.log(props);
  
    return (
      <ScrollView>
      <View
        style={{
          backgroundColor: Color.theme,
          padding: 16,
          alignItems: 'flex-start',
        }}>
          <FlatList
            data={[
                {
                    waktu: 'Minggu ini',
                    file: ImagesPath.filedoc
                },
                {
                    waktu: 'Bulan lalu',
                    file: ImagesPath.filedoc
                },
                {
                    waktu: 'Minggu ini',
                    file: ImagesPath.filedoc
                },
            ]}
            renderItem={tampil}
            keyExtractor={item => item.id}
            />
      </View>
      </ScrollView>
    );
  }

const UserGroupDetail = ({navigation}) => {

    const modalListActionRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const { Color } = useColor();
    const Tab = createMaterialTopTabNavigator();
    const [backCover, setBackCover] = useState(true)


    const GroupDetailHeader = () => {
      return (
        <>
          <Row>
            <Image source={ImagesPath.avatar1} style={{marginHorizontal: 15}}/>
          <Col>
              <Text style={{fontSize: 14, fontWeight: 'bold', textAlign: 'left'}}>Ngoding Bareng</Text>
              <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'left', marginVertical: 1}}>28 Anggota</Text>
          </Col>
          <View style={{width: '8%', marginVertical: 5}}>
              <Feather name={'edit-2'}/>
          </View>
          </Row>
        <Pressable onPress={()=>{navigation.navigate('AddMember')}} style={{flexDirection: 'row',marginHorizontal: 15, marginVertical: 15}}>
            <Ionicons name={'person-add-outline'} size={16} style={{color: Color.primary}}/>
            <Text style={{color: Color.primary, fontSize: 12, marginHorizontal: 10}}>Tambahkan anggota grup</Text>
        </Pressable>
        </>
      )
    }

  return (
    <Scaffold
            isLoading={isLoading}
            header={
                <Header
                    title='Detail Grup'
                    iconRightButton={
                        <TouchableOpacity
                          onPress={() => {
                            modalListActionRef.current.open();
                        }} 
                            style={{justifyContent: 'center', alignItems: 'center'}}
                        >
                            <Entypo name='dots-three-vertical' color={Color.text} size={20} />
                        </TouchableOpacity>
                    }
                />
            }
    >
        <GroupDetailHeader/>
        <Tab.Navigator
                
                initialRouteName={'Belanjaan'}
                tabBarOptions={{
                    indicatorStyle: {backgroundColor: Color.theme, height: '100%'},
                    activeTintColor: Color.primary,
                    activeBackgroundColor: Color.primary,
                    inactiveTintColor: Color.secondary,
                    labelStyle: {
                    fontSize: 12,
                    fontWeight: 'bold',
                    color: Color.secondary,
                    },
                    indicatorStyle: {
                    borderBottomColor: Color.primary,
                    borderBottomWidth: 2,
                    },
                    labelStyle: {
                    fontSize: 12,
                    },
                    
                }}
                
                >
                <Tab.Screen
                    name="Anggota"
                    component={Anggota}
                    options={{tabBarLabel: 'Anggota'}}
                />
                <Tab.Screen
                    name="Media"
                    component={Media}
                    options={{tabBarLabel: 'Media'}}
                />
                <Tab.Screen
                    name="Dokumen"
                    component={Dokumen}
                    options={{tabBarLabel: 'Dokumen'}}
                />
                </Tab.Navigator>

                <ModalListAction
                ref={modalListActionRef}
                data={[
                    {
                        id: 0,
                        name: 'Matikan pemberitahuan',
                        color: Color.text,
                        onPress: () => {
                            modalListActionRef.current.close();
                        },
                    },
                    {
                        id: 1,
                        name: 'Keluar dari grup',
                        color: Color.red,
                        onPress: () => {
                            modalListActionRef.current.close();
                        },
                    },
                    {
                        id: 2,
                        name: 'Report',
                        color: Color.red,
                        onPress: () => {
                            modalListActionRef.current.close();
                        },
                    },
                ]}
            />

            
    </Scaffold>
  )
}

export default UserGroupDetail