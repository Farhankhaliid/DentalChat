/* @flow */

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  Text,
  Platform,
  Modal,
  Button,
  SafeAreaView,
  ActivityIndicator,
  WebView
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { SearchBar } from 'react-native-elements';
import DentistMessageItem from '../components/DentistMessageItem';
import { Data } from '../data/DentistMessagesList';
import Spinner from 'react-native-loading-spinner-overlay';
import MessagesIconWithBadge from '../components/MessagesIconWithBadge';
import SInfo from 'react-native-sensitive-info';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import constants from './../constants/constants'
import timer from 'react-native-timer';
import filterImage from './../images/filterresult.png'
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';
export default class Subscription extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {

      headerTintColor: '#ffffff',
      headerStyle: {
        backgroundColor: constants.baseColor
      },
      headerLeft: <TouchableOpacity onPress={() => navigation.navigate('subscripitonScreen')} >
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontSize: 15, marginTop: 7, marginLeft: 5, fontWeight: '500', color: '#ffffff' }}>Back</Text>
        </View>
      </TouchableOpacity>
    };
  };
  constructor(props) {
    global.MyDental = '0';
    super(props);
    this.state = {
      visible: false,
      rady: false,
      dataArray: [],
      dataArrayAll: [],
      doctorId: '',
      isRefreshing: false,
      isSearching: false,
      alertMsg: '',
      opration: '',
      type: '',
      more: '0',
      page: 0,
      unreadCount: '0',
      token: '',
      mUnreadCount: 0,
      showModal: false,
      scrollDown: false,
      checkBox: 0,
      SearchBarColor: '#bdc6ce',
      visible: true,
      loading: true,
      token: ''
    };
  }
  componentDidMount() {
    SInfo.getItem('token', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      // console.log('time to fetch token')
      // console.log("https://dentalchat.com/dentistdirectory?token=" + value)
      this.setState({ token: value, })
    });
  }
  render() {

    return (
      <View style={{ flex: 1 }}>
        <SafeAreaView style={{ backgroundColor: constants.baseColor }}></SafeAreaView>
        <View style={{ flex: 1, backgroundColor: 'white' }} >
          {/* {this.renderToolbar()} */}
          <WebView
            onLoad={() => { this.setState({ visible: false, loading: false }) }}
            source={{ uri: "https://dentalchat.com/dentistdirectory?token=" + this.state.token }}
          />
          {this.state.visible && (
            <View style={styles.activityIndicatorView}>
              <View style={styles.activityIndicatorWrapper}>
                <ActivityIndicator
                  size={"large"}
                  color={constants.baseColor}
                  animating={this.state.loading} />
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderBottomWidth: 35,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: constants.baseColor,
    transform: [
      { rotate: '90deg' }
    ],
    // right: -10,
    top: 12
  },
  triangle2: {
    width: 0,
    height: 0,
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderBottomWidth: 35,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: constants.baseColor,
    transform: [
      { rotate: '270deg' }
    ],
    top: 12
  },
  textTitle: {
    fontSize: 20,
    color: "white",
    marginLeft: 15,
  },
  activityIndicatorView: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '15%'
  },
  activityIndicatorWrapper: {
    // position:'absolute',
    // top:'35%',
    // left:'38%',
    backgroundColor: 'gray',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
  },
});