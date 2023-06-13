import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import shopifyApiService from '../../services/ShopifyApiService';
//@ts-ignore

import {DefaultPic, CollectionTitle} from '../../constant/Images';
import Container from '../../components/common/Container';
import {hp, wp} from '../../components/common/Responsive';
import {ColorsI, custom_collections} from '../../models';

//@ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAppSelector} from '../../hooks';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import WhatsApp from '../../components/common/whatsappLogo';

import FastImage from 'react-native-fast-image';
const {getCollection} = shopifyApiService;

interface Props {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<
    {
      path?: any;

      params?: {
        pId?: any;
        cId?: any;
        title: string;
        titleFlag?: boolean;
        path: any;
      };
    },
    'params'
  >;
}
const Catalogue = (props: Props) => {
  const [loader, setLoader] = useState<boolean>(false);

  const [focus, setFocus] = useState<boolean>(false);

  const [collection, setcollection] = useState<
    Array<custom_collections | undefined>
  >([]);

  const dashboardReducer = useAppSelector(State => State.dashboardReducer);
  const {colors} = dashboardReducer;
  const styles = useStyles(colors);
  useEffect(() => {
    getCollections();
  }, []);
  useEffect(() => {
    if (props.navigation.isFocused()) {
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    }
    return () =>
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
  }, [props.navigation.isFocused()]);
  function handleBackButtonClick() {
    props.navigation.goBack();

    return true;
  }
  const getCollections = async () => {
    setLoader(true);
    let temp: any = [];
    const res = await getCollection();

    if (res?.status == 200) {
      res.data.smart_collections.map(e => {
        CollectionTitle.map((a, i) => {
          if (a.key == e.title) {
            CollectionTitle[i].value = e;
          }
        });
      });

      CollectionTitle.map(e => {
        temp.push(e.value);
      });
      setcollection(temp!);

      setLoader(false);
    } else {
      return [];
    }
  };
  const renderItem = (item: any) => {
    let img = item?.item?.image?.src.split('?', 1).toString();

    return (
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate('CatalogueItemScreen', {
            ...item.item,
            title: item.item.title,
            catId: item.item.id,
            callApi: true,
          })
        }
        style={styles.flatList}>
        <Text numberOfLines={2} style={styles.text2}>
          {' '}
          {item?.item?.title}
        </Text>
        {img ? (
          <FastImage
            style={styles.img}
            source={{uri: img, priority: FastImage.priority.high}}
          />
        ) : (
          <Image style={[styles.img, {height: hp(12)}]} source={DefaultPic} />
        )}
      </TouchableOpacity>
    );
  };

  const onFocus = (e: boolean) => {
    setFocus(true);
  };
  const onBlur = (e: boolean) => {
    setFocus(false);
  };

  return (
    <Container
      path={props.route.path}
      navigation={props.navigation}
      cart
      arrow
      headerTitle={'Categories'}>
      <View style={styles.container}>
        <Pressable
          onPress={() =>
            props.navigation.navigate('Catalogue', {
              screen: 'SearchScreen',
              path: 'CatalogueI',
            })
          }
          style={styles.SearchView}>
          <>
            <MaterialIcons
              name="search"
              size={25}
              color={'grey'}
              style={{marginLeft: 10}}
            />
            <Text style={{color: '#9B9B9B', marginLeft: 5}}>
              What are you looking for?
            </Text>
          </>
        </Pressable>

        {loader ? (
          <ActivityIndicator
            style={{justifyContent: 'center', flex: 1}}
            size="large"
            color={colors.secondary}
          />
        ) : (
          <FlatList
            key={'#'}
            style={{flexGrow: 0}}
            showsHorizontalScrollIndicator={false}
            data={collection}
            extraData={collection}
            renderItem={renderItem}
          />
        )}
        <WhatsApp />
      </View>
    </Container>
  );
};

export default Catalogue;

const useStyles = (colors: ColorsI) =>
  StyleSheet.create({
    container: {
      backgroundColor: '#f5f2f2',
      flex: 1,
    },
    text2: {
      alignSelf: 'center',
      width: wp(55),
      // borderWidth: 1,
      color: 'black',
      fontWeight: 'bold',
      fontSize: wp(4),
      marginLeft: wp(2),
    },

    SearchView: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      width: wp(85),
      alignSelf: 'center',
      zIndex: 1,
      top: hp(-2.5),
      borderRadius: 25,
      height: wp(10),
      justifyContent: 'flex-start',
      elevation: 10,
      shadowColor: 'black',
      shadowOpacity: 0.26,
      shadowOffset: {width: 0, height: 2},
      shadowRadius: 10,
      alignItems: 'center',
    },
    flatList: {
      width: wp(90),
      height: hp(12),
      borderRadius: 15,
      marginHorizontal: 5,
      overflow: 'hidden',
      flexDirection: 'row',
      marginVertical: 5,
      alignSelf: 'center',
      backgroundColor: '#fff',
      // alignItems: 'center',
      justifyContent: 'space-between',
    },
    img: {
      width: wp(30),
      borderTopRightRadius: 15,
      borderBottomRightRadius: 15,
    },
  });
