import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {CatalogueStackI, DashBoardI, ProfileI} from './RootStackParams';
import Tabbar from '../containers/Tabbar';
// import HomeDrawer from './HomeDrawer';
import Catalogue from '../screens/dashboard/Catalogue';
import Profile from '../screens/dashboard/Profile';
import CatalogueItemScreen from '../screens/dashboard/CatalogueItemScreem';
import SelectedProduct from '../screens/dashboard/SelectedProduct';
import Notifications from '../screens/dashboard/Notifications';
import Cart from '../screens/dashboard/Cart';
import Reviews from '../screens/dashboard/Reviews';
import ShippingAddress from '../screens/dashboard/ShippingAddress';
import AddAddress from '../screens/dashboard/AddAdress';
import EditProfile from '../screens/dashboard/EditProfile';
import MyOrder from '../screens/dashboard/Order';
import SearchScreen from '../screens/Search/Search';
import CompleteCheckout from '../screens/dashboard/CompleteCheckout';
import {wp} from '../components/common/Responsive';
import {useAppSelector} from '../hooks';
import About from '../screens/dashboard/About';
import Contactus from '../screens/dashboard/Contactus';
import FAQ from '../screens/dashboard/FAQ';
import Privacy from '../screens/dashboard/Privacy';
import ProductWarrenty from '../screens/dashboard/ProductWarrenty';
import ReturnExchange from '../screens/dashboard/ReturnExchange';
import Review from '../screens/dashboard/Review';
import ShippingPolicy from '../screens/dashboard/ShippingPolicy';
import Supa360 from '../screens/dashboard/supa360View';
import TermCondition from '../screens/dashboard/TermCondition';
import Home from '../screens/Home/Home';
import SideBar from '../containers/Drawer';
import {createDrawerNavigator} from '@react-navigation/drawer';

const {Navigator, Screen} = createBottomTabNavigator<DashBoardI>();

const CatalogueComponent = () => {
  const CatalogueStack = createNativeStackNavigator<CatalogueStackI>();
  const sharedScreens = getSharedScreens(CatalogueStack);
  return (
    <CatalogueStack.Navigator screenOptions={{headerShown: false}}>
      <CatalogueStack.Screen name="CatalogueI" component={Catalogue} />
      {sharedScreens}
    </CatalogueStack.Navigator>
  );
};
const ProfileComponent = () => {
  const ProfileStack = createNativeStackNavigator<ProfileI>();
  return (
    <ProfileStack.Navigator
      initialRouteName="profile"
      screenOptions={{headerShown: false}}>
      <ProfileStack.Screen name="profile" component={Profile} />
      <ProfileStack.Screen name="ShippingAddress" component={ShippingAddress} />
      <ProfileStack.Screen name="AddAddress" component={AddAddress} />
      <ProfileStack.Screen name="EditProfile" component={EditProfile} />
      <ProfileStack.Screen name="MyOrder" component={MyOrder} />
    </ProfileStack.Navigator>
  );
};
const HomeDrawer: React.FC = () => {
  const DrawerStack = createDrawerNavigator<DashBoardI>();
  const sharedScreens = getSharedScreens(DrawerStack);

  const dashboardReducer = useAppSelector(State => State.dashboardReducer);
  const {colors} = dashboardReducer;
  return (
    <DrawerStack.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: wp(70),
          borderBottomRightRadius: 20,
          borderTopRightRadius: 20,
          overflow: 'hidden',
        },
      }}
      useLegacyImplementation={false}
      drawerContent={props => <SideBar colors={colors} drawerProps={props} />}>
      <DrawerStack.Screen component={Home} name="Home" />
      <DrawerStack.Screen component={Contactus} name="Contactus" options={{}} />
      <DrawerStack.Screen component={About} name="About" />
      <DrawerStack.Screen component={MyOrder} name="MyOrder" />
      <DrawerStack.Screen component={Review} name="Review" />

      <DrawerStack.Screen name="ReturnExchange" component={ReturnExchange} />
      <DrawerStack.Screen name="ShippingPolicy" component={ShippingPolicy} />
      <DrawerStack.Screen name="ProductWarrenty" component={ProductWarrenty} />
      <DrawerStack.Screen name="FAQ" component={FAQ} />
      <DrawerStack.Screen name="Privacy" component={Privacy} />
      <DrawerStack.Screen name="TermCondition" component={TermCondition} />
      <DrawerStack.Screen name="Supa360" component={Supa360} />
      {sharedScreens}
    </DrawerStack.Navigator>
  );
};
const HomeTabs = () => {
  return (
    <Navigator
      tabBar={props => <Tabbar {...props} />}
      initialRouteName="HomeDrawer"
      screenOptions={{headerShown: false, tabBarHideOnKeyboard: true}}>
      <Screen name="HomeDrawer" component={HomeDrawer} />
      <Screen name="Catalogue" component={CatalogueComponent} />
      <Screen name="Notifications" component={Notifications} />
      <Screen name="Profile" component={ProfileComponent} />
      {/* <Screen name="More" component={MoreComponent} /> */}

      {/* <Screen name="SelectedProduct" component={SelectedProduct} /> */}
    </Navigator>
  );
};
const getSharedScreens = (Stack: any) => {
  return [
    <Stack.Screen
      key="CatalogueItemScreen"
      name="CatalogueItemScreen"
      component={CatalogueItemScreen}
    />,
    <Stack.Screen
      key="SelectedProduct"
      name="SelectedProduct"
      component={SelectedProduct}
    />,
    <Stack.Screen
      key="SearchScreen"
      name="SearchScreen"
      component={SearchScreen}
    />,
    <Stack.Screen key="Reviews" name="Reviews" component={Reviews} />,
    <Stack.Screen key="Cart" name="Cart" component={Cart} />,
    <Stack.Screen
      key={CompleteCheckout}
      component={CompleteCheckout}
      name="CompleteCheckout"
    />,
  ];
};
export default HomeTabs;
