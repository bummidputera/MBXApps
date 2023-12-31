import React from 'react';
import {
  View,
  StatusBar,
  Platform,
  SafeAreaView,
  useWindowDimensions,
  Animated,
} from 'react-native';
import PropTypes from 'prop-types';
import {useNavigation} from '@react-navigation/native';
import {Portal} from 'react-native-portalize';

import Header from '@src/components/Header';
import ScreenIndicator from 'src/components/Modal/ScreenIndicator';
import ScreenEmptyData from 'src/components/Modal/ScreenEmptyData';
import Popup from 'src/components/Modal/Popup';
import Loading from 'src/components/Modal/Loading';
import {useColor} from '@src/components/Color';
import {isIphoneNotch, statusBarHeight} from 'src/utils/constants';
import Entypo from 'react-native-vector-icons/Entypo';

const propTypes = {
  children: PropTypes.node,
  header: PropTypes.node,
  headerTitle: PropTypes.string,
  showHeader: PropTypes.bool,
  iconRightButton: PropTypes.node,
  fallback: PropTypes.bool,
  option: PropTypes.bool,
  onPressLeftButton: PropTypes.func,
  onPressRightButton: PropTypes.func,

  empty: PropTypes.bool,
  emptyTitle: PropTypes.string,
  emptyButtonLabel: PropTypes.string,
  emptyButtonColor: PropTypes.string,
  emptyButtonPress: PropTypes.func,

  popupProps: PropTypes.object,
  loadingProps: PropTypes.object,
  isLoading: PropTypes.bool,
  style: PropTypes.object,
  useSafeArea: PropTypes.bool,
  translucent: PropTypes.bool,
  statusBarColor: PropTypes.string,
  floatingActionButton: PropTypes.PropTypes.node,
  statusBarAnimatedStyle: PropTypes.object,
};

const defaultProps = {
  headerTitle: '',
  useSafeArea: true,
  showHeader: true,
  fallback: false,

  empty: false,
  emptyTitle: 'Data tidak tersedia',
  emptyButtonLabel: '',
  emptyButtonPress: () => {},

  popupProps: {
    visible: false,
  },
  loadingProps: {
    visible: false,
  },
  isLoading: false,
  style: {},
  translucent: false,
  floatingActionButton: null,
  statusBarAnimatedStyle: null,
};

const Scaffold = ({
  children,
  header,
  headerTitle,
  useSafeArea,
  translucent,
  statusBarColor,
  showHeader,
  iconRightButton,
  onPressLeftButton,
  onPressRightButton,
  iconLike,
  fallback,
  option,

  empty,
  emptyTitle,
  emptyButtonLabel,
  emptyButtonColor,
  emptyButtonPress,

  popupProps,
  loadingProps,
  isLoading,
  style,
  floatingActionButton,
  statusBarAnimatedStyle,
}) => {
  const {Color} = useColor();
  const navigation = useNavigation();
  const {width, height} = useWindowDimensions();

  const MainView = useSafeArea ? SafeAreaView : View;
  const BarView = statusBarAnimatedStyle
    ? Animated.createAnimatedComponent(View)
    : View;
  const AndroidStatusBarAnimated = Animated.createAnimatedComponent(StatusBar);

  let headerProps = {};
  if (typeof onPressLeftButton === 'function') {
    headerProps = { ...headerProps, onPressLeftButton: () => onPressLeftButton() };
  }
  if (typeof onPressRightButton === 'function') {
    headerProps = { ...headerProps, onPressRightButton: () => onPressRightButton() };
  }

  return (
    <MainView style={{flex: 1, backgroundColor: Color.theme, ...style}}>
      {Platform.OS === 'android' && statusBarAnimatedStyle ? (
        <AndroidStatusBarAnimated
          translucent={false}
          backgroundColor={statusBarAnimatedStyle.backgroundColor}
          barStyle={
            Color.colorDominant === 'dark' ? 'light-content' : 'dark-content'
          }
        />
      ) : (
        <StatusBar
          translucent={translucent}
          backgroundColor={statusBarColor || Color.theme}
          barStyle={
            Color.colorDominant === 'dark' ? 'light-content' : 'dark-content'
          }
        />
      )}

      {Platform.OS === 'ios' && translucent && (
        <BarView
          style={{
            height: statusBarHeight,
            backgroundColor: statusBarColor || Color.theme,
            ...statusBarAnimatedStyle,
          }}
        />
      )}

      {showHeader && header ? (
        header
      ) : showHeader ? (
        <Header
            { ...headerProps }
            title={headerTitle}
            iconRightButton={iconRightButton}
            iconlike={iconLike}
        />
      ) : null}

      {fallback ? (
        <ScreenIndicator transparent />
      ) : empty && !isLoading ? (
        <ScreenEmptyData
          message={emptyTitle}
          buttonLabel={emptyButtonLabel}
          buttonColor={emptyButtonColor}
          onButtonPress={() => emptyButtonPress()}
        />
      ) : (
        children
      )}
      {option ? <Entypo name={'dots-three-vertical'} size={22} /> : empty}

      {isLoading && (
        <Portal>
          <View
            style={{
              zIndex: 99,
              position: 'absolute',
              alignSelf: 'flex-end',
              alignItems: 'center',
              justifyContent: 'center',
              width,
              height: translucent
                ? height + statusBarHeight
                : height -
                  (showHeader
                    ? 60 + (isIphoneNotch() ? statusBarHeight : 0)
                    : 0),
              top: showHeader
                ? 60 + (isIphoneNotch() ? statusBarHeight : 0)
                : 0,
              backgroundColor: Color.overflow,
            }}>
            <ScreenIndicator transparent />
          </View>
        </Portal>
      )}

      {/* {translucent && <View style={{height: isIphoneNotch() ? statusBarHeight : 0}} />} */}

      {floatingActionButton && (
        <View
          style={{
            position: 'absolute',
            right: 16,
            bottom: 32,
            backgroundColor: 'transparent',
          }}>
          {floatingActionButton}
        </View>
      )}

      <Popup {...popupProps} isTranslucent={translucent} />

      <Loading {...loadingProps} />
    </MainView>
  );
};

Scaffold.propTypes = propTypes;
Scaffold.defaultProps = defaultProps;
export default Scaffold;
