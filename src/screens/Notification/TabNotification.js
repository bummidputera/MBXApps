import React, { useState, useEffect, useRef } from 'react';
import { View, Image, FlatList, ScrollView, Platform, Linking, Pressable, useWindowDimensions } from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import Header from '@src/components/Header';
import { useLoading, usePopup, useColor, Alert, Row, Col } from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import { TouchableOpacity, Button } from '@src/components/Button';
import { Container, Divider, Padding } from 'src/styled';
import { useIsFocused, useRoute } from '@react-navigation/native';
import NotificationPromo from './NotificationPromo';
import NotificationScreen from './NotificationScreen';

const Tab = createMaterialTopTabNavigator();

const CustomTabBar = (props) => {
  const { navigation, navigationState } = props;

  const { Color } = useColor();
  const { width } = useWindowDimensions();

  console.log(props);

  return (
    <Container paddingHorizontal={16}>
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        {navigationState.routes.map((item, idx) => {
          const isActive = navigationState.index === idx;
          const isFirst = idx === 0;
          const isLast = idx === (navigationState.routes.length - 1);
          const label = item.name;

          return (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.65}
              onPress={() => {
                navigation.navigate(item.name);
              }}
            >
              <Container
                width={(width / navigationState.routes.length) - 16.5}
                color={isActive ? Color.primary : 'transparent'}
                paddingVertical={12}
                style={
                  isFirst ? {
                    // borderTopLeftRadius: 120,
                    // borderBottomLeftRadius: 120,
                    borderWidth: 1,
                  } :
                    isLast ? {
                      // borderTopRightRadius: 120,
                      // borderBottomRightRadius: 120,
                      borderWidth: 1
                    } : {}
                }
              >
                <Text size={12} type='medium' letterSpacing={0.5} color={isActive ? Color.theme : Color.primary}>{label}</Text>
              </Container>
            </TouchableOpacity>
          )
        })}
      </View>
    </Container>
  )
}

const TabNotification = ({ navigation, route }) => {

  const { Color } = useColor();
  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();

  const isFocused = useIsFocused();

  return (
    <Scaffold
      empty={false}
      popupProps={popupProps}
      loadingProps={loadingProps}
      header={
        <Header
          type="bold"
          centerTitle={false}
          title="Notifikasi"
        />
      }
    >
      <Divider />
      
      <Tab.Navigator
        initialRouteName={'Umum'}
        tabBarOptions={{
            indicatorStyle: {
                backgroundColor: Color.theme,
                height: '100%'
            },
            activeTintColor: '#E7FF00',
            inactiveTintColor: Color.white,
            labelStyle: {
                fontSize: 12,
            },
            indicatorStyle: {
                borderBottomColor: Color.primary,
                borderBottomWidth: 2,
            },
            style: {
                backgroundColor: Color.theme,
            }
        }}
        tabBar={(props) => <CustomTabBar {...props} />}
    >
        <Tab.Screen
            name="● NOTIFICATION"
            component={NotificationScreen}
            options={{tabBarLabel: 'NOTIFICATION'}}
        />
        <Tab.Screen
            name="● PROMOS"
            component={NotificationPromo}
            options={{tabBarLabel: 'PROMOS'}}
        />
    </Tab.Navigator>
    </Scaffold>
  )
}

export default TabNotification;