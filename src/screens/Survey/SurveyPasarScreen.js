import React, { useState, useEffect, useRef } from 'react';
import { View, KeyboardAvoidingView, FlatList, Image, Platform, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {
    Text,
    // TouchableOpacity,
    useLoading,
    Scaffold,
    useColor,
    Header,
    usePopup
} from '@src/components';
import moment from 'moment';

import survey_pasar_header from 'src/data/survey_pasar_header';
import CircularProgress from 'src/components/CircularProgress';
import { Column, Row, Container, Divider } from 'src/styled';
import survey_pasar_content_1 from 'src/data/survey_pasar_content_1';
import survey_pasar_content_2 from 'src/data/survey_pasar_content_2';
import survey_pasar_content_3 from 'src/data/survey_pasar_content_3';
import FormSelect from 'src/components/FormSelect';
import ModalSelectMap from 'src/components/ModalSelectMap';
import { initialLatitude, initialLongitude } from 'src/utils/constants';
import DatePicker from 'react-native-date-picker';
import AutofillAddress from 'src/components/AutofillAddress';
import ModalActions from 'src/components/Modal/ModalActions';
import { fetchShipperGetAreaList, fetchShipperGetCityList, fetchShipperGetProvinceList, fetchShipperGetSuburbList } from 'src/api/shipper';
import ModalActionScroll from 'src/components/Modal/ModalActionScroll';
import ModalImagePicker from 'src/components/Modal/ModalImagePicker';
import FormInput from 'src/components/FormInput';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';

const SurveyPasarScreen = ({ navigation, route }) => {
    const user = useSelector((state) => state['user.auth'].login.user);
    const [loadingProps, showLoading, hideLoading] = useLoading();
    const [popupProps, showPopup] = usePopup();
    const { Color } = useColor();
    const { width } = useWindowDimensions();

    const flatlistRef = useRef();

    const [currentHeaderIndex, setCurrentHeaderIndex] = useState(0);
    const [currentContentIndex, setCurrentContentIndex] = useState(-1);
    const [valueContent, setValueContent] = useState([]);

    const itemHeader = survey_pasar_header[currentHeaderIndex];
    const listContent = [survey_pasar_content_1, survey_pasar_content_2, survey_pasar_content_3];
    const currentContent = listContent[currentHeaderIndex];

    useEffect(() => {
        // remap ulang takutnya ada data baru (kl udah dari server)
        let newArr = [];
        for (const arr of listContent) {
            let newData = [];
            for (const item of arr) {
                newData.push({
                    code: item.code,
                    type: item.type,
                    label: item.label,
                    value: mappingTypeContent(item),
                    required: item.required,
                });
            }
            newArr.push(newData);
        }
        setValueContent(newArr);
    }, []);

    const mappingTypeContent = (item) => {
        let result = '';
        if (item.multiple) {
            result = [];
        }
        else if (item.type === 'TEXT_INPUT') {
            result = item.default_value ? mappingDefaultValueKey(item.default_value.key) : '';
        }
        else if (item.type === 'MAP_VIEW') {
            result = { fullAddress: '', latitude: initialLatitude, longitude: initialLongitude };
        }
        else if (item.type === 'TIME_PICKER') {
            result = new Date();
        }
        return result;
    }

    const mappingDefaultValueKey = (key) => {
        let result = '';
        key.map((k, i) => {
            result += user[k] + (i !== (key.length - 1) ? ' ' : '');
        })
        return result;
    }

    const onSubmit = () => {
        let errorMessage = '';

        if (valueContent.length > 0) {
            const currentValue = valueContent[currentHeaderIndex];
            for (let i = 0; i < currentValue.length; i++) {
                const e = currentValue[i];
                if (e.required && !e.value) {
                    errorMessage = e.label + ' wajib diisi';
                    break;
                }
            }
        } else {
            errorMessage = 'Harap tunggu';
        }

        if (errorMessage) {
            showPopup(errorMessage, 'error');
        } else {
            if (currentHeaderIndex < (survey_pasar_header.length - 1)) {
                setCurrentHeaderIndex(currentHeaderIndex + 1);
                flatlistRef.current.scrollToOffset({ animated: true, offset: 0 });
                return;
            }

            navigation.navigate('SurveyReviewScreen', { listHeader: survey_pasar_header, valueContent: valueContent });
        }
    }

    const onPressLeftButton = () => {
        if (currentHeaderIndex > 0) {
            setCurrentHeaderIndex(currentHeaderIndex - 1);
            return;
        }
        navigation.pop();
    }

    const renderLabel = (item, index) => {
        return (
            <Container paddingHorizontal={16} paddingVertical={12}>
                <Text type='bold' align='left'>{item.label}</Text>
            </Container>
        )
    }

    const renderTextInput = (item, index) => {
        return (
            <Container paddingHorizontal={16} marginBottom={12}>
                <FormInput
                    label={item.label}
                    placeholder={item.placeholder}
                    hideErrorHint
                    keyboardType={item.validation ? item.validation.keyboardType : 'default'}
                    value={valueContent.length > 0 ? valueContent[currentHeaderIndex][index].value : null}
                    onChangeText={(value) => {
                        if (valueContent.length > 0) {
                            let newValues = [...valueContent];
                            newValues[currentHeaderIndex][index].value = value;
                            setValueContent(newValues);
                        }
                    }}
                    multiline={item.type === 'TEXT_AREA'}
                    prefixText={item.validation ? item.validation.prefixText : ''}
                />
            </Container>
        )
    }

    const [modalSelectMap, setModalSelectMap] = useState(false);
    const renderMapView = (item, index) => {
        return (
            <View style={{marginBottom: 12}}>
                <FormSelect
                    type='select'
                    hideErrorHint
                    label={item.label}
                    value={valueContent.length > 0 && valueContent[currentHeaderIndex][index].value ? valueContent[currentHeaderIndex][index].value.fullAddress : ''}
                    placeholder={item.placeholder}
                    onPress={() => {
                        setModalSelectMap(true);
                    }}
                    labelContainerStyle={{
                        paddingTop: 0,
                        marginBottom: 4,
                    }}
                />

                <ModalSelectMap
                    visible={modalSelectMap}
                    extraProps={{
                        fullAddress: valueContent.length > 0 && valueContent[currentHeaderIndex][index].value ? valueContent[currentHeaderIndex][index].value.fullAddress : '',
                        latitude: valueContent.length > 0 && valueContent[currentHeaderIndex][index].value ? valueContent[currentHeaderIndex][index].value.latitude : initialLatitude,
                        longitude: valueContent.length > 0 && valueContent[currentHeaderIndex][index].value ? valueContent[currentHeaderIndex][index].value.longitude : initialLongitude,
                    }}
                    onSelect={(item) => {
                        // const name = item.name;
                        const spl = item.fullAddress.split(",");
                        const fullAddress = item.fullAddress;
                        const latitude = item.latitude;
                        const longitude = item.longitude;

                        // const provinceName = item.provinceName
                        // const cityName = item.cityName
                        // const postCode = item.postCode
                        // const kecName = spl[3]
                        // const kelName = spl[2]

                        // setProvince(provinceName)
                        // setCity(cityName)
                        // setKecamatan(kecName)
                        // setKelurahan(kelName)
                        // setAddress(fullAddress)

                        // setLocationPinnedMap(fullAddress);

                        if (valueContent.length > 0) {
                            let newValues = [...valueContent];
                            newValues[currentHeaderIndex][index].value = { fullAddress, latitude, longitude };
                            setValueContent(newValues);
                        }
                    }}
                    onClose={() => setModalSelectMap(false)}
                />
            </View>
        )
    }

    const [modalImagePicker, setModalImagePicker] = useState(false);
    const renderUploadImage = (item, index) => {
        let arr = valueContent.length > 0 ? [valueContent[currentHeaderIndex][index].value] : [];
        if (item.multiple) {
            arr = valueContent.length > 0 ? valueContent[currentHeaderIndex][index].value : [];
        }

        return (
            <>
                <Container paddingHorizontal={16}>
                    <Text align='left' size={12} color={Color.secondary}>{item.label}</Text>
                </Container>
                {arr.length != 0 && <Row style={{ flexWrap: 'wrap', flex: 1 }}>
                    {arr.map((val, id) => (
                        <View
                            key={id}
                            style={{
                                borderWidth: 1,
                                borderColor: Color.border,
                                width: (width / 2) - 40,
                                aspectRatio: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginHorizontal: 20,
                                marginVertical: 12,
                            }}>
                            <Image
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 4,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                source={{ uri: `data:${val.type};base64,${val.base64}` }}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    const newArr = arr;
                                    newArr.splice(id, 1);

                                    let newValues = [...valueContent];
                                    newValues[currentHeaderIndex][index].value = arr;
                                    setValueContent(newValues);
                                }}
                                style={{ position: 'absolute', top: 0, right: 2 }}
                            >
                                <AntDesign
                                    name={'close'}
                                    size={22}
                                    style={{ color: Color.error, padding: 5 }}
                                />
                            </TouchableOpacity>
                        </View>
                    ))}
                </Row>}

                <TouchableOpacity
                    onPress={() => {
                        setModalImagePicker(true);
                        setCurrentContentIndex(index);
                    }}
                    style={{
                        width: '30%',
                        borderWidth: 1,
                        borderColor: Color.text,
                        height: 100,
                        aspectRatio: 1,
                        borderStyle: 'dashed',
                        borderRadius: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginHorizontal: 20,
                        marginVertical: 12,
                    }}>
                    <AntDesign
                        name={'camerao'}
                        size={22}
                        style={{ color: Color.secondary, paddingVertical: 5 }}
                    />
                    <Text style={{ color: Color.secondary, fontSize: 12 }}>
                        {item.placeholder}
                    </Text>
                </TouchableOpacity>

                <Container paddingHorizontal={16}>
                    <Text size={10} align='left' style={{ marginBottom: 20 }}>{item.hint_label}</Text>
                </Container>
            </>
        )
    }

    const renderSelectMultipleTag = (item, index) => {
        let arr = valueContent.length > 0 ? valueContent[currentHeaderIndex][index].value : [];
        const arrOptions = Array.isArray(item.options) ? item.options : [];

        return (
            <>
                <View style={{ marginHorizontal: 12, marginBottom: 16 }}>
                    <View style={{ alignItems: 'flex-start', paddingHorizontal: 4, paddingVertical: 10 }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{item.label}</Text>
                        <Text style={{ fontSize: 10, color: Color.secondary }}>{item.placeholder}</Text>
                    </View>
                    <View>
                        <Row style={{ flexWrap: 'wrap' }}>
                            {arrOptions.map((val, id) => {
                                const idxOf = arr.indexOf(val);
                                const isSelected = idxOf !== -1;

                                return (
                                    <View
                                        key={id}
                                        style={{ paddingHorizontal: 4, marginBottom: 8 }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                let newValues = [...valueContent];
                                                if (isSelected) {
                                                    arr.splice(idxOf, 1);
                                                } else {
                                                    arr.push(val);
                                                }
                                                newValues[currentHeaderIndex][index].value = arr;
                                                setValueContent(newValues);
                                            }}
                                            style={{
                                                borderColor: isSelected ? Color.textInput : Color.text,
                                                backgroundColor: isSelected ? Color.primary : Color.textInput,
                                                borderWidth: 2,
                                                borderRadius: 20,
                                            }}
                                        >
                                            <Text style={{ marginHorizontal: 16, marginVertical: 8 }} color={isSelected ? Color.textInput : Color.text}>{val.name}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            })}
                        </Row>
                    </View>
                </View>
            </>
        )
    }

    const renderRadio = (item, index) => {
        let val = valueContent.length > 0 ? valueContent[currentHeaderIndex][index].value : '';
        const arrOptions = Array.isArray(item.options) ? item.options : [];

        return (
            <View style={{ alignItems: 'flex-start', paddingHorizontal: 16, marginBottom: 16 }}>
                <Text align='left' size={12} color={Color.secondary} style={{ marginBottom: 8 }}>{item.label}</Text>
                <Column>
                    {arrOptions.map((v, id) => {
                        const isSelected = val !== '' && val && v.id === val.id;

                        return (
                            <TouchableOpacity
                                key={id}
                                onPress={() => {
                                    let newValues = [...valueContent];
                                    newValues[currentHeaderIndex][index].value = v;
                                    setValueContent(newValues);
                                }}
                                style={{paddingRight: 16, marginBottom: 8}}
                            >
                                <Row align='center'>
                                    <View
                                        style={{ height: 20, width: 20, borderRadius: 15, backgroundColor: Color.primary, justifyContent: 'center', alignItems: 'center' }}
                                    >
                                        {isSelected && <View style={{ height: 14, width: 14, borderRadius: 7, backgroundColor: Color.textInput }} />}
                                    </View>
                                    <Container paddingLeft={8}>
                                        <Text size={12}>{v.name}</Text>
                                    </Container>
                                </Row>
                            </TouchableOpacity>
                        )
                    })}
                </Column>
            </View>
        )
    }

    const [modalSelectBox, setModalSelectBox] = useState(false);
    const [currentData, setCurrentData] = useState([]);
    const fetchSelectBox = async(item, index) => {
        let newValues = [...valueContent];

        const valProv = valueContent[currentHeaderIndex].filter((e) => e.code === item.parent_code)[0];
        const valCity = valueContent[currentHeaderIndex].filter((e) => e.code === item.parent_code)[0];
        const valSub = valueContent[currentHeaderIndex].filter((e) => e.code === item.parent_code)[0];

        // legacy
        const legacy_code = currentContent[index].legacy_code; 
        for (let i = 0; i < legacy_code.length; i++) {
            const element = legacy_code[i];
            const find = currentContent.filter((f) => f.code == element)[0];
            if (find) {
                const idxOf = currentContent.indexOf(find);
                if (idxOf !== -1) {
                    newValues[currentHeaderIndex][idxOf].value = '';
                    currentContent[idxOf].status = 2;
                }
            }
        }

        if (item.validation.shema === 'queryGetProvince') {
            const result = await fetchShipperGetProvinceList({ countryCode: 228 });
            if (result.status) {
                setCurrentData(result.data);
            }
        }
        else if (item.validation.shema === 'queryGetCity') {
            // ambil value yg jadi brancing parent
            const result = await fetchShipperGetCityList({ provinceId: valProv && valProv.value ? valProv.value.id : null });
            if (result.status) {
                setCurrentData(result.data);
            }
        }
        else if (item.validation.shema === 'queryGetSub') {
            // ambil value yg jadi brancing parent
            const result = await fetchShipperGetSuburbList({ cityId: valCity && valCity.value ? valCity.value.id : null });
            if (result.status) {
                setCurrentData(result.data);
            }
        }
        else if (item.validation.shema === 'queryGetArea') {
            // ambil value yg jadi brancing parent
            const result = await fetchShipperGetAreaList({ suburbId: valSub && valSub.value ? valSub.value.id : null });
            if (result.status) {
                setCurrentData(result.data);
            }
        }
    }
    const renderSelecBox = (item, index) => {
        let arrOptions = item.options;
        if (item.validation && item.validation.fetch) {
            arrOptions = currentData;
        }

        return (
            <View style={{marginBottom: 12}}>
                <FormSelect
                    type='select'
                    hideErrorHint
                    label={item.label}
                    value={valueContent.length > 0 && valueContent[currentHeaderIndex][index].value ? valueContent[currentHeaderIndex][index].value.name : ''}
                    placeholder={item.placeholder}
                    onPress={() => {
                        setModalSelectBox(true);
                        setCurrentData([]);
                        fetchSelectBox(item, index);
                        setCurrentContentIndex(index);
                    }}
                    labelContainerStyle={{
                        paddingTop: 0,
                        marginBottom: 4,
                    }}
                />
            </View>
        )
    }

    const [showDatePicker, setShowDatePicker] = useState(false);
    const renderTimePicker = (item, index) => {
        const val = valueContent.length > 0 ? valueContent[currentHeaderIndex][index].value : new Date();

        return (
            <View style={{ marginBottom: 12 }}>
                <FormSelect
                    type='select'
                    hideErrorHint
                    label={item.label}
                    placeholder={item.placeholder}
                    value={moment(val).format('HH:mm')}
                    onPress={() => {
                        setShowDatePicker(true);
                        setCurrentContentIndex(index);
                    }}
                    suffixIcon={
                        <View style={{ width: '10%', paddingRight: 16, justifyContent: 'center', alignItems: 'flex-end' }}>
                            <AntDesign name='clockcircle' size={16} color={Color.info} />
                        </View>
                    }
                    labelContainerStyle={{
                        paddingTop: 0,
                        marginBottom: 4,
                    }}
                />
            </View>
        )
    }

    const ContentList = Platform.OS === 'ios' ? FlatList : KeyboardAwareFlatList;
    const ButtonView = Platform.OS === 'ios' ? KeyboardAvoidingView : View;

    return (
        <Scaffold
            header={
                <Header
                    customIcon
                    title="Survey Pasar"
                    type="regular"
                    centerTitle={false}
                    onPressLeftButton={() => onPressLeftButton()}
                />
            }
            popupProps={popupProps}
        >
            <ContentList
                ref={flatlistRef}
                keyExtractor={(item, index) => item.id.toString() + index.toString}
                data={currentContent}
                keyboardShouldPersistTaps='handled'
                ListHeaderComponent={
                    <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 16 }}>
                        <CircularProgress
                            progress={Math.ceil(((currentHeaderIndex + 1) / survey_pasar_header.length) * 100)}
                            color={Color.error}
                            textComponent={<Text size={28} color={Color.error} type='bold'>{itemHeader.order}</Text>}
                        />
                        <View style={{ alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 8 }}>
                            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{itemHeader.header_label}</Text>
                            <Text style={{ fontSize: 10, color: Color.secondary }}>{itemHeader.sub_header_label}</Text>
                        </View>
                    </View>
                }
                renderItem={({ item, index }) => {
                    if ([1, 3].includes(item.status)) {
                        if (item.type === 'LABEL') {
                            return renderLabel(item, index);
                        }
                        if (item.type === 'TEXT_INPUT' || item.type === 'TEXT_AREA') {
                            return renderTextInput(item, index);
                        }
                        if (item.type === 'MAP_VIEW') {
                            return renderMapView(item, index);
                        }
                        if (item.type === 'UPLOAD') {
                            if (item.validation && item.validation.uploadType === 'image') {
                                return renderUploadImage(item, index);
                            }
                        }
                        if (item.type === 'SELECT_MULTIPLE') {
                            if (item.validation && item.validation.selectType === 'tag') {
                                return renderSelectMultipleTag(item, index);
                            }
                        }
                        if (item.type === 'TIME_PICKER') {
                            return renderTimePicker(item, index);
                        }
                        if (item.type === 'RADIO') {
                            return renderRadio(item, index);
                        }
                        if (item.type === 'AUTOFILL_ADDRESS') {
                            return <AutofillAddress />
                        }
                        if (item.type === 'SELECT_BOX') {
                            return renderSelecBox(item, index);
                        }
                    }
                    else if ([2, 4].includes(item.status)) {
                        return <View />
                    }
                    else {
                        return <View />
                    }

                    return <Text>Not set</Text>
                }}
            />

            <ButtonView behavior='padding'>
                <View style={{ width: '100%', alignItems: 'center', borderRadius: 10, paddingVertical: 16 }}>
                    <TouchableOpacity onPress={() => onSubmit()} style={{ backgroundColor: Color.primary, width: '90%', height: 45, borderRadius: 50, justifyContent: 'center' }}>
                        <Text style={{ color: Color.textInput }}>{itemHeader.button_label}</Text>
                    </TouchableOpacity>
                </View>
            </ButtonView>

            {/* modal for select box */}
            <ModalActionScroll
                data={currentData}
                visible={modalSelectBox && currentContentIndex !== -1}
                onPress={(val) => {
                    if (valueContent.length > 0) {
                        let newValues = [...valueContent];
                        newValues[currentHeaderIndex][currentContentIndex].value = val;

                        const branching_code = currentContent[currentContentIndex].branching_code;
                        
                        for (let i = 0; i < branching_code.length; i++) {
                            const element = branching_code[i];
                            const find = currentContent.filter((f) => f.code == element)[0];
                            if (find) {
                                const idxOf = currentContent.indexOf(find);
                                if (idxOf !== -1) {
                                    newValues[currentHeaderIndex][idxOf].value = '';
                                    currentContent[idxOf].status = 1;
                                }
                            }
                        }
                        
                        setValueContent(newValues);
                    }
                    setModalSelectBox(false);
                    setCurrentContentIndex(-1);
                }}
                onClose={() => {
                    setModalSelectBox(false);
                    setCurrentContentIndex(-1);
                }}
            />

            {/* modal upload */}
            <ModalImagePicker
                visible={modalImagePicker && currentContentIndex !== -1}
                onClose={() => {
                    setModalImagePicker(false);
                    setCurrentContentIndex(-1);
                }}
                onSelected={(callback) => {
                    if (callback.base64 && valueContent.length > 0) {
                        let arr = valueContent.length > 0 ? [valueContent[currentHeaderIndex][currentContentIndex].value] : [];
                        if (currentContent[currentContentIndex].multiple) {
                            arr = valueContent.length > 0 ? valueContent[currentHeaderIndex][currentContentIndex].value : [];
                        }

                        let newValues = [...valueContent];
                        arr.push({
                            ...callback,
                            uploadType: 'image',
                        });
                        newValues[currentHeaderIndex][currentContentIndex].value = arr;
                        setValueContent(newValues);
                    }

                    setModalImagePicker(false);
                    setCurrentContentIndex(-1);
                }}
            />

            {valueContent.length > 0 && showDatePicker && <DatePicker
                timeZoneOffsetInMinutes={7 * 60}
                modal
                open={showDatePicker}
                date={valueContent[currentHeaderIndex][currentContentIndex].value}
                mode="time"
                onConfirm={(value) => {        
                    console.log(value);            
                    setShowDatePicker(false);
                    let newValues = [...valueContent];
                    newValues[currentHeaderIndex][currentContentIndex].value = value;
                    setValueContent(newValues);
                }}
                onCancel={() => {
                    setShowDatePicker(false);
                }}
            />}
        </Scaffold>
    )
}

export default SurveyPasarScreen;