import React, { Component } from 'react';
import {
  Platform,
  View,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';
import { GiftedChat, Actions, Bubble } from 'react-native-gifted-chat';
import { Button } from 'react-native-elements';
import Btn from '../components/Button';
import CustomActions from '../components/CustomActions';
import ImageBubble from '../components/ImageBubbleDocterImg';
import SInfo from 'react-native-sensitive-info';
import Spinner from 'react-native-loading-spinner-overlay';
import SocketIOClient from 'socket.io-client';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import PropTypes from 'prop-types';
import RF from 'react-native-responsive-fontsize';
import constants from './../constants/constants';
import { Rating, AirbnbRating } from 'react-native-ratings';

export default class PatientChatWindow extends Component {
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
      visible: false,
      isClose: '',
      token: '',
      eme: '',
      modalVisible: false,
      rating: 0,
      description: '',
    };
    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.sendMsg = this.sendMsg.bind(this);
    this.onSend = this.onSend.bind(this);
    this.socket = SocketIOClient('https://dentalchat.com:8005/', {
      transports: ['websocket'],
    });
  }

  mReadChatForPatient() {
    var mThis = this;
    var rawData = [];
    var countMSG = 0;
    var data = new FormData();
    data.append('auth_token', this.state.token);
    data.append('doctor_id', this.state.docterId);
    data.append('post_id', this.state.postId);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        if (this.responseText.indexOf('status') !== -1) {
          var text = this.responseText;
          console.log('<><><>abc10 ' + this.responseText);
          var obj = JSON.parse(text);
        } else {
        }
      }
    });
    xhr.open('POST', constants.url + 'read-chat-for-patient');
    xhr.send(data);
  }
  mLoaderShowHide() {
    this.setState({
      visible: !this.state.visible,
    });
  }
  mSuccess(msg) {
    () => {
      setTimeout(() => {
        Alert.alert('Success', msg);
      }, 200);
    };
  }
  mNetworkFailed() {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        Alert.alert('Failed', 'The Internet connection appears to be offline');
      }, 200);
    });
  }
  mClosedPostChat = () => {
    this.mLoaderShowHide();
    var mThis = this;
    var data = new FormData();
    data.append('patient_id', this.state.patientId);
    data.append('doctor_id', this.state.docterId);
    data.append('post_id', this.state.postId);
    data.append('auth_token', this.state.token);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        mThis.mLoaderShowHide();
        if (this.responseText.indexOf('status') !== -1) {
          var text = this.responseText;
          console.log('<><><>abc' + this.responseText);
          var obj = JSON.parse(text);
          mThis.mSuccess('Chat has been closed successfully');
          mThis.props.navigation.navigate('PatientMainTab');
        } else {
          mThis.mNetworkFailed();
        }
      }
    });
    xhr.open('POST', constants.url + 'closed-post-chat');
    xhr.send(data);
  };
  addUserToChatroom() {
    const set_name_json = {
      from: this.state.patientId,
      senderName: '',
      buddy: this.state.docterId,
      receiverName: '',
      roomName: '',
      post_id: this.state.postId,
    };
    this.socket.emit('set_name', set_name_json);
  }

  componentDidMount() {
    console.log('finde');
    this.props.navigation.setParams({ handleClose: this.mCloseConfrmation });
    SInfo.getItem('patient_tokan', {
      sharedPreferencesName: 'mySharedPrefs',
      keychainService: 'myKeychain',
    }).then(value => {
      this.setState({ tokan: value });
    });
    SInfo.getItem('token', {
      sharedPreferencesName: 'mySharedPrefs',
      keychainService: 'myKeychain',
    }).then(value => {
      console.log('time to fetch token');
      this.setState({ token: value });
    });
    var contex = this;
    var arrayPost = [];
    var arrayarrival = [];
    var arrayHistory = [];
    const {
      chat_history_arr,
      description,
      emergency,
      post_id,
      posted_date,
      is_closed_chat,
    } = this.props.navigation.state.params;
    if (chat_history_arr.appointment == 1 && chat_history_arr.is_status == 1) {
      this.setState({
        eme: 'Confirm',
      });
    } else if (
      chat_history_arr.appointment == 1 &&
      chat_history_arr.is_status == 0
    ) {
      this.setState({
        eme: 'Request made for an appointment',
      });
    } else if (
      chat_history_arr.appointment == 3 &&
      chat_history_arr.is_status == 1
    ) {
      this.setState({
        eme: 'final',
      });
    } else if (
      chat_history_arr.appointment > 0 &&
      chat_history_arr.is_status > 0
    ) {
      this.setState({
        eme: 'cancelled',
      });
    } else {
      this.setState({
        eme: 'Request Appointment',
      });
    }
    // arrayPost.push({
    //   _id: 3,
    //   text: "Thank you for your post. We will be responding to you shortly. Please check back regularly to view the reply back to your post, write about your dental story on My Story or post further questions. We are continually looking to grow, improve and add more features. Please share DentalChat with your friends and family, so we can grow and help others.\n 1. Sign-in to DentalChat.com \n 2. On the top menu go to Messaging, to view your posts click My Post sub-menu . \n 3. Under Messages sub-menu, click the Recent Tab or Unread Tab to see what messages have gotten back from us. \n 4. Can share your dental story on My Story tab.",
    //   createdAt: posted_date,
    //   user: {
    //     _id: 2,
    //     name: chat_history_arr.get_doctor.first_name + ' ' + chat_history_arr.get_doctor.last_name
    //   }
    // });
    if (emergency == 1) {
      arrayPost.push({
        _id: 2,
        text: 'Emergency - Yes',
        createdAt: posted_date,
        user: {
          _id: 1,
          name:
            chat_history_arr.get_doctor.first_name +
            ' ' +
            chat_history_arr.get_doctor.last_name,
        },
      });
    } else {
      arrayPost.push({
        _id: 2,
        text: 'Emergency - No',
        createdAt: posted_date,
        user: {
          _id: 1,
          name:
            chat_history_arr.get_doctor.first_name +
            ' ' +
            chat_history_arr.get_doctor.last_name,
        },
      });
    }
    arrayPost.push({
      _id: 1,
      text: 'Post Description\n' + description,
      createdAt: posted_date,
      user: {
        _id: 1,
        name:
          chat_history_arr.get_doctor.first_name +
          ' ' +
          chat_history_arr.get_doctor.last_name,
      },
    });
    this.socket.on('message', function (data) {
      if (Array.isArray(data)) {
        for (let userObject of data) {
          console.log('aaaaaaaaa ' + userObject.chat_file);
          if (userObject.from == contex.state.patientId) {
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
              console.log(
                'https://dentalchat.com:8005/' + userObject.chat_file,
              );
            }
          } else {
            if (userObject.chat_file == '') {
              arrayHistory.push({
                _id: userObject._id,
                text: userObject.message,
                createdAt: userObject.createdAt,
                user: {
                  _id: 2,
                  name: userObject.senderName,
                },
              });
            } else {
              arrayHistory.push({
                _id: userObject._id,
                text: userObject.message,
                createdAt: userObject.createdAt,
                user: {
                  _id: 2,
                  name: userObject.senderName,
                },
                image: 'https://dentalchat.com:8005/' + userObject.chat_file,
              });
              console.log('nnnnnnnn ' + userObject.chat_file);
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
    SInfo.getItem('patient_id', {
      sharedPreferencesName: 'mySharedPrefs',
      keychainService: 'myKeychain',
    }).then(value => {
      this.setState({
        patientId: value,
        docterId: chat_history_arr.doctor_id,
        postId: post_id,
        isClose: is_closed_chat,
      });
      this.addUserToChatroom();
      this.mReadChatForPatient();
    });
  }
  loaderShowHide = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };
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
    console.warn(data);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        var text = this.responseText;
        var obj = JSON.parse(text);
        console.warn(obj);
        if (obj.status == 1) {
          //com.loaderShowHide();
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
        }
      }
    });
    xhr.open('POST', constants.url + 'save-chat-history');
    xhr.send(data);
  }
  save_chat_history() {
    //this.loaderShowHide();
    var com = this;
    var data = new FormData();
    data.append('auth_token', this.state.token);
    data.append('patient_id', this.state.patientId);
    data.append('doctor_id', this.state.docterId);
    data.append('post_id', this.state.postId);
    data.append(
      'patient_content',
      'Success! Request Appointment has been done successfully.',
    );

    data.append('doctor_content', '');
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        var text = this.responseText;
        var obj = JSON.parse(text);
        if (obj.status == 1) {
          //com.loaderShowHide();
        }
      }
    });
    xhr.open('POST', constants.url + 'save-chat-history');
    xhr.send(data);
  }
  sendMsg(msg) {
    var dd = new Date();
    var nn = dd.getTime();
    var com = this;
    var data = new FormData();
    data.append('auth_token', this.state.token);
    data.append('patient_id', this.state.patientId);
    data.append('doctor_id', this.state.docterId);
    data.append('post_id', this.state.postId);
    data.append('patient_content', msg);
    data.append('doctor_content', '');
    data.append('creatAt', nn / 1000);
    console.warn(data);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        console.log('SAVE_MSG_RES:' + xhr);
        var text = this.responseText;
        console.log('eeeeee= ' + this.responseText);
        var obj = JSON.parse(text);
        console.warn(obj);
        if (obj.status == 1) {
        }
      }
    });
    xhr.open('POST', constants.url + 'save-chat-history');
    xhr.send(data);
  }
  sendImage(photo) {
    var con = this;
    for (let i = 0; i < photo.length; i++) {
      let data = new FormData();

      data.append('image', photo[i]);

      data.append('from', this.state.patientId);
      data.append('senderName', this.state.patientName);
      data.append('buddy', this.state.docterId);
      data.append('receiverName', this.state.dentistName);
      data.append('status', 'unread');
      data.append('type', 'userMessage');
      data.append('post_id', this.state.postId);
      data.append('auth_token', this.state.token);
      console.log(data);
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.addEventListener('readystatechange', function () {
        console.log(this.responseText);
        if (this.readyState === 4) {
          console.log('@@@@@@@' + JSON.parse(this.responseText));
          var text = this.responseText;
          var obj = JSON.parse(text);
          console.log(obj);
          con.socket.emit('file-uploaded', obj.result);
        }
      });
      xhr.open('POST', 'https://dentalchat.com:8005/image-uploaded');
      xhr.setRequestHeader('content-type', 'multipart/form-data');
      xhr.send(data);
    }
  }
  mFailed() {
    setTimeout(() => {
      Alert.alert(
        'Alert',
        'You can not send any messages on this conversation, this conversation is closed.',
      );
    }, 200);
  }
  mCloseConfrmation = () => {
    Alert.alert(
      'Are you sure?',
      // 'You want to close this chat!',
      'This will stop sending/receiving future messages.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Yes, close it!', onPress: () => this.mClosedPostChat() },
      ],
      { cancelable: false },
    );
  };
  mAppointmentRequest(op) {
    this.mLoaderShowHide();
    var mThis = this;
    var data = new FormData();
    data.append('auth_token', this.state.token);
    data.append('patient_id', this.state.patientId);
    data.append('doctor_id', this.state.docterId);
    data.append('post_id', this.state.postId);
    data.append('is_appoitment', op);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        mThis.mLoaderShowHide();
        if (this.responseText.indexOf('status') !== -1) {
          var text = this.responseText;
          console.log('<><><>abc' + this.responseText);
          var obj = JSON.parse(text);
          if (op == 1) {
            mThis.setState({
              eme: 'Request made for an appointment',
            });
            mThis.save_chat_history();
          } else if (op == 3) {
            mThis.setState({
              eme: 'final',
            });
          } else if (op == 2) {
            mThis.setState({
              eme: 'cancelled',
            });
          }
        } else {
          mThis.mNetworkFailed();
        }
      }
    });
    xhr.open('POST', constants.url + 'set-appointment-patient');
    xhr.send(data);
  }
  onSend(messages = []) {
    if (this.state.isClose == 1) {
      this.mFailed();
    } else {
      if (messages[0].text == undefined) {
        let photo = [];
        for (let i = 0; i < messages.length; i++) {
          photo[i] = {
            uri: messages[i].image,
            type: 'image/jpeg',
            name: 'imageshare',
          };
        }

        console.log('list of images are');
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
        console.warn('we are here');
        this.sendMsg(messages[0].text);
      }
      this.setState(previousState => {
        return {
          messages: GiftedChat.append(previousState.messages, messages),
        };
      });
    }
  }
  renderCustomActions(props) {
    return <CustomActions {...props} />;

    // const options = {
    //   /*  'Action 1': (props) => {
    //     //alert('option 1');
    //   },
    //   'Action 2': (props) => {
    //     //alert('option 2');
    //   },
    //   'Cancel': () => {
    //     //asdf
    //   },*/
    // };
    // return (<Actions {...props} options={options} />);
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
  modalVisibility() {
    console.log("modalVisible", this.state.modalVisible)
    this.setState({ modalVisible: !this.state.modalVisible });
  }
  render() {
    const Request_Appointment = (
      <Btn
        onPress={() => this.mAppointmentRequest(1)}
        name={this.state.eme}
        buttonType="pBtn"
      />
    );
    const inOther = <Btn name={this.state.eme} buttonType="pBtn" />;
    const Confirm = (
      <View style={styles.viewStyle}>
        <Text allowFontScaling={false} style={styles.textStyle}>
          Appointment confirmed
          {'\n' +
            this.props.navigation.state.params.chat_history_arr
              .appointment_time}
        </Text>
        <View style={styles.con}>
          <View style={styles.buttonCon}>
            <Button
              allowFontScaling={false}
              title="Confirm"
              onPress={() => this.mAppointmentRequest(3)}
              textStyle={{ fontSize: 15 }}
              buttonStyle={{
                backgroundColor: constants.baseColor,
                width: 100,
                height: 35,
                borderColor: 'transparent',
                borderWidth: 0,
                borderRadius: 5,
              }}
            />
          </View>
          <View style={styles.buttonCon}>
            <Button
              allowFontScaling={false}
              title="Cancel"
              onPress={() => this.mAppointmentRequest(2)}
              textStyle={{ fontSize: 15 }}
              buttonStyle={{
                backgroundColor: '#d9534f',
                width: 100,
                height: 35,
                borderColor: 'transparent',
                borderWidth: 0,
                borderRadius: 5,
              }}
            />
          </View>
        </View>
      </View>
    );
    const cancel = (
      <View style={styles.viewCan}>
        <Text allowFontScaling={false} style={styles.textStyle}>
          Appointment confirmed
        </Text>
        <Text allowFontScaling={false} style={styles.textStyle}>
          {this.props.navigation.state.params.chat_history_arr.appointment_time}
        </Text>
        <Text allowFontScaling={false} style={styles.textStyle}>
          You have cancelled the appointment
        </Text>
      </View>
    );
    const final = (
      <View style={styles.viewCon}>
        <Text allowFontScaling={false} style={styles.textStyle}>
          Appointment confirmed
        </Text>
        <Text allowFontScaling={false} style={styles.textStyle}>
          {this.props.navigation.state.params.chat_history_arr.appointment_time}
        </Text>
      </View>
    );
    let cos_view;
    if (this.state.eme == 'Confirm') {
      cos_view = Confirm;
    } else if (this.state.eme == 'Request Appointment') {
      cos_view = Request_Appointment;
    } else if (this.state.eme == 'cancelled') {
      cos_view = cancel;
    } else if (this.state.eme == 'final') {
      cos_view = final;
    } else {
      cos_view = inOther;
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
                  fontSize: RF(2.5),
                  fontWeight: 'bold',
                  marginTop: 10,
                  color: '#ffffff',
                }}>
                {this.props.navigation.state.params.chat_history_arr.get_doctor
                  .first_name +
                  ' ' +
                  this.props.navigation.state.params.chat_history_arr.get_doctor
                    .last_name}
              </Text>
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
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate(
                  'PatientDoctorProfile',
                  this.props.navigation.state.params,
                )
              }>
              <ImageBubble
                image={
                  this.props.navigation.state.params.chat_history_arr.get_doctor
                    .profile_pics
                }
                firstName={
                  this.props.navigation.state.params.chat_history_arr.get_doctor
                    .first_name
                }
                lastName={
                  this.props.navigation.state.params.chat_history_arr.get_doctor
                    .last_name
                }
                size={35}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              position: 'absolute',
              top: 15,
              left: 0,
              justifyContent: 'center',
              alignItems: 'center',
              height: 90,
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
              <View style={{ flexDirection: 'row' }}>
                <Icon
                  style={{ marginLeft: 15 }}
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
              </View>
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
          {Platform.OS == 'android' ? (
            <View style={styles.viewBottomLeft}>
              {/* {this.state.eme=="Request Appointment" ? <Btn onPress={() => this.mAppointmentRequest(1)} name={this.state.eme} buttonType='pBtn' /> : <Btn onPress={() => this.mAppointmentRequest(0)} name={this.state.eme} buttonType='pBtn' />} */}

              <View
                style={{
                  height: 60,
                  width: '47%',
                  marginLeft: '1%',
                }}>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      'Choose An Option',
                      '',
                      [
                        {
                          text: 'Post Detail',
                          onPress: () =>
                            this.props.navigation.navigate(
                              'PatientPostDetails',
                              this.props.navigation.state.params,
                            ),
                        },
                        {
                          text: 'Close Chat',
                          onPress: () => this.mCloseConfrmation(),
                        },
                        {
                          text: 'Cancel',
                          onPress: () => console.log('OK Pressed'),
                          style: 'cancel',
                        },
                      ],
                      { cancelable: false },
                    )
                  }
                  style={{
                    backgroundColor: 'black',
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: constants.baseColor,
                    backgroundColor: constants.baseColor,
                    height: 29,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: '2%',
                  }}>
                  <Text
                    allowFontScaling={false}
                    numberOfLines={1}
                    style={{ color: 'white' }}>
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
                    height: 29,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: '2%',
                  }}>
                  <Text
                    allowFontScaling={false}
                    numberOfLines={1}
                    style={{ color: 'white' }}>
                    Write Review
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  height: 60,
                  width: '47%',
                  marginLeft: '1%',
                }}>
                {cos_view}
              </View>
            </View>
          ) : (
              <View style={styles.viewBottomLeft}>
                {/* {this.state.eme=="Request Appointment" ? <Btn onPress={() => this.mAppointmentRequest(1)} name={this.state.eme} buttonType='pBtn' /> : <Btn onPress={() => this.mAppointmentRequest(0)} name={this.state.eme} buttonType='pBtn' />} */}
                <View
                  style={{
                    height: 60,
                    width: '47%',
                    marginLeft: '1%',
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert(
                        'Choose An Option',
                        '',
                        [
                          {
                            text: 'Post Detail',
                            onPress: () =>
                              this.props.navigation.navigate(
                                'PatientPostDetails',
                                this.props.navigation.state.params,
                              ),
                          },
                          {
                            text: 'Close Chat',
                            onPress: () => this.mCloseConfrmation(),
                          },
                          {
                            text: 'Cancel',
                            onPress: () => console.log('OK Pressed'),
                            style: 'cancel',
                          },
                        ],
                        { cancelable: false },
                      )
                    }
                    style={{
                      backgroundColor: 'black',
                      borderWidth: 1,
                      borderRadius: 10,
                      borderColor: constants.baseColor,
                      backgroundColor: constants.baseColor,
                      height: 29,
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: '2%',
                    }}>
                    <Text
                      allowFontScaling={false}
                      numberOfLines={1}
                      style={{ color: 'white' }}>
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
                      height: 29,
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: '2%',
                    }}>
                    <Text
                      allowFontScaling={false}
                      numberOfLines={1}
                      style={{ color: 'white' }}>
                      Write Review
                  </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    height: 60,
                    width: '47%',
                    marginLeft: '1%',
                  }}>
                  {cos_view}
                </View>
              </View>
            )}
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              backgroundColor: 'rgba(52, 52, 52, 0.8)',
            }}>
            <View
              style={{
                width: '80%',
                height: 300,
                backgroundColor: 'white',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: 'white',
              }}>
              <View
                style={{
                  width: '100%',
                  height: 250,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Rating
                  // readonly={true}
                  type="custom"
                  onFinishRating={rating => this.setState({ rating: rating })}
                  imageSize={30}
                  ratingCount={5}
                  startingValue={this.state.rating}
                  ratingBackgroundColor="lightgray"
                  borderColor={constants.baseColor}
                // style={{ marginTop: 10 }}
                />
                <Text style={{ marginTop: 15, marginBottom: 15 }}>
                  You Gave {this.state.rating} star
                </Text>
                <Text style={{ marginRight: '45%', fontWeight: 'bold' }}>
                  Write Your Review
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: '#cccccc',
                    width: '90%',
                  }}>
                  <TextInput
                    allowFontScaling={false}
                    maxLength={100}
                    style={styles.textInputStyleDesc}
                    multiline={true}
                    value={this.state.description}
                    onChangeText={text => this.setState({ description: text })}
                    keyboardType="default"
                    returnKeyType="done"
                    onKeyPress={() => {
                      this.modalVisibility();
                    }}
                    placeholder="Write Your Review"
                  />
                </View>
              </View>
              <View
                style={{
                  height: 50,
                  width: '100%',
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderColor: 'white',
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  style={{
                    height: 50,
                    width: '50%',
                    borderTopColor: 'lightgray',
                    borderWidth: 1,
                    borderRightColor: 'lightgray',
                    borderBottomLeftRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => this.modalVisibility()}>
                  <Text>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    height: 50,
                    width: '50%',
                    borderTopColor: 'lightgray',
                    borderWidth: 1,
                    borderRightColor: 'lightgray',
                    borderBottomRightRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => this.modalVisibility()}>
                  <Text>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <GiftedChat
          style={{ marginTop: 15 }}
          messages={this.state.messages}
          onSend={this.onSend}
          user={{
            _id: 1,
          }}
          renderActions={this.renderCustomActions}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  viewBottom: {
    marginTop: 5,
    flexDirection: 'row',
  },
  viewBottomLeft: {
    width: '100%',
    flexDirection: 'row',
  },
  viewStyle: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: constants.baseColor,
    backgroundColor: constants.baseColor,
    height: 60,
    width: '47%',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 10,
    marginBottom: 15,
    marginLeft: '0.5%',
  },
  viewCan: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: constants.baseColor,
    backgroundColor: constants.baseColor,
    height: 60,
    width: '47%',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 10,
    marginBottom: 15,
    marginLeft: '0.5%',
  },
  viewCon: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: constants.baseColor,
    backgroundColor: constants.baseColor,
    height: 60,
    width: '47%',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 10,
    marginBottom: 15,
    marginLeft: '0.5%',
  },
  textStyle: {
    color: '#ffffff',
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
  textInputStyleDesc: {
    width: '90%',
    height: 70,
    fontWeight: '500',
  },
});
