import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  ScrollView,
  useWindowDimensions,
  FlatList,
} from 'react-native';
import Styled from 'styled-components';
import axios from 'axios';
import Config from 'react-native-config';

import {
  Text,
  TouchableOpacity,
  useColor,
  Scaffold,
  Alert,
  Button,
  useLoading,
} from '@src/components';
import {shadowStyle} from '@src/styles';
import {usePopup} from '@src/components/Modal/Popup';
import {Container, Row} from 'src/styled';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

const SurveyDetailHistory = ({navigation, route}) => {
  const { listHeader, valueContent } = route.params;
  const {params} = route;
  console.log('ini param', params);

  const user = useSelector(state => state['user.auth'].login.user);
  const {width, height} = useWindowDimensions();
  const {Color} = useColor();
  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();

  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [listDataDetail, setListDataDetail] = useState([]);
  const [useSurveyFile, setUseSurveyFile] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    fetchSurvey();
  }, [isFocused]);

  const fetchSurvey = async () => {
    showLoading();

    const dataq = {
      user_id: user.userId,
      survey_id: params.surveyId,
      with_detail : 1
    };

    const PostsURL = `${Config.SURVEY_API_URL}/get-surveys?user_id=${dataq.user_id}&survey_id=${dataq.survey_id}&with_detail=${dataq.with_detail}`;

    try {
      const res = await axios.get(PostsURL);
      
      if (Array.isArray(res.data)) {
        setListData(res.data);
        setListDataDetail(res.data[0].details);
      }

      hideLoading();
    } catch (error) {
      hideLoading();
      console.log(error, 'error apicall');
    }
  };
  const renderUpload = (item, index) => {
    let arr = JSON.parse( item.value);
    console.log('arr', arr);
    return (
      <View key={index}>
        <Container paddingHorizontal={16}>
          <Text size={10} align="left" style={{marginBottom: 8}}>
            {item.label}
          </Text>
        </Container>
        <Text size={14} align="left" fontWeight="bold" style={{marginBottom: 2}}>
          {item.name}
        </Text>
        {arr.length != 0 && (
          <Row style={{flexWrap: 'wrap', flex: 1}}>
            {arr.map((val, id) => (
              <View
                key={id}
                style={{
                  borderWidth: 1,
                  borderColor: Color.border,
                  width: width / 2 - 40,
                  aspectRatio: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: 20,
                  marginVertical: 5,
                }}>
                <Image
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 4,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  source={{uri: val.url}}
                />
              </View>
            ))}
          </Row>
        )}
      </View>
    );
  };

  return (
    <Scaffold
      headerTitle="Detail Survey History"
      fallback={loading}
      popupProps={popupProps}
      loadingProps={loadingProps}>
      <ScrollView>
        {listData.map(item => (
          <Container paddingHorizontal={16} paddingVertical={12}>
            {/* <TouchableOpacity
              style={{
                paddingVertical: 16,
                borderRadius: 6,
                backgroundColor: Color.textInput,
                paddingLeft: 12,
                marginBottom: 4,
                ...shadowStyle,
              }}>
              <Text size={12} align="left" type="bold">
                Code Survey : {item.code_survey}
              </Text>
            </TouchableOpacity> */}
          </Container>
        ))}
        {listDataDetail.map((item, index) => (
          <Container key={index} paddingHorizontal={16} paddingVertical={12}>
            {item.type !== 'UPLOAD_IMAGE' ? (
              <TouchableOpacity
                style={{
                  paddingVertical: 16,
                  borderRadius: 6,
                  backgroundColor: Color.textInput,
                  paddingLeft: 12,
                  ...shadowStyle,
                }}>
                <Text size={12} align="left" type="bold">
                  {item.name} : {item.value}
                </Text>
              </TouchableOpacity>
            ) : (
               renderUpload(item, index)
            )}
          </Container>
        ))}
      </ScrollView>
    </Scaffold>
  );
};

export default SurveyDetailHistory;
