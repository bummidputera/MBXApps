import React, {useState} from 'react';
import {Text, View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import imagesPath from '../components/ImagesPath';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Filter = ({data = [], value = {}, onSelect = () => {}}) => {
  console.log('selected value', !!value);
  const [showOption, setShowOption] = useState(false);

  const onSelectedItem = val => {
    setShowOption(false);
    onSelect(val);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.picker}
        activeOpacity={0.8}
        onPress={() => setShowOption(!showOption)}>
        <Text
          style={{
            color: '#027BC9',
          }}>
          {!!value ? value?.name : ' Filter'}
        </Text>
        <MaterialIcons
          name={'keyboard-arrow-down'}
          size={15}
          style={{color: '#027BC9'}}
        />
        {/* <Image
          style={{transform: [{rotate: showOption ? '180deg' : '0deg'}]}}
          source={imagesPath.icDropDown}
        /> */}
      </TouchableOpacity>
      {/* {showOption && (
        <View>
          {data.map((val, i) => {
            return (
              <TouchableOpacity
                key={String(i)}
                onPress={() => onSelectedItem(val)}
                style={{
                  backgroundColor: 'white',
                  paddingVertical: 8,
                  width: 120,
                  borderRadius: 4,
                }}>
                <Text>{val.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  picker: {
    width: 110,
    height: 35,
    borderWidth: 1,
    borderColor: '#027BC9',
    borderRadius: 50,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 10,
  },
});
export default Filter;
