import React, { useState, useEffect, useRef } from 'react';
import { View, Image, TextInput, Dimensions, SafeAreaView, FlatList } from 'react-native';
import Styled from 'styled-components';
import Moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { useSelector } from 'react-redux';

import {
    Alert,
    Text,
    useLoading,
    ModalListAction,
    TouchableOpacity,
    Scaffold,
    useColor
} from '@src/components';

import Client from '@src/lib/apollo';
import { queryMaudiProduct, queryMaudiComment, queryMaudiAddComment, queryMaudiDelComment } from '@src/lib/query';

import {
    imageBlank,
} from '@assets/images';

const windowWidth = Dimensions.get('window').width;

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const DetailForumScreen = ({ route, navigation }) => {
    const { params } = route;

    // state
    const [item, setItem] = useState(params.item);
    const [selectedCommentId, setSelectedCommentId] = useState(-1);
    const [textComment, setTextComment] = useState('');
    const [dataComment, setDataComment] = useState({
        data: [],
        loading: true,
        page: 0,
        loadNext: false,
    });
    const [refreshComment, setRefreshComment] = useState(false);

    // ref
    const modalListActionRef = useRef();

    // hooks
    const [loadingProps, showLoading] = useLoading();
    const { Color } = useColor();

    // selector
    const user = useSelector(
        state => state['user.auth'].login.user
    );

    useEffect(() => {
        getMaudiProduct();
    }, []);

    useEffect(() => {
        if (refreshComment) {
            getMaudiProduct();

            if (item && item.comment > 0) {
                getMaudiComment('initial');
                setRefreshComment(false);
            }
        }
    }, [refreshComment]);

    // useEffect(() => {
    //     if (item && item.comment > 0) {
    //         getMaudiComment('initial');
    //     } else {
    //         setDataComment({
    //             ...dataComment,
    //             loading: false,
    //             page: -1,
    //             loadNext: false,
    //         });
    //     }
    // }, [item]);

    useEffect(() => {
        if (dataComment.page !== -1 && item) {
            getMaudiComment();
        }
    }, [dataComment.loadNext]);

    const getMaudiProduct = () => {
        Client.query({
            query: queryMaudiProduct,
            variables: {
                productCode: params.item.code
            }
          })
          .then((res) => {
            console.log(res, 'res detail');
      
            if (res.data.maudiProduct.length > 0) {
                setItem(res.data.maudiProduct[0]);
            }
          })
          .catch((err) => {
              console.log(err, 'err detail');
          });
    }

    const getMaudiComment = (initial) => {
        Client.query({
            query: queryMaudiComment,
            variables: {
              page: dataComment.page + 1,
              itemPerPage: 10,
              productId: item.id
            }
          })
          .then((res) => {
            console.log(res, 'res list comm');
            
            if (initial) {
                setDataComment({
                    data: res.data.maudiComment,
                    loading: false,
                    page: res.data.maudiComment.length === 10 ? 1 : -1,
                    loadNext: false,
                });
            } else {
                setDataComment({
                    data: dataComment.data.concat(res.data.maudiComment),
                    loading: false,
                    page: res.data.maudiComment.length === 10 ? dataComment.page + 1 : -1,
                    loadNext: false,
                });
            }
          })
          .catch((err) => {
            console.log(err, 'err list comm');
            setDataComment({
                ...dataComment,
                loading: false,
                page: -1,
                loadNext: false,
            });
          })
    }

    const submitComment = () => {
        if (textComment === '') {
          alert('Isi komentar tidak boleh kosong');
          return;
        }

        const variables = {
            productId: item.id,
            comment: textComment,
        };

        console.log(variables, 'variables');
        
        Client.query({
            query: queryMaudiAddComment,
            variables
          })
          .then((res) => {
            console.log(res, 'res add comm');
            
            if (res.data.maudiAddComment.id) {
              const arrNew = [res.data.maudiAddComment].concat([]);
            
              setTextComment('');
              setRefreshComment(true);
            } else {
              showLoading('error', 'Gagal mengirimkan komentar');
            }
          })
          .catch((err) => {
              console.log(err, 'err add comm');
              showLoading('error', 'Gagal mengirimkan komentar');
          })
    }

    const maudiDelComment = () => {
        showLoading();

        const variables = {
            id: selectedCommentId,
            productId: item.id,
        };
        
        Client.query({
          query: queryMaudiDelComment,
          variables,
        })
        .then((res) => {
          const data = res.data.maudiDelComment;
          
          showLoading(data.success ? 'success' : 'error', data.message);

          if (data.success) {
            setRefreshComment(true);
          }
        })
        .catch((err) => {
            console.log(err, 'err add like');
            showLoading('error', 'Gagal menghapus');
        })
    }

    const renderHeader = () => {
        return (
            <View style={{}}>
                <View style={{width: windowWidth, height: windowWidth / 3, backgroundColor: Color.primary}} />

                <View style={{width: windowWidth, height: windowWidth / 4, alignItems: 'flex-end'}}>
                    <View style={{width: '50%', paddingRight: 16, paddingTop: 16}}>
                        <Text size={18} type='semibold' align='left'>{item.productName}</Text>
                        <Text size={12} align='left'>{Moment(parseInt(item.created_date)).format('dddd, HH:mm - DD/MM/YYYY')}</Text>
                    </View>
                </View>

                <Image
                    source={item && item.image ? { uri: item.image } : imageBlank}
                    style={{position: 'absolute', top: windowWidth / 12, left: 16, width: windowWidth / 2 - 32, aspectRatio: 5/6, backgroundColor: Color.border, borderRadius: 4}}
                />

                <View style={{padding: 16}}>
                    <Text align='left'>{item.productDescription}</Text>
                </View>

                <View style={{width: '100%', paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, paddingTop: 24, borderBottomWidth: 0.5, borderColor: Color.border}}>
                    <Text size={12}>{item.comment} Tanggapan</Text>
                </View>
            </View>
        )
    }

    const renderItem = (item, index) => {
        const canManageComment = user && !user.guest && user.userId === item.userId;
        return (
            <View style={[{width: '100%', flexDirection: 'row', marginBottom: 2, paddingVertical: 8, paddingRight: 16, paddingLeft: 8, borderBottomWidth: 0.5, borderColor: Color.border}, index === 0 && {marginTop: 4} ]}>
                  <View style={{width: '15%', alignItems: 'center', paddingTop: 4}}>
                      <Image source={{ uri: item.image }} style={{width: 30, height: 30, borderRadius: 15, backgroundColor: Color.primary}} />
                  </View>
                  <View style={{width: '80%'}}>
                      <View>
                          <Text size={12} align='left' style={{opacity: 0.75}}>{item.fullname}</Text>
                          <View style={{width: 4}} />
                          <Text size={10} align='left' style={{opacity: 0.75}}>{Moment(parseInt(item.commentDate)).format('dddd, HH:mm - DD/MM/YYYY')}</Text>
                      </View>
                      
                      <Text size={12} align='left' type='medium'>{item.comment}</Text>
                  </View>

                  {canManageComment && <TouchableOpacity
                    onPress={() => {
                      modalListActionRef.current.open();
                      setSelectedCommentId(item.id);
                    }}
                    style={{height: 30, width: '5%', alignItems: 'center', justifyContent: 'center'}}
                  >
                      <Entypo name='dots-three-vertical' />
                  </TouchableOpacity>}
              </View>
        )
    }

    return (
        <Scaffold
            headerTitle='Diskusi'
            fallback={!item || dataComment.loading}
            loadingProps={loadingProps}
        >
            <FlatList
              keyExtractor={(item, index) => item.toString() + index}
              data={dataComment.data}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps='handled'
              renderItem={({ item, index }) => {
                  if (index === 0) {
                    return (
                        <>
                            {renderHeader()}
                            {renderItem(item, index)}
                        </>
                    )
                  }
                  return renderItem(item, index);
              }}
              onEndReached={() => dataComment.page !== -1 && setDataComment({ ...dataComment, loadNext: true })}
              onEndReachedThreshold={0.3}
            />

            <View style={{width: '100%', padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 0.5, borderColor: Color.border}}>
              <View style={{width: '100%', borderRadius: 4, borderColor: Color.border, borderWidth: 0.5, justifyContent: 'center'}}>
                  <TextInput
                    placeholder='Tulis Tanggapan'
                    placeholderTextColor={Color.text}
                    style={{fontSize: 12, fontFamily: 'Inter-Regular', color: Color.text, marginTop: 8, marginBottom: 16, paddingLeft: 16, paddingRight: 40}}
                    value={textComment}
                    multiline
                    onChangeText={(e) => setTextComment(e)}
                  />

                  <TouchableOpacity
                    onPress={() => {
                      submitComment();
                    }}
                    style={{width: 40, height: 40, position: 'absolute', bottom: -2, right: 4, alignItems: 'center', justifyContent: 'center'}}
                  >
                    <View style={{width: 28, height: 28, borderRadius: 14, backgroundColor: Color.primary, alignItems: 'center', justifyContent: 'center'}}>
                      <Ionicons name='arrow-forward' color={Color.theme} size={18} />
                    </View>
                  </TouchableOpacity>
              </View>
            </View>

            <ModalListAction
                ref={modalListActionRef}
                data={[
                    {
                        id: 0,
                        name: 'Hapus',
                        color: Color.red,
                        onPress: () => {
                            Alert('Hapus', 'Apakah Anda yakin menghapus konten?', () => maudiDelComment());
                            modalListActionRef.current.close();
                        },
                    }
                ]}
            />
        </Scaffold>
    )
}

export default DetailForumScreen;