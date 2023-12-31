import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, TextInput, Image, ScrollView } from 'react-native';
import Styled from 'styled-components';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Moment from 'moment';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import { usePopup } from '@src/components';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import { Circle } from '@src/styled';

import { Header, ModalListAction, Scaffold, Alert } from 'src/components';
import ModalActions from 'src/components/Modal/ModalActions';
import { statusBarHeight } from 'src/utils/constants';
import { initSocket } from 'src/api-socket/currentSocket';

const BottomSection = Styled(View)`
  width: 100%;
  paddingHorizontal: 16px;
  paddingTop: 8px;
  paddingBottom: 4px;
  flexDirection: row;
  alignItems: center;
  borderTopWidth: 0.5px;
`;

const BoxInput = Styled(View)`
  width: 100%;
  padding: 8px 16px 8px 16px;
  borderRadius: 32px;
  borderWidth: 0.5px;
  flexDirection: row;
`;

const TextInputNumber = Styled(TextInput)`
  width: 90%;
  alignContent: flex-start;
  fontFamily: Inter-Regular;
  letterSpacing: 0.23;
  height: 40px;
`;

const CircleSend = Styled(TouchableOpacity)`
  width: 40px;
  height: 40px;
  borderRadius: 20px;
  justifyContent: center;
  alignItems: center;
`;

const initialDataRooms = {
    data: [],
    loading: true,
    page: 0,
    loadNext: false,
    refresh: false,
}

const ChatGroupScreen = ({ navigation, route }) => {
    const currentSocket = initSocket();

    // state
    const [dataRooms, setDataRooms] = useState(initialDataRooms);
    const [myRoomIds, setMyRoomIds] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState();
    const [isLoading, setIsLoading] = useState(false);

    // const modalListActionRef = useRef();
    const [showModal, setShowModal] = useState(false);

    // selector
    const user = useSelector(
        state => state['user.auth'].login.user
    )

    // hooks
    const isFocused = useIsFocused();
    const { Color } = useColor();
    const [popupProps, showPopup] = usePopup();

    useEffect(() => {
      currentSocket.on('chat_rooms', respone => {
        var res = respone.filter(function (el) {
          return el['room_detail'].type === 'GROUP';
        });
        console.log('respon', res);

        if (Array.isArray(res)) {
          setDataRooms({
            ...dataRooms,
            data: res,
            loading: false,
          });

          let ids = [];
          res.forEach(e => {
            ids.push(parseInt(e['room_id']));
          });
          setMyRoomIds(ids);
        } else {
          setDataRooms({
            ...dataRooms,
            loading: false,
          });
        }
      });
    }, []);

    useEffect(() => {
        if (isFocused) {
             currentSocket.emit('chat_rooms');

      }
      //  setIsLoading(false);
    }, [isFocused]);

    const fetchRoomsDelete = async() => {
        // setIsLoading(true);

        console.log(selectedRoom);

        currentSocket.emit('chat_rooms_delete', { room_id: selectedRoom.room_id });
        currentSocket.on('chat_rooms_delete', (res) => {
            console.log('res rooms delete', res);

            // setIsLoading(false);
            setSelectedRoom();

            showPopup('Berhasil menghapus obrolan', 'success');
            // showPopup('Gagal menghapus obrolan', 'error');
        });
    }

    const getTitle = (member) => {
        let title = '';
        
        if (member.length === 1) {
            member.map((i) => {
                if (i.user_id != user.userId) title = i.first_name;
            });
        } else if (member.length >= 2) {
            member.map((i) => {
                
                if (i.user_id != user.userId) title = '[Grup] ' + i.first_name + ' & ' + member.length + ' lainnya';
            });
        }

        return title;
    }

    const managedDateUTC = (origin) => {
        const date = Moment(origin).utc();
        const now = new Moment();
        const diff = now.diff(Moment(date), 'days');
        
        let title = '';

        if (diff === 0) {
            title = date.format('HH:mm');
        } else if (diff === 1) {
            title = 'Kemarin';
        } else {
            title = date.format('DD/MM/YYYY');
        }
        
        return title;
    }

    const isUserTyping = (typing) => {
        let result = false;
        if (Array.isArray(typing) && typing.length > 0) {
            const idxOf = typing.indexOf(user.userId.toString());
            if (idxOf === -1) result = true;
        }
        return result;
    }

    return (
      <Scaffold
        isLoading={isLoading}
        showHeader={false}
        empty={dataRooms.data.length === 0 && !dataRooms.loading}
        fallback={dataRooms.loading}>
        <View style={{backgroundColor: Color.theme}}>
          {/* <BottomSection style={{borderColor: Color.border}}>
                    <BoxInput style={true ? {borderColor: Color.border} : {borderColor: Color.error}}>
                        <TextInputNumber
                            name="text"
                            placeholder='Masukan teks..'
                            returnKeyType="done"
                            returnKeyLabel="Done"
                            blurOnSubmit={false}
                            onBlur={() => {}}
                            error={null}
                            onChangeText={(text) => {
                                // this.setState({ prepaidNumber }, () => this.validateTypingNumber(prepaidNumber, 'prepaid') );
                                // this.isValueErrorPrepaid('prepaidNumber')
                            }}
                        />
                        <CircleSend style={{backgroundColor: Color.primary}}>
                            <Ionicons name='search' size={16} color={Color.text} />
                        </CircleSend>
                    </BoxInput>
                </BottomSection> */}
          {/* <View
            style={{
              backgroundColor: Color.theme,
              width: '100%',
              height: 70,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TextInput
              placeholder="Cari . . ."
              style={{
                backgroundColor: Color.border,
                width: '95%',
                height: 35,
                borderRadius: 5,
                fontSize: 12,
                paddingHorizontal: 12,
              }}
            />
            <AntDesign
              name={'search1'}
              size={12}
              style={{
                alignSelf: 'flex-end',
                right: 20,
                color: Color.secondary,
                position: 'absolute',
              }}
            />
          </View> */}
          <FlatList
            keyExtractor={(item, index) =>
              item.id.toString() + index.toString()
            }
            data={dataRooms.data}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingTop: 8,
              paddingBottom: statusBarHeight,
            }}
            onEndReachedThreshold={0.3}
            onEndReached={() => {}}
            renderItem={({item}) => {
              const isSelected = selectedRoom && selectedRoom.id === item.id;
              const notifBadge = item.unread_count > 0;

              // console.log('item', item);

              let lastChatName = '';
              if (Array.isArray(item.member) && item.last_chat && item.last_chat.user_id) {
                const f = item.member.filter((e) => e.user_id == item.last_chat.user_id)[0];
                if (f) {
                  lastChatName = f.first_name;
                }
              }

              return (
                <TouchableOpacity
                  onPress={() => {
                    let targetIds = [];
                    item.member.map(e => {
                      if (e['user_id'] != user.userId)
                        targetIds.push(e['user_id']);
                    });

                    navigation.navigate('GroupDetailScreen', {
                      roomId: item.room_id,
                      roomName: getTitle(item.member),
                      nameGroup: item['room_detail'].name,
                      imageGroup: item['room_detail'].image,
                      description : item['room_detail'].description,
                      selected: item.member,
                      is_admin_room: item.is_admin_room,
                      is_owner_room: item.is_owner_room,
                      targetIds,
                    });
                  }}
                  onLongPress={() => {
                    // modalListActionRef.current.open();
                    setShowModal(!showModal);
                    setSelectedRoom(item);
                  }}
                  style={{
                    height: 60,
                    paddingHorizontal: 16,
                    marginBottom: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: isSelected
                      ? Color.primarySoft
                      : Color.textInput,
                  }}>
                  <View
                    style={{
                      width: '12%',
                      height: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={{uri: item['room_detail'].image}}
                      style={{
                        width: '100%',
                        aspectRatio: 1,
                        borderRadius: 30,
                        backgroundColor: Color.border,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      width: '70%',
                      height: '100%',
                      alignItems: 'flex-start',
                      justifyContent: 'space-around',
                      paddingLeft: 8,
                      paddingRight: 16,
                      paddingVertical: 4,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text type="semibold" numberOfLines={1}>
                        {item['room_detail'].name}
                      </Text>
                    </View>
                    <Text
                      align='left'
                      type={
                        isUserTyping(item.typing)
                          ? 'italic'
                          : notifBadge
                          ? 'bold'
                          : 'regular'
                      }
                      numberOfLines={1}
                      color={
                        isUserTyping(item.typing) ? Color.success : Color.text
                      }
                      style={{opacity: 0.6}}>
                      {item.last_chat &&
                      item.last_chat.user_id == user.userId ? (
                        lastChatName ? `${lastChatName}: ` : ''
                      ) : (
                        <Ionicons name={'md-checkmark-done-sharp'} size={12} />
                      )}
                      {isUserTyping(item.typing)
                        ? 'Sedang mengetik...'
                        : item.last_chat
                        ? item.last_chat.message
                        : ''}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '18%',
                      height: '100%',
                      alignItems: 'flex-end',
                      justifyContent: 'space-around',
                      paddingVertical: 4,
                    }}>
                    <Text size={8}>
                      {item.last_chat
                        ? managedDateUTC(item.last_chat.created_unix_date)
                        : ''}
                    </Text>
                    <Circle
                      size={20}
                      color={notifBadge ? Color.primary : 'transparent'}>
                      {notifBadge && (
                        <Text color={Color.textInput} size={10}>
                          {item.unread_count}
                        </Text>
                      )}
                    </Circle>
                  </View>
                </TouchableOpacity>
              );
            }}
          />

          <ModalActions
            // ref={modalListActionRef}
            visible={showModal}
            onClose={() => {
              setSelectedRoom();
            }}
            data={[
              {
                id: 0,
                name: 'Hapus',
                color: Color.red,
                onPress: () => {
                  Alert('Hapus', 'Apakah Anda yakin menghapus konten?', () => {
                    fetchRoomsDelete();
                  });
                  setShowModal(!showModal);
                  // modalListActionRef.current.close();
                  setSelectedRoom();
                },
              },
            ]}
          />
        </View>
      </Scaffold>
    );
}

export default ChatGroupScreen;