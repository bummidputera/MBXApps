import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, TextInput, FlatList, Image } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import Config from 'react-native-config';
import { useLoading, usePopup, useColor, Alert } from '@src/components';
import Text from '@src/components/Text';
import { TouchableOpacity } from '@src/components/Button';
import Scaffold from '@src/components/Scaffold';

import Client from '@src/lib/apollo';
import { queryContentProduct } from '@src/lib/query';
import { shadowStyle } from '@src/styles';
import { Divider, Row } from 'src/styled';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImagesPath from 'src/components/ImagesPath';
import BannerEbook from 'src/components/BannerEbook';

const Ebook = () => {
	const { Color } = useColor();
	return (
		<Scaffold headerTitle="Ebook" fallback={false} empty={false}>
			<ScrollView>
				<TextInput
					placeholder="Cari yang butuh bantuan ..."
					style={{
						width: '90%',
						backgroundColor: Color.grayLight,
						height: 50,
						alignSelf: 'center',
						borderRadius: 10,
						paddingHorizontal: 15
					}}
				/>
				<View
					style={{
						position: 'absolute',
						alignSelf: 'flex-end',
						paddingHorizontal: 40
					}}
				>
					<AntDesign
						name={'search1'}
						size={16}
						style={{
							color: Color.gray,
							paddingVertical: 16,
							alignSelf: 'flex-end'
						}}
					/>
				</View>
				<View style={{ marginTop: 15 }}>
					<BannerEbook />
				</View>
				<View>
					<Text
						style={{
							textAlign: 'left',
							fontWeight: 'bold',
							fontSize: 18,
							paddingHorizontal: 15,
							paddingVertical: 15
						}}
					>
						Rilisan Terbaru
					</Text>
					<FlatList
						data={[
							{ image: ImagesPath.ebook1 },
							{ image: ImagesPath.ebook2 },
							{ image: ImagesPath.ebook1 },
							{ image: ImagesPath.ebook2 },
							{ image: ImagesPath.ebook1 },
							{ image: ImagesPath.ebook2 }
						]}
						renderItem={({ item }) => (
							<TouchableOpacity>
								<Image source={item.image} style={{ marginHorizontal: 15 }} />
							</TouchableOpacity>
						)}
						horizontal={true}
					/>
				</View>
				<View>
					<Text
						style={{
							textAlign: 'left',
							fontWeight: 'bold',
							fontSize: 18,
							paddingHorizontal: 15,
							paddingVertical: 15
						}}
					>
						Releasan Terbaru
					</Text>
					<FlatList
						data={[
							{ image: ImagesPath.release1 },
							{ image: ImagesPath.release2 },
							{ image: ImagesPath.release3 },
							{ image: ImagesPath.release4 },
							{ image: ImagesPath.release1 },
							{ image: ImagesPath.release2 }
						]}
						renderItem={({ item }) => (
							<TouchableOpacity>
								<Image
									source={item.image}
									style={{ resizeMode: 'contain', marginHorizontal: 15, marginVertical: 15 }}
								/>
							</TouchableOpacity>
						)}
						horizontal={false}
						numColumns={2}
					/>
				</View>
			</ScrollView>
		</Scaffold>
	);
};

export default Ebook;
