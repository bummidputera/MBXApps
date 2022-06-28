import React, {useRef, forwardRef} from 'react';
import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Text, useColor} from '@src/components';

import {useCombinedRefs} from '@src/hooks';
import {statusBarHeight} from 'src/utils/constants';

const defaultProps = {
  data: [],
  adjust: true,
  selected: null,
  name: '',
  onPress: () => {},
  onClose: () => {},
  style: {},
};

const ModalUnlock = forwardRef((props, ref) => {
  const {data, selected, adjust, onPress, onClose, children, style, name} = props;

  const modalizeRef = useRef(null);
  const combinedRef = useCombinedRefs(ref, modalizeRef);

  const {Color} = useColor();
  const {width} = useWindowDimensions();

  const renderContent = () => {
    return data.map((item, idx) => {
      if (item.show === false) return <View key={idx} />;

      return (
        <TouchableOpacity
          key={idx}
          onPress={() => {
            item.onPress ? item.onPress() : onPress(item, name);
          }}
          style={{
            width: width - 32,
            paddingVertical: 8,
            alignItems: 'center',
            marginTop: 16,
          }}>
         
          <View style={{backgroundColor:Color.primary,paddingHorizontal:120,paddingVertical:15,borderRadius:20}}>
          <Text
            size={14}
            type="bold"
            align="left"
            color={
              Color.textInput
            }>
            {item.name}
          </Text>
          </View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <Modalize
      ref={combinedRef}
      withHandle
      adjustToContentHeight={adjust}
      handlePosition="inside"
      handleStyle={{
        width: width / 6,
        height: 4,
        backgroundColor: Color.primary,
        marginTop: 8,
      }}
      childrenStyle={{
        backgroundColor: Color.theme,
        alignItems: 'center',
        padding: 16,
        paddingBottom: statusBarHeight,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        ...style,
      }}
      modalStyle={{
        backgroundColor: Color.theme,
      }}
      onClose={() => onClose()}>
      <View style={{flex: 1}}>
        <ScrollView>{data.length > 0 ? renderContent() : children}</ScrollView>
      </View>
    </Modalize>
  );
});

ModalUnlock.defaultProps = defaultProps;
export default ModalUnlock;
