import React from 'react';
import {
  Platform,
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import {GiftedChat, Actions, Bubble, Avatar} from 'react-native-gifted-chat';
import {Button} from 'react-native-elements';
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
import appointmentCalendar from './../images/confirmCalendar.png';
import requestCalendar from './../images/cautionCalendar.png';
import script from './../images/viewPost.png';
import star from './../images/requestReview.png';
import otherCalendar from './../images/confirmingCalender.png';
import cancelCalendar from './../images/cancelCalendar.png';
import requestmadeCalendar from './../images/cautionCalendar.png';
import Toast, {DURATION} from 'react-native-easy-toast';
import Styles from './../utils/Styles';
import {TextSemiBold, TextMedium} from './../utils/Component';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Constants from '../utils/Constants';
import Images from '../utils/Images';
import ActionSheet from 'react-native-actionsheet';
import moment from 'moment';

export default class DentistChatWindow extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {
      state: {params = {}},
    } = navigation;
    return {
      title: 'farhan',
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      patientId: '',
      postId: '',
      doctorId: '',
      dentistName: '',
      dentistFirstName: '',
      patientName: '',
      vvvvv: false,
      isDateTimePickerVisible: false,
      mode: 'date',
      newdate: '',
      newtime: '',
      eme: '',
      aptime: '',
      token: '',
      showModal: false,
      doctorIdForReview: '',
      doctorNameForReview: '',
      isArchive: false,
      isPatientAdded: false,
      isFollowUp: false,
      updateArchivePostListener: null,
      updateFollowUpPostListener: null,
      updateAddPatientPostListener: null,
      postIndex: -1,
      reloadLostMessages: false,
    };

    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.sendMsg = this.sendMsg.bind(this);
    this.onSend = this.onSend.bind(this);
    this.getDentistInfo = this.getDentistInfo.bind(this);
    this.getDentistNameForReviewUrl = this.getDentistNameForReviewUrl.bind(
      this,
    );
    this.renderAvatar = this.renderAvatar.bind(this);
    this.socket = SocketIOClient('https://socket.dentalchat.com/', {
      transports: ['websocket'],
    });

    console.log('SOCKET_CONNECTION_CALL_TIME_AGAIN:' + new Date());
  }

  showActionSheet = () => {
    this.ActionSheet.show();
  };

  addUserToChatroom() {
    const set_name_json = {
      from: this.state.doctorId,
      senderName: this.state.dentistName,
      buddy: this.state.patientId,
      receiverName: this.state.patientName,
      roomName: '',
      post_id: this.state.postId,
    };

    this.socket.emit('set_name', set_name_json);
  }

  connectionEstablish() {
    const set_name_json = {
      from: this.state.doctorId,
      senderName: this.state.dentistName,
      buddy: this.state.patientId,
      receiverName: this.state.patientName,
      roomName: '',
      post_id: this.state.postId,
    };

    this.socket.emit('connect_socket', set_name_json);
  }

  componentDidMount() {
    this.initializationOfData();
    try {
      this.socket.on('error', () => {
        console.log('--------------------------------');
        console.log('Connection Error');
        this.setState({visible: false});
      });

      this.socket.on('connect_error', () => {
        console.log('--------------------------------');
        console.log('Connection Error');
        this.setState({visible: false});
      });

      this.socket.on('connect_timeout', () => {
        console.log('--------------------------------');
        console.log('Connection TimeOut');
        this.setState({visible: false});
      });

      this.socket.on('reconnect_failed', () => {
        console.log('--------------------------------');
        console.log('ReConnection Failed');
        this.setState({visible: false});
      });

      this.socket.on('disconnect', () => {
        console.log('--------------------------------');
        console.log('Disconnect');
        this.setState({visible: false});
      });

      this.socket.on('reconnect_error', () => {
        console.log('--------------------------------');
        console.log('ReConnection Error');
        this.setState({visible: false});
      });
    } catch (err) {
      this.setState({visible: false});
    }
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  initializationOfData = () => {
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
    } = this.props.route.params.item;

    let postedDate = posted_date;
    if (posted_date && posted_date.toString().includes('-')) {
      postedDate = posted_date;
    } else if (posted_date) {
      postedDate = moment(posted_date * 1000).format();
    }

    SInfo.getItem('token', {
      sharedPreferencesName: 'mySharedPrefs',
      keychainService: 'myKeychain',
    }).then(value => {
      // console.log('time to fetch token')
      this.setState({token: value, visible: true});
    });
    this.setState({
      aptime: appointment_time,
      isArchived: this.props.route.params.isArchived,
      isFollowUp: this.props.route.params.item.follow_up_status
        ? this.props.route.params.item.follow_up_status
        : 0,
      isPatientAdded: this.props.route.params.item.is_patient_added
        ? this.props.route.params.item.is_patient_added
        : 0,
      updateArchivePostListener: this.props.route.params
        .updateArchivePostListener,
      updateFollowUpPostListener: this.props.route.params
        .updateFollowUpPostListener,
      updateAddPatientPostListener: this.props.route.params
        .updateAddPatientPostListener,
      postIndex: this.props.route.params.postIndex,
    });

    if (emergency == 1) {
      arrayPost.push({
        _id: 1,
        text: 'Emergency - Yes',
        createdAt: postedDate,
        user: {
          _id: 2,
          name: get_patient.name + ' ' + get_patient.last_name,
        },
      });
    } else {
      arrayPost.push({
        _id: 1,
        text: 'Emergency - No',
        createdAt: postedDate,
        user: {
          _id: 2,
          name: get_patient.name + ' ' + get_patient.last_name,
        },
      });
    }

    arrayPost.push({
      _id: 2,
      text: description,
      createdAt: postedDate,
      user: {
        _id: 2,
        name: get_patient.name + ' ' + get_patient.last_name,
      },
    });

    this.socket.on('message', function(data) {
      console.log('SOCKET_MSG');
      if (contex.state.reloadLostMessages) {
        arrayHistory = [];
        contex.setState({
          reloadLostMessages: false,
        });
      }

      // console.log(JSON.stringify(data))
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
                image: 'https://socket.dentalchat.com/' + userObject.chat_file,
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
                image: 'https://socket.dentalchat.com/' + userObject.chat_file,
              });
            }
          }
        }
        console.log('MESSAGE:1');
        // console.log(JSON.stringify(contex.state.messages))
        // console.log(JSON.stringify(arrayHistory))
        // console.log(JSON.stringify(arrayPost))
        console.log('SOCKET_MESSAGES_READ_TIME:' + new Date());
        console.log('-----------------------------------');
        contex.setState(
          {
            messages: contex.state.messages
              .concat(arrayHistory)
              .concat(arrayPost),
            visible: false,
          },
          () => {},
        );
        arrayHistory = [];
      } else {
        // console.log("DATA_DATA:")
        // console.log(data)

        var strData = data;
        // var strData = data.toString().includes("/") ? data.replace(/\\/g, "") : data.toString();
        // strData = ""
        // if(!(strData && strData.length>0 && strData.startsWith("{"))){
        //     return
        // }

        // var objJson = {}
        // try{
        //    objJson = JSON.parse(strData);
        // }catch(error){
        //   return
        // }
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
        console.log('MESSAGE:2');
        // console.log(JSON.stringify(contex.state.messages))
        console.log('-----------------------------------');
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
      this.setState({dentistName: value});
      if (value && value.length > 0) {
        let name = this.getDentistNameForReviewUrl(value);
        this.setState({dentistFirstName: name});
      }
    });
    SInfo.getItem('dentist_id', {
      sharedPreferencesName: 'mySharedPrefs',
      keychainService: 'myKeychain',
    }).then(value => {
      this.setState({
        doctorId: value,
        patientId: patient_id,
        postId: post_id,
        patientName: get_patient.name + ' ' + get_patient.last_name,
      });
      this.addUserToChatroom();
      this.mReadChatForDoctor();
      this.getDentistInfo();
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
  };

  getDentistNameForReviewUrl(value) {
    if (value && value.includes(' ')) {
      var pieces = value.split(' ');
      if (pieces && pieces.length > 0) {
        console.log('DENTIST_FIRST_NAME1:' + pieces[0]);
        return pieces[0];
      }
    } else {
      console.log('DENTIST_FIRST_NAME2:' + value);
      return value;
    }
  }

  mReadChatForDoctor() {
    // this.setState({
    //   loaderVisibility: true
    // })
    var mThis = this;
    var rawData = [];
    var countMSG = 0;
    var data = new FormData();
    data.append('auth_token', this.state.token);
    data.append('doctor_id', this.state.doctorId);
    data.append('post_id', this.state.postId);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        if (this.responseText.indexOf('status') !== -1) {
          var text = this.responseText;
          // console.log('<><><>abc10 ' + this.responseText);
          // mThis.mLoaderShowHide()
          var obj = JSON.parse(text);
        } else {
        }
      }
    });
    xhr.open('POST', constants.url + 'read-chat-dentist');
    xhr.send(data);
  }

  getDentistInfo() {
    // this.setState({
    //   loaderVisibility: true
    // })
    var mThis = this;
    var data = new FormData();
    data.append('auth_token', this.state.token);
    data.append('dentist_id', this.state.doctorId);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        if (this.responseText.indexOf('status') !== -1) {
          var text = this.responseText;
          // console.log('<><><>abc10 ' + this.responseText);
          // mThis.mLoaderShowHide()
          var obj = JSON.parse(text);
          // console.log("DENTIST_INFO:" + JSON.stringify(obj))
          if (
            obj &&
            obj.status &&
            obj.status == 1 &&
            obj.role &&
            obj.role == 1
          ) {
            let name = mThis.state.dentistFirstName;
            if (obj.parent_name && obj.parent_name.length > 0) {
              name = mThis.getDentistNameForReviewUrl(obj.parent_name);
            }
            mThis.setState({
              doctorIdForReview: obj.parent_doctor_id
                ? obj.parent_doctor_id
                : mThis.state.doctorId,
              doctorNameForReview: name,
            });
          } else {
            mThis.setState({
              doctorIdForReview: mThis.state.doctorId,
              doctorNameForReview: mThis.state.dentistFirstName,
            });
          }
        } else {
          mThis.setState({
            doctorIdForReview: mThis.state.doctorId,
            doctorNameForReview: mThis.state.dentistFirstName,
          });
        }
      }
    });
    xhr.open('POST', constants.url + 'get-dentist-info');
    xhr.send(data);
  }

  onBottomSheetClicked = index => {
    switch (index) {
      case 0:
        // this.state.updateArchivePostListener(this.props.route.params.item, this.state.postIndex, this.state.isArchived, this.state.isFollowUp, this.state.isPatientAdded)
        this.showArchivedAlert();

        break;
      case 1:
        this.followUpPost(this.props.route.params.item);
        break;
      case 2:
        this.addRemoveMyPatientPost(this.props.route.params.item);
        break;
      case 3:
        // this.createVideoMeeting(this.props.route.params.item)
        this.askPermissionForPrintMessage();
        break;
      case 4:
        this.getLostMessages(this.props.route.params.item);
        break;
    }
  };

  // createVideoMeeting = (item) => {
  //   this.setState({ visible: true })
  //   var mThis = this;
  //   var rawData = [];
  //   var mUnreadCount = 0;

  //   fetch(constants.url + constants.API_URL.createVideoMeeting, {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       auth_token: this.state.token,
  //       doctor_id: this.state.doctorId,
  //       post_id: item.post_id,
  //       patient_id: item.patient_id,
  //       request_id: ""
  //     }),
  //   }).then((response) => response.json())
  //     .then((responseJson) => {
  //       //var users = responseJson;
  //       console.log("vedio call response", responseJson);
  //       this.setState({ visible: false })

  //       if (responseJson.status && responseJson.status == 5) {
  //         SInfo.setItem('is_patient_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
  //         SInfo.setItem('is_dentist_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
  //         this.props.navigation.navigate('Home')
  //       }
  //       else if (responseJson.status && responseJson.status == 3) {
  //         mThis.setState({
  //           visible: false,
  //         }, () => {
  //           if (responseJson.msg) {
  //             setTimeout(() => {
  //               Alert.alert('Request Failed', responseJson.msg);
  //             }, 200);
  //           }
  //         });

  //       } else if (responseJson.status && responseJson.status == 2) {
  //         mThis.setState({
  //           visible: false,
  //         }, () => {
  //           if (responseJson.msg) {
  //             setTimeout(() => {
  //               Alert.alert('Request Failed', responseJson.msg);
  //             }, 200);
  //           }
  //         });

  //       } else if (responseJson.status && responseJson.status == 1) {
  //         mThis.setState({
  //           visible: false,
  //         });

  //         if (responseJson.room_type == 0 && responseJson.token) {
  //           msg = [{
  //             _id: mThis.state.doctorId,
  //             text: "Please join the video using the link. https://dentalchat.com/meeting-room/" + responseJson.token,
  //             createdAt: Moment().format('YYYY-MM-DD HH:mm:ss'),
  //             user: {
  //               _id: 1,
  //               name: mThis.state.senderName
  //             }
  //           }]
  //           // this.setState((previousState) => {
  //           //   return {
  //           //     messages: GiftedChat.append(previousState.messages, msg)
  //           //   };
  //           // });
  //           mThis.onSend(msg)
  //         } else if (responseJson.room_type == 1 && responseJson.token) {
  //           // for vsee video chat
  //           mThis.sendMessageForVSeeRoom(responseJson.token, item.post_id)
  //         }

  //       } else if (responseJson.msg) {
  //         setTimeout(() => {
  //           Alert.alert('Request Failed', responseJson.msg);
  //         }, 200);
  //       }
  //     })
  //     .catch((error) => {
  //       mThis.setState({
  //         visible: false
  //       });
  //       console.log(error)

  //       mThis.mFailed();
  //       // mThis.archivePost(item)
  //     });
  // }
  createVideoMeeting = item => {
    // console.log("POST:"+JSON.stringify(item))
    this.setState({visible: true});
    var mThis = this;
    var rawData = [];
    var mUnreadCount = 0;

    fetch(constants.url + constants.API_URL.createVideoMeeting, {
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
        request_id: '',
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('RESPONSE:' + JSON.stringify(responseJson));
        this.setState({visible: false});

        if (responseJson.status && responseJson.status == 5) {
          SInfo.setItem('is_patient_login', '0', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          SInfo.setItem('is_dentist_login', '0', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          this.props.navigation.navigate('Home');
        } else if (responseJson.status && responseJson.status == 3) {
          mThis.setState(
            {
              visible: false,
            },
            () => {
              if (responseJson.msg) {
                setTimeout(() => {
                  Alert.alert('Request Failed', responseJson.msg);
                }, 200);
              }
            },
          );
        } else if (responseJson.status && responseJson.status == 2) {
          mThis.setState(
            {
              visible: false,
            },
            () => {
              setTimeout(() => {
                mThis.alertSendEmail();
              }, 200);
            },
          );
        } else if (responseJson.status && responseJson.status == 1) {
          mThis.setState({
            visible: false,
          });

          if (responseJson.room_type == 0 && responseJson.token) {
            msg = [
              {
                _id: mThis.state.doctorId,
                text:
                  'Please join the video using the link. https://dentalchat.com/meeting-room/' +
                  responseJson.token +
                  ' \n\n' +
                  'Note: If you are not logged in, please use the secret code: ' +
                  responseJson.secret_code,
                createdAt: Moment().format('YYYY-MM-DD HH:mm:ss'),
                user: {
                  _id: 1,
                  name: mThis.state.senderName,
                },
              },
            ];
            // this.setState((previousState) => {
            //   return {
            //     messages: GiftedChat.append(previousState.messages, msg)
            //   };
            // });
            mThis.onSend(msg);
          } else if (responseJson.room_type == 1 && responseJson.token) {
            // for vsee video chat
            mThis.sendMessageForVSeeRoom(
              responseJson.token,
              item.post_id,
              responseJson.secret_code,
            );
          }
        } else if (responseJson.msg) {
          setTimeout(() => {
            Alert.alert('Request Failed', responseJson.msg);
          }, 200);
        }
      })
      .catch(error => {
        mThis.setState({
          visible: false,
        });
        console.log(error);
        mThis.mFailed();
        // mThis.archivePost(item)
      });
  };

  alertSendEmail = () => {
    Alert.alert(
      'Send email to admin ?',
      'You are not currently subscribed to Video consult feature!',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Send',
          onPress: () => {
            this.meetingRoomLicenseRequestApi();
          },
        },
      ],
      {cancelable: false},
    );
  };

  meetingRoomLicenseRequestApi = () => {
    this.setState({visible: true});
    var mThis = this;

    fetch(constants.url + constants.API_URL.meetingRoomLicenseRequest, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: this.state.token,
        doctor_id: this.state.doctorId,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        //var users = responseJson;
        this.setState({visible: false});
        console.log('responseJson', responseJson);
        if (responseJson.status && responseJson.status == 5) {
          SInfo.setItem('is_patient_login', '0', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          SInfo.setItem('is_dentist_login', '0', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          this.props.navigation.navigate('Home');
        } else if (responseJson.status && responseJson.status == 1) {
          mThis.setState(
            {
              visible: false,
            },
            () => {
              if (responseJson.msg) {
                setTimeout(() => {
                  Alert.alert('Email sent', responseJson.msg);
                }, 200);
              }
            },
          );
        } else if (responseJson.msg) {
          setTimeout(() => {
            Alert.alert('Request Failed', responseJson.msg);
          }, 200);
        }
      })
      .catch(error => {
        mThis.setState({
          visible: false,
        });
        console.log(error);

        mThis.mFailed();
        // mThis.archivePost(item)
      });
  };
  sendMessageForVSeeRoom(token, post_id, secret_code) {
    const message1 =
      'Step 1. Please join the video using the link. https://dentalchat.com/meeting-room/' +
      token +
      ' \n\n' +
      'Note: If you are not logged in, please use the secret code: ' +
      secret_code;
    const message2 = 'Step 2. Next, click the "ENTER WAITING ROOM" BUTTON.';
    const message3 = 'Step 3. Next, click  "PROCEED AS GUEST".';
    const message4 =
      'Step 4. Fill the short form and terms, enter the below DentalChat reference#  in the Reason for visit.';
    const message5 = 'Step 5. Reference# ' + post_id;
    const message6 = 'Step 6. Click continue';
    const message7 =
      'Step 7. Accept the terms and Launch the DentalChat Video application.';
    const message8 =
      'Step 8. If you are having any issues, please message here.';

    let msg =
      message1 +
      ' \n\n' +
      message2 +
      ' \n\n' +
      message3 +
      ' \n\n' +
      message4 +
      ' \n\n' +
      message5 +
      ' \n\n' +
      message6 +
      ' \n\n' +
      message7 +
      ' \n\n' +
      message8;
    setTimeout(() => {
      // this.setState((previousState) => {
      //   return {
      //     messages: GiftedChat.append(previousState.messages, msg)
      //   };
      // });
      this.onSend([
        {
          _id: this.state.doctorId,
          text: msg,
          createdAt: Moment().format('YYYY-MM-DD HH:mm:ss'),
          user: {
            _id: 1,
            name: this.state.senderName,
          },
        },
      ]);
    }, 200);
  }
  archivePost = item => {
    const isArchived = this.state.isArchived;
    console.log('Archive_Post_Pressed:');
    this.setState({visible: true});
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
        archived_status: isArchived ? 0 : 1,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        //var users = responseJson;
        this.setState({visible: false});

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
          mThis.setState({
            visible: false,
            isArchived: !isArchived,
          });
          mThis.state.updateArchivePostListener(
            item,
            mThis.state.postIndex,
            !isArchived,
          );
          mThis.props.navigation.goBack();
        }
      })
      .catch(error => {
        mThis.setState({
          visible: false,
        });
        console.log(error);

        mThis.mFailed();
        // mThis.archivePost(item)
      });
  };

  followUpPost = item => {
    console.log('Follow_Post_Pressed:');

    let followUpStatus = this.state.isFollowUp;
    this.setState({visible: true});
    var mThis = this;
    var rawData = [];
    var mUnreadCount = 0;
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
        flag: followUpStatus ? 0 : 1,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        //var users = responseJson;
        this.setState({visible: false});

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
          mThis.setState({
            visible: false,
            isFollowUp: !followUpStatus,
          });

          mThis.props.route.params.item['follow_up_status'] = followUpStatus
            ? 1
            : 0;
          this.state.updateFollowUpPostListener(item, !followUpStatus);
        }
      })
      .catch(error => {
        mThis.setState({
          rady: true,
          visible: false,
        });
        console.log(error);
        mThis.mFailed();
        // mThis.followUpPost(item)
      });
  };

  mFailed = () => {
    this.setState({visible: false}, () => {
      setTimeout(() => {
        Alert.alert(
          'Failed',
          'The Internet connection appears to be offline, Please try again',
        );
      }, 200);
    });
  };

  addRemoveMyPatientPost = item => {
    console.log('My_Patient_Post_Pressed:');

    const isPatientAdded = this.state.isPatientAdded;
    this.setState({visible: true});
    var mThis = this;
    var rawData = [];
    var mUnreadCount = 0;
    let url =
      item.is_patient_added && item.is_patient_added == 1
        ? constants.url + constants.API_URL.removeMyPatient
        : constants.url + constants.API_URL.addMyPatient;
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
    })
      .then(response => response.json())
      .then(responseJson => {
        //var users = responseJson;
        this.setState({visible: false});

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
          mThis.setState({
            visible: false,
            isPatientAdded: !isPatientAdded,
          });

          mThis.props.route.params.item['is_patient_added'] = isPatientAdded
            ? 1
            : 0;
          this.state.updateAddPatientPostListener(item, !isPatientAdded);
        }
      })
      .catch(error => {
        mThis.setState({
          rady: true,
          visible: false,
        });
        console.log(error);
        mThis.mFailed();
        // mThis.addRemoveMyPatientPost(item)
      });
  };

  getLostMessages = item => {
    console.log('My_Patient_Post_Pressed:');
    // console.log(item)

    this.setState({visible: true});
    var mThis = this;
    var rawData = [];
    var mUnreadCount = 0;

    let url = constants.url + constants.API_URL.getLostMessages;
    // console.log("URL:" + url)
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
    })
      .then(response => response.json())
      .then(responseJson => {
        //var users = responseJson;
        this.setState({visible: false});

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
          mThis.setState({
            visible: false,
          });

          this.reloadLostMessages();
        }
      })
      .catch(error => {
        mThis.setState({
          rady: true,
          visible: false,
        });
        console.log(error);
        mThis.mFailed();
        // mThis.addRemoveMyPatientPost(item)
      });
  };

  reloadLostMessages = () => {
    this.setState({
      messages: [],
      reloadLostMessages: true,
    });
    // this.socket.disconnect;
    // this.socket.connect;
    this.addUserToChatroom();
  };

  proposeAppoinment = () => {
    Alert.alert(
      'Are you sure?',
      'You want to request the appointment ',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Request',
          onPress: () => {
            this._showDatePicker();
          },
        },
      ],
      {cancelable: false},
    );
  };

  showArchivedAlert = () => {
    let title = this.state.isArchived ? 'Un-Archive Post!' : 'Archive Post!';
    let message = this.state.isArchived
      ? 'Are you sure you want to unarchive the post?'
      : 'Are you sure you want to archive the post?';
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            this.archivePost(this.props.route.params.item);
          },
        },
      ],
      {cancelable: false},
    );
  };

  changeProposeAppoinment = () => {
    Alert.alert(
      'Are you sure?',
      'Do you want to change request appoinment time ',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Change',
          onPress: () => {
            this._showDatePicker();
          },
        },
      ],
      {cancelable: false},
    );
  };
  _showDatePicker = () =>
    this.setState({isDateTimePickerVisible: true, mode: 'date'});
  _showTimePicker = () =>
    this.setState({isDateTimePickerVisible: true, mode: 'time'});
  _hidePicker = () => this.setState({isDateTimePickerVisible: false});

  _handleDatePicked = aaa => {
    if (this.state.mode == 'date') {
      var mDate = Moment(aaa).format('YYYY-MM-DD');
      this.setState({newdate: mDate});
    } else {
      var mTime = Moment(aaa)
        .format('hh:mm a')
        .replace('am', 'AM')
        .replace('pm', 'PM');
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
    this.setState({showModal: false});
    fetch(constants.url + 'set-appointment-doctors', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: this.state.token,
        patient_id: this.state.patientId,
        doctor_id: this.state.doctorId,
        post_id: this.state.postId,
        is_status: '2',
        proposedate: '',
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
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
    fetch(constants.url + 'set-appointment-doctors', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: this.state.token,
        patient_id: this.state.patientId,
        doctor_id: this.state.doctorId,
        post_id: this.state.postId,
        is_status: '1',
        proposedate: this.state.newdate + ' ' + this.state.newtime,
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
          if (
            this.state.eme == 'No Appointment Requested' ||
            this.state.eme == 'Appointment Requested' ||
            this.state.eme == 'Appointement Proposed for'
          ) {
            this.setState({
              eme: 'Appointement Proposed for',
              aptime: this.state.newdate + ' ' + this.state.newtime,
            });
            // Toast.showWithGravity("Appointement Proposed for", Toast.LONG, Toast.BOTTOM);
            this.refs.toast.show(
              'Appointement Proposed for ' +
                this.state.newdate +
                ' ' +
                this.state.newtime,
            );
            let text =
              'Appointement Proposed for ' +
              this.state.newdate +
              ' ' +
              this.state.newtime;
            this.printMessage(text);
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
    fetch(constants.url + 'save-chat-history', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: this.state.token,
        patient_id: this.state.patientId,
        doctor_id: this.state.doctorId,
        post_id: this.state.postId,
        patient_content: '',
        doctor_content: 'You can reschedule appointment',
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
  save_chat_history() {
    fetch(constants.url + 'save-chat-history', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: this.state.token,
        patient_id: this.state.patientId,
        doctor_id: this.state.doctorId,
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
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  mNetworkFailed() {
    this.setState({visible: false}, () => {
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
    data.append('doctor_id', this.state.doctorId);
    data.append('post_id', this.state.postId);
    data.append('patient_content', 'File');
    data.append('doctor_content', '');
    data.append('senderName', this.state.dentistName);
    data.append('receiverName', this.state.patientName);
    data.append('creatAt', nn / 1000);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener('readystatechange', function() {
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
    data.append('doctor_id', this.state.doctorId);
    data.append('post_id', this.state.postId);
    data.append('patient_content', '');
    data.append('doctor_content', msg);
    data.append('senderName', this.state.dentistName);
    data.append('receiverName', this.state.patientName);
    data.append('creatAt', nn / 1000);
    console.warn(data);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        console.warn('we stuck here with');

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
      data.append('from', this.state.doctorId);
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
      xhr.addEventListener('readystatechange', function() {
        if (this.readyState === 4) {
          var text = this.responseText;
          var obj = JSON.parse(text);
          console.warn(obj);
          con.socket.emit('file-uploaded', obj.result);
        }
      });
      // xhr.open("POST", "https://dentalchat.com:8005/image-uploaded");
      xhr.open('POST', 'https://socket.dentalchat.com/image-uploaded');
      xhr.setRequestHeader('content-type', 'multipart/form-data');
      xhr.send(data);
    }
  }

  onSend(messages = []) {
    if (messages[0].text == undefined && messages[0].location == undefined) {
      let photo = [];
      for (let i = 0; i < messages.length; i++) {
        photo[i] = {
          uri: messages[i].image,
          type: 'image/jpeg',
          name: 'imageshare',
        };
      }

      this.sendImage(photo);
      this.sendImageData(messages[0].text);
    } else if (messages[0].location != undefined) {
      messages[0].user['name'] = this.state.dentistName;
      if (
        messages[0].location &&
        messages[0].location.latitude &&
        messages[0].location.longitude
      ) {
        this.mGetLocationAddress(
          messages[0],
          messages[0].location.latitude,
          messages[0].location.longitude,
        );
      } else {
        console.log('LOCATION NOT FOUND');
      }
    } else {
      console.log('message as follow');
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
    if (messages[0].location == undefined) {
      messages[0].user['name'] = this.state.dentistName;

      console.log('-----------------------------------');
      this.setState(previousState => {
        return {
          messages: GiftedChat.append(previousState.messages, messages),
        };
      });
    }
  }
  askPermissionForPrintMessage = () => {
    Alert.alert(
      'Request Review',
      'Do you want to ask Patient to review your profile ',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          // text: 'Request', onPress: () => { this.printMessage("Your feedback is important to us, click the write review button or click the below link to provide your feedback. https://dentalchat.com/doctorprofile/" + this.state.doctorId + "/" + this.state.dentistName) }
          text: 'Request',
          onPress: () => {
            this.printMessage(
              'Your feedback is important to us, click on "write review" in the top section or click the below link to provide your experience using DentalChat. https://dentalchat.com/doctorprofile/' +
                this.state.doctorIdForReview +
                '/' +
                this.state.doctorNameForReview +
                '?review=true',
            );
          },
        },
      ],
      {cancelable: false},
    );
  };
  printMessage = message => {
    const text = message;
    let messages = [
      {
        user: {_id: 1},
        text: text,
        _id: '525d2d1f-9012-4808-b88b-36047dd087f8',
        createdAt: Date.now(),
      },
    ];
    const msg = {
      message: text,
      file_name: '',
      file_type: '',
      status: 'unread',
      type: 'userMessage',
    };
    this.socket.emit('message', JSON.stringify(msg));
    this.sendMsg(text);
    console.log('MESSAGE:4');

    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  };
  mGetLocationAddress = (message, latitude, longitude) => {
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
        console.log('LOCATION_ADDRESS:');
        var obj = JSON.parse(text);

        let city = '',
          country = '',
          zip = '',
          address = 'No Address Found';
        if (obj && obj.results && obj.results.length > 0) {
          let addressComponent = obj.results[0].address_components;
          addressComponent.forEach(element => {
            if (element.types[0] == 'locality') {
              city = element.long_name;
            }
            if (element.types[0] == 'country') {
              country = element.long_name;
            }
            if (element.types[0] == 'postal_code') {
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
              (address && address == 'No Address Found') ||
              address == ''
            ) {
              address = country;
            } else {
              address = address + ', ' + country;
            }
          }
          if (
            !address ||
            (address && address == 'No Address Found') ||
            address == ''
          ) {
            address = zip;
          } else {
            address = address + ', ' + zip;
          }
        }

        message['text'] = address;
        const msg = {
          message: address,
          file_name: '',
          file_type: '',
          status: 'unread',
          type: 'userMessage',
        };
        mThis.socket.emit('message', JSON.stringify(msg));
        mThis.sendMsg(message.text);
        console.log('MESSAGE:5');
        mThis.setState(previousState => {
          return {
            messages: GiftedChat.append(previousState.messages, message),
          };
        });
        // mThis.setState({
        //   currentLocation: obj.results[4].formatted_address
        // });
      }
    });
    xhr.open(
      'GET',
      'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
        latitude +
        ',' +
        longitude +
        '&key=' +
        constants.googleKey,
    );
    xhr.setRequestHeader('cache-control', 'no-cache');
    xhr.setRequestHeader(
      'postman-token',
      '66714504-4f88-2cce-6e47-4bd53dc4de0d',
    );
    xhr.setRequestHeader('key', constants.googleKey);
    xhr.send(data);
  };

  renderCustomActions(props) {
    return <CustomActions {...props} />;
  }

  onPressAvatar(data) {
    // console.log("AVATAR_PRESS:" + JSON.stringify(data))
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

  renderInitials() {
    return <Text style={[styles.avatarTextStyle]}>A</Text>;
  }

  // setAvatarColor(name) {
  //   let avatarName = ''
  //   let avatarColor = Constants.green
  //   const userName = name || '';
  //   const name = userName.toUpperCase().split(' ');
  //   if (name.length === 1) {
  //     avatarName = `${name[0].charAt(0)}`;
  //   } else if (name.length > 1) {
  //     avatarName = `${name[0].charAt(0)}${name[1].charAt(0)}`;
  //   } else {
  //     avatarName = '';
  //   }

  //   let sumChars = 0;
  //   for (let i = 0; i < userName.length; i += 1) {
  //     sumChars += userName.charCodeAt(i);
  //   }

  //   // inspired by https://github.com/wbinnssmith/react-user-avatar
  //   // colors from https://flatuicolors.com/
  //   const colors = [carrot, emerald, peterRiver, wisteria, alizarin, turquoise, midnightBlue];

  //   avatarColor = colors[sumChars % colors.length];
  //   return { avatarName: avatarName, avatarColor: avatarColor }
  // }

  renderAvatar(props) {
    // console.log("AVATAR_PROPS:" + JSON.stringify(props))
    return (
      <View>
        <View>{this.renderInitials()}</View>
        <TouchableOpacity
          onPress={() => {}}
          style={[styles.avatarStyle, {backgroundColor: Constants.green}]}>
          {this.renderInitials()}
        </TouchableOpacity>
      </View>
    );
    // return (<Avatar {...props} wrapperStyle={{
    //   left: {
    //     backgroundColor: '#f0f0f0'
    //   }
    // }} />);
  }

  render() {
    const {
      get_patient,
      follow_up_status,
      is_patient_added,
    } = this.props.route.params.item;
    // const { isArchived } = this.props.route.params.isArchived

    const No_Appointment_Requested = (
      <TouchableOpacity
        onPress={() => this.proposeAppoinment()}
        style={styles.viewCan}>
        {/* <Text allowFontScaling={false} style={styles.textStyle}>No Appointment Requested</Text>
      <Text allowFontScaling={false} style={styles.textStyle}>Propose Time</Text> */}
        <Image source={otherCalendar} style={styles.optionsImageStyle} />
      </TouchableOpacity>
    );

    const Appointment_Requested = (
      <TouchableOpacity
        onPress={() => this.changeProposeAppoinment()}
        style={styles.viewCan}>
        {/* <Text allowFontScaling={false} style={styles.textStyle}>Appointment Requested</Text>
      <Text allowFontScaling={false} onPress={() => this._showDatePicker()} style={styles.textStyle}>Propose Time</Text> */}
        <Image source={requestCalendar} style={styles.optionsImageStyle} />
      </TouchableOpacity>
    );

    const Appointement_Proposed_for = (
      <TouchableOpacity
        onPress={() => this._showDatePicker()}
        style={styles.viewCan}>
        {/* <Text allowFontScaling={false} style={styles.textStyle}>Appointement Proposed for</Text>
      <Text allowFontScaling={false} style={styles.textStyle}>{this.state.aptime}</Text>
      <Text allowFontScaling={false} onPress={() => this._showDatePicker()} style={styles.textStyle}>click to update</Text> */}
        <Image source={requestmadeCalendar} style={styles.optionsImageStyle} />
      </TouchableOpacity>
    );
    const Appointment_Cancelled = (
      <TouchableOpacity
        onPress={() => this.setState({showModal: true})}
        style={styles.viewCan}>
        <Image source={cancelCalendar} style={styles.optionsImageStyle} />
      </TouchableOpacity>
    );

    const Appointment_Confirmed = (
      <TouchableOpacity
        style={styles.viewCan}
        onPress={() => {
          Alert.alert(
            'Appointment confirmed',
            'Appointment is confirmed at ' + this.state.aptime,
            [
              {
                text: 'OK',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
            ],
            {cancelable: false},
          );
        }}>
        {/* <Text allowFontScaling={false} style={styles.textStyle}>Appointment Confirmed</Text>
      <Text allowFontScaling={false} style={styles.textStyle}>{this.state.aptime}</Text> */}
        <Image source={appointmentCalendar} style={styles.optionsImageStyle} />
      </TouchableOpacity>
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
      <View style={{backgroundColor: 'white', flex: 1}}>
        <View>
          <Spinner
            overlayColor={'rgba(0, 0, 0, 0.75)'}
            color={'#08a1d9'}
            textContent={'Updating'}
            visible={this.state.visible}
            textStyle={{color: '#fff', fontSize: 15, marginTop: -70}}
          />
        </View>
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          options={[
            this.state.isArchived ? 'Un-Archive' : 'Archive',
            this.state.isFollowUp ? 'Un-Follow' : 'Follow-Up',
            this.state.isPatientAdded ? '- Client List' : '+ Client List',
            'Write Review',
            'Lost Messages?',
            'Cancel',
          ]}
          cancelButtonIndex={5}
          destructiveButtonIndex={4}
          onPress={index => {
            this.onBottomSheetClicked(index);
          }}
        />

        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: 1,
          }}
        />
        <View style={styles.viewBottom}>
          <View style={styles.viewBottomLeft}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate(
                  'DentistPostDetails',
                  this.props.route.params.item,
                )
              }
              style={styles.viewCan}>
              <Image source={script} style={styles.optionsImageStyle} />
            </TouchableOpacity>
            <TextSemiBold
              title={'View Post'}
              textStyle={Styles.chatWindowInfo}></TextSemiBold>
          </View>
          <View style={styles.viewBottomLeft}>
            <TouchableOpacity
              onPress={() =>
                this.createVideoMeeting(this.props.route.params.item)
              }
              style={styles.viewCan}>
              <Image
                source={Images.ImgVideoCall}
                style={styles.optionsImageStyle}
              />
            </TouchableOpacity>
            <TextSemiBold
              title={'Video Consult'}
              textStyle={Styles.chatWindowInfo}></TextSemiBold>
          </View>

          <View style={styles.viewBottomLeft}>
            {cos_view}
            <TextSemiBold
              title={'Appointment'}
              textStyle={Styles.chatWindowInfo}></TextSemiBold>
          </View>

          <View
            style={[
              styles.viewBottomLeft,
              {width: '10%', alignItems: 'center'},
            ]}>
            <TouchableOpacity
              style={{width: 30, height: 30, alignItems: 'center'}}
              onPress={this.showActionSheet}>
              <Image
                style={{width: 25, height: 25}}
                source={Images.ImgMenuRoundVertical}></Image>
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showModal}>
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
                height: 100,
                backgroundColor: 'white',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}>
              <Button
                title="Re-enable"
                onPress={() => this.mAppointmentReEnabled()}
                textStyle={{fontSize: 15}}
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
        </Modal>
        <Toast ref="toast" position={'top'} />
        <Toast ref="toastTop" positionValue={200} position={'top'} />
        <KeyboardAvoidingView style={{flex: 1}}>
          <View style={{flex: 1}}>
            <GiftedChat
              messages={this.state.messages}
              showUserAvatar={true}
              onSend={this.onSend}
              user={{
                _id: 1,
              }}
              renderActions={this.renderCustomActions}
              onPressAvatar={user => {
                this.refs.toastTop.show(user.name);
              }}
            />
          </View>
        </KeyboardAvoidingView>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewBottomLeft: {
    height: 80,
    width: '30%',
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
    marginTop: 10,
    backgroundColor: 'black',
    borderWidth: 1,
    borderRadius: 20,
    borderColor: constants.baseColor,
    backgroundColor: constants.baseColor,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '2%',
    // marginBottom: 10
  },
  viewCon: {
    marginTop: 10,
    backgroundColor: 'black',
    borderWidth: 1,
    borderRadius: 30,
    borderColor: constants.baseColor,
    backgroundColor: constants.baseColor,
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '2%',
    // marginBottom: 10
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
  avatarStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarTextStyle: {
    color: '#FFFFFF',
    fontSize: 16,
    backgroundColor: 'transparent',
    fontWeight: '100',
  },
  optionsImageStyle: {
    width: '50%',
    height: '50%',
    resizeMode: 'contain',
  },
});
