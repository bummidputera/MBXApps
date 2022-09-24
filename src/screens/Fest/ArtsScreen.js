import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useColor, Header, Col, Text} from '@src/components';
import Scaffold from '@src/components/Scaffold';
import {Divider, Row, Container} from 'src/styled';
import {accessClient} from 'src/utils/access_client';
import {useIsFocused} from '@react-navigation/native';

//Fonts
import SearchBar from 'src/components/SearchBar';
import HighlightFestMusic from 'src/components/Fest/HighlightFestMusic';
import HighlightFestArts from 'src/components/Fest/HighlightFestArts';
import HighlightFestLiterature from 'src/components/Fest/HighlightFestLiterature';

const ArtsScreen = ({navigation, route}) => {
  const {title, userProfileId} = route.params;
  const isMainScreen = route.params && route.params.routeIndex;

  const user = useSelector(state => state['user.auth'].login.user);
  const {Color} = useColor();
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);

  let canGeneratedContent = accessClient.UserGeneratedContent === 'ALL_USER';
  if (
    accessClient.UserGeneratedContent === 'ONLY_ADMIN' &&
    user &&
    user.isDirector === 1
  )
    canGeneratedContent = true;
  else if (
    accessClient.UserGeneratedContent === 'ONLY_MEMBER' &&
    user &&
    user.organizationId
  )
    canGeneratedContent = true;
  const {width, height} = useWindowDimensions();

  return (
    <Scaffold
      header={<Header centerTitle={false} iconLeftButton="arrow-left" />}>
      <ScrollView>
        <Container paddingHorizontal={16}>
          <Text align="left" size={24} color={Color.black}>
            Seni & Desain
          </Text>
        </Container>
        <Divider height={16} />
        <SearchBar
          label="Cari jadwal acara ..."
          type="select"
          onPress={() => navigation.navigate('SearchEvent')}
        />
        <Divider />
        <HighlightFestArts
          productCategory="FEST_ARTS_GRAFIC"
          name="Desain Grafis"
          title="Desain Grafis"
          nav="EventScreen"
          horizontal
          refresh={refreshing || isFocused}
          showSeeAllText={true}
          showEmpty
        />
          <HighlightFestArts
            productCategory="FEST_ARTS_ARCHITECTURE"
            name="Desain Arsitektur"
            title="Desain Arsitektur"
            nav="EventScreen"
            horizontal
            refresh={refreshing || isFocused}
            showSeeAllText={true}
            showEmpty
          />
      </ScrollView>
    </Scaffold>
  );
};

export default ArtsScreen;
