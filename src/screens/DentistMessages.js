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
  TouchableOpacity,

} from 'react-native';
import CheckBox from '../components/CheckBox';
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
import { ScrollView } from 'react-native-gesture-handler';
// import Checkbox from '@react-native-community/checkbox';
import { Header } from './../utils/Component'
import Styles from "./../utils/Styles";
import Images from "./../utils/Images";
import { tsThisType } from '@babel/types';

export default class DentistMessages extends Component {

  static navigationOptions = Platform.OS == 'android' ? {
    header: null
  } : ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: "Message",
      headerTintColor: "#ffffff",
      headerStyle: {
        backgroundColor: constants.baseColor
      },
      tabBarIcon: ({ tintColor }) => (
        <Icon name="ellipsis-h" size={30} color={tintColor} />
      ),
      headerRight: (
        <TouchableOpacity
          style={[Styles.rightMenu]}
          onPress={navigation.getParam('manualRefresh')}
        >
          <Image
            source={Images.ImgRefresh}
            style={{ width: 25, height: 25, marginLeft: 10 }}
            resizeMode="contain"
          ></Image>

        </TouchableOpacity>
      )
    };
  };

  // static navigationOptions = {
  //   header: null
  // }


  // static navigationOptions = {
  //   // title: 'Message',
  //   // headerTintColor: '#ffffff',
  //   // headerStyle: {
  //   //   backgroundColor: constants.baseColor
  //   // }
  //   header: null
  // };
  constructor(props) {
    global.MyDental = '0';
    super(props);
    this.state = {
      visible: false,
      rady: true,
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
      filterList: false,
      dataArrayFilter: [],
      onEndReachedCalledDuringMomentum: true,
      followUpFilter: false,
      appointmentFilter: false,
      myPatientsFilter: false,
      myChatbotFilter: false,
    };
    // http://dc2.dentalchat.com:8006

  }
  // addUserToChatroom() {
  //   const set_name_json = {
  //     from: this.state.docterId,
  //     senderName: this.state.dentistName,
  //     buddy: this.state.patientId,
  //     receiverName: this.state.patientName,
  //     roomName: '',
  //     post_id: this.state.postId
  //   };

  //   this.socket.emit('set_name', set_name_json);
  // }

  componentDidMount() {
    this.props.navigation.setParams({ manualRefresh: this.manualRefresh });
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      if (this._interval) {
        clearInterval(this._interval);
      }
      SInfo.getItem('dentist_id', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
        this.setState({ doctorId: value, })
        console.log(value)
      });
      SInfo.getItem('type', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
        this.setState({ type: value, })
      });
      SInfo.getItem('token', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
        console.log('time to fetch token')
        // console.log(value)
        this.setState({ token: value, })
      });
      console.log("FILTER:" + this.state.filterList)
      console.log("FILTER_LIST:" ,this.state.dataArrayFilter)
      if (!this.state.filterList) {
        this.refreshList()
      }
      console.log(this.state.doctorId)
    })
  }

  componentWillMounthhh() {
    // this.socket.on('test-message', function (data) {
    //   console.log('we committed listen')
    //   console.log(data)
    // });
    // AsyncStorage.getItem('token', (data) => {
    //   console.log('time to dig async')
    //   console.log(data)
    // })

    this.setState({
      page: 0,
      dataArray: [],
      dataArrayAll: [],
    })
    SInfo.getItem('dentist_id', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      this.setState({ doctorId: value, })
      console.log(value)
    });
    SInfo.getItem('type', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      this.setState({ type: value, })
    });
    SInfo.getItem('token', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      console.log('time to fetch token')
      console.log(value)

      this.setState({ token: value, })
    });
    SInfo.getItem('opration', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      this.setState({ opration: value, })
      this.setState({ rady: false })
      AsyncStorage.getItem('postData', (error, result) => {
        console.log('hey we are at async storage')
        console.log(result)
        let rawData = [];
        let mUnreadCount = 0;
        if (error == null && result != null) {
          console.log('we found the data')
          let responseJson = JSON.parse(result)
          for (i in responseJson.patient_posts) {
            // console.log(this.state.dataArray.length)
            if (responseJson.patient_posts[i].chat_history_count > 0) {
              if (responseJson.patient_posts[i].chat_history_arr.doctor_content.length <= 0) {
                mUnreadCount = mUnreadCount + responseJson.patient_posts[i].unread_chat_history_count;
              }
            }
            if (responseJson.patient_posts[i].get_patient == null) {
            } else {
              rawData.push(responseJson.patient_posts[i])
            }
          }
          this.props.navigation.setParams({ handleSave: mUnreadCount });

          this.setState({
            more: responseJson.more,
            dataArray: [...rawData],
            dataArrayAll: [...rawData],
            rady: true,
            visible: false,
            mUnreadCount: mUnreadCount,
            filterList: false
          }, () => {
            global.MyDental = mUnreadCount;
            this.props.navigation.setParams({ handleSave: mUnreadCount });
            SInfo.setItem('msgCount', mUnreadCount + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          });

        }
        else {
          console.log('we are not able to find the data')
          this.mGetRecentPost();
        }
      })
    });
    this._interval = setInterval(() => {
      this.setState({
        rady: true,
      }, () => {
        this.mgetUpdate()
      })

      // console.log('hello')
    }, 30000);
    console.log(this.state.doctorId)

  }


  stopAutoRefresh = () => {
    if (this._interval) {
      clearInterval(this._interval);
    }
  }

  restartAutoRefresh = () => {
    this.stopAutoRefresh()
    if (!this.props.navigation.isFocused()) {
      return
    }
    this._interval = setInterval(() => {
      if (!this.state.rady) {
        return
      }
      this.setState({
        rady: false,
      }, () => {
        console.log("AUTO_REFRESH_RUNNING:")
        if (this.props.navigation.isFocused()) {
          this.mgetUpdate()
        } else {
          clearInterval()
        }

      })
      // console.log('hello')
    }, 45000);
  }

  refreshList() {
    // const mThis = this
    SInfo.getItem('opration', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      this.setState({ opration: value, })
      this.setState({ rady: false })
      AsyncStorage.getItem('postData', (error, result) => {
        console.log('hey we are at async storage')
        // console.log(result)
        let rawData = [];
        let mUnreadCount = 0;
        if (error == null && result != null) {
          console.log('we found the data')
          let responseJson = JSON.parse(result)
          console.log('responseJSON',responseJson);
          for (i in responseJson.patient_posts) {
            // console.log(this.state.dataArray.length)
            if (responseJson.patient_posts[i].chat_history_count > 0) {
              if (responseJson.patient_posts[i].chat_history_arr.doctor_content.length <= 0) {
                mUnreadCount = mUnreadCount + responseJson.patient_posts[i].unread_chat_history_count;
              }
            }
            if (responseJson.patient_posts[i].get_patient == null) {
            } else {
              rawData.push(responseJson.patient_posts[i])
            }
          }
          this.props.navigation.setParams({ handleSave: mUnreadCount });
          if (this.state.scrollDown == true) {
            this.setState({
              more: responseJson.more,
              dataArray: [...this.state.dataArray, ...rawData],
              dataArrayAll: [...this.state.dataArrayAll, ...rawData],
              rady: true,
              visible: false,
              mUnreadCount: mUnreadCount,
              scrollDown: false,
              filterList: false
            }, () => {
              global.MyDental = mUnreadCount;
              this.props.navigation.setParams({ handleSave: mUnreadCount });
              SInfo.setItem('msgCount', mUnreadCount + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              this.mgetUpdate()
            });
          }
          else {
            this.setState(prevState => ({
              more: responseJson.more,
              dataArray: prevState.text && prevState.text.length > 0 ? prevState.dataArray : [...rawData],
              dataArrayAll: [...rawData],
              rady: true,
              visible: false,
              mUnreadCount: mUnreadCount,
              filterList: false
            }), () => {
              global.MyDental = mUnreadCount;
              this.props.navigation.setParams({ handleSave: mUnreadCount });
              SInfo.setItem('msgCount', mUnreadCount + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              this.mgetUpdate()
            });
          }

        }
        else {
          console.log('we are not able to find the data')
          this.stopAutoRefresh()
          this.mGetRecentPost();
        }
      })
    });
    console.log("RESTART_REFRESH_1")
    this.restartAutoRefresh()
    // this._interval = setInterval(() => {
    //   if (!this.state.rady) {
    //     return
    //   }
    //   this.setState({
    //     rady: false,
    //   }, () => {
    //     this.mgetUpdate()
    //   })
    //   // console.log('hello')
    // }, 45000);
    // console.log(this.state.doctorId)
  }


  showAlert(title, body) {
    Alert.alert(
      title, body,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }

  mLoaderShowHide() {
    this.setState({
      visible: !this.state.visible
    });
  };
  mGetUnattendantPost() {
    this.setState({ rady: false })
    var mThis = this;
    var rawData = [];
    var mUnreadCount = 0;
    fetch(constants.url + 'get-unattendant-post', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: this.state.token,
        doctor_id: this.state.doctorId,
        page: this.state.page,
        perpage: '50',
        emergency: this.state.type == "-1" ? "" : this.state.type,
        follow_up: this.state.followUpFilter ? '1' : '0',
        appointment: this.state.appointmentFilter ? '1' : '0',
        my_patients: this.state.myPatientsFilter ? '1' : '0',
        my_chatbot: this.state.myChatbotFilter ? '1' : '0',
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        //var users = responseJson;
        this.setState({ rady: true })
        if (responseJson.status == 5) {
          SInfo.setItem('is_patient_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('is_dentist_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          this.props.navigation.navigate('Home')
        }
        else {

          for (i in responseJson.patient_posts) {
            if (responseJson.patient_posts[i].chat_history_count > 0) {
              if (responseJson.patient_posts[i].chat_history_arr.length != 0) {
                if (responseJson.patient_posts[i].chat_history_arr.doctor_content.length <= 0) {
                  mUnreadCount = mUnreadCount + responseJson.patient_posts[i].unread_chat_history_count;
                }
              }
            }
            if (responseJson.patient_posts[i].get_patient == null) {
            } else {
              rawData.push(responseJson.patient_posts[i])
              // console.log("IMAGE1:https://blog.dentalchat.com/server/uploads/patient_profile_image/" + responseJson.patient_posts[i])
            }
          }

          mThis.setState({
            more: responseJson.more,
            dataArrayFilter: [...rawData],
            dataArrayAll: [...mThis.state.dataArrayAll, ...rawData],
            rady: true,
            visible: false,
            filterList: true
          }, () => {
            global.MyDental = mUnreadCount;
            mThis.props.navigation.setParams({ handleSave: mUnreadCount });
            SInfo.setItem('msgCount', mUnreadCount + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          });
        }
      })
      .catch((error) => {
        mThis.setState({
          rady: true,
          visible: false
        });
        console.log(error)
        // mThis.mFailed();
        mThis.mGetUnattendantPost()
      });
  }

  mGetArchivedPost() {
    this.setState({ rady: false })
    var mThis = this;
    var rawData = [];
    var mUnreadCount = 0;
    console.log("BODY:", JSON.stringify({
      auth_token: this.state.token,
      doctor_id: this.state.doctorId,
      page: this.state.page,
      perpage: '50',
      emergency: this.state.type == "-1" ? "" : this.state.type,
      follow_up: this.state.followUpFilter ? '1' : '0',
      appointment: this.state.appointmentFilter ? '1' : '0',
      my_patients: this.state.myPatientsFilter ? '1' : '0',
      my_chatbot: this.state.myChatbotFilter ? '1' : '0'
    }))

    fetch(constants.url + constants.API_URL.getArchivedPost, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: this.state.token,
        doctor_id: this.state.doctorId,
        page: this.state.page,
        perpage: '50',
        emergency: this.state.type == "-1" ? "" : this.state.type,
        follow_up: this.state.followUpFilter ? '1' : '0',
        appointment: this.state.appointmentFilter ? '1' : '0',
        my_patients: this.state.myPatientsFilter ? '1' : '0',
        my_chatbot: this.state.myChatbotFilter ? '1' : '0',
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        //var users = responseJson;
        this.setState({ rady: true })
        if (responseJson.status == 5) {
          SInfo.setItem('is_patient_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('is_dentist_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          this.props.navigation.navigate('Home')
        }
        else {

          for (i in responseJson.patient_posts) {
            if (responseJson.patient_posts[i].chat_history_count > 0) {
              if (responseJson.patient_posts[i].chat_history_arr.length != 0) {
                if (responseJson.patient_posts[i].chat_history_arr.doctor_content.length <= 0) {
                  mUnreadCount = mUnreadCount + responseJson.patient_posts[i].unread_chat_history_count;
                }
              }
            }
            if (responseJson.patient_posts[i].get_patient == null) {
            } else {
              rawData.push(responseJson.patient_posts[i])
              // console.log("IMAGE1:https://blog.dentalchat.com/server/uploads/patient_profile_image/" + responseJson.patient_posts[i])
            }
          }

          mThis.setState({
            more: responseJson.more,
            dataArrayFilter: [...rawData],
            dataArrayAll: [...mThis.state.dataArrayAll, ...rawData],
            rady: true,
            visible: false,
            filterList: true
          }, () => {
            global.MyDental = mUnreadCount;
            mThis.props.navigation.setParams({ handleSave: mUnreadCount });
            SInfo.setItem('msgCount', mUnreadCount + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          });
        }
      })
      .catch((error) => {
        mThis.setState({
          rady: true,
          visible: false
        });
        console.log(error)
        // mThis.mFailed();
        mThis.mGetArchivedPost()
      });
  }

  mCheckBox = (number, showLoader) => {
    console.log("NUMBER:" + number)
    this.setState({ showModal: false })
    setTimeout(() => {
      if (number == 0) {
        this.setState({ rady: false, visible: showLoader, page: 0 })
        this.stopAutoRefresh()
        if (this.state.followUpFilter || this.state.appointmentFilter || this.state.myPatientsFilter || this.state.myChatbotFilter) {
          this.mGetRecentPostWithFilter()
        } else {
          this.mGetRecentPost()
        }

      }
      else if (number == 1) {
        this.setState({ rady: false, visible: showLoader })
        this.mGetAttendantPost()
      }
      else if (number == 2) {
        this.setState({ rady: false, visible: showLoader })
        this.mGetUnattendantPost()
      } else if (number == 3) {
        this.setState({ rady: false, visible: showLoader })
        this.mGetArchivedPost()
      }
    }, 500)
  }
  mGetAttendantPost() {
    // setTimeout(() => { this.setState({ rady: false }) }, 250)
    var mThis = this;
    var rawData = [];
    var mUnreadCount = 0;
    fetch(constants.url + 'get-attendant-post', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: this.state.token,
        doctor_id: this.state.doctorId,
        page: this.state.page,
        perpage: '50',
        emergency: this.state.type == "-1" ? "" : this.state.type,
        follow_up: this.state.followUpFilter ? '1' : '0',
        appointment: this.state.appointmentFilter ? '1' : '0',
        my_patients: this.state.myPatientsFilter ? '1' : '0',
        my_chatbot: this.state.myChatbotFilter ? '1' : '0',
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({ rady: true })
        //var users = responseJson;
        if (responseJson.status == 5) {
          SInfo.setItem('is_patient_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('is_dentist_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          this.props.navigation.navigate('Home')
        }
        else {
          for (i in responseJson.patient_posts) {
            if (responseJson.patient_posts[i].chat_history_count > 0) {
              if (responseJson.patient_posts[i].chat_history_arr.doctor_content.length <= 0) {
                mUnreadCount = mUnreadCount + responseJson.patient_posts[i].unread_chat_history_count;
              }
            }
            if (responseJson.patient_posts[i].get_patient == null) {
            } else {
              rawData.push(responseJson.patient_posts[i])
              // console.log("IMAGE2:https://blog.dentalchat.com/server/uploads/patient_profile_image/" + responseJson.patient_posts[i])
            }
          }

          mThis.setState({
            more: responseJson.more,
            dataArrayFilter: [...rawData],
            dataArrayAll: [...mThis.state.dataArrayAll, ...rawData],
            rady: true,
            visible: false,
            filterList: true
          }, () => {
            global.MyDental = mUnreadCount;
            mThis.props.navigation.setParams({ handleSave: mUnreadCount });
            SInfo.setItem('msgCount', mUnreadCount + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          });

        }
      })
      .catch((error) => {
        mThis.setState({
          rady: true,
          visible: false
        });
        mThis.mGetAttendantPost();
      });
  }
  mGetRecentPost() {

    var mThis = this;
    var rawData = [];
    var mUnreadCount = 0;
    console.log("page number is " + this.state.page)
    fetch(constants.url + 'get-patients-post', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: this.state.token,
        doctor_id: this.state.doctorId,
        page: this.state.page,
        perpage: '50'
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson)
        console.log("RES:mGetRecentPost")
        if (responseJson.status == 5) {
          SInfo.setItem('is_patient_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('is_dentist_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          this.props.navigation.navigate('Home')
        }
        else {
          AsyncStorage.setItem('postData', JSON.stringify(responseJson));
          for (i in responseJson.patient_posts) {
            // console.log(this.state.dataArray.length)
            if (responseJson.patient_posts[i].chat_history_count > 0) {
              if (responseJson.patient_posts[i].chat_history_arr.doctor_content.length <= 0) {
                mUnreadCount = mUnreadCount + responseJson.patient_posts[i].unread_chat_history_count;
              }
            }
            if (responseJson.patient_posts[i].get_patient == null) {
            } else {
              rawData.push(responseJson.patient_posts[i])
            }
          }

          console.log("UNREAD_COUNT1:" + mThis.state.mUnreadCount + " " + mUnreadCount)
          if (this.state.scrollDown == true) {
            mThis.setState({
              more: responseJson.more,
              dataArray: [...mThis.state.dataArray, ...rawData],
              dataArrayAll: [...mThis.state.dataArrayAll, ...rawData],
              rady: true,
              visible: false,
              mUnreadCount: mUnreadCount,
              scrollDown: false,
              filterList: false
            }, () => {
              global.MyDental = mUnreadCount;
              mThis.props.navigation.setParams({ handleSave: mUnreadCount });
              SInfo.setItem('msgCount', mUnreadCount + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              console.log("RESTART_REFRESH_2")
              mThis.restartAutoRefresh()
            });
          }
          else {
            mThis.setState({
              more: responseJson.more,
              dataArray: [...rawData],
              dataArrayAll: [...rawData],
              rady: true,
              visible: false,
              mUnreadCount: mUnreadCount,
              filterList: false
            }, () => {
              global.MyDental = mUnreadCount;
              mThis.props.navigation.setParams({ handleSave: mUnreadCount });
              SInfo.setItem('msgCount', mUnreadCount + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              console.log("RESTART_REFRESH_3")
              mThis.restartAutoRefresh()
            });
          }
        }

      })
      .catch((error) => {
        mThis.setState({
          rady: true,
          visible: false
        });
        // this.stopAutoRefresh()
        mThis.mGetRecentPost();
      });
  }

  mGetRecentPost1() {

    console.log("API:mGetRecentPost1:" + this.state.mUnreadCount)

    var mThis = this;
    var rawData = [];
    var mUnreadCount = 0//this.state.mUnreadCount;
    let data = []
    console.log("page number is " + this.state.page)
    fetch(constants.url + 'get-patients-post', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: this.state.token,
        //auth_token: 'haiuhsaiuhasiuhiushuisa',
        doctor_id: this.state.doctorId,
        page: this.state.page,
        perpage: '100',
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson)
        //var users = responseJson;
        if (responseJson.status == 5) {
          SInfo.setItem('is_patient_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('is_dentist_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          this.props.navigation.navigate('Home')
        }
        else {

          for (i in responseJson.patient_posts) {
            console.log(mThis.state.dataArray.length)
            if (responseJson.patient_posts[i].chat_history_count > 0) {
              if (responseJson.patient_posts[i].chat_history_arr.doctor_content.length <= 0) {
                mUnreadCount = mUnreadCount + responseJson.patient_posts[i].unread_chat_history_count;
              }

            }
            if (responseJson.patient_posts[i].get_patient == null) {

            } else {
              rawData.push(responseJson.patient_posts[i])
            }



          }

          console.log("UNREAD_COUNT2:" + mThis.state.mUnreadCount + " " + mUnreadCount)
          mThis.setState({
            more: responseJson.more,
            dataArray: [...mThis.state.dataArrayAll, ...rawData],
            dataArrayAll: [...rawData],
            rady: true,
            visible: false,
            // mUnreadCount: mUnreadCount,
            scrollDown: false
          }, () => {
            console.log(rawData)
            console.log("rawData is as follow")
            // global.MyDental = mUnreadCount;
            // mThis.props.navigation.setParams({ handleSave: mUnreadCount });
            // SInfo.setItem('msgCount', mUnreadCount + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
            console.log("RESTART_REFRESH_4")
            mThis.restartAutoRefresh()
          });
        }

      })
      .catch((error) => {
        console.log("ON_SCROLL_ERROR")
        mThis.setState({
          rady: true,
          visible: false
        });
        mThis.mGetRecentPost1();
      });
  }

  mGetRecentPostWithFilter() {

    var mThis = this;
    var rawData = [];
    var mUnreadCount = 0;
    console.log("page number is " + this.state.page)
    fetch(constants.url + 'get-patients-post', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: this.state.token,
        doctor_id: this.state.doctorId,
        page: this.state.page,
        perpage: '50',
        follow_up: this.state.followUpFilter ? '1' : '0',
        appointment: this.state.appointmentFilter ? '1' : '0',
        my_patients: this.state.myPatientsFilter ? '1' : '0',
        my_chatbot: this.state.myChatbotFilter ? '1' : '0',
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson)
        console.log("RES:" + JSON.stringify(responseJson))
        if (responseJson.status == 5) {
          SInfo.setItem('is_patient_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('is_dentist_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          this.props.navigation.navigate('Home')
        }
        else {
          for (i in responseJson.patient_posts) {
            if (responseJson.patient_posts[i].chat_history_count > 0) {
              if (responseJson.patient_posts[i].chat_history_arr.length != 0) {
                if (responseJson.patient_posts[i].chat_history_arr.doctor_content.length <= 0) {
                  mUnreadCount = mUnreadCount + responseJson.patient_posts[i].unread_chat_history_count;
                }
              }
            }
            if (responseJson.patient_posts[i].get_patient == null) {
            } else {
              rawData.push(responseJson.patient_posts[i])
              // console.log("IMAGE1:https://blog.dentalchat.com/server/uploads/patient_profile_image/" + responseJson.patient_posts[i])
            }
          }

          mThis.setState({
            more: responseJson.more,
            dataArrayFilter: [...rawData],
            dataArrayAll: [...mThis.state.dataArrayAll, ...rawData],
            rady: true,
            visible: false,
            filterList: true
          }, () => {
            global.MyDental = mUnreadCount;
            mThis.props.navigation.setParams({ handleSave: mUnreadCount });
            SInfo.setItem('msgCount', mUnreadCount + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          });
        }

      })
      .catch((error) => {
        mThis.setState({
          rady: true,
          visible: false
        });
        // this.stopAutoRefresh()
        mThis.mGetRecentPostWithFilter();
      });
  }
  mgetUpdate() {
    console.log("UPDATE_MSG:")

    SInfo.getItem('token', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      console.log('time to fetch token')
      this.setState({ token: value, })
    });
    SInfo.getItem('dentist_id', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      this.setState({ doctorId: value, })
      console.log(value)
    });
    var mThis = this;
    var rawData = [];
    var mUnreadCount = 0;
    var firstMsgChanged = false

    fetch(constants.url + 'get-patients-post', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: this.state.token,
        doctor_id: this.state.doctorId,
        page: 0,
        perpage: '100',
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log("RES:mgetUpdate")
        // console.log("DENTIST_MSGS:" + JSON.stringify(responseJson))
        //var users = responseJson;
        AsyncStorage.setItem('postData', JSON.stringify(responseJson));

        if (responseJson.status == 5) {
          AsyncStorage.setItem('postData', '');
          SInfo.setItem('is_patient_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('is_dentist_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          this.props.navigation.navigate('Home')
        }
        else {
          // console.log('we are playing with the data now')
          for (i in responseJson.patient_posts) {
            if (responseJson.patient_posts[i].chat_history_count > 0) {
              if (responseJson.patient_posts[i].chat_history_arr.doctor_content.length <= 0) {
                mUnreadCount = mUnreadCount + responseJson.patient_posts[i].unread_chat_history_count;
              }
            }
            if (responseJson.patient_posts[0].post_id != mThis.state.dataArrayAll[0].post_id) {
              firstMsgChanged = true
              // console.log('there is a change in post id')
              console.log(mThis.state.dataArrayAll.length)
              // if (responseJson.patient_posts[i].chat_history_count > 0) {
              //   if (responseJson.patient_posts[i].chat_history_arr.doctor_content.length <= 0) {
              //     mUnreadCount = mUnreadCount + responseJson.patient_posts[i].unread_chat_history_count;
              //   }
              // }
              if (responseJson.patient_posts[i].get_patient == null) {
              } else {
                rawData.push(responseJson.patient_posts[i])
              }
            }
            else if ((responseJson.patient_posts[0].post_id != mThis.state.dataArrayAll[0].post_id)
              && responseJson.patient_posts[0].unread_chat_history_count != mThis.state.dataArrayAll[0].unread_chat_history_count) {
              // console.log('there is a change in msg only')
              rawData.push(responseJson.patient_posts[i])
            }
            else if (mThis.state.mUnreadCount == mUnreadCount) {

            } else {
              // console.log('there is an update');
              // console.log(mThis.state.mUnreadCount)
              // console.log(mUnreadCount);
              // console.log(responseJson)
              rawData.push(responseJson.patient_posts[i])

            }

          }

          console.log("UNREAD_COUNT3:" + mThis.state.mUnreadCount + " " + mUnreadCount)
          if (mThis.state.mUnreadCount != mUnreadCount || firstMsgChanged) {
            console.log("Msgs_Updated")

            mThis.setState(prevState => ({
              more: responseJson.more,
              dataArray: prevState.text && prevState.text.length > 0 ? prevState.dataArray : rawData,
              dataArrayAll: rawData,
              rady: true,
              visible: false,
              mUnreadCount: mUnreadCount
            }), () => {
              global.MyDental = mUnreadCount;
              mThis.props.navigation.setParams({ handleSave: mUnreadCount });
              SInfo.setItem('msgCount', mUnreadCount + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
            });
          } else {
            console.log("Msgs_Not_Updated")
            mThis.setState({
              rady: true,
              visible: false
            });
          }

        }
      })
      .catch((error) => {
        mThis.setState({
          rady: true,
          visible: false
        });
        console.log('the issue occur')
        // mThis.mFailed();
        // Alert.alert('Failed', error);

      });
  }
  mFailed() {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        Alert.alert('Failed', 'Something went wrong please try again');
      }, 200);
    });
  }

  mSearchFilterFunction = (text) => {
    console.log(text);
    let dataArray = this.state.dataArrayAll;
    console.log(dataArray);
    let filteredData = dataArray.filter(
      obj =>
        (obj.get_patient.name && obj.get_patient.name.includes(text)) ||
        (obj.get_patient.last_name && obj.get_patient.last_name.includes(text)) ||
        (obj.get_patient.email && obj.get_patient.email.includes(text.toLowerCase()))
    )
    console.log(filteredData)

    this.setState({
      dataArray: filteredData,
      text: text,
      isSearching: false,
    });
  }
  // mSearchFilterFunction(text) {
  //   console.log(this.state.dataArrayAll);
  //   const newData = this.state.dataArrayAll.filter(function (item) {
  //     console.log("ITEM:" + JSON.stringify(item))
  //     const postId = item.post_id.toString();
  //     const patientId = item.patient_id.toString();
  //     const itemData = item.post_title.toUpperCase();
  //     const itemDescription = item.description.toUpperCase();
  //     const itemName = item.get_patient.name.toUpperCase()
  //     const itemLastName = item.get_patient.last_name.toUpperCase()
  //     const email = item.get_patient.email.toUpperCase()
  //     const contact = item.get_patient.contact.toUpperCase()
  //     const painLevel = item.pain_level.toUpperCase()
  //     const currentLocation = item.current_location.toUpperCase()
  //     const appointmentDateTime = item.appointment_time.toString().toUpperCase()
  //     const postedDateTime = item.posted_date.toString().toUpperCase()
  //     const insuranceInformation = item.insurance_information.toUpperCase()
  //     const textData = text.toUpperCase();

  //     if (painLevel.indexOf(textData) > -1) {
  //       return painLevel.indexOf(textData) > -1
  //     }
  //     else if (postId.indexOf(textData) > -1) {
  //       return postId.indexOf(textData) > -1
  //     }
  //     else if (patientId.indexOf(textData) > -1) {
  //       return patientId.indexOf(textData) > -1
  //     }
  //     else if (itemName.indexOf(textData) > -1) {
  //       return itemName.indexOf(textData) > -1
  //     }
  //     else if (itemLastName.indexOf(textData) > -1) {
  //       return itemLastName.indexOf(textData) > -1
  //     }
  //     else if (email.indexOf(textData) > -1) {
  //       return email.indexOf(textData) > -1
  //     }
  //     else if (contact.indexOf(textData) > -1) {
  //       return contact.indexOf(textData) > -1
  //     }
  //     else if (itemData.indexOf(textData) > -1) {
  //       return itemData.indexOf(textData) > -1
  //     }
  //     else if (itemDescription.indexOf(textData) > -1) {
  //       return itemDescription.indexOf(textData) > -1
  //     }
  //     else if (currentLocation.indexOf(textData) > -1) {
  //       return currentLocation.indexOf(textData) > -1
  //     }
  //     else if (postedDateTime.indexOf(textData) > -1) {
  //       return postedDateTime.indexOf(textData) > -1
  //     }
  //     else if (appointmentDateTime.indexOf(textData) > -1) {
  //       return appointmentDateTime.indexOf(textData) > -1
  //     }
  //     else if (insuranceInformation.indexOf(textData) > -1) {
  //       return insuranceInformation.indexOf(textData) > -1
  //     }
  //     else {
  //       return itemName.indexOf(textData) > -1
  //     }


  //   })

  //   if (!text || text === '') {
  //     console.log('<><><><><>change state');
  //     this.setState({
  //       dataArray: this.state.dataArrayAll,
  //       text: text,
  //       isSearching: false,
  //     });
  //   }

  //   else if (!Array.isArray(newData) && !newData.length) {
  //     this.setState({
  //       data: [],
  //       isSearching: true,
  //     });
  //   } else {
  //     this.setState({
  //       dataArray: newData,
  //       text: text,
  //       isSearching: true,
  //     })
  //   }
  // }


  mRefresh = async () => {
    if (this.state.filterList) {
      this.mCheckBox(this.state.checkBox)
    } else {
      SInfo.setItem('opration', '-1', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
      SInfo.setItem('type', '-1', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
      this.setState({
        page: 0,
        rady: false,
        dataArray: [],
        dataArrayAll: [],
        pageRefresh: true,
        text: ''
      });
      this.stopAutoRefresh()
      this.mGetRecentPost();
    }

  };

  manualRefresh = () => {
    console.log("REFRESH")
    if (!this.state.rady) {
      return
    } else if (this.state.filterList) {
      this.mCheckBox(this.state.checkBox)
    } else if (this.state.dataArrayAll.length == 0) {
      this.setState({
        rady: false
      }, () => {
        this.stopAutoRefresh()
        this.mGetRecentPost()
      })
    } else {
      this.setState({
        rady: false
      }, () => {
        this.mgetUpdate()
      })
    }
  }

  isAnyFilterSelected = () => {
    if (this.state.checkBox != 0 || this.state.followUpFilter || this.state.appointmentFilter || this.state.myPatientsFilter || this.state.myChatbotFilter) {
      return true
    } else {
      return false
    }
  }

  isAnyFilterSelectedExcept = (number) => {
    switch (number) {
      case 0:
        if (this.state.followUpFilter || this.state.appointmentFilter || this.state.myPatientsFilter || this.state.myChatbotFilter) {
          return true
        } else {
          return false
        }
      case 4:
        if (this.state.checkBox != 0 || this.state.appointmentFilter || this.state.myPatientsFilter || this.state.myChatbotFilter) {
          return true
        } else {
          return false
        }
      case 5:
        if (this.state.checkBox != 0 || this.state.followUpFilter || this.state.myPatientsFilter || this.state.myChatbotFilter) {
          return true
        } else {
          return false
        }
      case 6:
        if (this.state.checkBox != 0 || this.state.followUpFilter || this.state.appointmentFilter || this.state.myChatbotFilter) {
          return true
        } else {
          return false
        }
      case 7:
        if (this.state.checkBox != 0 || this.state.followUpFilter || this.state.appointmentFilter || this.state.myPatientsFilter) {
          return true
        } else {
          return false
        }
      default:
        if (this.state.checkBox != 0 || this.state.followUpFilter || this.state.appointmentFilter || this.state.myPatientsFilter || this.state.myChatbotFilter) {
          return true
        } else {
          return false
        }
    }
  }

  updatePostListener = (item, index, isArchive, isFollowUp, isPatientAdded) => {
    console.log("INDEX:" + index)
  }

  //callback
  updateArchivePostListener = (item, index, isArchived) => {
    if (this.state.checkBox == 3) {
      if (isArchived) {
        // add item to list
        this.addArchivedItemToList(item, index)
      } else {
        // remove item from list
        this.removeArchivedItemFromList(item, index)
      }
    } else {
      if (isArchived) {
        // remove item from list
        this.removeArchivedItemFromList(item, index)
      } else {
        // add item to list
        this.addArchivedItemToList(item, index)
      }
    }
    console.log("INDEX:" + index)
  }

  addArchivedItemToList = (item, index) => {
    //check if index
    // if (dataAll.length >= index + 1) {

    // }

    // if (data.length >= index + 1) {

    // }
  }

  removeArchivedItemFromList = (item, postIndex) => {
    var mThis = this;
    var rawData = [];
    var mUnreadCount = 0;

    let dataAll = mThis.state.filterList ? mThis.state.dataArrayFilter : mThis.state.dataArrayAll
    let data = mThis.state.filterList ? mThis.state.dataArrayFilter : mThis.state.dataArray
    let selectedList = []
    selectedList.push(item)
    let patient_posts = dataAll.filter(post => !selectedList.some(itemToRemove => post.post_id === itemToRemove.post_id));
    let patient_posts_searched = data.filter(post => !selectedList.some(itemToRemove => post.post_id === itemToRemove.post_id));


    for (i in patient_posts) {
      if (patient_posts[i].chat_history_count > 0) {
        if (patient_posts[i].chat_history_arr.length != 0) {
          if (patient_posts[i].chat_history_arr.doctor_content.length <= 0) {
            mUnreadCount = mUnreadCount + patient_posts[i].unread_chat_history_count;
          }
        }
      }
      if (patient_posts[i].get_patient == null) {
      } else {
        rawData.push(patient_posts[i])
        // console.log("IMAGE1:https://blog.dentalchat.com/server/uploads/patient_profile_image/" + responseJson.patient_posts[i])
      }
    }

    mThis.setState(prevState => ({
      dataArrayFilter: rawData,
      dataArray: prevState.text && prevState.text.length > 0 ? patient_posts_searched : rawData,
      dataArrayAll: rawData,
      rady: true,
      visible: false,
      mUnreadCount: mUnreadCount
    }), () => {
      global.MyDental = mUnreadCount;
      mThis.props.navigation.setParams({ handleSave: mUnreadCount });
      SInfo.setItem('msgCount', mUnreadCount + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
    });

  }

  updateFollowUpPostListener = (item, isFollowUp) => {
    mThis = this
    var rawData = [];
    var mUnreadCount = 0;

    let dataAll = mThis.state.filterList ? mThis.state.dataArrayFilter : mThis.state.dataArrayAll
    let data = mThis.state.filterList ? mThis.state.dataArrayFilter : mThis.state.dataArray

    let index = data.findIndex(obj => obj.post_id === item.post_id);
    let indexForAll = dataAll.findIndex(obj => obj.post_id === item.post_id);

    if (index == -1 || indexForAll == -1) {
      return
    }

    let updatedItem = JSON.parse(JSON.stringify(item))
    updatedItem["follow_up_status"] = isFollowUp ? 1 : 0
    data[index] = updatedItem
    dataAll[indexForAll] = updatedItem

    mThis.setState(prevState => ({
      dataArrayFilter: data,
      dataArray: data,
      dataArrayAll: dataAll,
      rady: true,
      visible: false,
    }));
  }

  updateAddPatientPostListener = (item, isPatientAdded) => {
    mThis = this
    var rawData = [];
    var mUnreadCount = 0;

    let dataAll = mThis.state.filterList ? mThis.state.dataArrayFilter : mThis.state.dataArrayAll
    let data = mThis.state.filterList ? mThis.state.dataArrayFilter : mThis.state.dataArray

    let index = data.findIndex(obj => obj.post_id === item.post_id);
    let indexForAll = dataAll.findIndex(obj => obj.post_id === item.post_id);

    if (index == -1 || indexForAll == -1) {
      return
    }

    let updatedItem = JSON.parse(JSON.stringify(item))
    updatedItem["is_patient_added"] = isPatientAdded ? 1 : 0
    data[index] = updatedItem
    dataAll[indexForAll] = updatedItem

    mThis.setState(prevState => ({
      dataArrayFilter: data,
      dataArray: data,
      dataArrayAll: dataAll,
      rady: true,
      visible: false,
    }));
  }

  archivePost = (item) => {
    console.log("Archive_Post_Pressed:")
    console.log(item)
    this.setState({ visible: true })
    var mThis = this;
    var rawData = [];
    var mUnreadCount = 0;
    fetch(constants.url + constants.API_URL.archivePost, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: this.state.token,
        dentist_id: this.state.doctorId,
        post_id: item.post_id,
        patient_id: item.patient_id,
        archived_status: this.state.checkBox == 3 ? 0 : 1
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        //var users = responseJson;
        this.setState({ visible: false })

        if (responseJson.status == 5) {
          SInfo.setItem('is_patient_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('is_dentist_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          this.props.navigation.navigate('Home')
        }
        else {
          let dataAll = mThis.state.filterList ? mThis.state.dataArrayFilter : mThis.state.dataArrayAll
          let data = mThis.state.filterList ? mThis.state.dataArrayFilter : mThis.state.dataArray
          let selectedList = []
          selectedList.push(item)
          let patient_posts = dataAll.filter(post => !selectedList.some(itemToRemove => post.post_id === itemToRemove.post_id));
          let patient_posts_searched = data.filter(post => !selectedList.some(itemToRemove => post.post_id === itemToRemove.post_id));


          for (i in patient_posts) {
            if (patient_posts[i].chat_history_count > 0) {
              if (patient_posts[i].chat_history_arr.length != 0) {
                if (patient_posts[i].chat_history_arr.doctor_content.length <= 0) {
                  mUnreadCount = mUnreadCount + patient_posts[i].unread_chat_history_count;
                }
              }
            }
            if (patient_posts[i].get_patient == null) {
            } else {
              rawData.push(patient_posts[i])
              // console.log("IMAGE1:https://blog.dentalchat.com/server/uploads/patient_profile_image/" + responseJson.patient_posts[i])
            }
          }

          mThis.setState(prevState => ({
            dataArrayFilter: rawData,
            dataArray: prevState.text && prevState.text.length > 0 ? patient_posts_searched : rawData,
            dataArrayAll: rawData,
            rady: true,
            visible: false,
            mUnreadCount: mUnreadCount
          }), () => {
            global.MyDental = mUnreadCount;
            mThis.props.navigation.setParams({ handleSave: mUnreadCount });
            SInfo.setItem('msgCount', mUnreadCount + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          });

        }
      })
      .catch((error) => {
        mThis.setState({
          rady: true,
          visible: false
        });
        console.log(error)
        // mThis.mFailed();
        mThis.archivePost(item)
      });
  }

  followUpPost = (item) => {
    console.log("Follow_Post_Pressed:")
    console.log(item)

    this.setState({ visible: true })
    var mThis = this;
    var rawData = [];
    var mUnreadCount = 0;
    console.log("REQ:" + JSON.stringify({
      auth_token: this.state.token,
      doctor_id: this.state.doctorId,
      post_id: item.post_id,
      patient_id: item.patient_id,
      flag: item.follow_up_status && item.follow_up_status == 1 ? 0 : 1
    }))
    fetch(constants.url + constants.API_URL.followUp, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: this.state.token,
        doctor_id: this.state.doctorId,
        post_id: item.post_id,
        patient_id: item.patient_id,
        flag: item.follow_up_status && item.follow_up_status == 1 ? 0 : 1
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        //var users = responseJson;
        this.setState({ visible: false })

        if (responseJson.status == 5) {
          SInfo.setItem('is_patient_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('is_dentist_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          this.props.navigation.navigate('Home')
        }
        else {
          // item["follow_up_status"] = item.follow_up_status && item.follow_up_status == 1 ? 0 : 1

          let dataAll = mThis.state.filterList ? mThis.state.dataArrayFilter : mThis.state.dataArrayAll
          let data = mThis.state.filterList ? mThis.state.dataArrayFilter : mThis.state.dataArray
          // let selectedList = []
          // selectedList.push(item)
          // let patient_posts = dataAll.filter(post => !selectedList.some(itemToRemove => post.post_id === itemToRemove.post_id));
          // let patient_posts_searched = data.filter(post => !selectedList.some(itemToRemove => post.post_id === itemToRemove.post_id));

          let index = data.findIndex(obj => obj.post_id === item.post_id);
          let indexForAll = dataAll.findIndex(obj => obj.post_id === item.post_id);
          let updatedItem = JSON.parse(JSON.stringify(item))
          updatedItem["follow_up_status"] = item.follow_up_status && item.follow_up_status == 1 ? 0 : 1
          data[index] = updatedItem
          dataAll[indexForAll] = updatedItem

          mThis.setState(prevState => ({
            dataArrayFilter: data,
            dataArray: data,
            dataArrayAll: dataAll,
            rady: true,
            visible: false,
          }));

        }
      })
      .catch((error) => {
        mThis.setState({
          rady: true,
          visible: false
        });
        console.log(error)
        // mThis.mFailed();
        mThis.followUpPost(item)
      });
  }

  addRemoveMyPatientPost = (item) => {
    console.log("My_Patient_Post_Pressed:")
    console.log(item)

    this.setState({ visible: true })
    var mThis = this;
    var rawData = [];
    var mUnreadCount = 0;
    console.log("REQ:" + JSON.stringify({
      auth_token: this.state.token,
      doctor_id: this.state.doctorId,
      post_id: item.post_id,
      patient_id: item.patient_id,
      flag: item.follow_up_status && item.follow_up_status == 1 ? 0 : 1
    }))
    let url = item.is_patient_added && item.is_patient_added == 1 ? constants.url + constants.API_URL.removeMyPatient : constants.url + constants.API_URL.addMyPatient
    console.log("URL:" + url)
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: this.state.token,
        doctor_id: this.state.doctorId,
        post_id: item.post_id,
        patient_id: item.patient_id,
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        //var users = responseJson;
        this.setState({ visible: false })

        if (responseJson.status == 5) {
          SInfo.setItem('is_patient_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('is_dentist_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          this.props.navigation.navigate('Home')
        }
        else {
          // item["follow_up_status"] = item.follow_up_status && item.follow_up_status == 1 ? 0 : 1

          let dataAll = mThis.state.filterList ? mThis.state.dataArrayFilter : mThis.state.dataArrayAll
          let data = mThis.state.filterList ? mThis.state.dataArrayFilter : mThis.state.dataArray
          // let selectedList = []
          // selectedList.push(item)
          // let patient_posts = dataAll.filter(post => !selectedList.some(itemToRemove => post.post_id === itemToRemove.post_id));
          // let patient_posts_searched = data.filter(post => !selectedList.some(itemToRemove => post.post_id === itemToRemove.post_id));

          let index = data.findIndex(obj => obj.post_id === item.post_id);
          let indexForAll = dataAll.findIndex(obj => obj.post_id === item.post_id);
          let updatedItem = JSON.parse(JSON.stringify(item))
          updatedItem["is_patient_added"] = item.is_patient_added && item.is_patient_added == 1 ? 0 : 1
          data[index] = updatedItem
          dataAll[indexForAll] = updatedItem

          mThis.setState(prevState => ({
            dataArrayFilter: data,
            dataArray: data,
            dataArrayAll: dataAll,
            rady: true,
            visible: false,
          }));

        }
      })
      .catch((error) => {
        mThis.setState({
          rady: true,
          visible: false
        });
        console.log(error)
        // mThis.mFailed();
        mThis.addRemoveMyPatientPost(item)
      });
  }

  renderHeader = () => {
    return (
      <View>
        <View style={{ flexDirection: 'row', width: '100%', borderColor: '#DDD', borderWidth: 1 }}>
          <View style={{ width: '85%' }}>
            <SearchBar
              placeholder="Search here ..."
              containerStyle={{ backgroundColor: 'white', width: '100%', paddingRight: 0, borderWidth: 0, borderBottomColor: 'transparent', borderTopColor: 'transparent' }}
              inputStyle={{ color: '#000' }}
              inputContainerStyle={{ backgroundColor: this.state.SearchBarColor }}
              lightTheme
              onChangeText={(text) => this.mSearchFilterFunction(text)}
              value={this.state.text}
            />
          </View>
          <View style={{ width: '15%', alignItems: "center" }}>
            <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', height: Platform.OS == 'android' ? 49 : 40, backgroundColor: this.state.SearchBarColor, width: 40, marginTop: 9 }} onPress={() => { this.setState({ showModal: true }) }}>
              <Image source={filterImage} style={{ height: 20, width: 20, }} />
            </TouchableOpacity>
          </View>
        </View>
        {this.state.isSearching && !this.state.filterList && this.state.dataArray.length == 0 && <Text style={{ alignSelf: 'center', marginTop: 50 }}>No messages matched your search.</Text>}
      </View>
    );
  };

  _onMomentumScrollBegin = () => this.setState({ onEndReachedCalledDuringMomentum: false });


  onScrollHandler = () => {
    console.log("SCROLL:onScrollHandler")
    if (!this.state.rady || this.state.scrollDown || !this.props.navigation.isFocused()) {
      return
    }
    if (this.state.more == 1 && this.state.isSearching == false && !this.state.onEndReachedCalledDuringMomentum) {
      if (this.state.filterList) {
        this.mCheckBox(this.state.checkBox)
      } else {
        this.stopAutoRefresh()
        this.setState({
          page: this.state.page + 100,
          rady: false,
          scrollDown: true,
          onEndReachedCalledDuringMomentum: true
        }, () => {
          SInfo.getItem('dentist_id', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
            this.setState({ doctorId: value, })
          });
          SInfo.getItem('type', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
            this.setState({ type: value, })
          });
          SInfo.getItem('opration', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
            this.setState({ opration: value, })
            if (this.props.navigation.isFocused()) {
              this.mGetRecentPost1();
            }
          });
        });
      }
    }
  }


  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        {/* {
          Platform.OS == 'android' ?
            <>
              <SafeAreaView style={{ backgroundColor: Constants.themeColor }}></SafeAreaView>
              <Header title={"Message"} menuEvent={this.manualRefresh} isRefreshButton={true} />
            </>
            : <></>
        } */}

        <Spinner overlayColor={'rgba(0, 0, 0, 0.75)'} color={'#08a1d9'} textContent={"Updating"} visible={this.state.visible} textStyle={{ color: '#fff', fontSize: 15, marginTop: -70 }} />

        {/* <NavigationEvents
          onDidFocus={() => {
            if (this._interval) {
              clearInterval(this._interval);
            }
            SInfo.getItem('dentist_id', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
              this.setState({ doctorId: value, })
              console.log(value)
            });
            SInfo.getItem('type', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
              this.setState({ type: value, })
            });
            SInfo.getItem('token', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
              console.log('time to fetch token')
              // console.log(value)

              this.setState({ token: value, })
            });


            console.log("FILTER:" + this.state.filterList)
            console.log("FILTER_LIST:" + this.state.dataArrayFilter)
            if (!this.state.filterList) {
              this.refreshList()
            }

            console.log(this.state.doctorId)
            //Call whatever logic or dispatch redux actions and update the screen!
          }}

          onWillBlur={() => {
            // console.log("Will Blur")
            clearInterval(this._interval);
          }}

          onDidBlur={() => {
            // console.log("Did Blur")
            clearInterval(this._interval);
          }}
        /> */}
        {/* {this.state.rady == false ? <Spinner overlayColor={'rgba(0, 0, 0, 0.75)'} color={'#08a1d9'} textContent={"Updating"} visible={this.state.visible} textStyle={{ color: '#fff', fontSize: 15, marginTop: -70 }} /> : <View>
        </View>} */}
        {
          this.state.rady == false ?
            <View style={{ margin: 10 }}>
              <ActivityIndicator
                size={"small"}
                color={'#08a1d9'}
                animating={true} />
            </View>
            :
            <View></View>
        }
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showModal}>
          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            backgroundColor: 'rgba(52, 52, 52, 0.8)'
          }}>
            <View style={{ flex: .5, width: '60%', backgroundColor: 'white', borderRadius: 10, borderWidth: 1, borderColor: 'white' }}>
              <View style={{ alignItems: 'center', flex: .2, borderBottomWidth: 3, borderColor: 'gray', justifyContent: 'flex-end', }}><Text style={{ fontSize: 16, fontWeight: 'bold' }}>Filter</Text></View>

              <View style={styles.rowStyle}>
                <CheckBox checked={this.state.checkBox == 0 ? true : false} checkboxStyle={{ marginLeft: 20 }}
                  checkedImage={Images.ImgRadioCheck}
                  uncheckedImage={Images.ImgRadioUncheck}
                  onChange={() => {
                    this.setState(prevState => ({
                      checkBox: 0,
                      SearchBarColor: this.isAnyFilterSelectedExcept(0) ? 'yellow' : '#bdc6ce'
                    }))
                  }}
                />
                <Text style={{ marginHorizontal: 5, fontWeight: '400' }}>All Messages</Text>
              </View>
              <View style={styles.rowStyle}>
                <CheckBox checked={this.state.checkBox == 1 ? true : false} checkboxStyle={{ marginLeft: 20 }}
                  checkedImage={Images.ImgRadioCheck}
                  uncheckedImage={Images.ImgRadioUncheck}
                  onChange={() => { this.setState({ checkBox: 1, SearchBarColor: 'yellow' }) }}
                />
                <Text style={{ marginHorizontal: 5, fontWeight: '400' }}>Attended</Text>
              </View>
              <View style={styles.rowStyle}>
                <CheckBox checked={this.state.checkBox == 2 ? true : false} checkboxStyle={{ marginLeft: 20 }}
                  checkedImage={Images.ImgRadioCheck}
                  uncheckedImage={Images.ImgRadioUncheck}
                  onChange={() => { this.setState({ checkBox: 2, SearchBarColor: 'yellow' }) }}
                />
                <Text style={{ marginHorizontal: 5, fontWeight: '400' }}>UnAttended</Text>
              </View>

              <View style={[styles.rowStyle]}>
                <CheckBox checked={this.state.checkBox == 3 ? true : false} checkboxStyle={{ marginLeft: 20 }}
                  checkedImage={Images.ImgRadioCheck}
                  uncheckedImage={Images.ImgRadioUncheck}
                  onChange={() => { this.setState({ checkBox: 3, SearchBarColor: 'yellow' }) }}
                />
                <Text style={{ marginHorizontal: 5, fontWeight: '400' }}>Archive</Text>
              </View>


              <View style={styles.rowStyle}>
                <CheckBox checked={this.state.followUpFilter} checkboxStyle={{ marginLeft: 20 }}
                  onChange={() => {
                    this.setState(prevState => ({
                      followUpFilter: !prevState.followUpFilter,
                      SearchBarColor: !prevState.followUpFilter ? 'yellow' : this.isAnyFilterSelectedExcept(4) ? 'yellow' : '#bdc6ce'
                    }))
                  }}
                />
                <Text style={{ marginHorizontal: 5, fontWeight: '400' }}>Show Follow-Up</Text>
              </View>

              <View style={styles.rowStyle}>
                <CheckBox checked={this.state.appointmentFilter} checkboxStyle={{ marginLeft: 20 }}
                  onChange={() => {
                    this.setState(prevState => ({
                      appointmentFilter: !prevState.appointmentFilter,
                      SearchBarColor: !prevState.appointmentFilter ? 'yellow' : this.isAnyFilterSelectedExcept(5) ? 'yellow' : '#bdc6ce'
                    }))
                  }}
                />
                <Text style={{ marginHorizontal: 5, fontWeight: '400' }}>Show Appointments</Text>
              </View>

              <View style={styles.rowStyle}>
                <CheckBox checked={this.state.myPatientsFilter} checkboxStyle={{ marginLeft: 20 }}
                  onChange={() => {
                    this.setState(prevState => ({
                      myPatientsFilter: !prevState.myPatientsFilter,
                      SearchBarColor: !prevState.myPatientsFilter ? 'yellow' : this.isAnyFilterSelectedExcept(6) ? 'yellow' : '#bdc6ce'
                    }))
                  }}
                />
                <Text style={{ marginHorizontal: 5, fontWeight: '400' }}>My Patient</Text>
              </View>

              <View style={styles.rowStyle}>
                <CheckBox checked={this.state.myChatbotFilter} checkboxStyle={{ marginLeft: 20 }}
                  onChange={() => {
                    this.setState(prevState => ({
                      myChatbotFilter: !prevState.myChatbotFilter,
                      SearchBarColor: !prevState.myChatbotFilter ? 'yellow' : this.isAnyFilterSelectedExcept(7) ? 'yellow' : '#bdc6ce'
                    }))
                  }}
                />
                <Text style={{ marginHorizontal: 5, fontWeight: '400' }}>My Chatbot</Text>
              </View>



              <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 15 }}>
                <TouchableOpacity style={{ backgroundColor: 'red', height: 30, width: 80, alignItems: 'center', justifyContent: 'center', borderRadius: 5 }} onPress={() => { this.setState({ showModal: false }) }}>
                  <Text style={{ color: 'white' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: constants.baseColor, height: 30, width: 80, alignItems: 'center', justifyContent: 'center', borderRadius: 5, marginLeft: 20 }} onPress={() => { this.mCheckBox(this.state.checkBox, true) }}>
                  <Text style={{ color: 'white' }}>OK</Text>
                </TouchableOpacity>
              </View>



            </View>

            {/* <View style={{ width: '80%', backgroundColor: 'white', borderRadius: 10, borderWidth: 1, borderColor: 'white', flexDirection: 'column' }}> */}
            {/* <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ width: '80%', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}><Text style={{ fontWeight: 'bold', marginLeft: '15%' }}>Filter</Text></View>
              </View> */}
            {/* <View style={{ height: 3, backgroundColor: 'lightgray', width: '100%' }}></View>

             <CheckBox
                    checked={this.state.checkBox == 0 ? true : false}
                    title='All Messages'
                    checkedIcon={Images.ImgRadioCheck}
                    uncheckedIcon={Images.ImgRadioUncheck}
                    onPress={() => {
                      this.setState(prevState => ({
                        checkBox: 0,
                        SearchBarColor: this.isAnyFilterSelectedExcept(0) ? 'yellow' : '#bdc6ce'
                      }))
                    }}
                    containerStyle={{ marginTop: 12, paddingLeft: 40 }}
                    /> */}
            {/* <CheckBox
                checkboxStyle={{ height: 15, width: 15 }}
                containerStyle={{ marginTop: 12, paddingLeft: 40 }}
                label='All Messages'
                labelStyle={{ color: '#000000' }}
                uncheckedImage={Images.ImgRadioUncheck}
                checkedImage={Images.ImgRadioCheck}
                checked={this.state.checkBox == 0 ? true : false}
                onChange={() => {
                  this.setState(prevState => ({
                    checkBox: 0,
                    SearchBarColor: this.isAnyFilterSelectedExcept(0) ? 'yellow' : '#bdc6ce'
                  }))
                }}
              /> */}
            {/* <View style={{ height: 1, backgroundColor: 'lightgray', width: '100%' }}></View>
              <CheckBox
                checkboxStyle={{ height: 15, width: 15 }}
                containerStyle={{ marginTop: 12, paddingLeft: 40 }}
                label='Attended'
                labelStyle={{ color: '#000000' }}
                uncheckedImage={Images.ImgRadioUncheck}
                checkedImage={Images.ImgRadioCheck}
                checked={this.state.checkBox == 1 ? true : false}
                onChange={() => { this.setState({ checkBox: 1, SearchBarColor: 'yellow' }) }}
              /> */}
            {/* <View style={{ height: 1, backgroundColor: 'lightgray', width: '100%' }}></View>
              <CheckBox
                checkboxStyle={{ height: 15, width: 15 }}
                containerStyle={{ marginTop: 12, paddingLeft: 40 }}
                label='UnAttended'
                labelStyle={{ color: '#000000' }}
                uncheckedImage={Images.ImgRadioUncheck}
                checkedImage={Images.ImgRadioCheck}
                checked={this.state.checkBox == 2 ? true : false}
                onChange={() => { this.setState({ checkBox: 2, SearchBarColor: 'yellow' }) }}
              /> */}
            {/* <View style={{ height: 1, backgroundColor: 'lightgray', width: '100%' }}></View>
              <CheckBox
                checkboxStyle={{ height: 15, width: 15 }}
                containerStyle={{ marginTop: 12, paddingLeft: 40 }}
                label='Archive'
                labelStyle={{ color: '#000000' }}
                uncheckedImage={Images.ImgRadioUncheck}
                checkedImage={Images.ImgRadioCheck}
                checked={this.state.checkBox == 3 ? true : false}
                onChange={() => { this.setState({ checkBox: 3, SearchBarColor: 'yellow' }) }}
              /> */}
            {/* <View style={{ height: 1, backgroundColor: 'lightgray', width: '100%' }}></View>
              <CheckBox
                checkboxStyle={{ height: 15, width: 15 }}
                containerStyle={{ marginTop: 12, paddingLeft: 40 }}
                label='Show Follow-Up'
                labelStyle={{ color: '#000000' }}
                checked={this.state.followUpFilter}
                onChange={() => {
                  this.setState(prevState => ({
                    followUpFilter: !prevState.followUpFilter,
                    SearchBarColor: !prevState.followUpFilter ? 'yellow' : this.isAnyFilterSelectedExcept(4) ? 'yellow' : '#bdc6ce'
                  }))
                }}
              /> */}
            {/* <View style={{ height: 1, backgroundColor: 'lightgray', width: '100%' }}></View>
              <CheckBox
                checkboxStyle={{ height: 15, width: 15 }}
                containerStyle={{ marginTop: 12, paddingLeft: 40 }}
                label='Show Appointments'
                labelStyle={{ color: '#000000' }}
                checked={this.state.appointmentFilter}
                onChange={() => {
                  this.setState(prevState => ({
                    appointmentFilter: !prevState.appointmentFilter,
                    SearchBarColor: !prevState.appointmentFilter ? 'yellow' : this.isAnyFilterSelectedExcept(5) ? 'yellow' : '#bdc6ce'
                  }))
                }}
              /> */}

            {/* <View style={{ height: 1, backgroundColor: 'lightgray', width: '100%' }}></View>
              <CheckBox
                checkboxStyle={{ height: 15, width: 15 }}
                containerStyle={{ marginTop: 12, paddingLeft: 40 }}
                label='My Patient'
                labelStyle={{ color: '#000000' }}
                checked={this.state.myPatientsFilter}
                onChange={() => {
                  this.setState(prevState => ({
                    myPatientsFilter: !prevState.myPatientsFilter,
                    SearchBarColor: !prevState.myPatientsFilter ? 'yellow' : this.isAnyFilterSelectedExcept(6) ? 'yellow' : '#bdc6ce'
                  }))
                }}
              /> */}
            {/* <View style={{ height: 1, backgroundColor: 'lightgray', width: '100%' }}></View>
              <CheckBox
                checkboxStyle={{ height: 15, width: 15 }}
                containerStyle={{ marginTop: 12, paddingLeft: 40 }}
                label='My Chatbot'
                labelStyle={{ color: '#000000' }}
                checked={this.state.myChatbotFilter}
                onChange={() => {
                  this.setState(prevState => ({
                    myChatbotFilter: !prevState.myChatbotFilter,
                    SearchBarColor: !prevState.myChatbotFilter ? 'yellow' : this.isAnyFilterSelectedExcept(7) ? 'yellow' : '#bdc6ce'
                  }))
                }}
              />
              <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 15 }}>
                <TouchableOpacity style={{ backgroundColor: 'red', height: 30, width: 80, alignItems: 'center', justifyContent: 'center', borderRadius: 5 }} onPress={() => { this.setState({ showModal: false }) }}>
                  <Text style={{ color: 'white' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: constants.baseColor, height: 30, width: 80, alignItems: 'center', justifyContent: 'center', borderRadius: 5, marginLeft: 20 }} onPress={() => { this.mCheckBox(this.state.checkBox, true) }}>
                  <Text style={{ color: 'white' }}>OK</Text>
                </TouchableOpacity>
              </View> */}

            {/* <View style={{ height: 1, backgroundColor: 'lightgray', width: '100%' }}></View>
              <CheckBox
                checkboxStyle={{ height: 15, width: 15 }}
                containerStyle={{ marginTop: 12, paddingLeft: 40 }}
                label='All Messages(Chatbot)'
                labelStyle={{ color: '#000000' }}
                checked={this.state.checkBox == 3 ? true : false}
                onChange={() => this.mCheckBox(3)}
              />
              <View style={{ height: 1, backgroundColor: 'lightgray', width: '100%' }}></View>
              <CheckBox
                checkboxStyle={{ height: 15, width: 15 }}
                containerStyle={{ marginTop: 12, paddingLeft: 40 }}
                label='Attended(Chatbot)'
                labelStyle={{ color: '#000000' }}
                checked={this.state.checkBox == 4 ? true : false}
                onChange={() => this.mCheckBox(4)}
              />
              <View style={{ height: 1, backgroundColor: 'lightgray', width: '100%' }}></View>
              <CheckBox
                checkboxStyle={{ height: 15, width: 15 }}
                containerStyle={{ marginTop: 12, paddingLeft: 40 }}
                label='UnAttended(Chatbot)'
                labelStyle={{ color: '#000000' }}
                checked={this.state.checkBox == 5 ? true : false}
                onChange={() => this.mCheckBox(5)}
              /> */}

          </View>
        </Modal>
        {
          this.state.filterList == true ?
            <View>{Platform.OS == 'android' ? <FlatList
              onRefresh={this.mRefresh}
              refreshing={this.state.isRefreshing}
              data={this.state.dataArrayFilter}
              extraData={this.state}
              keyExtractor={item => `key-${item.post_id}`}
              ListHeaderComponent={this.renderHeader}
              onEndReached={() => this.onScrollHandler()}
              onMomentumScrollBegin={() => this._onMomentumScrollBegin()}
              onEndReachedThreshold={1}
              renderItem={({ item, index }) => <DentistMessageItem item={item} onPress={() => navigate('DentistChatWindow', { item: item, isArchived: this.state.checkBox == 3 ? true : false, updateArchivePostListener: this.updateArchivePostListener, updateFollowUpPostListener: this.updateFollowUpPostListener, updateAddPatientPostListener: this.updateAddPatientPostListener, postIndex: index })} />}
            /> : <FlatList
                onRefresh={this.mRefresh}
                refreshing={this.state.isRefreshing}
                data={this.state.dataArrayFilter}
                extraData={this.state}
                keyExtractor={item => `key-${item.post_id}`}
                ListHeaderComponent={this.renderHeader}
                onEndReached={() => this.onScrollHandler()}
                onMomentumScrollBegin={() => this._onMomentumScrollBegin()}
                onEndReachedThreshold={0.1}
                renderItem={({ item, index }) => <DentistMessageItem item={item} onPress={() => navigate('DentistChatWindow', { item: item, isArchived: this.state.checkBox == 3 ? true : false, updateArchivePostListener: this.updateArchivePostListener, updateFollowUpPostListener: this.updateFollowUpPostListener, updateAddPatientPostListener: this.updateAddPatientPostListener, postIndex: index })} />}
              />}
            </View>
            :
            <View>{Platform.OS == 'android' ? <FlatList
              onRefresh={this.mRefresh}
              refreshing={this.state.isRefreshing}
              data={this.state.dataArray}
              extraData={this.state}
              keyExtractor={item => `key-${item.post_id}`}
              ListHeaderComponent={this.renderHeader}
              onEndReached={() => this.onScrollHandler()}
              onMomentumScrollBegin={() => this._onMomentumScrollBegin()}
              onEndReachedThreshold={1}
              renderItem={({ item, index }) => <DentistMessageItem item={item} onPress={() => navigate('DentistChatWindow', { item: item, isArchived: this.state.checkBox == 3 ? true : false, updateArchivePostListener: this.updateArchivePostListener, updateFollowUpPostListener: this.updateFollowUpPostListener, updateAddPatientPostListener: this.updateAddPatientPostListener, postIndex: index })} />}
            /> : <FlatList
                onRefresh={this.mRefresh}
                refreshing={this.state.isRefreshing}
                data={this.state.dataArray}
                extraData={this.state}
                keyExtractor={item => `key-${item.post_id}`}
                ListHeaderComponent={this.renderHeader}
                onEndReached={() => this.onScrollHandler()}
                onMomentumScrollBegin={() => this._onMomentumScrollBegin()}
                onEndReachedThreshold={0.1}
                // renderItem={({ item, index }) => <DentistMessageItem item={item} onPress={() => console.log(item)} />}
                renderItem={({ item, index }) => <DentistMessageItem item={item} onPress={() => navigate('DentistChatWindow', { item: item, isArchived: this.state.checkBox == 3 ? true : false, updateArchivePostListener: this.updateArchivePostListener, updateFollowUpPostListener: this.updateFollowUpPostListener, updateAddPatientPostListener: this.updateAddPatientPostListener, postIndex: index })} />}
              />}</View>
        }


      </View >
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
  rowStyle: { flex: .2, borderBottomWidth: .6, borderBottomColor: 'gray', flexDirection: 'row', alignItems: 'center', }
});