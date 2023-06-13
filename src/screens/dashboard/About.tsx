import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import Container from '../../components/common/Container';
import DrawerImage from '../../assets/allicons/drawer.svg';
import deviceInfoModule from 'react-native-device-info';
import {hp, wp} from '../../components/common/Responsive';
import {DrawerActions} from '@react-navigation/native';
import LogoWhite from '../../assets/allicons/logo-white.svg';
import {useAppSelector} from '../../hooks';
import {ColorsI} from '../../models';
import TextBold from '../../components/ui/TextBold';
import {supalogo} from '../../constant/Images';

interface nav {
  navigation: any;
}
export default function About(props: nav) {
  const dashboardReducer = useAppSelector(State => State.dashboardReducer);
  const {colors} = dashboardReducer;
  const styles = useStyles(colors);
  return (
    <Container
      drawer={
        <TouchableOpacity
          style={{
            left: wp(4),
            position: 'absolute',
            top: deviceInfoModule.hasNotch() ? hp(7) : hp(4.5),
            marginTop: Platform.OS == 'ios' ? hp(2.2) : 0,
          }}
          onPress={() => props.navigation.dispatch(DrawerActions.openDrawer())}>
          <DrawerImage width={21} height={21} />
        </TouchableOpacity>
      }
      logo={
        <Image
          resizeMode="contain"
          style={{
            height: Platform.OS == 'ios' ? hp(6) : hp(5.5),
            width: wp(42),
          }}
          source={supalogo}
        />
      }>
      <View style={{width: wp(90), alignSelf: 'center', flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.Home}
            onPress={() => props.navigation.navigate('Home')}>
            <Text style={styles.Htext}>{'<'}</Text>
            <Text style={styles.Htext}>Home</Text>
          </TouchableOpacity>
          <TextBold style={styles.contactus}>About Supa.pk</TextBold>
          <View style={{top: wp(3.5)}}>
            <TextBold style={{color: '#000', fontSize: wp(1.5)}}>
              Our Vision
            </TextBold>
            <Text
              style={{marginVertical: hp(1), fontSize: wp(4), color: '#000'}}>
              We wish to provide a better and everlasting shopping experience by
              creating a place in our customers hearts. At “Supa.pk” we believe
              that the key to success lies in customer’s satisfaction. What sets
              us apart from other vendors is the sole belief and promise that
              our customer is not only right but also the one who will
              personally take charge of how he or she wants things done. We
              ensure to deliver your respective goods at your doorstep with the
              promise that you are in good hands.
            </Text>
          </View>
          <View style={{top: wp(6)}}>
            <TextBold style={{color: '#000', fontSize: wp(1.5)}}>
              Who we are
            </TextBold>
            <Text
              style={{
                marginVertical: hp(1),
                fontSize: wp(4),
                marginBottom: hp(8),
                color: '#000',
              }}>
              “Supa” in Japanese language means “Supermarket” and that is what
              we at Supa.pk aim to achieve with an online shopping website that
              provides superior shopping experience in Pakistan. Our products
              range from Cosmetics, Digital Accessories, Mobile Accessories,
              Apparels and wide variety of households & garments.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Container>
  );
}
const useStyles = (colors: ColorsI) =>
  StyleSheet.create({
    container: {
      width: wp(100),
      alignSelf: 'center',
      backgroundColor: '#fff',
    },
    Home: {
      flexDirection: 'row',
      marginTop: wp(6),
      borderBottomWidth: 1,
      width: wp(16.5),
      // marginLeft: wp(4),
      borderColor: colors.secondary,
      justifyContent: 'space-between',
    },
    Htext: {
      color: colors.secondary,
      fontSize: wp(4.5),
      fontWeight: '400',
    },
    contactus: {
      fontSize: wp(2.5),
      color: colors.primary,
      marginTop: wp(3),
    },
    text: {
      width: wp(55),
      color: '#575757',
      fontSize: wp(4),
    },

    btn: {
      backgroundColor: colors.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      width: wp(35),
      ...Platform.select({
        android: {
          height: 45,
        },
        ios: {
          height: 45,
        },
      }),
      marginTop: wp(10),
      alignSelf: 'flex-end',
      borderRadius: 10,
    },
  });
