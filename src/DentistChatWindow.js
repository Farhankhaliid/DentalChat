import React from 'react';
import {
  Platform,
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { GiftedChat, Actions, Bubble } from 'react-native-gifted-chat';
import { Button } from 'react-native-elements';
import CustomActions from '../components/CustomActions';
import ImageBubble from '../components/ImageBubble';
import SInfo from 'react-native-sensitive-info';
import Spinner from 'react-native-loading-spinner-overlay';
import SocketIOClient from 'socket.io-client';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Moment from 'moment';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import PropTypes from 'prop-types';
import constants from './../constants/constants';
export default class DentistChatWindow extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      patientId: '',
      postId: '',
      docterId: '',
      dentistName: '',
      patientName: '',
      vvvvv: false,
      isDateTimePickerVisible: false,
      mode: 'date',
      newdate: '',
      newtime: '',
      eme: '',
      aptime: '',
      token: '',
    };

    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.sendMsg = this.sendMsg.bind(this);
    this.onSend = this.onSend.bind(this);
    this.socket = SocketIOClient('https://dentalchat.com:8005/', {
      transports: ['websocket'],
    });
  }

  addUserToChatroom() {
    const set_name_json = {
      from: this.state.docterId,
      senderName: this.state.dentistName,
      buddy: this.state.patientId,
      receiverName: this.state.patientName,
      roomName: '',
      post_id: this.state.postId,
    };
    this.socket.emit('set_name', set_name_json);
  }

  componentDidMount() {
    var contex = this;
    var arrayPost = [];
    var arrayarrival = [];
    var arrayHistory = [];

    const {
      chat_history_arr,
      get_patient,
      description,
      emergency,
      post_id,
      patient_id,
      posted_date,
      appointment,
      is_status,
      appointment_time,
    } = this.props.navigation.state.params;

    SInfo.getItem('token', {
      sharedPreferencesName: 'mySharedPrefs',
      keychainService: 'myKeychain',
    }).then(value => {
      console.log('time to fetch token');
      this.setState({ token: value });
    });
    this.setState({
      aptime: appointment_time,
    });

    if (emergency == 1) {
      arrayPost.push({
        _id: 1,
        text: 'Emergency - Yes',
        createdAt: posted_date,
        user: {
          _id: 2,
          name: get_patient.name + ' ' + get_patient.last_name,
        },
      });
    } else {
      arrayPost.push({
        _id: 1,
        text: 'Emergency - No',
        createdAt: posted_date,
        user: {
          _id: 2,
          name: get_patient.name + ' ' + get_patient.last_name,
        },
      });
    }

    arrayPost.push({
      _id: 2,
      text: description,
      createdAt: posted_date,
      user: {
        _id: 2,
        name: get_patient.name + ' ' + get_patient.last_name,
      },
    });

    this.socket.on('message', function (data) {
      if (Array.isArray(data)) {
        for (let userObject of data) {
          if (userObject.from == contex.state.patientId) {
            if (userObject.chat_file == '') {
              arrayHistory.push({
                _id: userObject._id,
                text: userObject.message,
                createdAt: userObject.createdAt,
                user: {
                  _id: 2,
                  name: get_patient.name + ' ' + get_patient.last_name,
                },
              });
            } else {
              arrayHistory.push({
                _id: userObject._id,
                text: userObject.message,
                createdAt: userObject.createdAt,
                user: {
                  _id: 2,
                  name: get_patient.name + ' ' + get_patient.last_name,
                },
                image: 'https://dentalchat.com:8005/' + userObject.chat_file,
              });
              console.log('mmmmmmmmmm ' + userObject.chat_file);
            }
          } else {
            if (userObject.chat_file == '') {
              arrayHistory.push({
                _id: userObject._id,
                text: userObject.message,
                createdAt: userObject.createdAt,
                user: {
                  _id: 1,
                  name: userObject.senderName,
                },
              });
            } else {
              arrayHistory.push({
                _id: userObject._id,
                text: userObject.message,
                createdAt: userObject.createdAt,
                user: {
                  _id: 1,
                  name: userObject.senderName,
                },
                image: 'https://dentalchat.com:8005/' + userObject.chat_file,
              });
            }
          }
        }
        contex.setState({
          messages: contex.state.messages
            .concat(arrayHistory)
            .concat(arrayPost),
        });
      } else {
        var strData = data.replace(/\\/g, '');
        var objJson = JSON.parse(strData);
        arrayarrival.push({
          _id: objJson._id,
          text: objJson.message,
          createdAt: objJson.createdAt,
          user: {
            _id: 2,
            name: objJson.senderName,
          },
        });
        contex.setState(previousState => {
          return {
            messages: GiftedChat.append(previousState.messages, arrayarrival),
          };
        });
        arrayarrival = [];
      }
    });

    SInfo.getItem('dentist_name', {
      sharedPreferencesName: 'mySharedPrefs',
      keychainService: 'myKeychain',
    }).then(value => {
      this.setState({ dentistName: value });
    });
    SInfo.getItem('dentist_id', {
      sharedPreferencesName: 'mySharedPrefs',
      keychainService: 'myKeychain',
    }).then(value => {
      this.setState({
        docterId: value,
        patientId: patient_id,
        postId: post_id,
        patientName: get_patient.name + ' ' + get_patient.last_name,
      });
      this.addUserToChatroom();
    });

    if (appointment == 0 && is_status == 0) {
      this.setState({
        eme: 'No Appointment Requested',
      });
    } else if (appointment == 1 && is_status == 0) {
      this.setState({
        eme: 'Appointment Requested',
      });
    } else if (appointment == 1 && is_status == 1) {
      this.setState({
        eme: 'Appointement Proposed for',
      });
    } else if (appointment == 2) {
      this.setState({
        eme: 'Appointment Cancelled',
      });
    } else if (appointment == 3) {
      this.setState({
        eme: 'Appointment Confirmed',
      });
    }
  }

  _showDatePicker = () =>
    this.setState({ isDateTimePickerVisible: true, mode: 'date' });
  _showTimePicker = () =>
    this.setState({ isDateTimePickerVisible: true, mode: 'time' });
  _hidePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = aaa => {
    console.log('<><><>' + aaa);
    if (this.state.mode == 'date') {
      var mDate = Moment(aaa).format('YYYY-MM-DD');
      console.log('<><><>' + mDate);
      this.setState({ newdate: mDate });
    } else {
      var mTime = Moment(aaa)
        .format('hh:mm a')
        .replace('am', 'AM')
        .replace('pm', 'PM');
      console.log('<><><>' + mTime);
      this.setState(
        {
          newtime: mTime,
          vvvvv: true,
        },
        () => {
          this.mAppointmentRequest();
        },
      );
    }
    if (this.state.mode == 'date') {
      this._showTimePicker();
    } else {
      this._hidePicker();
    }
  };

  mAppointmentReEnabled() {
    console.log('<><><># call4  ');
    fetch(constants.url + 'set-appointment-doctors', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: this.state.token,
        patient_id: this.state.patientId,
        doctor_id: this.state.docterId,
        post_id: this.state.postId,
        is_status: '2',
        proposedate: '',
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('<><><>#3 ' + responseJson);
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
          this.setState({
            eme: 'No Appointment Requested',
          });
          this.save_chat_history_reshedule();
        }
      })
      .catch(error => {
        console.log(error);
        this.mNetworkFailed();
      });
  }

  mAppointmentRequest() {
    console.log('<><><># call1  ');
    console.log('<><><># patient_id  ' + this.state.patientId);
    console.log('<><><># doctor_id  ' + this.state.docterId);
    console.log('<><><># post_id  ' + this.state.postId);
    console.log('<><><># is_status 1  ');
    console.log(
      '<><><># proposedate  ' + this.state.newdate + ' ' + this.state.newtime,
    );
    fetch(constants.url + 'set-appointment-doctors', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: this.state.token,
        patient_id: this.state.patientId,
        doctor_id: this.state.docterId,
        post_id: this.state.postId,
        is_status: '1',
        proposedate: this.state.newdate + ' ' + this.state.newtime,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('<><><>#2 ' + responseJson);
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
          if (
            this.state.eme == 'No Appointment Requested' ||
            this.state.eme == 'Appointment Requested' ||
            this.state.eme == 'Appointement Proposed for'
          ) {
            this.setState({
              eme: 'Appointement Proposed for',
              aptime: this.state.newdate + ' ' + this.state.newtime,
            });
            this.save_chat_history();
          }
        }
      })
      .catch(error => {
        console.log(error);
        this.mNetworkFailed();
      });
  }

  save_chat_history_reshedule() {
    console.log('<><><># call2  ');
    fetch(constants.url + 'save-chat-history', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: this.state.token,
        patient_id: this.state.patientId,
        doctor_id: this.state.docterId,
        post_id: this.state.postId,
        patient_content: '',
        doctor_content: 'AYou can reshedule appoinment',
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('<><><>#1 ' + responseJson);
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
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  save_chat_history() {
    console.log('<><><># call3  ');
    console.log('<><><># patient_id  ' + this.state.patientId);
    console.log('<><><># doctor_id  ' + this.state.docterId);
    console.log('<><><># post_id  ' + this.state.postId);
    console.log(
      '<><><># doctor_content Appointment Proposed for ' + this.state.aptime,
    );
    fetch(constants.url + 'save-chat-history', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: this.state.token,
        patient_id: this.state.patientId,
        doctor_id: this.state.docterId,
        post_id: this.state.postId,
        patient_content: '',
        doctor_content: 'Appointment Proposed for ' + this.state.aptime,
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
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  mNetworkFailed() {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        Alert.alert('Failed', 'The Internet connection appears to be offline');
      }, 200);
    });
  }

  loaderShowHide() {
    this.setState({
      vvvvv: true,
    });
  }

  Hide() {
    this.setState({
      vvvvv: false,
    });
  }

  sendImageData(msg) {
    //this.loaderShowHide();
    var dd = new Date();
    var nn = dd.getTime();
    var com = this;
    var data = new FormData();
    data.append('auth_token', this.state.token);
    data.append('patient_id', this.state.patientId);
    data.append('doctor_id', this.state.docterId);
    data.append('post_id', this.state.postId);
    data.append('patient_content', 'File');
    data.append('doctor_content', '');
    data.append('creatAt', nn / 1000);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        var text = this.responseText;
        var obj = JSON.parse(text);
        if (obj.status == 1) {
          //com.loaderShowHide();
        }
        if (obj.status == 5) {
          SInfo.setItem('is_patient_login', '0', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          SInfo.setItem('is_dentist_login', '0', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          this.props.navigation.navigate('Home');
        }
      }
    });
    xhr.open('POST', constants.url + 'save-chat-history');
    xhr.send(data);
  }

  sendMsg(msg) {
    //this.loaderShowHide();
    var dd = new Date();
    var nn = dd.getTime();
    var com = this;
    var data = new FormData();
    data.append('auth_token', this.state.token);
    data.append('patient_id', this.state.patientId);
    data.append('doctor_id', this.state.docterId);
    data.append('post_id', this.state.postId);
    data.append('patient_content', '');
    data.append('doctor_content', msg);
    data.append('creatAt', nn / 1000);
    console.warn(data);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        console.warn('we stuck here with');
        console.log('@@@@@@@' + this.responseText);

        var text = this.responseText;
        var obj = JSON.parse(text);
        console.warn(obj);
        if (obj.status == 1) {
          //com.loaderShowHide();
          console.warn('we came here');
        }
        if (obj.status == 5) {
          SInfo.setItem('is_patient_login', '0', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          SInfo.setItem('is_dentist_login', '0', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          this.props.navigation.navigate('Home');
        }
      }
    });
    xhr.open('POST', constants.url + 'save-chat-history');
    xhr.send(data);
  }

  sendImage(photo) {
    console.warn('hey we are sending the image please verify');
    var dd = new Date();
    var nn = dd.getTime();
    var con = this;
    for (let i = 0; i < photo.length; i++) {
      var data = new FormData();
      console.warn(photo);
      data.append('image', photo[i]);
      data.append('from', this.state.docterId);
      data.append('senderName', this.state.dentistName);
      data.append('buddy', this.state.patientId);
      data.append('receiverName', this.state.patientName);
      data.append('status', 'unread');
      data.append('type', 'userMessage');
      data.append('post_id', this.state.postId);
      data.append('createdAt', nn / 1000);
      data.append('auth_token', this.state.token);
      console.warn(data);
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {
          console.log('@@@@@@@' + this.responseText);
          var text = this.responseText;
          var obj = JSON.parse(text);
          console.warn(obj);
          con.socket.emit('file-uploaded', obj.result);
        }
      });
      xhr.open('POST', 'https://dentalchat.com:8005/image-uploaded');
      xhr.setRequestHeader('content-type', 'multipart/form-data');
      xhr.send(data);
    }
  }

  onSend(messages = []) {
    if (messages[0].text == undefined) {
      let photo = [];
      for (let i = 0; i < messages.length; i++) {
        photo[i] = {
          uri: messages[i].image,
          type: 'image/jpeg',
          name: 'imageshare',
        };
      }
      console.log(photo);
      console.warn('message data is as follow?');
      console.log(messages);
      this.sendImage(photo);
      this.sendImageData(messages[0].text);
    } else {
      const msg = {
        message: messages[0].text,
        file_name: '',
        file_type: '',
        status: 'unread',
        type: 'userMessage',
      };
      this.socket.emit('message', JSON.stringify(msg));
      console.warn('we are also here');
      this.sendMsg(messages[0].text);
    }
    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  }
  renderCustomActions(props) {
    return <CustomActions {...props} />;
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          },
        }}
      />
    );
  }

  render() {
    const No_Appointment_Requested = (
      <View style={styles.viewCan}>
        <Text allowFontScaling={false} style={styles.textStyle}>
          No Appointment Requested
        </Text>
        <Text allowFontScaling={false} style={styles.textStyle}>
          Propose Time
        </Text>
      </View>
    );

    const Appointment_Requested = (
      <View style={styles.viewCan}>
        <Text allowFontScaling={false} style={styles.textStyle}>
          Appointment Requested
        </Text>
        <Text
          allowFontScaling={false}
          onPress={() => this._showDatePicker()}
          style={styles.textStyle}>
          Propose Time
        </Text>
      </View>
    );

    const Appointement_Proposed_for = (
      <View style={styles.viewCan}>
        <Text allowFontScaling={false} style={styles.textStyle}>
          Appointement Proposed for
        </Text>
        <Text allowFontScaling={false} style={styles.textStyle}>
          {this.state.aptime}
        </Text>
        <Text
          allowFontScaling={false}
          onPress={() => this._showDatePicker()}
          style={styles.textStyle}>
          click to update
        </Text>
      </View>
    );
    const Appointment_Cancelled = (
      <View style={styles.viewCan}>
        <Text allowFontScaling={false} style={styles.textStyle}>
          Appointment Cancelled
        </Text>
        <View style={styles.buttonCon}>
          <Button
            title="Re-enabled"
            onPress={() => this.mAppointmentReEnabled()}
            textStyle={{ fontSize: 15 }}
            buttonStyle={{
              backgroundColor: '#d9534f',
              width: 140,
              height: 35,
              borderColor: 'transparent',
              borderWidth: 0,
              borderRadius: 5,
            }}
          />
        </View>
      </View>
    );

    const Appointment_Confirmed = (
      <View style={styles.viewCan}>
        <Text allowFontScaling={false} style={styles.textStyle}>
          Appointment Confirmed
        </Text>
        <Text allowFontScaling={false} style={styles.textStyle}>
          {this.state.aptime}
        </Text>
      </View>
    );

    let cos_view;
    if (this.state.eme == 'No Appointment Requested') {
      cos_view = No_Appointment_Requested;
    } else if (this.state.eme == 'Appointment Requested') {
      cos_view = Appointment_Requested;
    } else if (this.state.eme == 'Appointement Proposed for') {
      cos_view = Appointement_Proposed_for;
    } else if (this.state.eme == 'Appointment Cancelled') {
      cos_view = Appointment_Cancelled;
    } else if (this.state.eme == 'Appointment Confirmed') {
      cos_view = Appointment_Confirmed;
    }

    return (
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <View>
          <Spinner
            overlayColor={'rgba(0, 0, 0, 0.75)'}
            color={'#08a1d9'}
            textContent={'Updating'}
            visible={this.state.visible}
            textStyle={{ color: '#fff', fontSize: 15, marginTop: -70 }}
          />
        </View>
        <View
          style={{ flexDirection: 'row', backgroundColor: constants.baseColor }}>
          <View
            style={{
              height: 60,
              width: '60%',
              marginTop: 20,
              marginLeft: '20%',
              backgroundColor: constants.baseColor,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={{ height: 40, width: 250, alignItems: 'center' }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginTop: 15,
                  color: '#ffffff',
                }}>
                {this.props.navigation.state.params.get_patient.name}
              </Text>
              {/* <Text allowFontScaling={false} style={{ fontSize: 18, fontWeight: 'bold', marginTop: 15, color: '#ffffff' }}>{this.props.navigation.state.params.get_patient.name + ' ' + this.props.navigation.state.params.get_patient.last_name}</Text> */}
              {/* <Text onPress={() => this.props.navigation.navigate('PostDetails', this.props.navigation.state.params)} numberOfLines={1} style={{ color: constants.baseColor }}>{this.props.navigation.state.params.post_title}</Text> */}
            </View>
          </View>
          <View
            style={{
              position: 'absolute',
              top: 35,
              right: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ImageBubble
              image={this.props.navigation.state.params.get_patient.image}
              firstName={this.props.navigation.state.params.get_patient.name}
              lastName={
                this.props.navigation.state.params.get_patient.last_name
              }
              size={35}
            />
          </View>
          <View
            style={{
              position: 'absolute',
              top: 15,
              left: 0,
              justifyContent: 'center',
              alignItems: 'center',
              height: 80,
            }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{
                height: '100%',
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon
                style={{ marginLeft: 15, marginTop: 5 }}
                name="angle-left"
                size={30}
                color={'#ffffff'}
              />
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 15,
                  marginTop: 7,
                  marginLeft: 5,
                  fontWeight: '500',
                  color: '#ffffff',
                }}>
                Back
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: 1,
          }}
        />

        <View style={styles.viewBottom}>
          <View style={styles.viewBottomLeft}>
            <View
              style={{
                height: 85,
                width: '100%',
                marginLeft: '1%',
              }}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate(
                    'DentistPostDetails',
                    this.props.navigation.state.params,
                  )
                }
                style={{
                  backgroundColor: 'black',
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: constants.baseColor,
                  backgroundColor: constants.baseColor,
                  height: 42,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: '2%',
                }}>
                <Text allowFontScaling={false} style={styles.textStyle}>
                  View Post
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.modalVisibility()}
                style={{
                  marginTop: 2,
                  backgroundColor: 'black',
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: constants.baseColor,
                  backgroundColor: constants.baseColor,
                  height: 42,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: '2%',
                }}>
                <Text
                  allowFontScaling={false}
                  numberOfLines={1}
                  style={styles.textStyle}>
                  Write Review
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => this._showDatePicker()}
            style={styles.viewBottomLeft}>
            {cos_view}
          </TouchableOpacity>
        </View>

        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          user={{
            _id: 1,
          }}
          renderActions={this.renderCustomActions}
        />

        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hidePicker}
          mode={this.state.mode}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  viewBottom: {
    // marginTop: 5,
    flexDirection: 'row',
    width: '100%',
  },
  viewBottomLeft: {
    marginLeft: '3.3%',
    width: '45%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewStyle: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: constants.baseColor,
    height: 85,
    width: 280,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  viewCan: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: constants.baseColor,
    backgroundColor: constants.baseColor,
    height: 100,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  viewCon: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#2293c0',
    height: 55,
    width: 350,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  textStyle: {
    color: '#ffffff',
    fontSize: 18,
  },
  con: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonCon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
