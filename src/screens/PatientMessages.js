/* @flow */

import React, {Component} from 'react';
import {
  View,
  Platform,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  Text,
  Button,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {SearchBar} from 'react-native-elements';
import PatientMessageItem from '../components/PatientMessageItem';
import Spinner from 'react-native-loading-spinner-overlay';
import MessagesIconWithBadge from '../components/MessagesIconWithBadge';
import SInfo from 'react-native-sensitive-info';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import constants from './../constants/constants';
import calendarMessage from './../images/calendarMessage.png';
import {Header} from './../utils/Component';
import Styles from './../utils/Styles';
import Images from './../utils/Images';

export default class PatientMessages extends Component {
  static navigationOptions =
    Platform.OS == 'android'
      ? {
          header: null,
        }
      : ({navigation}) => {
          const {params = {}} = navigation.state;
          return {
            title: 'Message',
            headerTintColor: '#ffffff',
            headerStyle: {
              backgroundColor: constants.baseColor,
            },
            tabBarIcon: ({tintColor}) => (
              <Icon name="ellipsis-h" size={30} color={tintColor} />
            ),
            headerRight: (
              <TouchableOpacity
                style={[Styles.rightMenu]}
                onPress={navigation.getParam('manualRefresh')}>
                <Image
                  source={Images.ImgRefresh}
                  style={{width: 25, height: 25, marginLeft: 10}}
                  resizeMode="contain"></Image>
              </TouchableOpacity>
            ),
          };
        };

  // static navigationOptions = {
  //   // title: 'Message',
  //   // headerTintColor: '#ffffff',
  //   // headerStyle: {
  //   //   backgroundColor: constants.baseColor
  //   // },
  //   header: null //hide the header
  // };

  // static navigationOptions = Platform.OS == 'android' ? nav2 : nav1

  constructor(props) {
    super(props);
    global.MyVar = '0';

    this.state = {
      data: [],
      visible: true,
      rady: false,
      dataArray: [],
      dataArrayAll: [],
      patientId: '',
      post_id: '',
      isRefreshing: false,
      isSearching: false,
      alertMsg: '',
      unCounts: '0',
      more: '0',
      page: 0,
      myver: '11',
      token: '',
      mUnreadCount: '',
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      SInfo.getItem('token', {
        sharedPreferencesName: 'mySharedPrefs',
        keychainService: 'myKeychain',
      }).then(value => {
        console.log('time to fetch token');
        console.log(value);
        this.setState({token: value});
      });
      SInfo.getItem('patient_id', {
        sharedPreferencesName: 'mySharedPrefs',
        keychainService: 'myKeychain',
      }).then(value => {
        this.setState({patientId: value});
      });
      SInfo.getItem('post_id', {
        sharedPreferencesName: 'mySharedPrefs',
        keychainService: 'myKeychain',
      }).then(value => {
        console.log('WWWWWW= ' + value);
        if (value == '' || value == undefined) {
          value = '';
        }
        this.setState({post_id: value});
        // this.mGetRecentPost();
        this.refreshList();
      });
    });
    this.props.navigation.setParams({manualRefresh: this.manualRefresh});
    this.mgetUpdate();
  }

  // componentWillMount() {
  //   this.setState({
  //     page: 0,
  //     dataArray: [],
  //     dataArrayAll: [],
  //   })
  //   firebase.notifications().onNotification((notification) => {
  //     const { title, body } = notification;
  //     // this.showAlert(title, body);
  //     console.warn(notification)
  //   });
  //   SInfo.getItem('token', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
  //     console.log('time to fetch token')
  //     console.log(value)
  //     this.setState({ token: value, })
  //   });
  //   SInfo.getItem('patient_id', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
  //     this.setState({ patientId: value, })
  //   });
  //   SInfo.getItem('post_id', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
  //     console.log('WWWWWW= ' + value);
  //     if (value == '' || value == undefined) {
  //       value = "";
  //     }
  //     this.setState({ post_id: value, })
  //     this.mGetRecentPost();

  //   });

  //   this._interval = setInterval(() => {
  //     console.log('hello')
  //     this.mgetUpdate()

  //   }, 45000);
  //   console.log(this.state.doctorId)
  // }
  componentWillUnmount() {
    clearInterval(this._interval);
    this._unsubscribe();
  }

  manualRefresh = () => {
    if (this.state.rady) {
      return;
    } else if (this.state.dataArrayAll.length == 0) {
      this.setState(
        {
          rady: true,
        },
        () => {
          this.mGetRecentPost();
        },
      );
    } else {
      this.setState(
        {
          rady: true,
        },
        () => {
          this.mgetUpdate();
        },
      );
    }
  };

  refreshList() {
    console.log('REFRESH_LIST');
    const mThis = this;
    SInfo.getItem('patientMessagesData', {
      sharedPreferencesName: 'mySharedPrefs',
      keychainService: 'myKeychain',
    }).then(result => {
      let rawData = [];
      let mUnreadCount = 0;
      console.log(result);
      if (result != null && result != '') {
        let responseJson = JSON.parse(result);
        console.log('RES:' + JSON.stringify(responseJson));
        if (
          responseJson.patient_post_arr &&
          responseJson.patient_post_arr.length > 0
        ) {
          console.log('API1');
          for (i in responseJson.patient_post_arr) {
            if (
              responseJson.patient_post_arr[i]
                .all_unread_chat_count_for_this_post > 0
            ) {
              if (
                responseJson.patient_post_arr[i].chat_history_arr
                  .patient_content.length <= 0
              ) {
                mUnreadCount =
                  mUnreadCount +
                  responseJson.patient_post_arr[i]
                    .all_unread_chat_count_for_this_post;
                console.log('<><><>###call ' + mUnreadCount);
                mThis.setState({
                  unCounts: mUnreadCount,
                });
              }
            }
            if (
              responseJson.patient_post_arr[i].chat_history_arr.get_doctor ==
              null
            ) {
            } else {
              rawData.push(responseJson.patient_post_arr[i]);
              // console.log("IMAGE1:https://blog.dentalchat.com/server/uploads/patient_profile_image/" + responseJson.patient_posts[i])
            }
          }
          mThis.setState(
            prevState => ({
              dataArray:
                prevState.text && prevState.text.length > 0
                  ? prevState.dataArray
                  : rawData,
              dataArrayAll: rawData,
              post_id: '',
              alertMsg: 'Sorry! No messages available',
              more: responseJson.more,
              mUnreadCount: mUnreadCount,
              rady: false,
              //visible: false
            }),
            () => {
              global.MyVar = mUnreadCount;
              mThis.props.navigation.setParams({
                handleSave: mThis.state.mUnreadCount,
              });
              this.mgetUpdate();
            },
          );
        } else {
          console.log('API2');
          this.mGetRecentPost();
        }
      } else {
        console.log('API3');
        this.mGetRecentPost();
      }
    });
  }

  visible() {
    this.setState({
      visible: !this.state.visible,
      rady: !this.state.rady,
    });
  }

  mFailed() {
    this.setState({visible: false}, () => {
      setTimeout(() => {
        Alert.alert('Failed', 'Something went wrong, Please try again');
      }, 200);
    });
  }

  mGetRecentPost() {
    // console.log("REQ:" + JSON.stringify({
    //   auth_token: this.state.token,
    //   patient_id: this.state.patientId,
    //   post_id: this.state.post_id,
    //   is_read: '1',
    //   page: this.state.page,
    //   perpage: '500',
    // }))
    const {navigation} = this.props;
    var mThis = this;
    var rawData = [];
    var mUnreadCount = 0;
    this.setState({
      rady: true,
      //  visible: true
    });
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
        is_read: '1',
        page: this.state.page,
        perpage: '500',
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        //var users = responseJson;
        if (responseJson.status == 5) {
          SInfo.setItem('is_patient_login', '0', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          SInfo.setItem('is_dentist_login', '0', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          this.props.navigation.navigate('Home');
        } else {
          SInfo.setItem('patientMessagesData', JSON.stringify(responseJson), {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          console.log(responseJson);
          for (i in responseJson.patient_post_arr) {
            if (
              responseJson.patient_post_arr[i]
                .all_unread_chat_count_for_this_post > 0
            ) {
              if (
                responseJson.patient_post_arr[i].chat_history_arr
                  .patient_content.length <= 0
              ) {
                mUnreadCount =
                  mUnreadCount +
                  responseJson.patient_post_arr[i]
                    .all_unread_chat_count_for_this_post;
                console.log('<><><>###call0 ' + mUnreadCount);
                mThis.setState({
                  unCounts: mUnreadCount,
                });
              }
            }
            if (
              responseJson.patient_post_arr[i].chat_history_arr.get_doctor ==
              null
            ) {
            } else {
              rawData.push(responseJson.patient_post_arr[i]);
              // console.log("IMAGE1:https://blog.dentalchat.com/server/uploads/patient_profile_image/" + responseJson.patient_posts[i])
            }
          }
          mThis.setState(state => ({
            dataArray: [...state.dataArray, ...rawData],
            dataArrayAll: [...state.dataArrayAll, ...rawData],
            post_id: '',
            alertMsg: 'Sorry! No messages available',
            more: responseJson.more,
            mUnreadCount: mUnreadCount,
            rady: false,
            //visible: false
          }));

          // mThis.mLoaderShowHide();
          console.log('<><><> ' + mThis.state.unCounts);
          global.MyVar = mThis.state.unCounts;
          mThis.props.navigation.setParams({handleSave: mThis.state.unCounts});
          SInfo.setItem('post_id', '', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
        }

        //console.log("<><><>akki "+responseJson);
      })
      .catch(error => {
        console.log(error);
        mThis.setState({
          rady: true,
          post_id: '',
          // alertMsg: 'Something went wrong, Please try again'
        });
        SInfo.setItem('post_id', '', {
          sharedPreferencesName: 'mySharedPrefs',
          keychainService: 'myKeychain',
        });
        mThis.mGetRecentPost();
      });
  }

  mgetUpdate() {
    const {navigation} = this.props;
    var mThis = this;
    var rawData = [];
    var mUnreadCount = 0;
    var firstMsgChanged = false;
    console.log(
      this.state.token,
      '-----',
      this.state.patientId,
      '===========',
      this.state.post_id,
    );

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
        is_read: '1',
        page: this.state.page,
        perpage: '500',
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('RES1:' + JSON.stringify(responseJson.patient_post_arr));
        console.log('RES2:' + JSON.stringify(this.state.dataArrayAll));
        //var users = responseJson;
        SInfo.setItem('patientMessagesData', JSON.stringify(responseJson), {
          sharedPreferencesName: 'mySharedPrefs',
          keychainService: 'myKeychain',
        });
        if (responseJson.status == 5) {
          SInfo.setItem('patientMessagesData', '', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          SInfo.setItem('is_patient_login', '0', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          SInfo.setItem('is_dentist_login', '0', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          // this.props.navigation.navigate('Home')
        } else {
          console.log(responseJson);
          for (i in responseJson.patient_post_arr) {
            if (
              responseJson.patient_post_arr[i]
                .all_unread_chat_count_for_this_post > 0
            ) {
              if (
                responseJson.patient_post_arr[i].chat_history_arr
                  .patient_content.length <= 0
              ) {
                mUnreadCount =
                  mUnreadCount +
                  responseJson.patient_post_arr[i]
                    .all_unread_chat_count_for_this_post;
                console.log('<><><>###call1 ' + mUnreadCount);
                mThis.setState({
                  unCounts: mUnreadCount,
                });
              }
            }

            if (
              responseJson.patient_post_arr[0].post_id !=
              this.state.dataArrayAll[0].post_id
            ) {
              firstMsgChanged = true;
              console.log('there is a change in post id');
              console.log(this.state.dataArray.length);
              if (
                responseJson.patient_post_arr[i].chat_history_arr.get_doctor ==
                null
              ) {
                console.log('First msg changed but no doc found');
              } else {
                console.log('UPDATE_MSG1:');
                rawData.push(responseJson.patient_post_arr[i]);
              }
            } else if (
              responseJson.patient_post_arr[0].post_id ==
                this.state.dataArrayAll[0].post_id &&
              responseJson.patient_post_arr[0]
                .all_unread_chat_count_for_this_post !=
                this.state.dataArrayAll[0].all_unread_chat_count_for_this_post
            ) {
              rawData.push(responseJson.patient_post_arr[i]);
            } else if (this.state.mUnreadCount == mUnreadCount) {
              console.log('no update');
              // if (firstMsgChanged) {
              //   rawData.push(responseJson.patient_post_arr[i])
              // }
            } else {
              console.log(' update');
              console.log('UPDATE_MSG2:');
              rawData.push(responseJson.patient_post_arr[i]);
            }
          }
          console.log('OLD_UNREAD:' + this.state.mUnreadCount);
          console.log('OLD_UNCOUNTS:' + this.state.unCounts);
          console.log('NEW_UNREAD:' + mUnreadCount);
          if (this.state.mUnreadCount != mUnreadCount || firstMsgChanged) {
            mThis.setState(prevState => ({
              dataArray:
                prevState.text && prevState.text.length > 0
                  ? prevState.dataArray
                  : rawData,
              dataArrayAll: rawData,
              post_id: '',
              alertMsg: 'Sorry! No messages available',
              more: responseJson.more,
              mUnreadCount: mUnreadCount,
              rady: false,
            }));

            // mThis.mLoaderShowHide();
            console.log('<><><> ' + mUnreadCount);
            global.MyVar = mUnreadCount;
            mThis.props.navigation.setParams({
              handleSave: mThis.state.unCounts,
            });
            SInfo.setItem('post_id', '', {
              sharedPreferencesName: 'mySharedPrefs',
              keychainService: 'myKeychain',
            });
          } else {
            mThis.setState(state => ({
              rady: false,
            }));
          }
        }
        //console.log("<><><>akki "+responseJson);
      })
      .catch(error => {
        console.log('ERROR:');
        console.log(error);
        mThis.setState({
          rady: true,
          post_id: '',
          alertMsg: error,
        });
        SInfo.setItem('post_id', '', {
          sharedPreferencesName: 'mySharedPrefs',
          keychainService: 'myKeychain',
        });
        mThis.mgetUpdate();
        // Alert.alert('Failed', error);
      });
  }

  mSearchFilterFunction(text) {
    const newData = this.state.dataArrayAll.filter(function(item) {
      console.log('ITEM:' + JSON.stringify(item));
      const postId = item.post_id.toString();
      const doctorId = item.chat_history_arr.get_doctor.doctor_id
        .toString()
        .toUpperCase();
      const itemData = item.post_title.toUpperCase();
      const itemDescription = item.description.toUpperCase();
      const itemName = item.chat_history_arr.get_doctor.first_name.toUpperCase();
      const itemLastName = item.chat_history_arr.get_doctor.last_name.toUpperCase();
      const email = item.chat_history_arr.get_doctor.email.toUpperCase();
      const contact = item.chat_history_arr.get_doctor.contact_number.toUpperCase();
      const businessName = item.chat_history_arr.doctor_clinic.business_name.toUpperCase();
      const webAddress = item.chat_history_arr.doctor_clinic.web_address.toUpperCase();
      const clinicAddress = item.chat_history_arr.doctor_clinic.address.toUpperCase();
      const painLevel = item.pain_level.toUpperCase();
      const currentLocation = item.current_location.toUpperCase();
      const appointmentDateTime = item.chat_history_arr.appointment_time
        .toString()
        .toUpperCase();
      const postedDateTime = item.posted_date.toString().toUpperCase();
      const textData = text.toUpperCase();

      if (painLevel.indexOf(textData) > -1) {
        return painLevel.indexOf(textData) > -1;
      } else if (postId.indexOf(textData) > -1) {
        return postId.indexOf(textData) > -1;
      } else if (doctorId.indexOf(textData) > -1) {
        return doctorId.indexOf(textData) > -1;
      } else if (itemName.indexOf(textData) > -1) {
        return itemName.indexOf(textData) > -1;
      } else if (itemLastName.indexOf(textData) > -1) {
        return itemLastName.indexOf(textData) > -1;
      } else if (email.indexOf(textData) > -1) {
        return email.indexOf(textData) > -1;
      } else if (contact.indexOf(textData) > -1) {
        return contact.indexOf(textData) > -1;
      } else if (businessName.indexOf(textData) > -1) {
        return businessName.indexOf(textData) > -1;
      } else if (webAddress.indexOf(textData) > -1) {
        return webAddress.indexOf(textData) > -1;
      } else if (itemData.indexOf(textData) > -1) {
        return itemData.indexOf(textData) > -1;
      } else if (itemDescription.indexOf(textData) > -1) {
        return itemDescription.indexOf(textData) > -1;
      } else if (currentLocation.indexOf(textData) > -1) {
        return currentLocation.indexOf(textData) > -1;
      } else if (clinicAddress.indexOf(textData) > -1) {
        return clinicAddress.indexOf(textData) > -1;
      } else if (postedDateTime.indexOf(textData) > -1) {
        return postedDateTime.indexOf(textData) > -1;
      } else if (appointmentDateTime.indexOf(textData) > -1) {
        return appointmentDateTime.indexOf(textData) > -1;
      } else {
        return itemName.indexOf(textData) > -1;
      }
    });
    if (!text || text === '') {
      console.log('<><><><><>change state');
      this.setState({
        dataArray: this.state.dataArrayAll,
        text: text,
        isSearching: false,
      });
    } else if (!Array.isArray(newData) && !newData.length) {
      this.setState({
        data: [],
        isSearching: true,
      });
    } else {
      this.setState({
        dataArray: newData,
        text: text,
        isSearching: true,
      });
    }
  }

  onScrollHandler = () => {
    if (this.state.more == 1 && this.state.isSearching == false) {
      this.setState(
        {
          page: this.state.page + 10,
          rady: false,
          visible: true,
        },
        () => {
          SInfo.getItem('patient_id', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          }).then(value => {
            this.setState({patientId: value});
          });
          SInfo.getItem('post_id', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          }).then(value => {
            console.log('WWWWWW= ' + value);
            if (value == '' || value == undefined) {
              value = '';
            }
            this.setState({post_id: value});
            this.mGetRecentPost();
          });
        },
      );
    }
  };

  mRefresh = async () => {
    this.setState({
      page: 0,
      rady: false,
      visible: true,
      dataArray: [],
      dataArrayAll: [],
      text: '',
    });
    SInfo.getItem('patient_id', {
      sharedPreferencesName: 'mySharedPrefs',
      keychainService: 'myKeychain',
    }).then(value => {
      this.setState({patientId: value});
      this.mGetRecentPost();
    });
  };

  renderHeader = () => {
    return (
      <View>
        <SearchBar
          placeholder="Search here ..."
          containerStyle={{backgroundColor: 'white'}}
          inputStyle={{color: '#000'}}
          lightTheme
          onChangeText={text => this.mSearchFilterFunction(text)}
          value={this.state.text}
        />
        {this.state.isSearching && this.state.dataArray.length == 0 && (
          <Text style={{alignSelf: 'center', marginTop: 50}}>
            No messages matched your search.
          </Text>
        )}
      </View>
    );
  };

  render() {
    const {navigate} = this.props.navigation;

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

        {/* <NavigationEvents
          onDidFocus={() => {
            this.setState({
              rady: true,
              // page: 0,
              // dataArray: [],
              // dataArrayAll: [],
            })

            // firebase.notifications().onNotification((notification) => {
            //   const { title, body } = notification;
            //   // this.showAlert(title, body);
            //   console.warn(notification)
            // });
           

            // this._interval = setInterval(() => {
            //   console.log('hello')
            //   this.mgetUpdate()

            // }, 45000);
            console.log(this.state.doctorId)
            //Call whatever logic or dispatch redux actions and update the screen!
          }}
        /> */}

        {/* {this.state.rady == true ? <Spinner overlayColor={'rgba(0, 0, 0, 0.75)'} color={'#08a1d9'} textContent={"Updating"} visible={this.state.visible} textStyle={{ color: '#fff', fontSize: 15, marginTop: -70 }} /> : <View></View>} */}
        {this.state.rady == true ? (
          <View style={{margin: 10}}>
            <ActivityIndicator
              size={'small'}
              color={'#08a1d9'}
              animating={true}
            />
          </View>
        ) : (
          <View></View>
        )}

        <FlatList
          data={this.state.dataArray}
          keyExtractor={item => `key-${item.chat_history_arr.id}`}
          ListHeaderComponent={this.renderHeader}
          renderItem={({item}) => (
            <PatientMessageItem
              item={item}
              onPress={() => navigate('PatientChatWindow', item)}
            />
          )}
          onRefresh={this.mRefresh}
          refreshing={this.state.isRefreshing}
          onEndReached={this.onScrollHandler}
          onEndReachedThreshold={0}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
