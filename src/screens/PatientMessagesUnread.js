/* @flow */

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  Text
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import PatientMessageItem from '../components/PatientMessageItem';
import Spinner from 'react-native-loading-spinner-overlay';
import MessagesIconWithBadge from '../components/MessagesIconWithBadge';
import SInfo from 'react-native-sensitive-info';
import Patient from './PatientMessages';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import PropTypes from 'prop-types';
import constants from './../constants/constants'
export default class PatientMessagesUnread extends Component {
  static navigationOptions = {
    headerTintColor: '#ffffff',
    headerStyle: {
      backgroundColor: constants.baseColor
    },
    tabBarIcon: ({ tintColor }) => (
      <Image style={{ width: 30, height: 30 }} source={tintColor == constants.baseColor ? require('../images/n2-on.png') : require('../images/n2-off.png')} />
    ),
  }
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      rady: false,
      dataArray: [],
      dataArrayAll: [],
      patientId: '',
      post_id: '',
      isRefreshing: false,
      isSearching: false,
      alertMsg: '',
      unreadCount: '0',
      more: '0',
      page: 0,
      token: ''
    };
  }

  componentDidMount() {
    this.setState({
      page: 0,
      dataArray: [],
      dataArrayAll: [],
    })
    SInfo.getItem('patient_id', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      this.setState({ patientId: value, })
    });
    SInfo.getItem('token', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      console.log('time to fetch token')
      this.setState({ token: value, })
    });
    SInfo.getItem('post_id', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      console.log('WWWWWW= ' + value);
      if (value == '' || value == undefined) {
        value = "";
      }
      this.setState({ post_id: value, })
      this.mGetRecentPost();
      //this.mUnreadChatCountForPatient();

    });
  }

  mFailed() {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        Alert.alert('Failed', 'Something went wrong, Please try again');
      }, 200);
    });
  }
  mGetRecentPost() {
    var mThis = this;
    var rawData = [];
    var mUnreadCount = 0;

    fetch(constants.url + 'get-recent-post', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: this.state.token,
        patient_id: this.state.patientId,
        post_id: this.state.post_id,
        is_read: '0',
        page: this.state.page,
        perpage: '13',
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        //var users = responseJson;
        for (i in responseJson.patient_post_arr) {
          if (responseJson.patient_post_arr[i].chat_history_arr.get_doctor == null) {
          } else {
            rawData.push(responseJson.patient_post_arr[i])
          }
        }
        mThis.setState({
          more: responseJson.more,
          dataArray: mThis.state.dataArray.concat(rawData),
          dataArrayAll: mThis.state.dataArrayAll.concat(rawData),
          post_id: '',
          alertMsg: 'Sorry! No messages available'
        });
        mThis.mLoaderShowHide();
        mThis.props.navigation.setParams({ handleSave: mThis.state.unCounts });
        SInfo.setItem('post_id', '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
        //console.log("<><><>akki "+responseJson);
      })
      .catch((error) => {
        console.log(error);
        mThis.setState({
          rady: true,
          post_id: '',
          alertMsg: 'Something went wrong, Please try again'
        });
        SInfo.setItem('post_id', '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
        mThis.mFailed();
      });
  }
  mLoaderShowHide() {
    this.setState({
      visible: !this.state.visible,
      rady: !this.state.rady
    });
  };
  mUnreadChatCountForPatient() {
    var mThis = this;
    var rawData = [];
    var data = new FormData();
    data.append("auth_token", this.state.token);
    data.append("patient_id", this.state.patientId);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        if (this.responseText.indexOf('status') !== -1) {
          var text = this.responseText;
          console.log('<><><>abc1' + this.responseText);
          var obj = JSON.parse(text);
          mThis.setState({
            unreadCount: obj.unread_history_count
          });
          //mThis.props.navigation.setParams({ handleSave: mThis.state.unreadCount });
        } else {
          mThis.setState({
            unreadCount: '0'
          });
        }
      }
    });
    xhr.open("POST", constants.url + 'unread-chat-count-for-patient');
    xhr.send(data);
  }
  mSearchFilterFunction(text) {
    const newData = this.state.dataArray.filter(function (item) {
      const itemData = item.post_title.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1
    })
    if (!text || text === '') {
      console.log('<><><><><>change state');
      this.setState({
        dataArray: this.state.dataArrayAll,
        text: text,
        isSearching: false
      });
    }
    else if (!Array.isArray(newData) && !newData.length) {
      this.setState({
        data: [],
        isSearching: true
      });
    } else {
      this.setState({
        dataArray: newData,
        text: text,
        isSearching: true
      })
    }
  }
  onScrollHandler = () => {
    if (this.state.more == 1 && this.state.isSearching == false) {

      this.setState({
        page: this.state.page + 10,
        rady: false,
        visible: true,
      }, () => {
        SInfo.getItem('patient_id', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
          this.setState({ patientId: value, })
        });
        SInfo.getItem('post_id', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
          console.log('WWWWWW= ' + value);
          if (value == '' || value == undefined) {
            value = "";
          }
          this.setState({ post_id: value, })
          this.mGetRecentPost();
        });
      });

    }

  }
  onEndReached = () => {
    if (this.state.more == 1 && this.state.isSearching == false) {
      this.setState({
        rady: false,
        visible: true,
      });
    }
    console.log("<><>#  " + this.state.page);
    console.log("<><>#  " + this.state.more);
  };
  mRefresh = async () => {
    this.setState({
      page: 0,
      rady: false,
      visible: true,
      dataArray: [],
      dataArrayAll: [],
    });
    SInfo.getItem('patient_id', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      this.setState({ patientId: value, })
      this.mGetRecentPost();
      //this.mUnreadChatCountForPatient();
    });

  };
  renderHeader = () => {
    return (
      <SearchBar
        placeholder="Search here ..."
        containerStyle={{ backgroundColor: 'white' }}
        inputStyle={{ color: '#000' }}
        lightTheme
        onChangeText={(text) => this.mSearchFilterFunction(text)}
      />
    );
  };
  render() {
    const { navigate } = this.props.navigation;
    if (this.state.rady == false) {
      return (
        <View style={styles.container}>
          <Spinner overlayColor={'rgba(0, 0, 0, 0.75)'} color={'#08a1d9'} textContent={"Updating"} visible={this.state.visible} textStyle={{ color: '#fff', fontSize: 15, marginTop: -70 }} />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          {this.state.dataArray.length <= 0 ?
            <View style={{ width: "100%", height: 50, backgroundColor: "#111", justifyContent: 'center', alignItems: 'center' }}>
              <Text allowFontScaling={false} style={{ fontSize: 18, fontWeight: '500', color: '#fff' }}>
                {this.state.alertMsg}
              </Text>
            </View>
            :
            <View>
            </View>
          }
          <FlatList
            //onEndReachedThreshold={0.5}
            onRefresh={this.mRefresh}
            refreshing={this.state.isRefreshing}
            data={this.state.dataArray}
            keyExtractor={item => item.chat_history_arr.id}
            ListHeaderComponent={this.renderHeader}
            renderItem={({ item }) => <PatientMessageItem item={item} onPress={() => navigate('PatientChatWindow', item)} />}
          //onEndReached={this.onScrollHandler}
          />
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
