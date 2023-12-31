import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  useLoading,
  Scaffold,
  useColor,
  Header,
} from '@src/components';
import ListProduct from 'src/screens/Ecommerce/ListProduct';

let filter = [
  { id: 1, name: 'Category' },
  { id: 2, name: 'Rating' },
];

const MerchScreen = ({ navigation }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const user = useSelector(state => state['user.auth'].login.user);
  const loading = useSelector(state => state['user.auth'].loading);

  const [loadingProps, showLoading, hideLoading] = useLoading();
  const { Color } = useColor();

  const onSelect = item => {
    setSelectedItem(item);
  };

  return (
    <Scaffold
      loadingProps={loadingProps}
      header={
        <Header
          customIcon
          type="regular"
          centerTitle={false}
          title='Semua Produk'

        />
      }
      onPressLeftButton={() => navigation.pop()}
    >
      {/* hide filter */}
      {/* <View style={{ flexDirection: 'row', marginTop: 12 }}>
        <Filter
          value={selectedItem}
          data={filter}
          onSelect={onSelect}
        />
        <Category />
      </View> */}

      {/* <View
        style={{
          paddingHorizontal: 16,
          paddingBottom: 16,
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontWeight: 'bold' }}>Terbaru</Text>
        <View style={{ flexDirection: 'row', backgroundColor: Color.primary }}>
          <View style={{ paddingHorizontal: 3 }}>
            <TouchableOpacity>
              <Image
                source={ImagesPath.icDashboard}
                style={{ width: 20, height: 20 }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ paddingHorizontal: 3 }}>
            <TouchableOpacity>
              <Image
                source={ImagesPath.icList}
                style={{ width: 22, height: 22 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View> */}
      
      <View>
        <ListProduct />
      </View>
    </Scaffold>
  );
};

export default MerchScreen;
