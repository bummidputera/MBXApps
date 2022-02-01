import React from 'react';
import { View, Image, TouchableOpacity, Animated } from 'react-native';
import Styled from 'styled-components';
import PropTypes from 'prop-types';

import {
  Row, Col,
  Text,
  useColor
} from '@src/components';
import {
  iconSplash,
  iconApp
} from '@assets/images';

const RowView = Styled(Row)`
    height: 100%;
    alignItems: center;
    justifyContent: center;
`;

const SideButton = Styled(TouchableOpacity)`
    height: 100%;
    width: 100%;
    alignItems: flex-end;
    justifyContent: center;
`;

const propTypes = {
  title: PropTypes.string,
  titleRight: PropTypes.string,
  actions: PropTypes.node,
  style: PropTypes.object,
  useAnimated: PropTypes.bool,
};

const defaultProps = {
    title: '',
    titleRight: '',
    actions: null,
    style: {},
    useAnimated: false,
};

const HeaderBig = (props) => {
  const {
    title,
    titleRight,
    titleRightColor,
    actions,
    style,
    useAnimated,
    iconRightButton,
    onPressRightButton,
  } = props;

  const { Color } = useColor();

  const MainContainer = useAnimated ? Animated.View : View;

  return (
    <MainContainer
      style={{
        width: '100%',
        height: 60,
        elevation: 0,
        borderBottomWidth: 0,
        paddingHorizontal: 16,
        backgroundColor: Color.theme,
        borderColor: Color.border,
        ...style,
      }}
    >
      <RowView>
        <Col size={6} justify='center' align='flex-start' style={{height: '100%'}}>
          {title === '' ?
            <View style={{flexDirection: 'row'}}>
              <Image source={iconApp} style={{width: 90, height: 40}} resizeMode='contain' />
            </View>
          :
            <Text size={18} type='bold'>{title}</Text>
          }
        </Col>

        <Col size={6} justify='center' align='flex-end' style={{height: '100%'}}>
          {iconRightButton && <SideButton
            onPress={() => onPressRightButton && onPressRightButton()}
          >
            {iconRightButton}
          </SideButton>}

          {titleRight !== '' && <Text
            type='medium'
            align='left'
            color={titleRightColor || Color.primary}
            onPress={() => onPressRightButton &&  onPressRightButton()}
          >
              {titleRight}
          </Text>}

          {actions && actions}
        </Col>
      </RowView>
    </MainContainer>
  );
}

HeaderBig.propTypes = propTypes;
HeaderBig.defaultProps = defaultProps;
export default HeaderBig;
