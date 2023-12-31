import React, { useState, useEffect } from 'react';
import { View, FlatList, Modal, Keyboard, useWindowDimensions, Image } from 'react-native';

import Scaffold from '@src/components/Scaffold';
import Text from '@src/components/Text';
import TouchableOpacity from 'src/components/Button/TouchableDebounce';
import Header from '@src/components/Header';
import { useColor } from '@src/components/Color';
import { usePopup } from 'src/components/Modal/Popup';
import PropTypes from 'prop-types';
import { Padding, Divider, Container } from '@src/styled';
import SearchBar from 'src/components/SearchBar';
import Maps from 'src/components/Maps';
import { googleApiKey, initialLatitude, initialLongitude } from 'src/utils/constants';
import Button from 'src/components/Button/Button';

const propTypes = {
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    onSelect: PropTypes.func,
    extraProps: PropTypes.object,
};

const defaultProps = {
    visible: false,
    onClose: () => { },
    onSelect: () => { },
};

const ModalSelectMap = ({
    visible,
    onClose,
    onSelect,
    extraProps,
}) => {
    const [value, setValue] = useState('');
    const [searchData, setSearchData] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [locationName, setLocationName] = useState('Unknown Location');
    const [userData, setUserData] = useState({
        addressName: extraProps.title,
        provinceName: '',
        cityName: '',
        postCode: '',
        fullAddress: extraProps.fullAddress,
        latitude: isNaN(parseFloat(extraProps.latitude)) ? initialLatitude : parseFloat(extraProps.latitude),
        longitude: isNaN(parseFloat(extraProps.longitude)) ? initialLongitude : parseFloat(extraProps.longitude),
    });
    const [showAddress, setShowAddress] = useState(true);
    
      const keyboardShowListener = Keyboard.addListener( //for check keyboard
        'keyboardDidShow',
        () => {
            setShowAddress(false);
        },
      );
      const keyboardHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
          setShowAddress(true);
        },
    );
    
    const [collapse, setCollapse] = useState(true);

    const [popupProps, showPopup] = usePopup();

    const { Color } = useColor();
    const { width, height } = useWindowDimensions();

    useEffect(() => {
        const timeout = value !== '' ? setTimeout(() => {
            fetchGoogleSearch();
        }, 500) : null;

        return () => {
            clearTimeout(timeout);
        }
    }, [value]);

    const fetchGoogleSearch = () => {
        const paramLocation = `location=${userData.latitude} ${userData.longitude}`;
        const paramRadius = `radius=3000`;
        const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${value}&${encodeURIComponent(paramLocation)}&${paramRadius}&key=${googleApiKey}`;
    
        setSearchLoading(true);
        setCollapse(true);
    
        fetch(url)
        .then((result) => result.json())
        .then((res) => {
            console.log('res place search', res);
    
            let newData = [];
    
            if (res.status.toLowerCase() === 'ok') {
                newData = res.results;
            }
    
            setSearchData(newData);
            setSearchLoading(false);
        })
        .catch((err) => {
            console.log('err place search', err);
            setSearchData([]);
            setSearchLoading(false);
        });
      }

    const renderItem = (item, index) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    const newUserData = {
                        ...userData,
                        fullAddress: item.formatted_address,
                        latitude: parseFloat(item.geometry.location.lat),
                        longitude: parseFloat(item.geometry.location.lng),
                    };

                    Keyboard.dismiss();
                    onSelect(newUserData);

                    setUserData(newUserData);
                    setLocationName(item.name);
                    setCollapse(false);
                }}
                style={{
                    paddingHorizontal: 16,
                }}
            >
                <Container
                    paddingVertical={4}
                    marginBottom={4}
                    style={{ flexDirection: 'row' }}
                >
                    <Container>
                        <Image
                            uri={{ uri: item.icon }}
                            style={{
                                width: 20,
                                height: 20,
                            }}
                        />
                    </Container>
                    <Divider width={8} />
                    <Container>
                        <Text align='left' size={14} type='medium'>{item.name}</Text>
                        <Divider height={4} />
                        <Text align='left' size={12}>{item.formatted_address}</Text>
                    </Container>
                </Container>
            </TouchableOpacity>
        )
    }

    const renderListLocationSearch = () => {
       
        return (
            <>
                <FlatList
                    keyExtractor={(item, index) => item.place_id + index.toString()}
                    data={searchData}
                    nestedScrollEnabled
                    keyboardShouldPersistTaps='handled'
                    style={{
                        maxHeight: height / 2.5,
                    }}
                    contentContainerStyle={{
                        paddingTop: 8,
                    }}
                    renderItem={({ item, index }) => renderItem(item, index)}
                />

                <TouchableOpacity
                    onPress={() => setCollapse(!collapse)}
                    style={{padding: 16}}
                >
                    <Text>{collapse ? 'Tutup' : 'Lihat Hasil'}</Text>
                </TouchableOpacity>
            </>
        )
    }

    return (
      <Modal visible={visible}>
        <Scaffold
          header={
            <Header title="Pin Lokasi" onPressLeftButton={() => onClose()} />
          }
          popupProps={popupProps}
          isLoading={searchLoading}>
          <SearchBar
            type="input"
            value={value}
            onSubmitEditing={Keyboard.dismiss}
            onChangeText={val => setValue(val)}
            textInputProps={{
              onPressIn: () => {
                setCollapse(true);
              },
            }}
          />

          <Divider />

          <View style={{flex: 1}}>
            <Maps
              name={locationName}
              latitude={userData.latitude}
              longitude={userData.longitude}
              initLocation={false}
              onCallback={param => {
                console.log('Map', param);
                let province = '';
                let city = '';
                let post = '';

                if (Array.isArray(param.address_components)) {
                  param.address_components.map(item => {
                    if (item.types.includes('administrative_area_level_1')) {
                      province = item.long_name;
                    } else if (
                      item.types.includes('administrative_area_level_2')
                    ) {
                      city = item.long_name;
                    } else if (item.types.includes('postal_code')) {
                      post = item.long_name;
                    }
                  });
                }

                const newUserData = {
                  ...userData,
                  longitude: param.longitude,
                  latitude: param.latitude,
                  fullAddress: param.formatted_address,
                  provinceName: province,
                  cityName: city,
                  postCode: post,
                };

                onSelect(newUserData);

                setUserData(newUserData);
              }}
            />

            {collapse && searchData.length > 0 && (
              <View
                style={{
                  width: '100%',
                  position: 'absolute',
                  backgroundColor: Color.theme,
                }}>
                {renderListLocationSearch()}
              </View>
            )}
          </View>

          <Padding horizontal={16} top={16}>
            {showAddress ? (
              <Text>{userData.fullAddress}</Text>
            ) : (
              <Text></Text>
            )}

            <Divider />
            <Button
              onPress={() => {
                onSelect(userData);
                onClose();
              }}>
              Terapkan Lokasi
            </Button>
          </Padding>
        </Scaffold>
      </Modal>
    );
};

ModalSelectMap.propTypes = propTypes;
ModalSelectMap.defaultProps = defaultProps;
export default ModalSelectMap;