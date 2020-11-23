/* @flow */
import 'react-native-gesture-handler';
import React, {useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import {Text, TextInput, Alert, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './screens/Home';
import DentistLogin from './screens/DentistLogin';
import DentistDashboard from './screens/DentistDashboard';
import DentistMessages from './screens/DentistMessages';
import DentistAccount from './screens/DentistAccount';
import DentistChatWindow from './screens/DentistChatWindow';
import PostDetails from './screens/PostDetails';
import DentistEditProfile from './screens/DentistEditProfile';
import DentistChangePassword from './screens/DentistChangePassword';
import DentistForgotPassword from './screens/DentistForgotPassword';
import PatientRegistration from './screens/PatientRegistration';
import PatientForgetPassword from './screens/PatientForgetPassword';
import PatientAccount from './screens/PatientAccount';
import PatientProfileUpdate from './screens/PatientProfileUpdate';
import PatientLogin from './screens/PatientLogin';
import PatientDashBoard from './screens/PatientDashBoard';
import PatientMessages from './screens/PatientMessages';
import PatientChatWindow from './screens/PatientChatWindow';
import PatientPostDetails from './screens/PatientPostDetails';
import PatientDoctorList from './screens/PatientDoctorList';
import PatientCreatePost from './screens/PatientCreatePost';
import PatientDoctorProfile from './screens/PatientDoctorProfile';
import PatientPostDetailsFromList from './screens/PatientPostDetailsFromList';
import PatientChangePassword from './screens/PatientChangePassword';
import DentistRegistration from './screens/DentistRegistration';
import DentistProfileUpdate from './screens/Profile';
import Ionicons from 'react-native-vector-icons/Ionicons';
import mainHome from './screens/mainHome';
import constants, {DENTIST, PATIENT} from './constants/constants';
import DentistPostDetails from './screens/DentistPostDetails';
import subscripitonScreen from './screens/subscripitonScreen';
import subscriptionPurchase from './screens/subscriptionplanPurchase';
import dentistSubscription from './screens/dentistSubscription';
import dentistProfileUpdate2 from './screens/Profile-2';
import dentistProfileUpdate3 from './screens/Profile-3';
import dentistProfileUpdate4 from './screens/Profile-4';
import dentistProfileUpdate5 from './screens/Profile-5';
import dentistProfileUpdate6 from './screens/Profile-6';
import dentistProfileUpdate7 from './screens/Profile-7';
import DisplayImage from './screens/DisplayImage';
import SearchLanguage from './screens/SearchLanguage';
import editProfile from './screens/editProfile';
import ImagePicker from 'react-native-image-picker';
import MyClientList from './screens/MyClientList';

//#############PATIENT
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

export default () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);
  const [initialRouteNameIs, setInitialRouteNameIs] = React.useState('Consult');

  const PatientAccountStack = createStackNavigator();
  const PatientAccountStackScreen = () => (
    <PatientAccountStack.Navigator
      screenOptions={{
        gestureEnabled: false,
        headerTitleAllowFontScaling: false,
        headerStyle: {backgroundColor: '#1272f6'},
        headerTitleStyle: {fontWeightL: '500'},
        headerTintColor: '#ffffff',
      }}>
      <PatientAccountStack.Screen
        name="PatientAccount"
        component={PatientAccount}
        options={{title: 'Patient Account'}}
      />
      <PatientAccountStack.Screen
        name="PatientChangePassword"
        component={PatientChangePassword}
        options={{title: 'Change Password      '}}
      />
      <PatientAccountStack.Screen
        name="PatientProfileUpdate"
        component={PatientProfileUpdate}
        options={{title: 'PatientProfileUpdate'}}
      />
    </PatientAccountStack.Navigator>
  );
  const PatientDashBoardStack = createStackNavigator();
  const PatientDashBoardStackScreens = () => (
    <PatientDashBoardStack.Navigator
      screenOptions={{
        gestureEnabled: false,
        headerTitleAllowFontScaling: false,
        headerStyle: {backgroundColor: '#1272f6'},
        headerTitleStyle: {fontWeight: '500', color: '#FFF'},
        headerTintColor: '#FFFF',
      }}>
      <PatientDashBoardStack.Screen
        name="PatientDashBoard"
        component={PatientDashBoard}
        options={{title: 'Dashboard', headerBackTitle: 'Back'}}
      />
      <PatientDashBoardStack.Screen
        name="PatientDoctorList"
        component={PatientDoctorList}
        options={{title: 'Dentist Responded', headerBackTitle: 'Back'}}
      />
      <PatientDashBoardStack.Screen
        name="PatientDoctorProfile"
        component={PatientDoctorProfile}
        options={{title: 'PatientDoctorProfile'}}
      />
      <PatientDashBoardStack.Screen
        name="PatientCreatePost"
        component={PatientCreatePost}
        options={{title: 'PatientCreatePost'}}
      />
      <PatientDashBoardStack.Screen
        name="PatientPostDetailsFromList"
        component={PatientPostDetailsFromList}
        options={({route}) => ({title: route.params.post_title})}
      />
      <PatientDashBoardStack.Screen
        name="PatientMessages"
        component={PatientMessages}
        options={{title: 'PatientMessages'}}
      />
    </PatientDashBoardStack.Navigator>
  );

  const PatientCreatePostStack = createStackNavigator();
  const export_PatientCreatePostStack = () => (
    <PatientCreatePostStack.Navigator
      screenOptions={{
        headerTitleAllowFontScaling: false,
        headerStyle: {backgroundColor: '#1272f6'},
        headerTitleStyle: {fontWeight: '500', color: '#FFF'},
        headerTintColor: '#FFFF',
      }}>
      <PatientCreatePostStack.Screen
        name="mainHome"
        component={mainHome}
        options={{title: 'Home', headerShown: false}}
      />
      <PatientCreatePostStack.Screen
        name="PatientCreatePost"
        component={PatientCreatePost}
        options={{title: 'Consult Request'}}
      />
    </PatientCreatePostStack.Navigator>
  );

  const PatientMessagesStack = createStackNavigator();
  const PatientMessagesStackScreen = () => (
    <PatientMessagesStack.Navigator
      screenOptions={{
        gestureEnabled: false,
        headerTitleAllowFontScaling: false,
        headerStyle: {backgroundColor: '#1272f6'},
        headerTitleStyle: {fontWeight: '500', color: '#FFF'},
      }}>
      <PatientMessagesStack.Screen
        name="PatientMessages"
        component={PatientMessages}
        options={{title: 'Message', color: '#FFFFFF'}}
      />
      <PatientMessagesStack.Screen
        name="PatientProfileUpdate"
        component={PatientProfileUpdate}
        options={{title: 'PatientProfileUpdate'}}
      />
      {/* just for testing param issue */}
      <PatientStack.Screen
        name="PatientChatWindow"
        component={PatientChatWindow}
        options={{headerShown: false}}
      />
    </PatientMessagesStack.Navigator>
  );

  const PatientMainTab = createBottomTabNavigator();
  const PatientMainTabScreen = () => (
    <PatientMainTab.Navigator
      tabBarOptions={{
        activeTintColor: 'blue',
        inactiveTintColor: 'black',
      }}
      initialRouteName={initialRouteNameIs}
      screenOptions={{headerShown: false}}>
      <PatientMainTab.Screen
        name="Consult"
        component={export_PatientCreatePostStack}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="ios-disc" size={30} color={color} />
          ),
        }}
      />
      <PatientMainTab.Screen
        name="Message"
        component={PatientMessagesStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Ionicons name="ios-mail" size={30} color={color} />
          ),
        }}
      />
      <PatientMainTab.Screen
        name="Dashboard"
        component={PatientDashBoardStackScreens}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="ios-list-box" size={30} color={color} />
          ),
        }}
      />
      <PatientMainTab.Screen
        name="More"
        component={PatientAccountStackScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="ios-more" size={30} color={color} />
          ),
        }}
      />
    </PatientMainTab.Navigator>
  );

  // this is exportable stack  for navigation
  const PatientStack = createStackNavigator();
  const PatientMainStack = () => (
    <PatientStack.Navigator
      initialRouteName="PatientMainTab"
      screenOptions={{
        gestureEnabled: false,
        headerTitleAllowFontScaling: false,
        headerStyle: {backgroundColor: '#1272f6'},
        headerTitleStyle: {fontWeight: '500', color: '#FFF'},
      }}>
      <PatientStack.Screen
        name="PatientMainTab"
        component={PatientMainTabScreen}
        options={{headerShown: false}}
      />
      <PatientStack.Screen
        name="PatientChatWindow"
        component={PatientChatWindow}
        options={{headerShown: false}}
      />
      <PatientStack.Screen
        name="PatientPostDetails"
        component={PatientPostDetails}
        options={{
          headerBackTitle: 'Back',
          title: 'Post Details',
          headerTintColor: '#FFFF',
        }}
      />
      <PatientStack.Screen
        name="PatientDoctorProfile"
        component={PatientDoctorProfile}
        options={({route}) => ({
          title:
            route.params.chat_history_arr.get_doctor.first_name +
            ' ' +
            route.params.chat_history_arr.get_doctor.last_name,
          headerTintColor: '#FFFF',
        })}
      />
      <LoginStack.Screen
        name="Home"
        component={LoginStackScreen}
        options={{headerShown: false}}
      />
    </PatientStack.Navigator>
  );

  //###########DENTIST
  const DentistMessageStackNav = createStackNavigator();
  const DentistMessageStackNavScreen = () => (
    <DentistMessageStackNav.Navigator
      screenOptions={{
        headerTitleAllowFontScaling: false,
        gesturesEnabled: false,
        headerStyle: {backgroundColor: '#1272f6'},
        headerTitleStyle: {fontWeight: '500', color: '#FFF'},
      }}>
      <DentistMessageStackNav.Screen
        name="DentistMessages"
        component={DentistMessages}
        options={{title: 'Message'}}
      />
    </DentistMessageStackNav.Navigator>
  );

  const DentistAccountStackNav = createStackNavigator();
  DentistAccountStackNavScreens = () => (
    <DentistAccountStackNav.Navigator
      screenOptions={{
        gestureEnabled: false,
        headerTitleAllowFontScaling: false,
        headerBackTitle: 'Back',
        headerStyle: {backgroundColor: '#1272f6'},
        headerTitleStyle: {fontWeight: '500', color: '#FFF'},
        headerTintColor: '#ffffff',
      }}>
      <DentistAccountStackNav.Screen
        name="DentistAccount"
        component={DentistAccount}
        options={{title: 'My Account'}}
      />
      <DentistAccountStackNav.Screen
        name="editProfile"
        component={editProfile}
        options={{title: 'Edit Profile', headerTintColor: '#FFFF'}}
      />
      <DentistAccountStackNav.Screen
        name="DentistEditProfile"
        component={DentistEditProfile}
      />
      <DentistAccountStackNav.Screen
        name="DentistProfileUpdate"
        component={DentistProfileUpdate}
        options={{headerShown: false}}
      />
      <DentistAccountStackNav.Screen
        name="DentistProfileUpdate2"
        component={dentistProfileUpdate2}
        options={{headerShown: false}}
      />
      <DentistAccountStackNav.Screen
        name="DentistProfileUpdate3"
        component={dentistProfileUpdate3}
        options={{headerShown: false}}
      />
      <DentistAccountStackNav.Screen
        name="DentistProfileUpdate4"
        component={dentistProfileUpdate4}
        options={{headerShown: false}}
      />
      <DentistAccountStackNav.Screen
        name="DentistProfileUpdate5"
        component={dentistProfileUpdate5}
        options={{headerShown: false}}
      />
      <DentistAccountStackNav.Screen
        name="DentistProfileUpdate6"
        component={dentistProfileUpdate6}
        options={{headerShown: false}}
      />
      <DentistAccountStackNav.Screen
        name="DentistProfileUpdate7"
        component={dentistProfileUpdate7}
        options={{title: 'Edit Profile'}}
      />
      <DentistAccountStackNav.Screen
        name="dentistSubscription"
        component={dentistSubscription}
        options={{title: 'Dentist Subscription'}}
      />
      <DentistAccountStackNav.Screen
        name="DentistChangePassword"
        component={DentistChangePassword}
      />
      <DentistAccountStackNav.Screen
        name="DisplayImage"
        component={DisplayImage}
      />
      <DentistAccountStackNav.Screen
        name="SearchLanguage"
        component={SearchLanguage}
      />
      <DentistAccountStackNav.Screen
        name="MyClientList"
        component={MyClientList}
      />
    </DentistAccountStackNav.Navigator>
  );

  const DentistTabMenu = createBottomTabNavigator();
  const DentistTabMainScreen = () => (
    <DentistTabMenu.Navigator
      tabBarOptions={{
        activeTintColor: 'blue',
        inactiveTintColor: 'black',
      }}>
      {/* <DentistTabMenu.Screen name="Dashboard" component={DentistDashboardStackNav} options={{title:'Dashboard'}}/> */}
      <DentistTabMenu.Screen
        name="Message"
        component={DentistMessageStackNavScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="ios-contacts" size={30} color={color} />
          ),
        }}
      />
      <DentistTabMenu.Screen
        name="Account"
        component={DentistAccountStackNavScreens}
        options={{
          title: 'More',
          tabBarIcon: ({color, size}) => (
            <Ionicons name="ios-more" size={30} color={color} />
          ),
        }}
      />
    </DentistTabMenu.Navigator>
  );

  const DentistStack = createStackNavigator();
  const DentistMainStackScreens = () => (
    <DentistStack.Navigator
      initialRouteName="DentistTabMenu"
      screenOptions={{
        gesturesEnabled: false,
        headerTitleAllowFontScaling: false,
        headerTintColor: '#ffffffff',
        headerBackTitle: 'Back',
        headerStyle: {backgroundColor: '#1272f6'},
      }}>
      <DentistStack.Screen
        name="DentistTabMenu"
        component={DentistTabMainScreen}
        options={{headerShown: false}}
      />
      <DentistStack.Screen
        name="PatientPostDetails"
        component={PatientPostDetails}
      />
      <DentistStack.Screen
        name="DentistChatWindow"
        component={DentistChatWindow}
        options={({route}) => ({
          title:
            route.params.item.get_patient.name +
            ' ' +
            route.params.item.get_patient.last_name,
        })}
      />
      <DentistStack.Screen
        name="subscripitonScreen"
        component={subscripitonScreen}
      />
      <DentistStack.Screen
        name="DentistPostDetails"
        component={DentistPostDetails}
        options={{title: 'Dentist Post Details'}}
      />
      <DentistStack.Screen
        name="subscriptionPurchase"
        component={subscriptionPurchase}
      />
      <LoginStack.Screen
        name="Home"
        component={LoginStackScreen}
        options={{headerShown: false}}
      />
    </DentistStack.Navigator>
  );

  const LoginStack = createStackNavigator();
  const LoginStackScreen = () => (
    <LoginStack.Navigator
      screenOptions={{
        gestureEnabled: false,
        headerTitleAllowFontScaling: false,
        headerBackTitle: 'Back',
        headerStyle: {backgroundColor: '#1272f6'},
        headerTintColor: '#FFFF',
        headerTitleStyle: {fontWeight: '500', color: '#FFF'},
      }}>
      <LoginStack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <LoginStack.Screen
        name="PatientForgetPassword"
        component={PatientForgetPassword}
        options={{title: 'Password Recovery'}}
      />
      <LoginStack.Screen
        name="DentistForgotPassword"
        component={DentistForgotPassword}
        options={{title: 'Password Recovery'}}
      />
      <LoginStack.Screen
        name="DentistLogin"
        component={DentistLogin}
        options={{title: 'Dentist Login'}}
      />
      <LoginStack.Screen
        name="DentistRegistration"
        component={DentistRegistration}
        options={{title: 'Dentist Registration'}}
      />
      <LoginStack.Screen
        name="PatientLogin"
        component={PatientLogin}
        options={{title: 'Patient Login'}}
      />
      <LoginStack.Screen
        name="PatientRegistration"
        component={PatientRegistration}
        options={{title: 'Patient Registration'}}
      />
      <DentistStack.Screen
        name="DentistMainStackScreens"
        component={DentistMainStackScreens}
        options={{headerShown: false}}
      />
      <DentistStack.Screen
        name="PatientMainStack"
        component={PatientMainStack}
        options={{headerShown: false}}
      />
    </LoginStack.Navigator>
  );

  React.useEffect(() => {
    (async function getStatus() {
      try {
        await AsyncStorage.getItem('checkLoginStatus').then(value => {
          console.log('stored Value is', value);
          if (value === DENTIST) {
            console.log('Dentist Logged in ');
            setIsLoading(!isLoading);
            setUser({});
          } else if (value === PATIENT) {
            console.log('Paitent Logged in ');
            setIsLoading(!isLoading);
          }
        });
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  React.useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      // navigation.navigate(remoteMessage.data.type);
      console.log('props of this classs is =>> ', this.props);
      setInitialRouteNameIs('Message');
    });
    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          console.log('props of this classs is =>> ', this.props);
          setInitialRouteNameIs('Message');
          console.log(initialRouteNameIs);
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
      });
  }, []);

  return (
    <NavigationContainer>
      {isLoading ? (
        <LoginStackScreen />
      ) : user ? (
        <DentistMainStackScreens />
      ) : (
        <PatientMainStack />
      )}
    </NavigationContainer>
  );
};
