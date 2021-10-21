import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import Styled from 'styled-components';
import {
  Text,
  // TouchableOpacity,
  useColor,
} from '@src/components';

const CustomButton = Styled(TouchableOpacity)`
  backgroundcolor: ${(props) => (props.disabled ? '#E7CE3E' : props.color)};
  width: 100%;
  minheight: 35px;
  borderradius: 4px;
  alignitems: center;
  justifycontent: center;
  flexdirection: row;
`;

const CustomImage = Styled(Image)`
  width: 10;
  height: 10;
  marginRight: 3;
`;

const Button = (props) => {
  const {
    fontColor,
    fontSize,
    color,
    onPress,
    children,
    disabled,
    type,
    source,
    ...style
  } = props;

  const {Color} = useColor();

  return (
    <CustomButton
      {...style}
      {...props}
      color={color || Color.primary}
      onPress={!disabled && onPress}>
      {source && <CustomImage source={source} />}
      <Text
        fontSize={fontSize}
        type={type || 'semibold'}
        color={
          disabled ? '#D2BD3F' : props.fontColor ? props.fontColor : Color.theme
        }>
        {children}
      </Text>
    </CustomButton>
  );
};

export default Button;
