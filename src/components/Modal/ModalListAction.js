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

const ModalListAction = forwardRef((props, ref) => {
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
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginTop: 16,
          }}>
          <Text
            size={12}
            align="left"
            color={
              item.color
                ? item.color
                : selected && selected.id === item.id
                ? Color.secondary
                : Color.text
            }>
            {item.name}
          </Text>
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
        alignItems: 'flex-start',
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

ModalListAction.defaultProps = defaultProps;
export default ModalListAction;
