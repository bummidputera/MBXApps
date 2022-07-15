import { View, Text, ScrollView } from 'react-native'
import React, {useState, useEffect, useRef} from 'react'
import HighlightContentProduct from 'src/components/Content/HighlightContentProduct'
import { Divider } from 'src/styled'
import Client from '@src/lib/apollo';
import {useIsFocused, useRoute} from '@react-navigation/native';
import { getHistory } from 'src/lib/query/event'
import CardContentProduct from 'src/components/Content/CardContentProduct';
import { Row } from 'src/components';

const EventHistory = () => {

  const [loading, setLoading, hideLoading] = useState(true);
  const [list, setList] = useState([]);
  const isFocused = useIsFocused();

    useEffect(() => {
      getList();
    }, [isFocused]);

      const getList = () => {
        // showLoading();
        let variables = {
          page: 0,
          itemPerPage: 20,
        };
        console.log(variables);
        Client.query({query: getHistory, variables})
          .then(res => {
            // hideLoading()
            if(res.data.eventTicketOrderList){
              setList(res.data.eventTicketOrderList)
            }
            console.log(res);

            setLoading(false);
          })
          .catch(reject => {
            // hideLoading()
            console.log(reject, 'reject');
            setLoading(false);
          });
      };

    const renderCardContent = (item, index) => (
      <CardContentProduct
          key={index}
          productCategory={'EVENT'}
          category={'MyEvent'}
          item={{...item,productCategory: 'event', productName: item.event.name, image: item.event.images[0], fullname: item.userOrderName, eventDate: item.event.startTime}}
          horizontal={false}
      />
  )

  return (
    <View>
        <Divider/>
        <Text style={{fontSize: 14, fontWeight: 'bold', paddingHorizontal: 15}}>Event Aktif</Text>
        <Divider/>
        <ScrollView
              horizontal={false}
              showsHorizontalScrollIndicator={false}
          >
              <Row
                  style={{flexWrap: 'wrap', paddingRight: 8, paddingLeft: 16}}
              >
                  {list.map((item, index) =>
                      renderCardContent(item, index)
                  )}
              </Row>
          </ScrollView>
          
    </View>
  )
}

export default EventHistory