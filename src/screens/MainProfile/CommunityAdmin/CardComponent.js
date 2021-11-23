import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  TextInput,
  Image,
} from 'react-native';
import Styled from 'styled-components';
import {
  Text,
  TouchableOpacity,
  useColor,
  usePopup,
  Popup,
  Scaffold,
  Alert,
} from '@src/components';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {shadowStyle} from '@src/styles';
import {useSelector, useDispatch} from 'react-redux';

import Client from '@src/lib/apollo';
import {joinCommunityManage} from '@src/lib/query/joinCommunityManage';
import {joinCommunityMember} from 'src/lib/query/joinCommunityMember';
import { Divider } from 'src/styled';

const CardComponent = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [popupProps, showPopup] = usePopup();
  const {Color} = useColor();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    let status = 2;
    if (props.type === 'newAnggota') {
      status = 0;
    } else if (props.type === 'Anggota') {
      status = 1;
    }

    Client.query({
      query: joinCommunityMember,
      variables: {
        status: status,
      },
    })
    .then((res) => {
      setData(res.data.joinCommunityMember);
      setLoading(false);
    })
    .catch((err) => {
      console.log('catch', 'warning');
      setLoading(false);
    });
  }

  const handleSuccess = (id) => {
    setLoading(true);

    Client.query({
      query: joinCommunityManage,
      variables: {
        status: 1,
        id: id,
      },
    })
      .then((res) => {
        showPopup('Akun selesai di Approve', 'success');
        fetchData();
        setLoading(false);
      })
      .catch((err) => {
        showPopup(err.message, 'warning');
        setLoading(false);
      });
  };

  const handleRemove = (id) => {
    setLoading(true);

    Client.query({
      query: joinCommunityManage,
      variables: {
        status: 2,
        id: id,
      },
    })
      .then((res) => {
        showPopup('Akun berhasil ditolak', 'success');
        fetchData();
        setLoading(false);
      })
      .catch((err) => {
        showPopup('catch', 'warning');
        setLoading(false);
      });
  };

  const fetchUpdateMember = (item) => {
    setLoading(true);

    Client.query({
      query: joinCommunityManage,
      variables: {
        status: 1,
        id: item.id,
        customIdNumber: item.userDetail.idNumber,
      },
    })
      .then((res) => {
        showPopup('Akun berhasil diubah', 'success');
        fetchData();
        setLoading(false);
      })
      .catch((err) => {
        showPopup('catch', 'error');
        setLoading(false);
      });
  }

  const renderItem = (item, index) => {
    if (index === 0) {
      console.log(item);
    }

    return (
      <View
        style={{
          borderWidth: 0.5,
          borderRadius: 15,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          marginBottom: 16,
        }}>
        <Image
          source={{ uri: item.userDetail.photoProfile || item.userDetail.image || item.car_photo_main }}
          style={{
            backgroundColor: Color.disabled,
            width: '20%',
            aspectRatio: 1,
            borderRadius: 16,
          }}
        />
        
        <View style={{width: '80%', paddingLeft: 16, justifyContent: 'space-between'}}>
          <View>
            <Text align='left'>{item.userDetail.firstName} - {item.car_type}</Text>
          </View>

          <Divider height={12} />

          {props.type === 'Anggota' ? (
            <View style={{flexDirection: 'row', width: '100%', height: 33}}>
              <TextInput
                placeholder={item.userDetail.idNumber || "Input Nomor ID"}
                placeholderTextColor={Color.gray}
                value={item.userDetail.idNumber}
                onChangeText={(val) => {
                  let newData = [...data];
                  newData[index].userDetail.idNumber = val;
                  setData(newData);
                }}
                style={{
                  color: Color.gray,
                  fontSize: 14,
                  fontFamily: 'Inter-Regular',
                  width: '80%',
                  backgroundColor: '#fff',
                  padding: 12,
                  borderRadius: 4,
                }}
              />

              <View
                style={{
                  width: '20%',
                  height: '100%',
                  alignItems: 'flex-end',
                }}
              >
                <TouchableOpacity
                  style={{
                    height: '100%',
                    aspectRatio: 1,
                    borderRadius: 50,
                    backgroundColor: Color.info,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    Alert('Konfirmasi', 'Apakah Anda yakin akan mengubah data anggota ini?', () => fetchUpdateMember(item));
                  }}
                >
                  <Ionicons
                    name="save"
                    color={Color.theme}
                    size={16}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={{flexDirection: 'row', width: '100%', height: 33}}>
              <TouchableOpacity
                onPress={() => {
                  Alert('Terima', 'Apakah Anda yakin akan menerima anggota ini?', () => handleSuccess(item.id));
                }}
                style={{
                  backgroundColor: Color.info,
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 4,
                }}>
                <Text color={Color.textInput}>{props.handleSuccess}</Text>
              </TouchableOpacity>
              {props.type !== 'notAnggota' && <Divider />}
              {props.type !== 'notAnggota' && <TouchableOpacity
                onPress={() => {
                  Alert('Tolak', 'Apakah Anda yakin akan menolak anggota ini?', () => handleRemove(item.id));
                }}
                style={{
                  backgroundColor: Color.error,
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 4,
                }}>
                <Text color={Color.textInput}>{props.handleRemove}</Text>
              </TouchableOpacity>}
            </View>
          )}
        </View>
      </View>
    )
  }

  return (
    <Scaffold
      fallback={loading}
      header={<View />}
      popupProps={popupProps}
    >
      {data.length > 0 ?
        <FlatList
          keyExtractor={(item, index) => item.id + index.toString()}
          data={data}
          renderItem={({ item, index }) => renderItem(item, index)}
          contentContainerStyle={{
            padding: 16,
          }}
        />
      : 
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>Data belum tersedia</Text>
        </View>
      }
    </Scaffold>
  );
};

export default CardComponent;