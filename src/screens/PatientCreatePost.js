/* eslint-disable comma-dangle */
/* eslint-disable prettier/prettier */
/* @flow */

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  Image,
  Alert,
  ScrollView,
  AppRegistry,
  TouchableOpacity,
  Keyboard,
  Button,
  KeyboardAvoidingView,
  Switch,
} from 'react-native';
import SInfo from 'react-native-sensitive-info';
import {Avatar, Slider} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import ToggleSwitch from 'toggle-switch-react-native';
import constants, {PLACEHOLDER_COLOR} from './../constants/constants';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import add from './../images/add.png';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import Images from './../utils/Images';
import CheckBox from '../components/CheckBox';
import RNPickerSelect from 'react-native-picker-select';
import Geolocation from '@react-native-community/geolocation';
import {throwStatement} from '@babel/types';
import {white} from 'ansi-colors';

const DEMO_OPTIONS_1 = [
  'Please Select',
  'Less than 6 months',
  '6 months - 1 year',
  '1 -3 years',
  'Over 3 years',
];
const PickerData = [
  {
    label: 'Less then 6 Months',
    value: '1',
  },
  {
    label: '6 Months - 1 Year',
    value: '2',
  },
  {
    label: '1 -3 Years',
    value: '3',
  },
  {
    label: 'Over 3 Years',
    value: '4',
  },
];

const placeholder = {
  label: 'Please Select this',
  value: '0',
  color: 'Black',
};

var options = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
let pics = [];
export default class PatientCreatePost extends Component {
  static navigationOptions = {
    title: 'Consult Request',
    headerTintColor: '#ffffff',
    headerStyle: {
      backgroundColor: constants.baseColor,
    },
  };
  constructor(props) {
    super(props);
    this.state = {
      imageUpload: [],
      visible: false,
      avatarSource: '',
      patientId: '',
      pic: 0,
      postTitle: '',
      currentLocation: '',
      description: '',
      latitude: '',
      longitude: '',
      error: '',
      height: 0,
      painLevel: 'Low',
      emergency: false,
      sendEmergency: false,
      insurance: false,
      sendInsurance: true,
      appointment: false,
      sendAppointment: true,
      tog: false,
      token: '',
      appointment: '',
      time: 'Appointment Time',
      date: moment(new Date()).format('MM-DD-YYYY'),
      insuranceInfo: '',
      nextPage: true,
      timeSelected: 1,
      painLevelState: 1,
      defaultLocation: '',
      locationViewStatus: 0,
      pageSelected: 1,
      lastCleaning: {id: 2, name: 'Please Select'},
      lastVisit: {id: 2, name: 'Please Select'},
      lastXRay: {id: 2, name: 'Please Select'},
      leads: [
        {id: 0, name: 'Find a dentist (free)', selected: false},
        {id: 1, name: 'Ask a dental question (free)', selected: false},
        {
          id: 2,
          name: '15-min Video consultation (fee USD 35)',
          selected: false,
        },
        {
          id: 3,
          name:
            '15-min Video consultation + Electronic prescription (for USA only patients, fee USD 89)',
          selected: false,
        },
      ],
      procedures: [
        {id: 1, name: 'Teeth Whitening', val: 'Whitening', selected: false},
        {id: 2, name: 'Invisalign®', val: 'Invisalign', selected: false},
        {id: 3, name: 'Dental Bridge', val: 'Bridge', selected: false},
        {id: 4, name: 'Dentures', val: 'Dentures', selected: false},
        {id: 5, name: 'Implant(s)', val: 'Implant', selected: false},
        {id: 6, name: 'Veneers', val: 'Veneers', selected: false},
        {id: 7, name: 'Crowns (caps)', val: 'Crown', selected: false},
        {id: 8, name: 'Partials', val: 'Partials', selected: false},
        {
          id: 9,
          name: 'All on 4 Implants',
          val: 'All on 4 Implants',
          selected: false,
        },
        {id: 10, name: 'Other', val: 'other', selected: false},
      ],
      patientFinance: false,
      otherProcedure: '',
      regularDentist: false,
    };

    this.renderLeadType = this.renderLeadType.bind(this);
  }
  onCancel() {
    this.TimePicker.close();
  }

  onConfirm(hour, minute) {
    this.setState({time: `${hour}:${minute}`});
    this.TimePicker.close();
  }
  onChange = date => this.setState({date});
  componentDidMount() {
    SInfo.getItem('appointment_type', {
      sharedPreferencesName: 'mySharedPrefs',
      keychainService: 'myKeychain',
    }).then(value => {
      this.setState({
        appointment: parseInt(value),
      });
      console.warn(parseInt(value));
    });
    SInfo.getItem('patient_id', {
      sharedPreferencesName: 'mySharedPrefs',
      keychainService: 'myKeychain',
    }).then(value => {
      this.setState({patientId: value});
    });
    SInfo.getItem('token', {
      sharedPreferencesName: 'mySharedPrefs',
      keychainService: 'myKeychain',
    }).then(value => {
      console.log('time to fetch token');
      this.setState({token: value});
      //this.mGetCurrentLocation();
    });
    Platform.OS === 'android'
      ? console.log('hello')
      : Geolocation.requestAuthorization();
    Geolocation.getCurrentPosition(
      position => {
        console.log('<><><>1234 ' + position.coords.latitude);
        console.log('<><><>1234 ' + position.coords.longitude);
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
        if (
          this.state.latitude.length > 0 ||
          this.state.latitude != undefined
        ) {
          //this.mLoaderShowHide();
          SInfo.getItem('appointment_type', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          }).then(value => {
            this.setState({
              appointment: parseInt(value),
            });
            console.warn(parseInt(value));
          });
          SInfo.getItem('patient_id', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          }).then(value => {
            this.setState({patientId: value});
          });
          SInfo.getItem('token', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          }).then(value => {
            console.log('time to fetch token');
            this.setState({token: value});
            this.mGetCurrentLocation();
          });
        }
      },
      error => this.setState({error: error.message}),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
    this.props.navigation.setParams({handleSave: this.mValidation});
  }
  mValidation = () => {
    if (this.state.postTitle.length <= 0) {
      Alert.alert('Post Title is required.');
      return false;
    } else if (this.state.description.length <= 0) {
      Alert.alert('Description is required.');
      return false;
    } else if (this.state.currentLocation.length <= 0) {
      // Alert.alert('Current Location is required.')
      Alert.alert(
        "Current location info is required, write 'none' if you don't want to share.",
      );
      return false;
    } else if (this.state.lastCleaning.id == 0) {
      Alert.alert('Choose last cleaning.');
      return false;
    } else if (this.state.lastVisit.id == 0) {
      Alert.alert('Choose last visit.');
      return false;
    } else if (this.state.lastXRay.id == 0) {
      Alert.alert('Choose last visit for x-ray.');
      return false;
    } else if (this.state.sendInsurance == true) {
      if (!this.state.insuranceInfo) {
        Alert.alert('Please provide Insurance Information.');
        return false;
      }
    }
    this.mLoaderShowHide();
    this.mUpdateProfile();
  };
  renderCustomActions = () => {
    if (pics.length == 4) {
      Alert.alert(
        'Maximum Selected',
        'Max 4 Image can be uploaded',
        [
          {
            text: 'Ok',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );
    } else {
      const options = {
        rotation: 360,
        allowsEditing: true,
        noData: true,
        mediaType: 'photo',
        maxWidth: 300,
        maxHeight: 300,
        storageOptions: {
          skipBackup: false,
        },
      };

      ImagePicker.showImagePicker(options, response => {
        console.log('Response = ', response);
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          let source = {uri: response.uri};

          let fileName = 'BDSGYUIWEGD.JPG';
          if (response && response.fileName) {
            let extension = response.fileName.substr(
              response.fileName.lastIndexOf('.'),
            );
            if (extension && extension != '') {
              fileName = response.fileName;
            }
          }
          const myImg = {
            uri: response.uri,
            // uri: Platform.OS === "android" ? response.uri : response.uri.replace("file://", ""),
            type: 'image/jpeg',
            name: fileName,
          };
          pics.push(myImg);
          this.setState({
            avatarSource: source,
            pic: myImg,
            imageUpload: myImg,
          });
        }
        console.log(pics);
      });
    }
  };
  AlertRemoveLocation = remove => {
    if (remove) {
      Alert.alert(
        'Remove Location',
        "Current location info is required, write 'none' if you don't want to share.",
        [
          {
            text: 'Ok',
            onPress: () => {
              this.setState({
                locationViewStatus: 1,
                currentLocation: 'none',
              });
            },
          },
        ],
        {cancelable: true},
      );
    } else {
      this.setState(prevState => ({
        locationViewStatus: 0,
        currentLocation: prevState.defaultLocation,
      }));
    }
  };
  DeleteImage = index => {
    Alert.alert(
      'Delete',
      'Do You Want To Remove Image ?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            pics.splice(index, 1);
            this.setState({
              pic: 10,
            });
          },
        },
      ],
      {cancelable: true},
    );
  };
  mFailed() {
    this.setState({visible: false}, () => {
      setTimeout(() => {
        Alert.alert('Failed', 'Something went wrong! Try again');
      }, 200);
    });
  }
  mSuccess() {
    this.props.navigation.navigate('PatientMessages');
    this.setState({visible: false}, () => {
      setTimeout(() => {
        Alert.alert(
          'Success',
          'Received your post, near by Dentist(s) will contact you soon, Thank you.',
        );
      }, 200);
    });
  }
  mLoaderShowHide() {
    this.setState({
      visible: !this.state.visible,
    });
  }
  mNetworkFailed() {
    this.setState({visible: false}, () => {
      setTimeout(() => {
        Alert.alert(
          'Failed',
          'The Internet connection appears to be offline, Please try again',
        );
      }, 200);
    });
  }
  mGetCurrentLocation() {
    var mThis = this;
    var data = new FormData();
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        // mThis.mLoaderShowHide();
        //console.warn("<><><>1234 " + this.responseText);
        var text = this.responseText;
        //console.warn('<><><>abc1' + this.responseText);
        var obj = JSON.parse(text);

        console.log(obj);

        let city = '',
          country = '',
          zip = '',
          address = 'No Address Found';
        if (obj && obj.results && obj.results.length > 0) {
          let addressComponent = obj.results[0].address_components;
          addressComponent.forEach(element => {
            if (element.types[0] == 'locality') {
              console.log('CITY:' + element.long_name);
              city = element.long_name;
            }
            if (element.types[0] == 'country') {
              console.log('COUNTRY:' + element.long_name);
              country = element.long_name;
            }
            if (element.types[0] == 'postal_code') {
              console.log('ZIP:' + element.long_name);
              zip = element.long_name;
            }
          });
        }

        if (
          (!city && !country && !zip) ||
          city == '' ||
          country == '' ||
          zip == ''
        ) {
          return address;
        } else {
          if (city && city != '') {
            address = city;
          }
          if (country && country != '') {
            if (
              !address ||
              (address && address == 'No Address Found') || address == ''
            ) {
              address = country;
            } else {
              address = address + ', ' + country;
            }
          }
          if (
            !address ||
            (address && address == 'No Address Found') || address == ''
          ) {
            address = zip;
          } else {
            address = address + ', ' + zip;
          }
        }

        mThis.setState({
          currentLocation: address,
          defaultLocation: address,
        });

        // mThis.setState({
        //   currentLocation: obj.results[4].formatted_address,
        //   defaultLocation: obj.results[4].formatted_address,
        // });
      }
    });
    xhr.open(
      'GET',
      'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
        this.state.latitude +
        ',' +
        this.state.longitude +
        '&key=AIzaSyCECNx6YKAjaYfP9Eq7FXAMB1QmjUKvMZk',
    );
    xhr.setRequestHeader('cache-control', 'no-cache');
    xhr.setRequestHeader(
      'postman-token',
      '66714504-4f88-2cce-6e47-4bd53dc4de0d',
    );
    xhr.setRequestHeader('key', 'AIzaSyCECNx6YKAjaYfP9Eq7FXAMB1QmjUKvMZk');
    xhr.send(data);
  }

  mUpdateProfile() {
    console.log(pics);
    console.log(this.state.token);

    var date = new Date().getDate();
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    var emergency = '0';
    var appointment = '0';
    var insurance = '0';
    if (this.state.sendEmergency == true) {
      emergency = '1';
    }
    if (this.state.sendAppointment == true) {
      appointment = '1';
    }
    if (this.state.sendInsurance == true) {
      insurance = '1';
    }
    let painLevel = 0;
    if (this.state.painLevel == 'Low') {
      painLevel = 0;
    } else if (this.state.painLevel == 'Medium') {
      painLevel = 5;
    } else {
      painLevel = 10;
    }

    let lead_type = '';
    this.state.leads.forEach(element => {
      if (element.selected) {
        if (lead_type == '') {
          lead_type = element.name;
        } else {
          lead_type = lead_type + ',' + element.name;
        }
      }
    });

    let patientFinance = '0';
    let leadProcedure = '';
    let otherInformation = '';
    let regularDentist = '0';
    if (this.state.patientFinance == true) {
      patientFinance = '1';
      if (this.state.regularDentist == true) {
        regularDentist = '1';
      }
      this.state.procedures.forEach(element => {
        if (element.selected) {
          if (leadProcedure == '') {
            leadProcedure = element.val;
          } else {
            leadProcedure = leadProcedure + ',' + element.val;
          }

          if (element.id == 10 && element.selected) {
            otherInformation = this.state.otherProcedure;
          }
        }
      });
    }

    var data = new FormData();
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    data.append('patient_id', this.state.patientId);
    if (pics.length == 1) {
      data.append('attachments[]', pics[0]);
    } else if (pics.length == 2) {
      data.append('attachments[]', pics[0]);
      data.append('attachments[]', pics[1]);
    } else if (pics.length == 3) {
      data.append('attachments[]', pics[0]);
      data.append('attachments[]', pics[1]);
      data.append('attachments[]', pics[2]);
    } else if (pics.length == 4) {
      data.append('attachments[]', pics[0]);
      data.append('attachments[]', pics[1]);
      data.append('attachments[]', pics[2]);
      data.append('attachments[]', pics[3]);
    } else {
    }
    data.append('auth_token', 'z7NHOmfvqRPAoKM');
    data.append('emergency', emergency);
    data.append('post_title', this.state.postTitle);
    data.append('address', this.state.currentLocation);
    data.append('pain_level', painLevel);
    data.append('description', this.state.description);
    // data.append("appointment", appointment);
    data.append('appointment_datetime', this.state.date);
    data.append('appointment_time', this.state.timeSelected);
    data.append('insurance', insurance);
    data.append('insurance_inforamtion', this.state.insuranceInfo);
    data.append(
      'posted_date',
      year + '-' + month + '-' + date + ' ' + hours + ':' + min + ':' + sec,
    );
    data.append('appointment', this.state.appointment);
    data.append('lead_type', lead_type);
    data.append('last_cleaning', this.state.lastCleaning.id);
    data.append('last_visit', this.state.lastVisit.id);
    data.append('last_dental_xray', this.state.lastXRay.id);
    data.append('financing', patientFinance);
    data.append('lead_procedure', leadProcedure);
    data.append('other_information', otherInformation);
    data.append('regular_dentist', regularDentist);
    console.log('dataa', data);
    fetch(constants.url + 'create-patient-post', {
      method: 'POST',
      body: data,
      headers: {
        //Accept: 'application/json',
        //'Content-Type': 'json; charset=UTF-8',
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        //var users = responseJson;
        console.log(responseJson);
        // this.mLoaderShowHide();
        this.setState(
          {
            visible: false,
          },
          () => {
            if (responseJson.status == 1) {
              this.mSuccess();
              console.log(responseJson);
              this.setState({
                sendEmergency: false,
                postTitle: '',
                painLevel: 'Low',
                description: '',
                date: moment(new Date()).format('MM-DD-YYYY'),
                timeSelected: 1,
                insurance: true,
                insuranceInfo: '',
                appointment: '',
                nextPage: true,
                pageSelected: 1,
              });
              pics = [];
            } else if (responseJson.status == 5) {
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
              this.mFailed();
            }
          },
        );
      })
      .catch(error => {
        this.mLoaderShowHide();
        console.log(error);
        this.mFailed();
      });
  }

  handleKeyDown = function(e) {
    if (e.nativeEvent.key == 'Enter') {
      console.log('<><><><>enter press here! ');
      Keyboard.dismiss();
    } else {
      console.log('<><><><>enter press here5555! ');
    }
  };

  _scrollToInput() {
    const scrollResponder = this.refs.myScrollView.getScrollResponder();
    const inputHandle = React.findNodeHandle(this.refs.myInput);

    scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
      inputHandle, // The TextInput node handle
      0, // The scroll view's bottom "contentInset" (default 0)
      true, // Prevent negative scrolling
    );
  }

  toggleSwitchAppoinment() {
    this.setState({
      sendAppointment: !this.state.sendAppointment,
    });
  }

  toggleSwitchSendEmergency() {
    this.setState({
      sendEmergency: !this.state.sendEmergency,
    });
  }

  toggleSwitchSendInsurance() {
    this.setState({
      sendInsurance: !this.state.sendInsurance,
    });
  }

  toggleSwitchPatientFinance() {
    this.setState({
      patientFinance: !this.state.patientFinance,
    });
  }

  toggleSwitchRegularDentist() {
    this.setState({
      regularDentist: !this.state.regularDentist,
    });
  }

  procedureList() {
    let {procedures} = this.state;
    return procedures.map((item, i) => {
      return (
        <TouchableOpacity
          activeOpacity={1}
          style={{flexDirection: 'row', marginTop: 12}}
          onPress={() => {
            let myprocedures = [...this.state.procedures];
            myprocedures[i] = {
              ...myprocedures[i],
              selected: !item.selected,
            };
            this.setState({procedures: myprocedures});
          }}>
          <CheckBox
            checked={item.selected}
            checkboxStyle={{height: 20, width: 20}}
            onChange={() => {
              let myprocedures = [...this.state.procedures];
              myprocedures[i] = {
                ...myprocedures[i],
                selected: !item.selected,
              };
              this.setState({procedures: myprocedures});
            }}
          />
          {/* <CheckBox
            checkboxStyle={{ height: 15, width: 15 }}
            checked={item.selected}
            label=""
            containerStyle={{ marginTop: 2 }}
            onChange={() => {
              let myprocedures = [...this.state.procedures];
              myprocedures[i] = {
                ...myprocedures[i],
                selected: !item.selected
              };
              this.setState({ procedures: myprocedures });

            }}
          /> */}

          <Text style={{marginStart: 10}}>{item.name}</Text>
        </TouchableOpacity>
      );
    });
  }

  leadList() {
    let {leads} = this.state;
    return leads.map((item, i) => {
      return (
        <TouchableOpacity
          activeOpacity={1}
          style={{flexDirection: 'row', marginTop: 12}}
          onPress={() => {
            let myLeads = [...this.state.leads];
            myLeads[i] = {
              ...myLeads[i],
              selected: !item.selected,
            };
            this.setState({leads: myLeads});
          }}>
          <CheckBox
            checked={item.selected}
            checkboxStyle={{height: 20, width: 20}}
            onChange={() => {
              let myLeads = [...this.state.leads];
              myLeads[i] = {
                ...myLeads[i],
                selected: !item.selected,
              };
              this.setState({leads: myLeads});
            }}
          />
          {/* <CheckBox
            checkboxStyle={{ height: 15, width: 15 }}
            checked={item.selected}
            label=""
            containerStyle={{ marginTop: 2 }}
            onChange={() => {
              let myLeads = [...this.state.leads];
              myLeads[i] = {
                ...myLeads[i],
                selected: !item.selected
              };
              this.setState({ leads: myLeads });

            }}
          /> */}
          <Text style={{marginStart: 10}}>{item.name}</Text>
        </TouchableOpacity>
      );
    });
  }

  renderLeadType() {
    return (
      <View style={{marginStart: 20, marginEnd: 20}}>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 16,
            color: constants.baseColor,
            fontWeight: 'bold',
          }}>
          Select all that applies, this request is for:
        </Text>

        {this.leadList()}

        {this.state.leads[2].selected || this.state.leads[3].selected ? (
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 16,
              color: '#000000',
              fontWeight: 'bold',
              marginTop: 10,
            }}>
            Note : You will be charged only after the consultation.
          </Text>
        ) : null}
      </View>
    );
  }

  renderPage1() {
    return (
      <KeyboardAwareScrollView enableAutomaticScroll={true} style={{flex: 1}}>
        <View style={{backgroundColor: '#ffffff'}}>
          <View style={{backgroundColor: '#fff', marginTop: 30}}>
            {this.renderLeadType()}
            <View style={{width: '100%', flexDirection: 'row', marginTop: 30}}>
              <View style={{width: '70%'}}>
                {this.state.sendEmergency === true ? (
                  <Text
                    allowFontScaling={false}
                    style={{
                      marginLeft: 20,
                      fontSize: 16,
                      color: constants.baseColor,
                      fontWeight: 'bold',
                    }}>
                    Emergency
                  </Text>
                ) : (
                  <Text
                    allowFontScaling={false}
                    style={{
                      marginLeft: 20,
                      fontSize: 16,
                      color: constants.baseColor,
                      fontWeight: 'bold',
                    }}>
                    Emergency
                  </Text>
                )}
              </View>
              <View style={{width: 100, justifyContent: 'flex-end'}}>
                <View style={{alignSelf: 'flex-end'}}>
                  {this.state.sendEmergency === true ? (
                    <Text
                      allowFontScaling={false}
                      style={{
                        marginLeft: 10,
                        fontSize: 16,
                        color: constants.baseColor,
                        fontWeight: 'bold',
                      }}>
                      Yes
                    </Text>
                  ) : (
                    <Text
                      allowFontScaling={false}
                      style={{
                        marginLeft: 10,
                        fontSize: 16,
                        color: constants.baseColor,
                        fontWeight: 'bold',
                      }}>
                      No
                    </Text>
                  )}
                  <Switch
                    trackColor={{false: '#767577', true: constants.baseColor}}
                    value={this.state.sendEmergency}
                    onValueChange={ison => this.toggleSwitchSendEmergency()}
                  />
                </View>
              </View>
            </View>

            <View
              style={{
                marginLeft: 20,
                marginRight: 20,
                borderWidth: 0.5,
                marginTop: 30,
                borderColor: '#cccccc',
              }}></View>
          </View>
          <View style={{backgroundColor: '#fff', marginTop: 20}}>
            <View style={styles.searchSection}>
              <Text
                allowFontScaling={false}
                style={{
                  marginLeft: 20,
                  fontSize: 16,
                  color: constants.baseColor,
                  fontWeight: 'bold',
                }}>
                Pain Level ({this.state.painLevel}){' '}
              </Text>
            </View>
            <View style={{width: '100%', height: 50, flexDirection: 'row'}}>
              <TouchableOpacity
                style={{
                  width: '33%',
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  this.setState({painLevelState: 1, painLevel: 'Low'});
                }}>
                {this.state.painLevelState == 1 ? (
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      style={{height: 15, width: 15, marginTop: 5}}
                      source={require('../images/selected.png')}
                    />
                    <Text style={{color: constants.baseColor, marginTop: 4}}>
                      {' '}
                      Low
                    </Text>
                  </View>
                ) : (
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{fontSize: 22}}>o</Text>
                    <Text style={{color: 'black', marginTop: 6}}> Low</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: '33%',
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  this.setState({painLevelState: 2, painLevel: 'Medium'});
                }}>
                {this.state.painLevelState == 2 ? (
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      style={{height: 15, width: 15, marginTop: 5}}
                      source={require('../images/selected.png')}
                    />
                    <Text style={{color: constants.baseColor, marginTop: 4}}>
                      {' '}
                      Medium
                    </Text>
                  </View>
                ) : (
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{fontSize: 22}}>o</Text>
                    <Text style={{color: 'black', marginTop: 6}}> Medium</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: '33%',
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  this.setState({painLevelState: 3, painLevel: 'High'});
                }}>
                {this.state.painLevelState == 3 ? (
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      style={{height: 15, width: 15, marginTop: 5}}
                      source={require('../images/selected.png')}
                    />
                    <Text style={{color: constants.baseColor, marginTop: 4}}>
                      {' '}
                      High
                    </Text>
                  </View>
                ) : (
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{fontSize: 22}}>o</Text>
                    <Text style={{color: 'black', marginTop: 6}}> High</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View
              style={{
                marginLeft: 20,
                marginRight: 20,
                borderWidth: 0.5,
                marginTop: 20,
                borderColor: '#cccccc',
              }}></View>
          </View>
          <View style={styles.editViewNext}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#fff',
                marginTop: 20,
                marginBottom: 5,
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  marginLeft: 20,
                  marginRight: 20,
                  fontSize: 16,
                  color: constants.baseColor,
                  fontWeight: 'bold',
                }}>
                Post Title
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#fff',
                borderWidth: 1,
                borderRadius: 5,
                height: 50,
                borderColor: '#cccccc',
                width: '90%',
                marginLeft: '5%',
                marginTop: 10,
              }}>
              <TextInput
                allowFontScaling={false}
                maxLength={200}
                value={this.state.postTitle}
                keyboardType="default"
                placeholder="How can we help you (briefly explain)?"
                style={styles.textInputStyle}
                placeholderTextColor={PLACEHOLDER_COLOR}
                onChangeText={text => this.setState({postTitle: text})}
              />
            </View>
          </View>
          <View style={{backgroundColor: '', marginTop: 10}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#fff',
                marginTop: 20,
                marginBottom: 5,
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  marginLeft: 20,
                  marginRight: 20,
                  fontSize: 16,
                  color: constants.baseColor,
                  fontWeight: 'bold',
                }}>
                Description
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#fff',
                borderWidth: 1,
                borderRadius: 5,
                borderColor: '#cccccc',
                width: '90%',
                marginLeft: '5%',
                marginTop: 20,
              }}>
              <TextInput
                allowFontScaling={false}
                maxLength={500}
                style={styles.textInputStyleDesc}
                // multiline={true}
                numberOfLines={3}
                value={this.state.description}
                onChangeText={text => this.setState({description: text})}
                keyboardType="default"
                returnKeyType="done"
                onKeyPress={this.handleKeyDown}
                placeholder="Please provide more detail"
                placeholderTextColor={PLACEHOLDER_COLOR}
              />
            </View>
          </View>
          <TouchableOpacity
            style={{
              height: 50,
              width: '80%',
              marginLeft: '10%',
              backgroundColor: constants.baseColor,
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 30,
            }}
            onPress={() => {
              if (this.state.postTitle.length <= 0) {
                Alert.alert('Post Title is required.');
                return false;
              } else if (this.state.description.length <= 0) {
                Alert.alert('Description is required.');
                return false;
              } else if (
                this.state.leads[0].selected == false &&
                this.state.leads[1].selected == false &&
                this.state.leads[2].selected == false &&
                this.state.leads[3].selected == false
              ) {
                Alert.alert('Request type is required.');
                return false;
              } else {
                this.setState({nextPage: false, pageSelected: 2});
              }
            }}>
            <Text
              allowFontScaling={false}
              style={{color: 'white', fontSize: 20}}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
        {/* </ScrollView> */}
      </KeyboardAwareScrollView>
    );
  }

  renderPage1_() {
    return (
      <KeyboardAwareScrollView style={{flex: 1}}>
        <ScrollView
          keyboardShouldPersistTaps="never"
          keyboardDismissMode="on-drag">
          <View style={{backgroundColor: '#ffffff'}}>
            <View style={{backgroundColor: '#fff', marginTop: 0}}>
              <View
                style={{width: '100%', flexDirection: 'row', marginTop: 30}}>
                <View style={{width: '70%'}}>
                  {this.state.sendEmergency === true ? (
                    <Text
                      allowFontScaling={false}
                      style={{
                        marginLeft: 20,
                        fontSize: 16,
                        color: constants.baseColor,
                        fontWeight: 'bold',
                      }}>
                      Emergency
                    </Text>
                  ) : (
                    <Text
                      allowFontScaling={false}
                      style={{
                        marginLeft: 20,
                        fontSize: 16,
                        color: constants.baseColor,
                        fontWeight: 'bold',
                      }}>
                      Emergency
                    </Text>
                  )}
                </View>
                <View style={{width: 100, justifyContent: 'flex-end'}}>
                  <View style={{alignSelf: 'flex-end'}}>
                    {this.state.sendEmergency === true ? (
                      <Text
                        allowFontScaling={false}
                        style={{
                          marginLeft: 10,
                          fontSize: 16,
                          color: constants.baseColor,
                          fontWeight: 'bold',
                        }}>
                        Yes
                      </Text>
                    ) : (
                      <Text
                        allowFontScaling={false}
                        style={{
                          marginLeft: 10,
                          fontSize: 16,
                          color: constants.baseColor,
                          fontWeight: 'bold',
                        }}>
                        No
                      </Text>
                    )}

                    <Switch
                      trackColor={{false: '#767577', true: constants.baseColor}}
                      value={this.state.sendEmergency}
                      onValueChange={ison => this.toggleSwitchSendEmergency()}
                    />
                  </View>
                </View>
              </View>
              <View
                style={{
                  marginLeft: 20,
                  marginRight: 20,
                  borderWidth: 0.5,
                  marginTop: 30,
                  borderColor: '#cccccc',
                }}></View>
            </View>

            <View style={{backgroundColor: '#fff', marginTop: 20}}>
              <View style={styles.searchSection}>
                <Text
                  allowFontScaling={false}
                  style={{
                    marginLeft: 20,
                    fontSize: 16,
                    color: constants.baseColor,
                    fontWeight: 'bold',
                  }}>
                  Pain Level ({this.state.painLevel}){' '}
                </Text>
              </View>
              <View style={{width: '100%', height: 50, flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{
                    width: '33%',
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    this.setState({painLevelState: 1, painLevel: 'Low'});
                  }}>
                  {this.state.painLevelState == 1 ? (
                    <View style={{flexDirection: 'row'}}>
                      <Image
                        style={{height: 15, width: 15, marginTop: 5}}
                        source={require('../images/selected.png')}
                      />
                      <Text style={{color: constants.baseColor, marginTop: 4}}>
                        {' '}
                        Low
                      </Text>
                    </View>
                  ) : (
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{fontSize: 22}}>o</Text>
                      <Text style={{color: 'black', marginTop: 6}}> Low</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: '33%',
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    this.setState({painLevelState: 2, painLevel: 'Medium'});
                  }}>
                  {this.state.painLevelState == 2 ? (
                    <View style={{flexDirection: 'row'}}>
                      <Image
                        style={{height: 15, width: 15, marginTop: 5}}
                        source={require('../images/selected.png')}
                      />
                      <Text style={{color: constants.baseColor, marginTop: 4}}>
                        {' '}
                        Medium
                      </Text>
                    </View>
                  ) : (
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{fontSize: 22}}>o</Text>
                      <Text style={{color: 'black', marginTop: 6}}>
                        {' '}
                        Medium
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: '33%',
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    this.setState({painLevelState: 3, painLevel: 'High'});
                  }}>
                  {this.state.painLevelState == 3 ? (
                    <View style={{flexDirection: 'row'}}>
                      <Image
                        style={{height: 15, width: 15, marginTop: 5}}
                        source={require('../images/selected.png')}
                      />
                      <Text style={{color: constants.baseColor, marginTop: 4}}>
                        {' '}
                        High
                      </Text>
                    </View>
                  ) : (
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{fontSize: 22}}>o</Text>
                      <Text style={{color: 'black', marginTop: 6}}> High</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              {/* <View style={[styles.searchSection, { marginTop: 20 }]}>

              <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ alignItems: "flex-start", width: '33%' }}>
                  <Text allowFontScaling={false} style={{ fontSize: 16, marginLeft: 20, color: constants.baseColor, fontWeight: 'bold' }}>Low</Text>
                </View>
                <View style={{ alignItems: "center", width: '34%' }}>
                  <Text allowFontScaling={false} style={{ fontSize: 16, color: constants.baseColor, fontWeight: 'bold' }}>Medium</Text>
                </View>
                <View style={{ alignItems: 'flex-end', width: '33%' }}>
                  <Text allowFontScaling={false} style={{ fontSize: 16, marginRight: 20, color: constants.baseColor, fontWeight: 'bold' }}>High</Text>
                </View>

              </View>

            </View>


            <View style={styles.searchSection}>
              <Slider
                step={1}
                minimumValue={0}
                maximumValue={10}
                minimumTrackTintColor={constants.baseColor}
                thumbTintColor={constants.baseColor}
                onValueChange={(ChangedValue) => this.setState({ painLevel: ChangedValue })}
                style={{ width: '90%', marginLeft: 20, marginRight: 20 }} />
            </View> */}
              <View
                style={{
                  marginLeft: 20,
                  marginRight: 20,
                  borderWidth: 0.5,
                  marginTop: 20,
                  borderColor: '#cccccc',
                }}></View>
            </View>
            <View style={styles.editViewNext}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  marginTop: 20,
                  marginBottom: 5,
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    fontSize: 16,
                    color: constants.baseColor,
                    fontWeight: 'bold',
                  }}>
                  Post Title
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  borderWidth: 1,
                  borderRadius: 5,
                  height: 50,
                  borderColor: '#cccccc',
                  width: '90%',
                  marginLeft: '5%',
                  marginTop: 10,
                }}>
                <TextInput
                  allowFontScaling={false}
                  maxLength={200}
                  value={this.state.postTitle}
                  keyboardType="default"
                  placeholder="Enter Post Title"
                  style={styles.textInputStyle}
                  onChangeText={text => this.setState({postTitle: text})}
                />
              </View>
            </View>
            <View style={{backgroundColor: '#fff', marginTop: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  marginTop: 20,
                  marginBottom: 5,
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    fontSize: 16,
                    color: constants.baseColor,
                    fontWeight: 'bold',
                  }}>
                  Description
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  borderWidth: 1,
                  borderRadius: 5,
                  borderColor: '#cccccc',
                  width: '90%',
                  marginLeft: '5%',
                  marginTop: 20,
                }}>
                <TextInput
                  allowFontScaling={false}
                  maxLength={500}
                  style={styles.textInputStyleDesc}
                  multiline={true}
                  value={this.state.description}
                  onChangeText={text => this.setState({description: text})}
                  keyboardType="default"
                  returnKeyType="done"
                  onKeyPress={this.handleKeyDown}
                  placeholder="Enter Description"
                />
              </View>
            </View>
            <TouchableOpacity
              style={{
                height: 50,
                width: '80%',
                marginLeft: '10%',
                backgroundColor: constants.baseColor,
                borderRadius: 15,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 30,
              }}
              onPress={() => {
                if (this.state.postTitle.length <= 0) {
                  Alert.alert('Post Title is required.');
                  return false;
                } else if (this.state.description.length <= 0) {
                  Alert.alert('Description is required.');
                  return false;
                } else {
                  this.setState({nextPage: false, pageSelected: 2});
                }
              }}>
              <Text
                allowFontScaling={false}
                style={{color: 'white', fontSize: 20}}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    );
  }

  renderPage2() {
    return (
      <KeyboardAwareScrollView style={{flex: 1}}>
        <ScrollView
          keyboardShouldPersistTaps="never"
          keyboardDismissMode="on-drag">
          <View style={{flex: 1}}>
            <View
              style={{
                backgroundColor: '#fff',
                marginTop: 30,
                marginStart: 20,
                marginEnd: 20,
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  color: constants.baseColor,
                  fontWeight: 'bold',
                }}>
                When was last time had dental prophy cleaning at a dental
                office?
              </Text>

              <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                <View
                  style={[
                    styles.buttonsStyle,
                    {
                      backgroundColor:
                        this.state.lastCleaning.id == 1
                          ? constants.baseColor
                          : '#FFFFFF',
                    },
                  ]}>
                  <TouchableOpacity
                    style={{justifyContent: 'center', alignContent: 'center'}}
                    onPress={() =>
                      this.setState({lastCleaning: {id: 1, name: 1}})
                    }>
                    <Text
                      style={[
                        styles.buttonStyle,
                        {
                          color:
                            this.state.lastCleaning.id == 1
                              ? '#FFFFFF'
                              : 'gray',
                        },
                      ]}>
                      Less then 6 months
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    styles.buttonsStyle,
                    {
                      backgroundColor:
                        this.state.lastCleaning.id == 2
                          ? constants.baseColor
                          : '#FFFFFF',
                      marginLeft: 5,
                    },
                  ]}>
                  <TouchableOpacity
                    style={{justifyContent: 'center', alignContent: 'center'}}
                    onPress={() =>
                      this.setState({lastCleaning: {id: 2, name: 2}})
                    }>
                    <Text
                      style={[
                        styles.buttonStyle,
                        {
                          color:
                            this.state.lastCleaning.id == 2
                              ? '#FFFFFF'
                              : 'gray',
                        },
                      ]}>
                      6 months to 1 year
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    styles.buttonsStyle,
                    {
                      backgroundColor:
                        this.state.lastCleaning.id == 3
                          ? constants.baseColor
                          : '#FFFFFF',
                      marginLeft: 5,
                    },
                  ]}>
                  <TouchableOpacity
                    style={{justifyContent: 'center', alignContent: 'center'}}
                    onPress={() =>
                      this.setState({lastCleaning: {id: 3, name: 3}})
                    }>
                    <Text
                      style={[
                        styles.buttonStyle,
                        {
                          color:
                            this.state.lastCleaning.id == 3
                              ? '#FFFFFF'
                              : 'gray',
                        },
                      ]}>
                      1 to 3 years
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    styles.buttonsStyle,
                    {
                      backgroundColor:
                        this.state.lastCleaning.id == 4
                          ? constants.baseColor
                          : '#FFFFFF',
                      marginLeft: 5,
                    },
                  ]}>
                  <TouchableOpacity
                    style={{justifyContent: 'center', alignContent: 'center'}}
                    onPress={() =>
                      this.setState({lastCleaning: {id: 4, name: 4}})
                    }>
                    <Text
                      style={[
                        styles.buttonStyle,
                        {
                          color:
                            this.state.lastCleaning.id == 4
                              ? '#FFFFFF'
                              : 'gray',
                        },
                      ]}>
                      Over 3 years
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* <View style={{ borderWidth: 1, borderRadius: 5, borderColor: '#cccccc', justifyContent: 'center', marginTop: 10, paddingHorizontal: 10, height: 50, }}> */}

              {/* <RNPickerSelect
                  placeholder={placeholder}
                  value={this.state.lastCleaning.value}

                  pickerProps={{ style: { height: 214, overflow: 'hidden' } }}

                  onValueChange={(id, value) => { this.setState({ lastCleaning: { id: id, name: value } }) }}
                  items={PickerData}
                  style={{
                    fontSize: 36,
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderColor: 'gray',
                    borderRadius: 4,
                    color: 'black',
                    paddingRight: 30,
                    placeholder: {
                      color: 'black',
                      fontSize: 16,
                      fontWeight: '500',

                    }, inputIOS: {
                      color: 'black',
                      fontSize: 16,
                      fontWeight: 'bold',
                    }, iconContainer: {
                      marginBottom: 30
                    }
                  }
                  }
                // useNativeAndroidPickerStyle={false}
                /> */}
              {/* {Platform.OS == 'ios' && <Image source={Images.ImgDownArrow} style={{ height: 12, width: 12, resizeMode: "contain", position: 'absolute', right: 10, justifyContent: 'center', height: 50, }} />} */}

              {/* </View> */}
            </View>
            <View
              style={{
                backgroundColor: '#fff',
                marginTop: 30,
                marginStart: 20,
                marginEnd: 20,
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  color: constants.baseColor,
                  fontWeight: 'bold',
                }}>
                When was your last visit to the dentist?
              </Text>
              <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                <View
                  style={[
                    styles.buttonsStyle,
                    {
                      backgroundColor:
                        this.state.lastVisit.id == 1
                          ? constants.baseColor
                          : '#FFFFFF',
                    },
                  ]}>
                  <TouchableOpacity
                    style={{justifyContent: 'center', alignContent: 'center'}}
                    onPress={() =>
                      this.setState({lastVisit: {id: 1, name: 1}})
                    }>
                    <Text
                      style={[
                        styles.buttonStyle,
                        {
                          color:
                            this.state.lastVisit.id == 1 ? '#FFFFFF' : 'gray',
                        },
                      ]}>
                      Less then 6 months
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    styles.buttonsStyle,
                    {
                      backgroundColor:
                        this.state.lastVisit.id == 2
                          ? constants.baseColor
                          : '#FFFFFF',
                      marginLeft: 5,
                    },
                  ]}>
                  <TouchableOpacity
                    style={{justifyContent: 'center', alignContent: 'center'}}
                    onPress={() =>
                      this.setState({lastVisit: {id: 2, name: 2}})
                    }>
                    <Text
                      style={[
                        styles.buttonStyle,
                        {
                          color:
                            this.state.lastVisit.id == 2 ? '#FFFFFF' : 'gray',
                        },
                      ]}>
                      6 months to 1 year
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    styles.buttonsStyle,
                    {
                      backgroundColor:
                        this.state.lastVisit.id == 3
                          ? constants.baseColor
                          : '#FFFFFF',
                      marginLeft: 5,
                    },
                  ]}>
                  <TouchableOpacity
                    style={{justifyContent: 'center', alignContent: 'center'}}
                    onPress={() =>
                      this.setState({lastVisit: {id: 3, name: 3}})
                    }>
                    <Text
                      style={[
                        styles.buttonStyle,
                        {
                          color:
                            this.state.lastVisit.id == 3 ? '#FFFFFF' : 'gray',
                        },
                      ]}>
                      1 to 3 years
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    styles.buttonsStyle,
                    {
                      backgroundColor:
                        this.state.lastVisit.id == 4
                          ? constants.baseColor
                          : '#FFFFFF',
                      marginLeft: 5,
                    },
                  ]}>
                  <TouchableOpacity
                    style={{justifyContent: 'center', alignContent: 'center'}}
                    onPress={() =>
                      this.setState({lastVisit: {id: 4, name: 4}})
                    }>
                    <Text
                      style={[
                        styles.buttonStyle,
                        {
                          color:
                            this.state.lastVisit.id == 4 ? '#FFFFFF' : 'gray',
                        },
                      ]}>
                      Over 3 years
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* <View style={{ borderWidth: 1, borderRadius: 5, borderColor: '#cccccc', height: 50, justifyContent: 'center', marginTop: 10, paddingHorizontal: 10 }}>

                <RNPickerSelect
                  placeholder={placeholder}
                  value={this.state.lastVisit.value}
                  pickerProps={{ style: { height: 214, overflow: 'hidden' } }}
                  onValueChange={(id, value) => this.setState({ lastVisit: { id: id, name: value } })}
                  items={PickerData}
                  style={{
                    fontSize: 36,
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderColor: 'gray',
                    borderRadius: 4,
                    color: 'black',
                    paddingRight: 30,
                    placeholder: {
                      color: 'black',
                      fontSize: 16,
                      fontWeight: '500',

                    }, inputIOS: {
                      color: 'black',
                      fontSize: 16,
                      fontWeight: 'bold',
                    }
                  }
                  }
                // useNativeAndroidPickerStyle={false}
                />

                {Platform.OS == 'ios' && <Image source={Images.ImgDownArrow} style={{ height: 12, width: 12, resizeMode: "contain", position: 'absolute', right: 10, justifyContent: 'center', height: 50, }} />}
              </View> */}
            </View>
            <View
              style={{
                backgroundColor: '#fff',
                marginTop: 30,
                marginStart: 20,
                marginEnd: 20,
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  color: constants.baseColor,
                  fontWeight: 'bold',
                }}>
                When was last time had dental x-rays?
              </Text>
              <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                <View
                  style={[
                    styles.buttonsStyle,
                    {
                      backgroundColor:
                        this.state.lastXRay.id == 1
                          ? constants.baseColor
                          : '#FFFFFF',
                    },
                  ]}>
                  <TouchableOpacity
                    style={{justifyContent: 'center', alignContent: 'center'}}
                    onPress={() => this.setState({lastXRay: {id: 1, name: 1}})}>
                    <Text
                      style={[
                        styles.buttonStyle,
                        {
                          color:
                            this.state.lastXRay.id == 1 ? '#FFFFFF' : 'gray',
                        },
                      ]}>
                      Less then 6 months
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    styles.buttonsStyle,
                    {
                      backgroundColor:
                        this.state.lastXRay.id == 2
                          ? constants.baseColor
                          : '#FFFFFF',
                      marginLeft: 5,
                    },
                  ]}>
                  <TouchableOpacity
                    style={{justifyContent: 'center', alignContent: 'center'}}
                    onPress={() => this.setState({lastXRay: {id: 2, name: 2}})}>
                    <Text
                      style={[
                        styles.buttonStyle,
                        {
                          color:
                            this.state.lastXRay.id == 2 ? '#FFFFFF' : 'gray',
                        },
                      ]}>
                      6 months to 1 year
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    styles.buttonsStyle,
                    {
                      backgroundColor:
                        this.state.lastXRay.id == 3
                          ? constants.baseColor
                          : '#FFFFFF',
                      marginLeft: 5,
                    },
                  ]}>
                  <TouchableOpacity
                    style={{justifyContent: 'center', alignContent: 'center'}}
                    onPress={() => this.setState({lastXRay: {id: 3, name: 3}})}>
                    <Text
                      style={[
                        styles.buttonStyle,
                        {
                          color:
                            this.state.lastXRay.id == 3 ? '#FFFFFF' : 'gray',
                        },
                      ]}>
                      1 to 3 years
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    styles.buttonsStyle,
                    {
                      backgroundColor:
                        this.state.lastXRay.id == 4
                          ? constants.baseColor
                          : '#FFFFFF',
                      marginLeft: 5,
                    },
                  ]}>
                  <TouchableOpacity
                    style={{justifyContent: 'center', alignContent: 'center'}}
                    onPress={() => this.setState({lastXRay: {id: 4, name: 4}})}>
                    <Text
                      style={[
                        styles.buttonStyle,
                        {
                          color:
                            this.state.lastXRay.id == 4 ? '#FFFFFF' : 'gray',
                        },
                      ]}>
                      Over 3 years
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* <View style={{ borderWidth: 1, borderRadius: 5, borderColor: '#cccccc', height: 50, justifyContent: 'center', marginTop: 10, paddingHorizontal: 10 }}>
                <RNPickerSelect
                  placeholder={placeholder}
                  value={this.state.lastXRay.value}
                  pickerProps={{ style: { height: 214, overflow: 'hidden' } }}
                  onValueChange={(id, value) => this.setState({ lastXRay: { id: id, name: value } })}
                  items={PickerData}
                  style={{
                    fontSize: 36,
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderColor: 'gray',
                    borderRadius: 4,
                    color: 'black',
                    paddingRight: 30,
                    placeholder: {
                      color: 'black',
                      fontSize: 16,
                      fontWeight: '500',

                    }, inputIOS: {
                      color: 'black',
                      fontSize: 16,
                      fontWeight: 'bold',
                    }
                  }
                  }
                // useNativeAndroidPickerStyle={false}
                />

                {Platform.OS == 'ios' && <Image source={Images.ImgDownArrow} style={{ height: 12, width: 12, resizeMode: "contain", position: 'absolute', right: 10, justifyContent: 'center', height: 50, }} />}
              </View> */}
            </View>

            <View
              style={{
                backgroundColor: '#fff',
                marginTop: 30,
                marginStart: 20,
                marginEnd: 20,
              }}>
              <View style={{width: '100%', flexDirection: 'row'}}>
                <View style={{width: '70%'}}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 16,
                      color: constants.baseColor,
                      fontWeight: 'bold',
                    }}>
                    Are you interested in patient financing?
                  </Text>
                </View>
                <View style={{width: 100, justifyContent: 'flex-end'}}>
                  <View style={{alignSelf: 'flex-end'}}>
                    {this.state.patientFinance === true ? (
                      <Text
                        allowFontScaling={false}
                        style={{
                          marginLeft: 10,
                          fontSize: 16,
                          color: constants.baseColor,
                          fontWeight: 'bold',
                        }}>
                        Yes
                      </Text>
                    ) : (
                      <Text
                        style={{
                          marginLeft: 10,
                          fontSize: 16,
                          color: constants.baseColor,
                          fontWeight: 'bold',
                        }}>
                        No
                      </Text>
                    )}
                    <Switch
                      trackColor={{false: '#767577', true: constants.baseColor}}
                      value={this.state.patientFinance}
                      onValueChange={ison => this.toggleSwitchPatientFinance()}
                    />
                  </View>
                </View>
              </View>
            </View>

            {this.state.patientFinance ? (
              this.renderPatientFinancing()
            ) : (
              <View></View>
            )}
          </View>

          <TouchableOpacity
            style={{
              height: 50,
              width: '80%',
              marginLeft: '10%',
              backgroundColor: constants.baseColor,
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 30,
            }}
            onPress={() => {
              this.setState(prevState => ({
                pageSelected: prevState.pageSelected - 1,
              }));
            }}>
            <Text
              allowFontScaling={false}
              style={{color: 'white', fontSize: 20}}>
              Back
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 50,
              width: '80%',
              marginLeft: '10%',
              backgroundColor: constants.baseColor,
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
            }}
            onPress={() => {
              if (this.state.lastCleaning.id == 0) {
                Alert.alert('Choose last cleaning.');
                return false;
              } else if (this.state.lastVisit.id == 0) {
                Alert.alert('Choose last visit.');
                return false;
              } else if (this.state.lastXRay.id == 0) {
                Alert.alert('Choose last visit for x-ray.');
                return false;
              } else {
                this.setState({pageSelected: 3});
              }
            }}>
            <Text
              allowFontScaling={false}
              style={{color: 'white', fontSize: 20}}>
              Next
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAwareScrollView>
    );
  }

  renderPatientFinancing() {
    return (
      <View style={{marginTop: 20, marginStart: 20, marginEnd: 20}}>
        <Text style={{color: constants.baseColor}}>
          Please identify the type of procedure(s) you are seeking (If unsure,
          please leave blank):
        </Text>
        {this.procedureList()}
        {this.state.procedures[9].selected ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#fff',
              borderWidth: 1,
              borderRadius: 5,
              height: 50,
              borderColor: '#cccccc',
              width: '100%',
              marginTop: 10,
            }}>
            <TextInput
              allowFontScaling={false}
              maxLength={200}
              value={this.state.otherProcedure}
              keyboardType="default"
              placeholder="Other Procedure"
              style={styles.textInputStyle}
              onChangeText={text => this.setState({otherProcedure: text})}
            />
          </View>
        ) : null}
        <View style={{backgroundColor: '#fff', marginTop: 20}}>
          <View style={{width: '100%', flexDirection: 'row'}}>
            <View style={{width: '70%'}}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  color: constants.baseColor,
                  fontWeight: 'bold',
                }}>
                Do you have a regular dentist?
              </Text>
            </View>
            <View style={{width: 100, justifyContent: 'flex-end'}}>
              <View style={{alignSelf: 'flex-end'}}>
                {this.state.regularDentist === true ? (
                  <Text
                    allowFontScaling={false}
                    style={{
                      marginLeft: 10,
                      fontSize: 16,
                      color: constants.baseColor,
                      fontWeight: 'bold',
                    }}>
                    Yes
                  </Text>
                ) : (
                  <Text
                    style={{
                      marginLeft: 10,
                      fontSize: 16,
                      color: constants.baseColor,
                      fontWeight: 'bold',
                    }}>
                    No
                  </Text>
                )}
                <Switch
                  trackColor={{false: '#767577', true: constants.baseColor}}
                  value={this.state.regularDentist}
                  onValueChange={ison => this.toggleSwitchRegularDentist()}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  renderPage3() {
    return (
      <KeyboardAwareScrollView style={{flex: 1}}>
        <ScrollView
          keyboardShouldPersistTaps="never"
          keyboardDismissMode="on-drag">
          <View style={{backgroundColor: '#ffffff'}}>
            {/* <View style={{ backgroundColor: '#fff', marginTop: 10, }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginTop: 5, marginBottom: 5 }}>
              <Text allowFontScaling={false} style={{ marginLeft: 20, marginRight: 20, fontSize: 16, color: constants.baseColor, fontWeight: 'bold' }}>Current Location</Text>
            </View> */}
            {/* <View style={styles.searchSection}>
              <TextInput
                keyboardType='default'
                placeholder='not added'
                style={styles.textInputStyle}
                value={this.state.currentLocation}
                onChangeText={(text) => this.setState({ currentLocation: text })} />
            </View> */}
            {/* <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderRadius: 5, borderColor: '#cccccc', width: '90%', marginLeft: '5%' }}>

             
              <GooglePlacesAutocomplete
                placeholder='Enter Location'
                minLength={2}
                autoFocus={false}
                returnKeyType={'search'}
                fetchDetails={true}
                styles={{
                  textInputContainer: {
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderTopWidth: 0,
                    borderBottomWidth: 0
                  },
                  textInput: {
                    marginLeft: 0,
                    marginRight: 0,
                    color: '#5d5d5d',
                    fontSize: 16
                  },
                  predefinedPlacesDescription: {
                    color: '#1faadb'
                  },
                }}
                currentLocation={false}
                query={{
                  // available options: https://developers.google.com/places/web-service/autocomplete
                  key: 'AIzaSyCECNx6YKAjaYfP9Eq7FXAMB1QmjUKvMZk',
                  language: 'en', // language of the results
                  types: '(cities)' // default: 'geocode'
                }}

                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                  console.warn(data);
                  this.setState({ currentLocation: data.description })
                }}


              />
            </View> */}
            {/* </View> */}

            <View style={{backgroundColor: '#fff', marginTop: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  marginTop: 5,
                  marginBottom: 5,
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    fontSize: 16,
                    color: constants.baseColor,
                    fontWeight: 'bold',
                  }}>
                  Location
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  borderWidth: 1,
                  borderRadius: 5,
                  height: 50,
                  borderColor: '#cccccc',
                  width: '90%',
                  marginLeft: '5%',
                  marginTop: 10,
                }}>
                <TextInput
                  allowFontScaling={false}
                  maxLength={200}
                  value={this.state.currentLocation}
                  keyboardType="default"
                  placeholder="Enter Location"
                  style={styles.textLocationInputStyle}
                  onChangeText={text => this.setState({currentLocation: text})}
                />
                {this.state.locationViewStatus == 0 ? (
                  <TouchableOpacity
                    style={{
                      height: '100%',
                      alignItems: 'flex-end',
                      width: '5%',
                      justifyContent: 'center',
                    }}
                    onPress={() => this.AlertRemoveLocation(true)}>
                    <Image
                      source={Images.ImgDelete}
                      style={{
                        resizeMode: 'center',
                        height: 25,
                        width: 25,
                      }}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{
                      height: '100%',
                      alignItems: 'flex-end',
                      width: '5%',
                      justifyContent: 'center',
                    }}
                    onPress={() => this.AlertRemoveLocation(false)}>
                    <Image
                      source={add}
                      style={{
                        resizeMode: 'center',
                        height: 25,
                        width: 25,
                      }}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={{backgroundColor: '#fff', marginTop: 30}}>
              <View style={{width: '100%', flexDirection: 'row'}}>
                <View style={{width: '70%'}}>
                  {this.state.sendAppointment === true ? (
                    <Text
                      allowFontScaling={false}
                      style={{
                        marginLeft: 20,
                        fontSize: 16,
                        color: constants.baseColor,
                        fontWeight: 'bold',
                      }}>
                      Are you looking for Appointment?
                    </Text>
                  ) : (
                    <Text
                      allowFontScaling={false}
                      style={{
                        marginLeft: 20,
                        fontSize: 16,
                        color: constants.baseColor,
                        fontWeight: 'bold',
                      }}>
                      Are you looking for Appointment?
                    </Text>
                  )}
                </View>
                <View style={{width: 100, justifyContent: 'flex-end'}}>
                  <View style={{alignSelf: 'flex-end'}}>
                    {this.state.sendAppointment === true ? (
                      <Text
                        allowFontScaling={false}
                        style={{
                          marginLeft: 10,
                          fontSize: 16,
                          color: constants.baseColor,
                          fontWeight: 'bold',
                        }}>
                        Yes
                      </Text>
                    ) : (
                      <Text
                        allowFontScaling={false}
                        style={{
                          marginLeft: 10,
                          fontSize: 16,
                          color: constants.baseColor,
                          fontWeight: 'bold',
                        }}>
                        No
                      </Text>
                    )}
                    <Switch
                      trackColor={{false: '#767577', true: constants.baseColor}}
                      value={this.state.sendAppointment}
                      onValueChange={ison => this.toggleSwitchAppoinment()}
                    />
                  </View>
                </View>
              </View>
              {this.state.sendAppointment ? (
                <View style={{flexDirection: 'column', width: '100%'}}>
                  {/* <TouchableOpacity
                onPress={() => this.TimePicker.open()}
                style={{ backgroundColor: constants.baseColor, borderWidth: 1, borderColor: constants.baseColor, borderRadius: 15, width: '45%', height: 30, marginLeft: '3.3%', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}
              >
                <Text style={{ color: 'white' }}>{this.state.time}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.TimePicker.open()}
                style={{ backgroundColor: constants.baseColor, borderWidth: 1, borderColor: constants.baseColor, borderRadius: 15, width: '45%', height: 30, marginLeft: '3.3%', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}
              >
             
                <Text style={{ color: 'white' }}>{this.state.time}</Text>
              </TouchableOpacity>
              <TimePicker
                ref={ref => {
                  this.TimePicker = ref;
                }}
                onCancel={() => this.onCancel()}
                onConfirm={(hour, minute) => this.onConfirm(hour, minute)}
              /> */}
                  <Text
                    style={{
                      marginTop: 20,
                      color: constants.baseColor,
                      marginLeft: '5%',
                    }}>
                    Preferred Date
                  </Text>
                  <DatePicker
                    style={{width: '90%', marginTop: 20, marginLeft: '5%'}}
                    date={this.state.date}
                    mode="date"
                    placeholder="select date"
                    format="MM-DD-YYYY"
                    minDate={this.state.date}
                    // maxDate="2016-06-01 00:00:00"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        position: 'absolute',
                        left: 0,
                        top: 4,
                        marginLeft: 0,
                      },
                      dateInput: {
                        marginLeft: 36,
                      },
                      // ... You can check the source to find the other keys.
                    }}
                    onDateChange={date => {
                      this.setState({date: date});
                    }}
                  />
                  <Text
                    style={{
                      marginTop: 20,
                      color: constants.baseColor,
                      marginLeft: '5%',
                    }}>
                    Preferred Time
                  </Text>
                  <View
                    style={{width: '100%', height: 50, flexDirection: 'row'}}>
                    <TouchableOpacity
                      style={{
                        width: '33%',
                        height: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => {
                        this.setState({timeSelected: 1});
                      }}>
                      {this.state.timeSelected == 1 ? (
                        <View style={{flexDirection: 'row'}}>
                          <Image
                            style={{height: 15, width: 15, marginTop: 5}}
                            source={require('../images/selected.png')}
                          />
                          <Text
                            style={{color: constants.baseColor, marginTop: 4}}>
                            {' '}
                            8am-4pm
                          </Text>
                        </View>
                      ) : (
                        <View style={{flexDirection: 'row'}}>
                          <Text style={{fontSize: 22}}>o</Text>
                          <Text style={{color: 'black', marginTop: 6}}>
                            {' '}
                            8am-4pm
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        width: '33%',
                        height: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => {
                        this.setState({timeSelected: 2});
                      }}>
                      {this.state.timeSelected == 2 ? (
                        <View style={{flexDirection: 'row'}}>
                          <Image
                            style={{height: 15, width: 15, marginTop: 5}}
                            source={require('../images/selected.png')}
                          />
                          <Text
                            style={{color: constants.baseColor, marginTop: 4}}>
                            {' '}
                            4pm-12am
                          </Text>
                        </View>
                      ) : (
                        <View style={{flexDirection: 'row'}}>
                          <Text style={{fontSize: 22}}>o</Text>
                          <Text style={{color: 'black', marginTop: 6}}>
                            {' '}
                            4pm-12am
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        width: '33%',
                        height: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => {
                        this.setState({timeSelected: 3});
                      }}>
                      {this.state.timeSelected == 3 ? (
                        <View style={{flexDirection: 'row'}}>
                          <Image
                            style={{height: 15, width: 15, marginTop: 5}}
                            source={require('../images/selected.png')}
                          />
                          <Text
                            style={{color: constants.baseColor, marginTop: 4}}>
                            {' '}
                            12am-8am
                          </Text>
                        </View>
                      ) : (
                        <View style={{flexDirection: 'row'}}>
                          <Text style={{fontSize: 22}}>o</Text>
                          <Text style={{color: 'black', marginTop: 6}}>
                            {' '}
                            12am-8am
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View></View>
              )}
              <View
                style={{
                  marginLeft: 20,
                  marginRight: 20,
                  borderWidth: 0.5,
                  marginTop: 20,
                  borderColor: '#cccccc',
                }}></View>
            </View>
            <View style={{backgroundColor: '#fff', marginTop: 30}}>
              <View style={{width: '100%', flexDirection: 'row'}}>
                <View style={{width: '70%'}}>
                  {this.state.sendInsurance === true ? (
                    <Text
                      allowFontScaling={false}
                      style={{
                        marginLeft: 20,
                        fontSize: 16,
                        color: constants.baseColor,
                        fontWeight: 'bold',
                      }}>
                      Do you have dental insurance ?
                    </Text>
                  ) : (
                    <Text
                      allowFontScaling={false}
                      style={{
                        marginLeft: 20,
                        fontSize: 16,
                        color: constants.baseColor,
                        fontWeight: 'bold',
                      }}>
                      Do you have dental insurance ?
                    </Text>
                  )}
                </View>
                <View style={{width: 100, justifyContent: 'flex-end'}}>
                  <View style={{alignSelf: 'flex-end'}}>
                    {this.state.sendInsurance === true ? (
                      <Text
                        allowFontScaling={false}
                        style={{
                          marginLeft: 10,
                          fontSize: 16,
                          color: constants.baseColor,
                          fontWeight: 'bold',
                        }}>
                        Yes
                      </Text>
                    ) : (
                      <Text
                        style={{
                          marginLeft: 10,
                          fontSize: 16,
                          color: constants.baseColor,
                          fontWeight: 'bold',
                        }}>
                        No
                      </Text>
                    )}
                    <Switch
                      trackColor={{false: '#767577', true: constants.baseColor}}
                      value={this.state.sendInsurance}
                      onValueChange={ison => this.toggleSwitchSendInsurance()}
                    />
                  </View>
                </View>
              </View>
              {this.state.sendInsurance ? (
                <View style={{marginTop: 20}}>
                  <Text style={{color: constants.baseColor, marginLeft: '5%'}}>
                    Type Your Insurance Inforamtion
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#fff',
                      borderWidth: 1,
                      borderRadius: 5,
                      height: 50,
                      borderColor: '#cccccc',
                      width: '90%',
                      marginLeft: '5%',
                      marginTop: 10,
                    }}>
                    <TextInput
                      allowFontScaling={false}
                      maxLength={200}
                      value={this.state.insuranceInfo}
                      keyboardType="default"
                      placeholder="Dental Insurance Information"
                      style={styles.textInputStyle}
                      onChangeText={text =>
                        this.setState({insuranceInfo: text})
                      }
                    />
                  </View>
                </View>
              ) : (
                <View></View>
              )}
              <View
                style={{
                  marginLeft: 20,
                  marginRight: 20,
                  borderWidth: 0.5,
                  marginTop: 20,
                  borderColor: '#cccccc',
                }}></View>
            </View>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
            <Text
              allowFontScaling={false}
              style={{
                marginLeft: 20,
                fontSize: 16,
                color: constants.baseColor,
                fontWeight: 'bold',
              }}>
              Add Photo
            </Text>
          </View>
          <View style={[styles.profileImage, {flexDirection: 'row'}]}>
            {this.state.pic == 0 ? (
              <View></View>
            ) : (
              <View style={{flexDirection: 'row', marginRight: 5}}>
                {pics.map((item, index) => (
                  <TouchableOpacity
                    style={{height: 35, width: 30, marginLeft: 5}}
                    onPress={() => this.DeleteImage(index)}>
                    <Image
                      style={{height: 35, width: 30, resizeMode: 'stretch'}}
                      source={{uri: item.uri}}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <TouchableOpacity
              style={{height: 30, width: 30}}
              onPress={() => this.renderCustomActions()}>
              <Image style={{height: 30, width: 30}} source={add} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{
              height: 50,
              width: '80%',
              marginLeft: '10%',
              backgroundColor: constants.baseColor,
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 30,
            }}
            onPress={() => {
              this.setState(prevState => ({
                nextPage: true,
                pageSelected: prevState.pageSelected - 1,
              }));
            }}>
            <Text
              allowFontScaling={false}
              style={{color: 'white', fontSize: 20}}>
              Back
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 50,
              width: '80%',
              marginLeft: '10%',
              backgroundColor: constants.baseColor,
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
            }}
            onPress={() => this.mValidation()}>
            <Text
              allowFontScaling={false}
              style={{color: 'white', fontSize: 20}}>
              Submit Request
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAwareScrollView>
    );
  }

  render() {
    const {navigate} = this.props.navigation;

    return (
      <View style={styles.container}>
        <Spinner
          overlayColor={'rgba(0, 0, 0, 0.75)'}
          color={'#08a1d9'}
          textContent={'Updating'}
          visible={this.state.visible}
          textStyle={{color: '#fff', fontSize: 15, marginTop: -70}}></Spinner>
        {this.state.pageSelected == 1
          ? this.renderPage1()
          : this.state.pageSelected == 2
          ? this.renderPage2()
          : this.renderPage3()}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'red',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  searchIcon: {
    marginLeft: 20,
  },
  textInputStyle: {
    width: '90%',
    marginLeft: 20,
    marginRight: 20,
    fontSize: 16,
    fontWeight: '500',
  },

  textLocationInputStyle: {
    width: '80%',
    marginLeft: 20,
    marginRight: 20,
    fontSize: 16,
    fontWeight: '500',
  },

  textInputStyleDesc: {
    width: '90%',
    height: 70,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 17,
    fontWeight: '500',
  },
  logoutContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  optionsListStyle: {
    marginTop: 10,
    marginBottom: 30,
    backgroundColor: 'white',
  },
  subtitleView: {
    marginLeft: 30,
  },
  maintitleView: {
    marginLeft: 30,
    marginTop: 10,
  },
  optiontitleView: {
    marginTop: 10,
  },
  subtitleTextStyle: {
    color: '#999',
  },
  maintitleTextStyle: {
    color: '#111',
    fontSize: 18,
    fontWeight: 'bold',
  },
  titleAndVersionContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
  },
  titleContainerStyle: {
    marginBottom: 10,
  },
  titleTextStyle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'grey',
  },
  versionTextStyle: {
    color: 'grey',
  },
  containerRow: {
    height: 60,
    marginTop: 10,
    backgroundColor: 'white',
  },
  imageview: {
    marginTop: 5,
  },
  profileImage: {
    marginTop: 10,
    marginLeft: 20,
  },
  editView: {
    height: 50,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  editViewNext: {
    backgroundColor: '#fff',
    marginTop: 1,
  },
  editViewLast: {
    height: 50,
    backgroundColor: '#fff',
    marginTop: 60,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dropdown: {
    width: 300,
    height: 50,
  },
  dropdown_text: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: '500',
    color: '#111',
  },
  dropdown_pop: {
    width: 200,
    height: 260,
  },
  dropdown_pop_text: {
    marginVertical: 5,
    marginHorizontal: 6,
    fontSize: 18,
    color: '#ccc',
  },

  buttonsStyle: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.4,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
  buttonStyle: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 6,
  },
});

const optionsList = [
  {
    title: 'Edit Profie',
    icon: 'edit',
    screenName: 'DentistEditProfile',
  },
  {
    title: 'Change Password',
    icon: 'lock',
    screenName: 'DentistChangePassword',
  },
];
