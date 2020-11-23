
import React, { Component } from 'react';
import { Platform, View, Text, Alert, TouchableOpacity, StyleSheet, Modal, TextInput, Image, ScrollView, KeyboardAvoidingView } from 'react-native';
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
import RF from "react-native-responsive-fontsize"
import constants from './../constants/constants'
import { Rating, AirbnbRating } from 'react-native-ratings';
import appointmentCalendar from './../images/confirmCalendar.png'
import finalCalendar from './../images/confirmCalendar.png'
import requestCalendar from './../images/cautionCalendar.png'
import script from './../images/viewPost.png'
import star from './../images/patientReview.png'
import otherCalendar from './../images/confirmingCalender.png'
import cancelCalendar from './../images/cancelCalendar.png'
import requestmadeCalendar from './../images/requestmadeCalendar.png'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import Constants from '../utils/Constants';
import Styles from "./../utils/Styles";
import {
  TextSemiBold,
  TextMedium
} from "./../utils/Component";
export default class PatientChatWindow extends Component {

  // static navigationOptions = {
  //   header: null
  // };
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
      confirmAppointmentModal: false,
      loaderVisibility: false,
      senderName: '',
      receiverName: '',
    };
    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.sendMsg = this.sendMsg.bind(this);
    this.onSend = this.onSend.bind(this);
    this.setReceiverName = this.setReceiverName.bind(this);
    this.setSenderName = this.setSenderName.bind(this);
    // this.socket = SocketIOClient('https://dentalchat.com:8005/', { transports: ['websocket'] });
    this.socket = SocketIOClient('https://socket.dentalchat.com/', { transports: ['websocket'] });
  }

  componentDidMount() {
    console.log('111=>',this.socket);
    this.Initialization_data()
    try {
      this.socket.on('error', () => {
        console.log("--------------------------------")
        console.log('Connection Error');
        this.setState({ loaderVisibility: false })
      });

      this.socket.on('connect_error', () => {
        console.log("--------------------------------")
        console.log('Connection Error');
        this.setState({ loaderVisibility: false })
      });

      this.socket.on('connect_timeout', () => {
        console.log("--------------------------------")
        console.log('Connection TimeOut');
        this.setState({ loaderVisibility: false })
      });

      this.socket.on('reconnect_failed', () => {
        console.log("--------------------------------")
        console.log('ReConnection Failed');
        this.setState({ loaderVisibility: false })
      });

      this.socket.on('disconnect', () => {
        console.log("--------------------------------")
        console.log('Disconnect');
        this.setState({ loaderVisibility: false })
      });

      this.socket.on('reconnect_error', () => {
        console.log("--------------------------------")
        console.log('ReConnection Error');
        this.setState({ loaderVisibility: false })
      });
    } catch (err) {
      this.setState({ loaderVisibility: false })
    }
  }

  mSaveReviewRatingForDoctors() {
    this.modalVisibility();
    var mThis = this;
    var data = new FormData();
    data.append("patient_id", this.state.patientId);
    data.append("doctor_id", this.state.docterId);
    data.append("post_id", this.state.postId);
    data.append("rating", this.state.rating);
    data.append("review", this.state.description);
    data.append("auth_token", this.state.token);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        if (this.responseText.indexOf('status') !== -1) {
          var text = this.responseText;
          console.log('<><><>abc' + this.responseText);
          var obj = JSON.parse(text);
          mThis.mSuccess('Your review submitted');
        } else if (this.responseText.indexOf('status') == 5) {
          SInfo.setItem('is_patient_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('is_dentist_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          this.props.navigation.navigate('Home')
        } else {
          mThis.mNetworkFailed();
        }
      }
    });
    xhr.open("POST", constants.url + 'save-review-rating-for-doctors');
    xhr.send(data);
  }
  mReadChatForPatient() {
    this.setState({
      loaderVisibility: true
    })
    var mThis = this;
    var rawData = [];
    var countMSG = 0;
    var data = new FormData();
    data.append("auth_token", this.state.token);
    data.append("doctor_id", this.state.docterId);
    data.append("post_id", this.state.postId);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {

      if (this.readyState === 4) {

        if (this.responseText.indexOf('status') !== -1) {
          var text = this.responseText;
          console.log('<><><>abc10 ' + this.responseText);
          mThis.mLoaderShowHide()
          var obj = JSON.parse(text);
        } else {
        }
      }
    });
    xhr.open("POST", constants.url + 'read-chat-for-patient');
    xhr.send(data);
  }
  mLoaderShowHide() {
    this.setState({
      loaderVisibility: !this.state.loaderVisibility
    });
  };
  mSuccess(msg) {
    () => {
      setTimeout(() => {
        Alert.alert('Success', msg);
      }, 200);
    }
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
    data.append("patient_id", this.state.patientId);
    data.append("doctor_id", this.state.docterId);
    data.append("post_id", this.state.postId);
    data.append("auth_token", this.state.token)
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        mThis.mLoaderShowHide();
        if (this.responseText.indexOf('status') !== -1) {
          var text = this.responseText;
          console.log('<><><>abc' + this.responseText);
          var obj = JSON.parse(text);
          mThis.mSuccess('Chat has been closed successfully');
          mThis.props.navigation.navigate('PatientMainTab')
        } else {
          mThis.mNetworkFailed();
        }
      }
    });
    xhr.open("POST", constants.url + 'closed-post-chat');
    xhr.send(data);
  }
  addUserToChatroom() {
    const set_name_json = {
      from: this.state.patientId,
      senderName: this.state.senderName,
      buddy: this.state.docterId,
      receiverName: this.state.receiverName,
      roomName: '',
      post_id: this.state.postId
    };
    this.socket.emit('set_name', set_name_json);
  }
  Initialization_data=()=>{
    this.props.navigation.setParams({ handleClose: this.mCloseConfrmation });
    SInfo.getItem('patient_tokan', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      this.setState({ tokan: value, })
    });
    SInfo.getItem('token', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      console.log('time to fetch token')
      this.setState({ token: value, })
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
      is_closed_chat
    } = this.props.route.params;
    this.setSenderName()
    this.setReceiverName()
    console.log("DATA:" + JSON.stringify(this.props.route.params))
    if (chat_history_arr.appointment == 1 && chat_history_arr.is_status == 1) {
      this.setState({
        eme: appointmentCalendar
      });
    } else if (chat_history_arr.appointment == 1 && chat_history_arr.is_status == 0) {
      this.setState({
        eme: otherCalendar
      });
    } else if (chat_history_arr.appointment == 3 && chat_history_arr.is_status == 1) {
      this.setState({
        eme: finalCalendar
      });
    } else if (chat_history_arr.appointment > 0 && chat_history_arr.is_status > 0) {
      this.setState({
        eme: cancelCalendar
      });
    } else {
      this.setState({
        eme: requestCalendar
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
          name: chat_history_arr.get_doctor.first_name + ' ' + chat_history_arr.get_doctor.last_name
        }
      });
    } else {
      arrayPost.push({
        _id: 2,
        text: 'Emergency - No',
        createdAt: posted_date,
        user: {
          _id: 1,
          name: chat_history_arr.get_doctor.first_name + ' ' + chat_history_arr.get_doctor.last_name
        }
      });
    }
    arrayPost.push({
      _id: 1,
      text: "Post Description\n" + description,
      createdAt: posted_date,
      user: {
        _id: 1,
        name: chat_history_arr.get_doctor.first_name + ' ' + chat_history_arr.get_doctor.last_name
      }
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
                  name: userObject.senderName
                }
              })
            } else {
              arrayHistory.push({
                _id: userObject._id,
                text: userObject.message,
                createdAt: userObject.createdAt,
                user: {
                  _id: 1,
                  name: userObject.senderName
                },
                // image: 'https://dentalchat.com:8005/' + userObject.chat_file,
                image: 'https://socket.dentalchat.com/' + userObject.chat_file,
              })
            }
          } else {
            if (userObject.chat_file == '') {
              arrayHistory.push({
                _id: userObject._id,
                text: userObject.message,
                createdAt: userObject.createdAt,
                user: {
                  _id: 2,
                  name: userObject.senderName
                }
              })
            } else {
              arrayHistory.push({
                _id: userObject._id,
                text: userObject.message,
                createdAt: userObject.createdAt,
                user: {
                  _id: 2,
                  name: userObject.senderName
                },
                // image: 'https://dentalchat.com:8005/' + userObject.chat_file,
                image: 'https://socket.dentalchat.com/' + userObject.chat_file,
              })
              console.log('nnnnnnnn ' + userObject.chat_file);
            }
          }
        }
        contex.setState({ messages: contex.state.messages.concat(arrayHistory).concat(arrayPost) })
      } else {
        var strData = data.replace(/\\/g, "");
        var objJson = JSON.parse(strData);
        arrayarrival.push({
          _id: objJson._id,
          text: objJson.message,
          createdAt: objJson.createdAt,
          user: {
            _id: 2,
            name: objJson.senderName
          }
        })
        contex.setState((previousState) => {
          return {
            messages: GiftedChat.append(previousState.messages, arrayarrival)
          };
        });
        arrayarrival = [];
      }
    });
    SInfo.getItem('patient_id', {
      sharedPreferencesName: 'mySharedPrefs',
      keychainService: 'myKeychain'
    }).then(value => {
      this.setState({ patientId: value, docterId: chat_history_arr.doctor_id, postId: post_id, isClose: is_closed_chat })
      this.addUserToChatroom();
      this.mReadChatForPatient();
    });
  }
  loaderShowHide = () => {
    this.setState({
      visible: !this.state.visible
    });
  };
  sendImageData(msg) {
    //this.loaderShowHide();
    var dd = new Date();
    var nn = dd.getTime();
    var com = this;
    var data = new FormData();
    data.append("auth_token", this.state.token);
    data.append("patient_id", this.state.patientId);
    data.append("doctor_id", this.state.docterId);
    data.append("post_id", this.state.postId);
    data.append("senderName", this.state.senderName);
    data.append("receiverName", this.state.receiverName);
    data.append("patient_content", 'File');
    data.append("doctor_content", "");
    data.append("creatAt", nn / 1000);
    console.warn(data)
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        var text = this.responseText;
        var obj = JSON.parse(text);
        console.warn(obj)
        if (obj.status == 1) {
          //com.loaderShowHide();
        }
        else if (responseJson.status == 5) {
          SInfo.setItem('is_patient_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('is_dentist_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          this.props.navigation.navigate('Home')
        }
      }
    });
    xhr.open("POST", constants.url + "save-chat-history");
    xhr.send(data);
  }
  save_chat_history() {
    //this.loaderShowHide();
    var com = this;
    var data = new FormData();
    data.append("auth_token", this.state.token);
    data.append("patient_id", this.state.patientId);
    data.append("doctor_id", this.state.docterId);
    data.append("post_id", this.state.postId);
    data.append("patient_content", "Success! Request Appointment has been done successfully.");

    data.append("doctor_content", "");
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        var text = this.responseText;
        var obj = JSON.parse(text);
        if (obj.status == 1) {
          //com.loaderShowHide();
        }
      }
    });
    xhr.open("POST", constants.url + "save-chat-history");
    xhr.send(data);
  }


  setReceiverName = () => {
    if (this.props.route.params.chat_history_arr
      && this.props.route.params.chat_history_arr.get_doctor) {
      let name = ''
      if (this.props.route.params.chat_history_arr.get_doctor.first_name) {
        name = this.props.route.params.chat_history_arr.get_doctor.first_name;
        console.log("FIRST_NAME:"+name)
      }

      if (this.props.route.params.chat_history_arr.get_doctor.last_name) {
        if (name == '') {
          name = this.props.route.params.chat_history_arr.get_doctor.last_name;
        } else {
          name = name + " " + this.props.route.params.chat_history_arr.get_doctor.last_name
        }
        console.log("FULL_NAME:"+name)
      }

      console.log("FULL_NAME2:"+name)
      this.setState({
        receiverName: name
      })
    }
  }

  setSenderName = () => {
    SInfo.getItem('patient_name', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      this.setState({
        senderName: value
      });
    });
  }

  sendMsg(msg) {
    var dd = new Date();
    var nn = dd.getTime();
    var com = this;
    var data = new FormData();
    data.append("auth_token", this.state.token);
    data.append("patient_id", this.state.patientId);
    data.append("doctor_id", this.state.docterId);
    data.append("post_id", this.state.postId);
    data.append("senderName", this.state.senderName);
    data.append("receiverName", this.state.receiverName);
    data.append("patient_content", msg);
    data.append("doctor_content", "");
    data.append("creatAt", nn / 1000);
    console.warn(data)
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log("SAVE_MSG_RES:" + JSON.stringify(xhr))
        // var text = this.responseText;
        // console.log('eeeeee= ' + this.responseText);
        // var obj = JSON.parse(text);
        // console.warn(obj)
        // if (obj.status == 1) {

        // }
      }
    });
    xhr.open("POST", constants.url + "save-chat-history");
    xhr.send(data);
  }
  sendImage(photo) {
    console.log("Image Sending")
    var con = this;
    for (let i = 0; i < photo.length; i++) {
      let data = new FormData();

      data.append("image", photo[i]);

      data.append("from", this.state.patientId);
      data.append("buddy", this.state.docterId);
      data.append("senderName", this.state.senderName);
      data.append("receiverName", this.state.receiverName);
      data.append("status", "unread");
      data.append("type", "userMessage");
      data.append("post_id", this.state.postId);
      data.append("auth_token", this.state.token)
      console.log(data)
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.addEventListener("readystatechange", function () {
        console.log(this.responseText)
        if (this.readyState === 4) {
          console.log("@@@@@@@" + JSON.parse(this.responseText));
          var text = this.responseText;
          var obj = JSON.parse(text);
          console.log(obj)
          con.socket.emit('file-uploaded', obj.result);
        }
      });
      // xhr.open("POST", "https://dentalchat.com:8005/image-uploaded");
      xhr.open("POST", "https://socket.dentalchat.com/image-uploaded");
      xhr.setRequestHeader('content-type', 'multipart/form-data');
      xhr.send(data);
    }
  }
  mFailed() {
    setTimeout(() => {
      Alert.alert('Alert', 'You can not send any messages on this conversation, this conversation is closed.');
    }, 200);
  }
  mCloseConfrmation = () => {
    Alert.alert(
      'Are you sure?',
      // 'You want to close this chat!',
      "This will stop sending/receiving future messages.",
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'Yes, close it!', onPress: () => this.mClosedPostChat() },
      ],
      { cancelable: false }
    )
  }
  requestAppointment = () => {
    Alert.alert(
      'Are you sure?',
      'You want to request the appointment ',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        {
          text: 'Request', onPress: () => {
            this.mAppointmentRequest(1)
            this.printMessage("Success! Request Appointment has been done successfully.")
          }
        }
      ],
      { cancelable: false }
    )
  }
  mAppointmentRequest(op) {

    this.mLoaderShowHide();
    var mThis = this;
    var data = new FormData();
    data.append("auth_token", this.state.token);
    data.append("patient_id", this.state.patientId);
    data.append("doctor_id", this.state.docterId);
    data.append("post_id", this.state.postId);
    data.append("is_appoitment", op);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        mThis.mLoaderShowHide();
        if (this.responseText.indexOf('status') !== -1) {
          var text = this.responseText;
          console.log('<><><>abc' + this.responseText);
          var obj = JSON.parse(text);
          if (op == 1) {
            mThis.setState({
              eme: otherCalendar
            });
            mThis.save_chat_history();
          } else if (op == 3) {
            mThis.setState({
              eme: finalCalendar,
              confirmAppointmentModal: false,
              loaderVisibility: false
            });
          } else if (op == 2) {
            mThis.setState({
              eme: cancelCalendar,
              confirmAppointmentModal: false,
              loaderVisibility: false
            });
            let text = "Patient have declined the appointment for " + this.props.route.params.chat_history_arr.appointment_time
            this.printMessage(text)
          }

        } else {
          mThis.mNetworkFailed();
        }
      }
    });
    xhr.open("POST", constants.url + 'set-appointment-patient');
    xhr.send(data);


  }
  onSend(messages = []) {
    console.log("MSG:" + JSON.stringify(messages))
    // return
    if (this.state.isClose == 1) {
      this.mFailed();
    } else {
      if (messages[0].text == undefined && messages[0].location == undefined) {
        let photo = []
        for (let i = 0; i < messages.length; i++) {
          photo[i] = {
            uri: messages[i].image,
            type: 'image/jpeg',
            name: 'imageshare',
          };
        }

        console.log('list of images are')
        console.log(messages)
        this.sendImage(photo);
        this.sendImageData(messages[0].text);
      } else if (messages[0].location != undefined) {
        if (messages[0].location && messages[0].location.latitude && messages[0].location.longitude) {
          this.mGetLocationAddress(messages[0], messages[0].location.latitude, messages[0].location.longitude)

        } else {
          console.log("LOCATION NOT FOUND")
        }
        // const msg = {
        //   message: messages[0].text,
        //   file_name: '',
        //   file_type: '',
        //   status: 'unread',
        //   type: 'userMessage'
        // };
        // this.socket.emit('message', JSON.stringify(msg));
        // console.warn('we are here');
        // this.sendMsg(messages[0].text);
      } else {


        const msg = {
          message: messages[0].text,
          file_name: '',
          file_type: '',
          status: 'unread',
          type: 'userMessage'
        };
        this.socket.emit('message', JSON.stringify(msg));
        console.warn('we are here');
        this.sendMsg(messages[0].text);

      }

      if (messages[0].location == undefined) {
        this.setState((previousState) => {
          return {
            messages: GiftedChat.append(previousState.messages, messages)
          };
        });
      }

    }
  }
  printMessage = (message) => {

    const text = message
    let messages = [{
      user: { _id: 1 },
      text: text,
      _id: "525d2d1f-9012-4808-b88b-36047dd087f8",
      createdAt: Date.now()
    }]
    console.log(messages)
    const msg = {
      message: text,
      file_name: '',
      file_type: '',
      status: 'unread',
      type: 'userMessage'
    };
    this.socket.emit('message', JSON.stringify(msg));
    console.warn('we are also here')
    this.sendMsg(text);
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages)
      };
    });
  }
  renderCustomActions(props) {

    return (<CustomActions {...props} />);

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
    return (<Bubble {...props} wrapperStyle={{
      left: {
        backgroundColor: '#f0f0f0'
      }
    }} />);
  }
  modalVisibility() {
    this.setState({ modalVisible: !this.state.modalVisible })
  }

  mGetLocationAddress = (message, latitude, longitude) => {
    var mThis = this;
    var data = new FormData();
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {

        // mThis.mLoaderShowHide();
        //console.warn("<><><>1234 " + this.responseText);
        var text = this.responseText;
        //console.warn('<><><>abc1' + this.responseText);
        console.log("LOCATION_ADDRESS:")
        var obj = JSON.parse(text);
        console.log(obj.results[0].address_components)

        let city = "", country = "", zip = "", address = "No Address Found"
        if (obj && obj.results && obj.results.length > 0) {
          let addressComponent = obj.results[0].address_components
          addressComponent.forEach(element => {
            if (element.types[0] == "locality") {
              console.log("CITY:" + element.long_name)
              city = element.long_name
            }
            if (element.types[0] == "country") {
              console.log("COUNTRY:" + element.long_name)
              country = element.long_name
            }
            if (element.types[0] == "postal_code") {
              console.log("ZIP:" + element.long_name)
              zip = element.long_name
            }
          });
        }

        if ((!city && !country && !zip) || city == '' || country == '' || zip == '') {
          return address
        } else {
          if (city && city != "") {
            address = city
          }
          if (country && country != "") {
            if ((!address) || (address && address == "No Address Found" || address == "")) {
              address = country
            } else {
              address = address + ", " + country
            }
          }
          if ((!address) || (address && address == "No Address Found" || address == "")) {
            address = zip
          } else {
            address = address + ", " + zip
          }
        }


        message['text'] = address
        console.log("MY MSG:" + JSON.stringify(message))
        const msg = {
          message: address,
          file_name: '',
          file_type: '',
          status: 'unread',
          type: 'userMessage'
        };
        mThis.socket.emit('message', JSON.stringify(msg));
        mThis.sendMsg(message.text);
        mThis.setState((previousState) => {
          return {
            messages: GiftedChat.append(previousState.messages, message)
          };
        });
        // mThis.setState({
        //   currentLocation: obj.results[4].formatted_address
        // });
      }
    });
    xhr.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&key=" + constants.googleKey);
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.setRequestHeader("postman-token", "66714504-4f88-2cce-6e47-4bd53dc4de0d");
    xhr.setRequestHeader("key", constants.googleKey)
    xhr.send(data);
  }

  render() {
    const Request_Appointment =
      <TouchableOpacity
        onPress={() => this.requestAppointment()}
        style={{
          backgroundColor: 'black', borderWidth: 1,
          borderRadius: 10,
          borderColor: constants.baseColor,
          backgroundColor: constants.baseColor,
          height: 60,
          width: 60,
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: '2%', borderRadius: 30
        }}>
        <Image source={this.state.eme} style={{ height: '70%', width: '70%', resizeMode: "contain" }} />
      </TouchableOpacity>
    const inOther = <TouchableOpacity
      onPress={() => {
        Alert.alert(
          'Waiting',
          'Waiting for Dentist to respond on your request appointment ',
          [
            { text: 'OK', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },

          ],
          { cancelable: false }
        )
      }}
      style={{
        backgroundColor: 'black', borderWidth: 1,
        borderRadius: 10,
        borderColor: constants.baseColor,
        backgroundColor: constants.baseColor,
        height: 60,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '2%', borderRadius: 30
      }}>
      <Image source={this.state.eme} style={{ height: '70%', width: '70%', resizeMode: "contain" }} />
    </TouchableOpacity>
    const Confirm = <TouchableOpacity
      onPress={() => this.setState({ confirmAppointmentModal: true })}
      style={{
        backgroundColor: 'black', borderWidth: 1,
        borderRadius: 10,
        borderColor: constants.baseColor,
        backgroundColor: constants.baseColor,
        height: 60,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '2%', borderRadius: 30
      }}>
      <Image source={this.state.eme} style={{ height: '70%', width: '70%', resizeMode: "contain" }} />
    </TouchableOpacity>
    // const Confirm = <View style={styles.viewStyle}>
    //   <Text allowFontScaling={false} style={styles.textStyle}>Appointment confirmed{"\n" + this.props.route.params.chat_history_arr.appointment_time}</Text>
    //   <View style={styles.con}>
    //     <View style={styles.buttonCon}>
    //       <Button
    //         allowFontScaling={false}
    //         title="Confirm"
    //         onPress={() => this.mAppointmentRequest(3)}
    //         textStyle={{ fontSize: 15 }}
    //         buttonStyle={{
    //           backgroundColor: constants.baseColor,
    //           width: 100,
    //           height: 35,
    //           borderColor: "transparent",
    //           borderWidth: 0,
    //           borderRadius: 5
    //         }}
    //       />
    //     </View>
    //     <View style={styles.buttonCon}>
    //       <Button
    //         allowFontScaling={false}
    //         title="Cancel"
    //         onPress={() => this.mAppointmentRequest(2)}
    //         textStyle={{ fontSize: 15 }}
    //         buttonStyle={{
    //           backgroundColor: "#d9534f",
    //           width: 100,
    //           height: 35,
    //           borderColor: "transparent",
    //           borderWidth: 0,
    //           borderRadius: 5
    //         }}
    //       />
    //     </View>
    //   </View>
    // </View>;
    const cancel =
      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            'Appointment confirmed',
            this.props.route.params.chat_history_arr.appointment_time + 'You have cancelled the appointment',
            [
              { text: 'OK', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },

            ],
            { cancelable: false }
          )
        }}
        style={{
          backgroundColor: 'black', borderWidth: 1,
          borderRadius: 10,
          borderColor: constants.baseColor,
          backgroundColor: constants.baseColor,
          height: 60,
          width: 60,
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: '2%', borderRadius: 30
        }}>
        <Image source={this.state.eme} style={{ height: '70%', width: '70%', resizeMode: "contain" }} />
      </TouchableOpacity>;
    const final = <TouchableOpacity
      onPress={() => {
        Alert.alert(
          'Appointment confirmed',
          this.props.route.params.chat_history_arr.appointment_time,
          [
            { text: 'OK', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },

          ],
          { cancelable: false }
        )
      }}
      style={{
        backgroundColor: 'black', borderWidth: 1,
        borderRadius: 10,
        borderColor: constants.baseColor,
        backgroundColor: constants.baseColor,
        height: 60,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '2%', borderRadius: 30
      }}>
      <Image source={this.state.eme} style={{ height: '70%', width: '70%', resizeMode: "contain" }} />
    </TouchableOpacity>;
    let cos_view;
    if (this.state.eme == appointmentCalendar) {
      cos_view = Confirm
    } else if (this.state.eme == requestCalendar) {
      cos_view = Request_Appointment
    } else if (this.state.eme == cancelCalendar) {
      cos_view = cancel
    } else if (this.state.eme == finalCalendar) {
      cos_view = final
    } else {
      cos_view = inOther
    }
    return (
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <View>
          <Spinner overlayColor={'rgba(0, 0, 0, 0.75)'} color={'#08a1d9'} textContent={"Updating"} visible={this.state.loaderVisibility} textStyle={{ color: '#fff', fontSize: 15, marginTop: -70 }} />
        </View>

        <View style={{ flexDirection: 'row', backgroundColor:constants.baseColor ,flex:.15}}>
        <View style={{flex:1 ,justifyContent:'flex-end'}}>
        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <View style={{ flexDirection: 'row' }}>
                <Icon style={{ marginLeft:10,marginBottom:7,}} name='angle-left' size={32} color={'#ffffff'} />
                <Text allowFontScaling={false} style={{marginHorizontal:6,marginBottom:4, fontSize: 16,  fontWeight: '500', color: '#ffffff',alignSelf:'center' }}>Back</Text>
              </View>
            </TouchableOpacity>
        </View>
        <View style={{flex:2.5,justifyContent: 'flex-end',alignItems:'center',}}>
        <Text allowFontScaling={false} style={{  fontWeight: 'bold',  color: '#ffffff' ,marginBottom:15,fontSize:17}}>{this.props.route.params.chat_history_arr.get_doctor.first_name + ' ' + this.props.route.params.chat_history_arr.get_doctor.last_name}</Text>

        </View>
        <View style={{flex:1,alignItems:'center',justifyContent:'flex-end'}}>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('PatientDoctorProfile', this.props.route.params )} style={{justifyContent:'flex-end',height:50}}>
              <ImageBubble image={this.props.route.params.chat_history_arr.get_doctor.profile_pics} firstName={this.props.route.params.chat_history_arr.get_doctor.first_name} lastName={this.props.route.params.chat_history_arr.get_doctor.last_name} size={35} />
            </TouchableOpacity>
        </View>

        {/* <View style={{ backgroundColor:'purple' ,flex:1}}> 
        <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ height: '100%', width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row' }}>
                <Icon style={{ }} name='angle-left' size={30} color={'#ffffff'} />
                <Text allowFontScaling={false} style={{ fontSize: 15,  fontWeight: '500', color: '#ffffff' }}>Back</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ flex:1,  backgroundColor:'red', justifyContent: 'center', alignItems: 'center' }}>
              <Text allowFontScaling={false} style={{  fontWeight: 'bold',  color: '#ffffff' }}>{this.props.route.params.chat_history_arr.get_doctor.first_name + ' ' + this.props.route.params.chat_history_arr.get_doctor.last_name}</Text>

          </View> */}
          {/* <View style={{width: '20%', backgroundColor:'yellow'}}> 
          <TouchableOpacity onPress={() => this.props.navigation.navigate('PatientDoctorProfile', this.props.route.params)}>
              <ImageBubble image={this.props.route.params.chat_history_arr.get_doctor.profile_pics} firstName={this.props.route.params.chat_history_arr.get_doctor.first_name} lastName={this.props.route.params.chat_history_arr.get_doctor.last_name} size={35} />
            </TouchableOpacity>
          </View> */}


          {/* <View style={{ position: "absolute", top: 35, right: 15, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('PatientDoctorProfile', this.props.route.params)}>
              <ImageBubble image={this.props.route.params.chat_history_arr.get_doctor.profile_pics} firstName={this.props.route.params.chat_history_arr.get_doctor.first_name} lastName={this.props.route.params.chat_history_arr.get_doctor.last_name} size={35} />
            </TouchableOpacity>
          </View>
          <View style={{ position: "absolute", top: 15, left: 0, justifyContent: 'center', alignItems: 'center', height: 90 }}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ height: '100%', width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row' }}>
                <Icon style={{ marginLeft: 15 }} name='angle-left' size={30} color={'#ffffff'} />
                <Text allowFontScaling={false} style={{ fontSize: 15, marginTop: 7, marginLeft: 5, fontWeight: '500', color: '#ffffff' }}>Back</Text>
              </View>
            </TouchableOpacity>
          </View> */}
        </View>
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: 1,
          }}
        />
        <View style={styles.viewBottom}>
          {Platform.OS == 'android' ? <View style={styles.viewBottomLeft}>
            {/* {this.state.eme=="Request Appointment" ? <Btn onPress={() => this.mAppointmentRequest(1)} name={this.state.eme} buttonType='pBtn' /> : <Btn onPress={() => this.mAppointmentRequest(0)} name={this.state.eme} buttonType='pBtn' />} */}
            <View style={{
              height: 100,
              width: '33%',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TouchableOpacity
                onPress={() => Alert.alert(
                  'Choose An Option',
                  '',
                  [


                    { text: 'Post Detail', onPress: () => this.props.navigation.navigate('PatientPostDetails', this.props.route.params) },
                    { text: 'Close Chat', onPress: () => this.mCloseConfrmation() },
                    { text: 'Cancel', onPress: () => console.log('OK Pressed'), style: 'cancel' },

                  ],
                  { cancelable: false }
                )
                } style={{
                  backgroundColor: 'black', borderWidth: 1,
                  borderRadius: 10,
                  borderColor: constants.baseColor,
                  backgroundColor: constants.baseColor,
                  height: 60,
                  width: 60,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: '2%', borderRadius: 30
                }}>
                {/* <Text allowFontScaling={false} numberOfLines={1} style={{ color: 'white' }}>View Post</Text> */}
                <Image source={script} style={{ height: '70%', width: '70%', resizeMode: "contain" }} />
              </TouchableOpacity>
              <TextSemiBold title={"View Post"} textStyle={Styles.info}></TextSemiBold>
              {/* <TouchableOpacity
                  onPress={() => this.modalVisibility()}
                  style={{
                    marginTop: 2,
                    backgroundColor: 'black', borderWidth: 1,
                    borderRadius: 10,
                    borderColor: constants.baseColor,
                    backgroundColor: constants.baseColor,
                    height: 29,
                    width: "100%",
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: '2%'
                  }}>
                  <Text allowFontScaling={false} numberOfLines={1} style={{ color: 'white' }}>Write Review</Text>
                </TouchableOpacity> */}
            </View>
            <View style={{
              height: 100,
              width: '33%',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TouchableOpacity
                onPress={() => this.modalVisibility()}
                style={{
                  backgroundColor: 'black', borderWidth: 1,
                  borderRadius: 10,
                  borderColor: constants.baseColor,
                  backgroundColor: constants.baseColor,
                  height: 60,
                  width: 60,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: '2%', borderRadius: 30
                }}>
                <Image source={star} style={{ height: '70%', width: '70%', resizeMode: "contain" }} />
              </TouchableOpacity>
              <TextSemiBold title={"Write Review"} textStyle={Styles.info}></TextSemiBold>
            </View>
            <View style={{
              height: 100,
              width: '33%',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {cos_view}
              <TextSemiBold title={"Appointment"} textStyle={Styles.info}></TextSemiBold>
            </View>

          </View> : <View style={styles.viewBottomLeft}>
              {/* {this.state.eme=="Request Appointment" ? <Btn onPress={() => this.mAppointmentRequest(1)} name={this.state.eme} buttonType='pBtn' /> : <Btn onPress={() => this.mAppointmentRequest(0)} name={this.state.eme} buttonType='pBtn' />} */}
              <View style={{
                height: 100,
                width: '33%',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TouchableOpacity
                  onPress={() => Alert.alert(
                    'Choose An Option',
                    '',
                    [


                      { text: 'Post Detail', onPress: () => this.props.navigation.navigate('PatientPostDetails', this.props.route.params) },
                      { text: 'Close Chat', onPress: () => this.mCloseConfrmation() },
                      { text: 'Cancel', onPress: () => console.log('OK Pressed'), style: 'cancel' },

                    ],
                    { cancelable: false }
                  )
                  } style={{
                    backgroundColor: 'black', borderWidth: 1,
                    borderRadius: 10,
                    borderColor: constants.baseColor,
                    backgroundColor: constants.baseColor,
                    height: 60,
                    width: 60,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: '2%', borderRadius: 30
                  }}>
                  {/* <Text allowFontScaling={false} numberOfLines={1} style={{ color: 'white' }}>View Post</Text> */}
                  <Image source={script} style={{ height: '70%', width: '70%', resizeMode: "contain" }} />
                </TouchableOpacity>
                <TextSemiBold title={"View Post"} textStyle={Styles.info}></TextSemiBold>
                {/* <TouchableOpacity
                  onPress={() => this.modalVisibility()}
                  style={{
                    marginTop: 2,
                    backgroundColor: 'black', borderWidth: 1,
                    borderRadius: 10,
                    borderColor: constants.baseColor,
                    backgroundColor: constants.baseColor,
                    height: 29,
                    width: "100%",
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: '2%'
                  }}>                                                                                                                                      
                                                                                                             
                  <Text allowFontScaling={false} numberOfLines={1} style={{ color: 'white' }}>Write Review</Text>
                </TouchableOpacity> */}
              </View>
              <View style={{
                height: 100,
                width: '33%',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TouchableOpacity
                  onPress={() => this.modalVisibility()}
                  style={{
                    backgroundColor: 'black', borderWidth: 1,
                    borderRadius: 10,
                    borderColor: constants.baseColor,
                    backgroundColor: constants.baseColor,
                    height: 60,
                    width: 60,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: '2%', borderRadius: 30
                  }}>
                  <Image source={star} style={{ height: '70%', width: '70%', resizeMode: "contain" }} />
                </TouchableOpacity>
                <TextSemiBold title={"Write Review"} textStyle={Styles.info}></TextSemiBold>
              </View>
              <View style={{
                height: 100,
                width: '33%',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {cos_view}
                <TextSemiBold title={"Appointment"} textStyle={Styles.info}></TextSemiBold>
              </View>

            </View>}

        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}>

          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            backgroundColor: 'rgba(52, 52, 52, 0.8)'
          }}>
            <KeyboardAwareScrollView style={{ flex: 1 }}>
              {/* <ScrollView style={{ flex: 1,}}> */}
              <View style={{
                height: Constants.deviceHeight,
                width: Constants.deviceWidth,
                flex: 1, justifyContent: 'center',
                alignItems: 'center',
              }}>
                <View style={{ width: '80%', height: 300, backgroundColor: 'white', borderRadius: 10, borderWidth: 1, borderColor: 'white' }}>
                  <View style={{ width: '100%', height: 250, justifyContent: 'center', alignItems: 'center' }}>
                    <Rating
                      // readonly={true}
                      type='custom'
                      onFinishRating={(rating) => this.setState({ rating: rating })}
                      imageSize={30}
                      ratingCount={5}
                      startingValue={this.state.rating}
                      ratingBackgroundColor='lightgray'
                      borderColor={constants.baseColor}
                    // style={{ marginTop: 10 }}
                    />
                    <Text style={{ marginTop: 15, marginBottom: 15 }}>You Gave {this.state.rating} star</Text>
                    <Text style={{ marginRight: "45%", fontWeight: 'bold' }}>Write Your Review</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderRadius: 5, borderColor: '#cccccc', width: '90%' }}>

                      <TextInput
                        allowFontScaling={false}
                        maxLength={100}
                        style={styles.textInputStyleDesc}
                        multiline={true}
                        value={this.state.description}
                        onChangeText={(text) => this.setState({ description: text })}
                        keyboardType="default"
                        placeholder='Write Your Review'
                      />
                    </View>
                  </View>
                  <View style={{ height: 50, width: '100%', backgroundColor: 'white', borderWidth: 1, borderColor: 'white', borderBottomLeftRadius: 10, borderBottomRightRadius: 10, flexDirection: 'row' }}>
                    <TouchableOpacity style={{ height: 50, width: '50%', borderTopColor: 'lightgray', borderWidth: 1, borderRightColor: 'lightgray', borderBottomLeftRadius: 10, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.modalVisibility()}>
                      <Text>Close</Text></TouchableOpacity>
                    <TouchableOpacity style={{ height: 50, width: '50%', borderTopColor: 'lightgray', borderWidth: 1, borderRightColor: 'lightgray', borderBottomRightRadius: 10, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.mSaveReviewRatingForDoctors()}>
                      <Text>Submit</Text></TouchableOpacity>
                  </View>
                </View>
              </View>
              {/* </ScrollView> */}
            </KeyboardAwareScrollView>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.confirmAppointmentModal}>
          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            backgroundColor: 'rgba(52, 52, 52, 0.8)'
          }}>

            <View style={{ width: '80%', height: 100, backgroundColor: 'white', borderRadius: 10, borderWidth: 1, borderColor: 'white', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              <Text style={{ marginBottom: 10, marginTop: 10 }}>Confirm Appointment</Text>
              <View style={{ flexDirection: 'column', width: '100%', height: 70, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity style={{ backgroundColor: constants.baseColor, alignItems: 'center', justifyContent: 'center', width: '45%', height: 50, borderWidth: 1, borderColor: constants.baseColor, borderRadius: 10, marginRight: 5 }} allowFontScaling={false} onPress={() => { this.setState({ confirmAppointmentModal: false }, () => { this.mAppointmentRequest(3) }) }}>
                  <Text style={{ color: 'white' }}>Confirm</Text></TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: 'red', alignItems: 'center', justifyContent: 'center', width: '45%', height: 50, borderWidth: 1, borderColor: 'red', borderRadius: 10, marginLeft: 5 }} allowFontScaling={false} onPress={() => { this.setState({ confirmAppointmentModal: false }, () => { this.mAppointmentRequest(2) }) }}>
                  <Text style={{ color: 'white' }}>Cancel</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <KeyboardAvoidingView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <GiftedChat style={{ marginTop: 15 }} messages={this.state.messages} onSend={this.onSend} user={{
              _id: 1
            }} renderActions={this.renderCustomActions} />
          </View>
        </KeyboardAvoidingView>
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
    width: "100%",
    flexDirection: 'row'
  },
  viewStyle: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: constants.baseColor,
    backgroundColor: constants.baseColor,
    height: 60,
    width: "47%",
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 10,
    marginBottom: 15,
    marginLeft: '0.5%'
  },
  viewCan: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: constants.baseColor,
    backgroundColor: constants.baseColor,
    height: 60,
    width: "47%",
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 10,
    marginBottom: 15,
    marginLeft: '0.5%'
  },
  viewCon: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: constants.baseColor,
    backgroundColor: constants.baseColor,
    height: 60,
    width: "47%",
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 10,
    marginBottom: 15,
    marginLeft: '0.5%'
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
    width: "90%",
    height: 70,
    fontWeight: '500'
  }
});