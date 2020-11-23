/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  Alert,
  ScrollView,
  TouchableOpacity,
  Modal, TouchableHighlight, Image, Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import SInfo from 'react-native-sensitive-info'
import { Avatar } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import ToggleSwitch from 'toggle-switch-react-native'
import ImageZoom from 'react-native-image-pan-zoom';
import PropTypes from 'prop-types';
import constants from './../constants/constants'
import { getDateTimeForPostToDisplay } from '../utils/GlobalFunctions'


export default class PatientPostDetailsFromList extends Component {
  // static navigationOptions = ({ navigation }) => ({
  //   title: navigation.state.params.post_title,
  //   tabBarVisible: false,
  //   headerTintColor: '#ffffff',
  //   headerStyle: {
  //     backgroundColor: constants.baseColor
  //   },
  //   headerLeft: <TouchableOpacity onPress={() => navigation.goBack()} >
  //     <View style={{ flexDirection: 'row' }}>
  //       <Icon style={{ marginLeft: 15 }} name='angle-left' size={30} color={'#ffffff'} />
  //       <Text allowFontScaling={false} style={{ fontSize: 15, marginTop: 7, marginLeft: 5, fontWeight: '500', color: '#ffffff' }}>Back</Text>
  //     </View>
  //   </TouchableOpacity>
  // });
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      rady: false,
      userProfileImg: [],
      patientId: '',
      painLevel: 'Pain level',
      emergency: 'Emergency',
      postTitle: '',
      currentLocation: '',
      description: '',
      postDate: '',
      postId: '',
      isActive: '0',
      modalVisible: false,
      token: '',
      selectUri: ''
    };
  }


  componentDidMount() {
    SInfo.getItem('token', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      console.log('time to fetch token')
      this.setState({ token: value, })
    });
    SInfo.getItem('post_id', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      this.setState({ postId: value, })
      this.getPostDetails();
      console.log(value)
      console.log(this.state.token)
    });

  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  getPostDetails() {
    var mThis = this;
    var data = new FormData();
    data.append("post_id", this.state.postId);
    data.append("auth_token", this.state.token);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        if (this.responseText.indexOf('status') !== -1) {
          mThis.mLoaderShowHide();
          console.log(JSON.parse(this.responseText));
          var text = this.responseText;
          var obj = JSON.parse(text);
          console.log(obj)
          if (obj.status == 1) {
            var mEmergency = 'Yes';
            var img = [];
            if (obj.patient_post_detls.emergency == '1') {
              mEmergency = 'Yes';
            } else if (obj.patient_post_detls.emergenc == '0') {
              mEmergency = 'No';
            }
            for (i in obj.patient_post_detls.get_attachments) {
              img[i] = constants.imageUrl + 'uploads/patient_post_attachments/' + obj.patient_post_detls.get_attachments[i].file_name;
            }
            mThis.setState({
              isActive: obj.patient_post_detls.is_active,
              patientId: obj.patient_post_detls.patient_id,
              postId: obj.patient_post_detls.id,
              postTitle: obj.patient_post_detls.post_title,
              currentLocation: obj.patient_post_detls.current_location,
              description: obj.patient_post_detls.description,
              painLevel: obj.patient_post_detls.pain_level,
              emergency: mEmergency,
              postDate: getDateTimeForPostToDisplay(obj.patient_post_detls.posted_date),
              userProfileImg: img,
              rady: true
            });
            SInfo.setItem('post_id', '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          } else {
          }
        } else if (obj.status == 5) {
          SInfo.setItem('is_patient_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('is_dentist_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          this.props.navigation.navigate('Home')
        }
        else {
          mThis.mNetworkFailed();
        }
      }
    });
    xhr.open("POST", constants.url + "get-patient-post-details");
    xhr.setRequestHeader('content-type', 'multipart/form-data');
    xhr.send(data);
  }

  mSuccess(msg) {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        Alert.alert('Success', msg);
      }, 200);
    });
  }


  mLoaderShowHide() {
    this.setState({
      visible: !this.state.visible
    });
  };

  mNetworkFailed() {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        Alert.alert('Failed', 'The Internet connection appears to be offline');
      }, 200);
    });
  }

  mDeleteConfrmation = () => {
    Alert.alert(
      'Are you sure?',
      'Your will loose the post and related chats!',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'Yes, delete it!', onPress: () => this.mDeletePatientPost() },
      ],
      { cancelable: false }
    )
  }

  changePostStatus(btn) {
    var status = '0';
    if (btn === true) {
      status = '1'
    } else {
      status = '0'
    }
    this.mLoaderShowHide();
    var mThis = this;
    var data = new FormData();
    data.append("status", status);
    data.append("post_id", this.state.postId);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        mThis.mLoaderShowHide();
        if (this.responseText.indexOf('status') !== -1) {
          var text = this.responseText;
          console.log('<><><>abc' + this.responseText);
          var obj = JSON.parse(text);
          mThis.mSuccess('Status successfully updated');
        } else {
          mThis.mNetworkFailed();
        }
      }
    });
    xhr.open("POST", constants.url + 'change-patient-post-status');
    xhr.send(data);
  }


  mDeletePatientPost() {
    this.mLoaderShowHide();
    var mThis = this;
    var data = new FormData();
    data.append("patient_id", this.state.patientId);
    data.append("auth_token", this.state.token);
    data.append("post_id", this.state.postId);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        if (this.responseText.indexOf('status') !== -1) {
          var text = this.responseText;
          console.log('<><><>abc' + this.responseText);
          var obj = JSON.parse(text);
          mThis.mSuccess('Your post successfully deleted');
          mThis.props.navigation.goBack();
        } else {
          mThis.mNetworkFailed();
        }
      }
    });
    xhr.open("POST", constants.url + 'delete-patient-post');
    xhr.send(data);
  }



  render() {
    const { navigate } = this.props.navigation;
    console.log("<><><><>111 " + this.state.isActive)

    if (this.state.rady == false) {

      return (
        <View style={styles.container}>
          <Spinner overlayColor={'rgba(0, 0, 0, 0.75)'} color={'#08a1d9'} textContent={"Updating"} visible={this.state.visible} textStyle={{ color: '#fff', fontSize: 15, marginTop: -70 }}>
          </Spinner>
        </View>
      )

    } else {

      return (
        <View style={styles.container}>
          <Spinner overlayColor={'rgba(0, 0, 0, 0.75)'} color={'#08a1d9'} textContent={"Updating"} visible={this.state.visible} textStyle={{ color: '#fff', fontSize: 15, marginTop: -70 }}>
          </Spinner>

          <ScrollView keyboardShouldPersistTaps="never">
            <View style={{ backgroundColor: '#ffffff' }}>
              <View style={{ height: 40, width: "100%", alignItems: 'center' }} >
                <Text allowFontScaling={false} style={{ marginTop: 20, fontSize: 14, color: '#000000', fontWeight: '400' }}>{"Posted " + this.state.postDate}</Text>
              </View>

              <View style={styles.editViewNext}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginTop: 5, marginBottom: 5 }}>
                  <Text allowFontScaling={false} style={{ marginLeft: 20, fontSize: 16, color: constants.baseColor, fontWeight: '600' }}>Post Title</Text>
                </View>
                <View style={styles.searchSection}>
                  <Text allowFontScaling={false} numberOfLines={4} style={{ marginLeft: 20, marginRight: 20, fontSize: 17, fontWeight: '500' }}>
                    {this.state.postTitle}</Text>
                </View>
                <View style={{ marginLeft: 20, borderWidth: 0.5, marginTop: 10, borderColor: '#cccccc', }}></View>
              </View>

              <View style={{ backgroundColor: '#fff', marginTop: 10, }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginTop: 5, marginBottom: 5 }}>
                  <Text allowFontScaling={false} style={{ marginLeft: 20, fontSize: 16, color: constants.baseColor, fontWeight: '600' }}>Current Location</Text>
                </View>
                <View style={styles.searchSection}>
                  <Text allowFontScaling={false} numberOfLines={4} style={{ marginLeft: 20, marginRight: 20, fontSize: 17, fontWeight: '500' }}>
                    {this.state.currentLocation}</Text>
                </View>
                <View style={{ marginLeft: 20, borderWidth: 0.5, marginTop: 10, borderColor: '#cccccc', }}></View>
              </View>

              <View style={{ backgroundColor: '#fff', marginTop: 10, }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginTop: 5, marginBottom: 5 }}>
                  <Text allowFontScaling={false} style={{ marginLeft: 20, fontSize: 16, color: constants.baseColor, fontWeight: '600' }}>Emergency</Text>
                </View>
                <View style={styles.searchSection}>
                  <Text allowFontScaling={false} numberOfLines={1} style={{ marginLeft: 20, marginRight: 20, fontSize: 17, fontWeight: '500' }}>
                    {this.state.emergency}</Text>
                </View>
                <View style={{ marginLeft: 20, borderWidth: 0.5, marginTop: 10, borderColor: '#cccccc', }}></View>
              </View>

              <View style={{ backgroundColor: '#fff', marginTop: 10, }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginTop: 5, marginBottom: 5 }}>
                  <Text allowFontScaling={false} style={{ marginLeft: 20, fontSize: 16, color: constants.baseColor, fontWeight: '600' }}>Pain Level</Text>
                </View>
                <View style={styles.searchSection}>
                  <Text allowFontScaling={false} numberOfLines={1} style={{ marginLeft: 20, marginRight: 20, fontSize: 17, fontWeight: '500' }}>
                    {this.state.painLevel}</Text>
                </View>
                <View style={{ marginLeft: 20, borderWidth: 0.5, marginTop: 10, borderColor: '#cccccc', }}></View>
              </View>

              <View style={{ backgroundColor: '#fff', marginTop: 10, }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginTop: 5, marginBottom: 5 }}>
                  <Text allowFontScaling={false} style={{ marginLeft: 20, fontSize: 16, color: constants.baseColor, fontWeight: '600' }}>Description</Text>
                </View>
                <View style={styles.searchSection}>
                  <Text allowFontScaling={false} numberOfLines={6} style={{ marginLeft: 20, marginRight: 20, fontSize: 17, fontWeight: '500' }}>
                    {this.state.description}</Text>
                </View>
                <View style={{ marginLeft: 20, borderWidth: 0.5, marginTop: 10, borderColor: '#cccccc', }}></View>
              </View>

              <View style={{ flexDirection: 'row' }}>
                {
                  this.state.userProfileImg.map((item, index) =>
                    (
                      <TouchableHighlight style={{ flexDirection: 'row', marginLeft: 10, marginTop: 10 }}
                        onPress={() => {
                          this.setState({ selectUri: item })
                          this.setModalVisible(true);
                        }}>
                        <Image style={{ width: 50, height: 50 }} source={{ uri: item }} />
                      </TouchableHighlight>
                    ))}
              </View>
              {this.state.userProfileImg.length == 0 ? <View></View> : <View style={{ marginLeft: 20, borderWidth: 0.5, marginTop: 10, borderColor: '#cccccc', }}></View>
              }
            </View>
            <View style={{ backgroundColor: '#fff', marginTop: 30, height: 41, width: "100%" }}>
              <View style={styles.searchSection}>
                <Text allowFontScaling={false} numberOfLines={1} style={{ color: '#000000', width: '70%', marginTop: 10, marginLeft: 20, marginRight: 20, fontSize: 17, fontWeight: '500' }}>
                  Post Visible</Text>
                <View style={{ justifyContent: 'flex-end', marginTop: 10 }}>
                  {this.state.isActive == '1' ? <ToggleSwitch isOn={true} onColor='#2E8B57' offColor='#ff0000' size='medium' onToggle={(isOn) => this.changePostStatus(isOn)} /> : <ToggleSwitch isOn={false} onColor='#2E8B57' offColor='#ff0000' size='medium' onToggle={(isOn) => this.changePostStatus(isOn)} />}
                </View>
              </View>
            </View>

            <TouchableOpacity onPress={this.mDeleteConfrmation} style={{ backgroundColor: '#fff', marginTop: 30, height: 41 }}>
              <View style={styles.searchSection}>
                <Text allowFontScaling={false} numberOfLines={1} style={{ color: '#ff0000', marginTop: 10, marginLeft: 20, marginRight: 20, fontSize: 17, fontWeight: '500' }}>
                  Delete Post</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
          <Modal
            style={{ backgroundColor: '#000000' }}
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              alert('Modal has been closed.');
            }}>
            <View>
              <TouchableOpacity style={{ marginTop: 50, height: 50, width: 100 }} onPress={() => {
                this.setState({ modalVisible: false });
              }}>
                <Icon style={{ marginTop: 20, marginLeft: 20 }} name='times' size={30} color={'#000000'} />
              </TouchableOpacity>

              <ImageZoom cropWidth={Dimensions.get('window').width}
                cropHeight={Dimensions.get('window').height}
                imageWidth={Dimensions.get('window').width}
                imageHeight={200}>
                <Image style={{ width: Dimensions.get('window').width, height: 200, marginTop: -50 }}
                  source={{ uri: this.state.selectUri }} />
              </ImageZoom>
            </View>
          </Modal>
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchIcon: {
    marginLeft: 20
  },
  textInputStyle: {
    width: "100%",
    marginLeft: 20,
    marginRight: 20,
    fontSize: 17,
    fontWeight: '500'
  },
  logoutContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  optionsListStyle: {
    marginTop: 10,
    marginBottom: 30,
    backgroundColor: 'white'
  },
  subtitleView: {
    marginLeft: 30,
  },
  maintitleView: {
    marginLeft: 30,
    marginTop: 10
  },
  optiontitleView: {
    marginTop: 10,
  },
  subtitleTextStyle: {
    color: '#999'
  },
  maintitleTextStyle: {
    color: '#111',
    fontSize: 18,
    fontWeight: 'bold',
  },
  titleAndVersionContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 150
  },
  titleContainerStyle: {
    marginBottom: 10
  },
  titleTextStyle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'grey',
  },
  versionTextStyle: {
    color: 'grey'
  },
  containerRow: {
    height: 60,
    marginTop: 10,
    backgroundColor: 'white'
  },
  imageview: {
    marginTop: 5
  },
  profileImage: {
    marginTop: 10,
    marginLeft: 20
  },
  editView: {
    height: 50,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  editViewNext: {
    backgroundColor: '#fff',
    marginTop: 10,
  },
  editViewLast: {
    height: 50,
    backgroundColor: '#fff',
    marginTop: 60,
  },
  searchSection: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: "100%"
  },
  dropdown: {
    width: 300,
    height: 50,
    marginLeft: 20,
  },
  dropdown_text: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: '500',
    color: '#111',
  },
  dropdown_pop: {
    width: 200,
    height: 100,
  },
  dropdown_pop_text: {
    marginVertical: 5,
    marginHorizontal: 6,
    fontSize: 18,
    color: '#ccc',
  },
});


