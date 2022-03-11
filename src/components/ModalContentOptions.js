import React, {useRef, forwardRef, useState} from 'react';

import {useColor} from '@src/components';
import {useCombinedRefs} from '@src/hooks';
import ModalListAction from './Modal/ModalListAction';
import {useNavigation} from '@react-navigation/native';
import {Alert} from './Modal/Alert';
import {accessClient} from 'src/utils/access_client';
import {queryProductReport} from '@src/lib/query';
import Client from '@src/lib/apollo';

const defaultProps = {
  isOwner: false,
  item: null,
};

const ModalContentOptions = forwardRef((props, ref) => {
  const {isOwner, item} = props;

  console.log('Item kakaaa', item.id);

  const modalizeRef = useRef(null);
  const combinedRef = useCombinedRefs(ref, modalizeRef);
  const navigation = useNavigation();

  const {Color} = useColor();

  const fetchProductReportCheck = () => {
    Client.mutate({
      mutation: queryProductReport,
      variables: {
        productId: item.id,
      },
    })
      .then(res => {
        console.log("res report",res)
        alert(
          'Laporan terkirim, Terima kasih telah membantu kami melakukan report',
        );
      })
      .catch(err => {
        console.log('error', err);
      });
  };

  const dataOptions = [
    {
      id: 0,
      show: isOwner ? true : false,
      name: 'Edit',
      color: Color.text,
      onPress: () => {
        combinedRef.current.close();
        navigation.navigate('EditThreadScreen', {
          ...item,
          title: 'Edit',
        });
      },
    },
    {
      id: 1,
      name: 'Report',
      color: Color.error,
      onPress: () => {
        combinedRef.current.close();
        Alert('Report', 'Laporkan postingan ini?', () => {
          fetchProductReportCheck();
        });
      },
    },
  ];

  if (accessClient.UserGeneratedContent) {
    dataOptions.push({
      id: 2,
      name: 'Block User',
      color: Color.error,
      onPress: () => {
        combinedRef.current.close();
        Alert(
          'Block',
          'Apakah Anda yakin akan memblok semua postingan user ini?',
        );
      },
    });
  }

  return <ModalListAction ref={combinedRef} data={dataOptions} />;
});

ModalContentOptions.defaultProps = defaultProps;
export default ModalContentOptions;
