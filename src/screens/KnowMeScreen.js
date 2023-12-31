import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {CommonActions, useIsFocused} from '@react-navigation/native';
import {Tabs, Tab, TabHeading} from 'native-base';
import Styled from 'styled-components';
import {useSelector, useDispatch} from 'react-redux';

import {
  Submit,
  usePopup,
  HeaderBig,
  useColor,
  Scaffold,
} from '@src/components';
import Text from '@src/components/Text';
import {guestLogin} from '@src/state/actions/user/auth';
import { Divider } from 'src/styled';
import {listBoarding} from '@assets/images/onboarding';

const MainView = Styled(View)`
  flex: 1;
  alignItems: center;
  justifyContent: flex-end;
  paddingBottom: 130px;
`;

const AbsoluteBottomView = Styled(View)`
  width: 100%;
  bottom: 26px;
  position: absolute;
`;

const NavgationFooterView = Styled(View)`
  alignItems: center;
  flexDirection: row;
  justifyContent: space-between;
`;

const WarpperNavigationBottom = Styled(View)`
  flex: 1;
  flexDirection: row;
  justifyContent: center;
`;

const NavigationTextWarpperView = Styled(View)`
  justifyContent: center;
  width: 100%;
  alignItems: center;
  paddingHorizontal: 16px;
`;

const DotIndicator = Styled(View)`
  height: 6px;
  width: 6px;
  borderRadius: 3px;
  marginHorizontal: 5px;
  backgroundColor: ${props => props.backgroundColor};
`;

const KnowMeScreen = ({navigation, route}) => {
  const [tabPage, setTabPage] = useState(0);

  const [popupProps, showPopup] = usePopup();
  const {Color} = useColor();

  const user = useSelector(state => state['user.auth'].login.user);
  const {loading, error} = useSelector(state => state['user.auth']);

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      if (user) {
        redirectTo('MainPage');
      }
    }
  }, [user, error, isFocused]);

  const redirectTo = nav => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: nav}],
      }),
    );
  };

  const isFinish = tabPage === (listBoarding.length - 1);

  const renderNavigationFooter = () => {
    return (
      <AbsoluteBottomView>
        <NavgationFooterView>
          <WarpperNavigationBottom>
            {listBoarding.map((_, idx) => (
              <TouchableOpacity key={idx} onPress={() => setTabPage(idx)}>
                <DotIndicator
                  backgroundColor={
                    tabPage === idx ? Color.primary : Color.grayLight
                  }
                />
              </TouchableOpacity>
            ))}
          </WarpperNavigationBottom>
        </NavgationFooterView>

        <Submit
          buttonLabel={isFinish ? "Login" : "Selanjutnya"}
          buttonColor={Color.primary}
          type="bottomSingleButton"
          buttonBorderTopWidth={0}
          onPress={() => {
            // dispatch(guestLogin());

            if (isFinish) {
              redirectTo('LoginScreen');
            } else {
              setTabPage(tabPage + 1);
            }
          }}
          style={{backgroundColor: 'transparent'}}
        />
      </AbsoluteBottomView>
    );
  };

  const renderTabContent = () => {
    return (
      <Tabs
        page={tabPage}
        prerenderingSiblingsNumber={Infinity}
        tabContainerStyle={{
          elevation: 0,
          height: 0,
          backgroundColor: Color.theme,
        }}
        tabBarUnderlineStyle={{backgroundColor: Color.theme, height: 0}}
        tabBarPosition="bottom"
        onChangeTab={({i}) => setTabPage(i)}>
        {listBoarding.map((item, idx) => (
          <Tab
            key={idx}
            heading={<TabHeading style={{backgroundColor: Color.theme}} />}>
            <MainView style={{backgroundColor: Color.theme}}>
              <Image
                style={{
                  width: '70%',
                  height: '70%',
                }}
                source={item.imageAsset}
                resizeMode="contain"
              />
              <NavigationTextWarpperView>
                <Text size={22} type="bold">
                  {item.title}
                </Text>
                <Divider height={8} />
                <Text size={12}>
                  {item.subTitle}
                </Text>
              </NavigationTextWarpperView>
            </MainView>
          </Tab>
        ))}
      </Tabs>
    );
  };

  return (
    <Scaffold
      header={
        user ?
          <View />
        :
          <HeaderBig
            titleRight='Lewati'
            titleRightColor={Color.primary}
            onPressRightButton={() => redirectTo('LoginScreen')}
            style={{backgroundColor: 'transparent', paddingTop: 16}}
          />
      }
      fallback={user || loading}
      popupProps={popupProps}
    >
      {renderTabContent()}

      {renderNavigationFooter()}
    </Scaffold>
  );
};

export default KnowMeScreen;
