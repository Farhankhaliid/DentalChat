
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
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import constants from "./../constants/constants";
import Spinner from "react-native-loading-spinner-overlay";
import SInfo from 'react-native-sensitive-info';
import ImageBubble from '../components/ImageBubble';
import Images from "./../utils/Images";

export default class MyClientList extends Component {
  static navigationOptions = {
    title: "My Client List",
    headerTintColor: "#ffffff",
    headerStyle: {
      backgroundColor: constants.baseColor
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      doctorId: "",
      loading: false,
      apiCount: 0,
      myClientList: [],
      noDataFound: false,
    };
  }

  deleteClient = (item) => {


    var mThis = this;

    let count = mThis.state.apiCount
    console.log("MY_CLIENT_API:" + mThis.state.doctorId + " " + mThis.state.token)

    mThis.setState({
      apiCount: count + 1,
    })

    fetch(constants.url + 'remove-my-patient', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: mThis.state.token,
        doctor_id: mThis.state.doctorId,
        patient_id: item.patient_id
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log("RES:PATIENT_REMOVE" + JSON.stringify(responseJson))

        mThis.setState({ loading: false,apiCount:0 })

        if (responseJson.status == 5) {
          AsyncStorage.setItem('postData', '');
          SInfo.setItem('is_patient_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('is_dentist_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          mThis.props.navigation.navigate('Home')
        }
        else {
          this.deleteItem(item)
        }
      })
      .catch((error) => {
        if (mThis.state.apiCount == 5) {
          mThis.setState({
            loading: false,
            noDataFound: true,
            apiCount: 0
          }, () => {
            mThis.mFailed();
          });
        } else {
          mThis.deleteClient()
        }

        console.log('the issue occur')

      });
  }

  getMyClientList = () => {


    var mThis = this;
    var rawData = [];
    var mUnreadCount = 0;
    var firstMsgChanged = false

    let count = mThis.state.apiCount
    console.log("MY_CLIENT_API:" + mThis.state.doctorId + " " + mThis.state.token)

    mThis.setState({
      apiCount: count + 1,
    })

    fetch(constants.url + 'fetch-dentist-patient', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: mThis.state.token,
        doctor_id: mThis.state.doctorId,
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log("RES:PATIENT_LIST" + JSON.stringify(responseJson))

        mThis.setState({ loading: false })
        if (responseJson.status == 5) {
          AsyncStorage.setItem('postData', '');
          SInfo.setItem('is_patient_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('is_dentist_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          mThis.props.navigation.navigate('Home')
        }
        else {
          if (responseJson.patients && responseJson.patients.length > 0) {
            mThis.setState({
              myClientList: responseJson.patients,
              noDataFound: false,
              apiCount: 0
            })
          } else {
            mThis.setState({
              myClientList: [],
              noDataFound: true,
              apiCount: 0
            })
          }
        }
      })
      .catch((error) => {
        if (mThis.state.apiCount == 5) {
          mThis.setState({
            loading: false,
            noDataFound: true,
            apiCount: 0
          }, () => {
            mThis.mFailed();
          });
        } else {
          mThis.getMyClientList()
        }

        console.log('the issue occur')

      });
  }

  mFailed() {
    this.setState({ loading: false }, () => {
      setTimeout(() => {
        Alert.alert('Failed', 'Something went wrong please try again');
      }, 200);
    });
  }



  deleteItem = (item) => {
    let dataAll = this.state.myClientList
    let selectedList = []
    selectedList.push(item)
    let remainingData = dataAll.filter(client => !selectedList.some(itemToRemove => client.id === itemToRemove.id));
    if (!remainingData || remainingData.length == 0) {

    } else {

    }
    this.setState({
      myClientList: remainingData,
      noDataFound: (!remainingData || remainingData.length == 0) ? true : false
    })
  }

  renderPatientItem() {
    return (
      this.state.myClientList.map((item, index) => (
        <View key={item.id} style={{ flex: 1 }}>
          <View style={styles.itemContainer}>
            <View style={styles.bubbleViewStyle}>
              <ImageBubble
                image={''}
                firstName={(item.get_patient && item.get_patient.name) ? item.get_patient.name : ""}
                lastName={(item.get_patient && item.get_patient.last_name) ? item.get_patient.last_name : ""}
                size={60}
              />
            </View>
            <View style={styles.detailContainer}>
              <Text allowFontScaling={false} numberOfLines={1} style={styles.nameTextStyle}>
                {(item.get_patient && item.get_patient.name) ? item.get_patient.name : ""} {(item.get_patient && item.get_patient.last_name) ? item.get_patient.last_name : ""}
              </Text>
              <Text allowFontScaling={false} numberOfLines={1} style={styles.nameTextStyle}>
                {"Email: " + (item.get_patient && item.get_patient.email) ? item.get_patient.email : "NA"}
              </Text>
            </View>
            <View style={styles.deleteContainer}>
              <TouchableOpacity style={{ padding: 5 }} onPress={() => {
                this.setState({
                  loading: true
                },()=>{
                  this.deleteClient(item)
                })
              }}>
                <Image source={Images.ImgDelete} style={{ height: 22, width: 22 }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))

    )
  }



  render() {
    // const { navigate } = this.props.navigation;
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        <Spinner overlayColor={'rgba(0, 0, 0, 0.75)'} color={'#08a1d9'} textContent={"Loading"} visible={this.state.loading} textStyle={{ color: '#fff', fontSize: 15, marginTop: -70 }} />

        {/* <NavigationEvents


          onDidFocus={() => {
            if (this._interval) {
              clearInterval(this._interval);
            }
            SInfo.getItem('dentist_id', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
              this.setState({ doctorId: value, })
              console.log("DOCTOR_ID:" + value)
            });
            // SInfo.getItem('type', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
            //   this.setState({ type: value, })
            // });
            SInfo.getItem('token', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
              console.log('time to fetch token')
              // console.log(value)

              this.setState({
                token: value,
                loading: true
              }, () => {
                this.getMyClientList()
              })
              console.log("TOEN:" + value)
            });

            console.log(this.state.doctorId)
            //Call whatever logic or dispatch redux actions and update the screen!
          }}

          onWillBlur={() => {
            // console.log("Will Blur")
            // clearInterval(this._interval);
          }}

          onDidBlur={() => {
            // console.log("Did Blur")
            // clearInterval(this._interval);
          }}
        /> */}


        {
          this.state.noDataFound ?
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", marginTop: 100 }}>
              <Text >No Client Found</Text>
            </View>
            : this.renderPatientItem()
        }


      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4"
  },
  itemContainer: {
    backgroundColor: 'white',
    height: 105,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#DDD'
  },
  bubbleViewStyle: {
    flex: 18
  },
  detailContainer: {
    flex: 63,
    justifyContent: 'center'
  },
  deleteContainer: {
    flex: 10,
    paddingTop: 5,
    alignItems: 'flex-end',
  },


});