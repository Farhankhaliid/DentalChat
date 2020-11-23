/* eslint-disable react-native/no-inline-styles */
/* @flow */

import React, {Component} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import {FormLabel, FormInput, Avatar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import ImageZoom from 'react-native-image-pan-zoom';
import moment from 'moment';
import PropTypes from 'prop-types';
import constants from './../constants/constants';
import SInfo from 'react-native-sensitive-info';
import Spinner from 'react-native-loading-spinner-overlay';
import ImageZoomComponent from '../components/ImageZoom';
import {getDateTimeFromMillis} from '../utils/GlobalFunctions';

export default class DentistPostDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      token: '',
      postId: '',
      loaderVisibility: false,
      appointmentTime: '',
      appointmentCheck: 0,
      insurance: '',
      insuranceDetails: '',
    };
  }

  static navigationOptions = ({navigation}) => ({
    title: 'Post Details',
    tabBarVisible: false,
    headerTintColor: '#ffffff',
    headerStyle: {
      backgroundColor: constants.baseColor,
    },
    headerLeft: (
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <View style={{flexDirection: 'row'}}>
          <Icon
            style={{marginLeft: 15}}
            name="angle-left"
            size={30}
            color={'#ffffff'}
          />
          <Text
            style={{
              fontSize: 15,
              marginTop: 7,
              marginLeft: 5,
              fontWeight: '500',
              color: '#ffffff',
            }}
            allowFontScaling={false}>
            Back
          </Text>
        </View>
      </TouchableOpacity>
    ),
  });

  componentDidMount() {
    const data = this.props.route.params;
    console.log('data', data);

    SInfo.getItem('token', {
      sharedPreferencesName: 'mySharedPrefs',
      keychainService: 'myKeychain',
    }).then(value => {
      console.log('time to fetch token');
      this.setState({postId: data.post_id}, () => {
        this.visibleLoader();
      });
      this.setState({token: value}, () => {
        this.getPostDetails();
      });
    });
  }
  visibleLoader = () => {
    console.log('we are here');
    this.setState({loaderVisibility: !this.state.loaderVisibility});
  };
  getPostDetails = () => {
    fetch(constants.url + 'get-patient-post-details', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post_id: this.state.postId,
        auth_token: this.state.token,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('responseJson', responseJson);
        this.visibleLoader();
        console.log(responseJson);
        this.setState({
          appointmentTime: responseJson.patient_post_detls.appointment_datetime,
          insurance: responseJson.patient_post_detls.insurance,
          insuranceDetails:
            responseJson.patient_post_detls.insurance_information,

          appointmentCheck: responseJson.patient_post_detls.appointment_datetime
            ? 1
            : 0,
        });
      })
      .catch(error => {
        mThis.setState({
          rady: true,
          visible: false,
        });
        // mThis.mFailed();
        Alert.alert('Failed', error);
      });
  };
  setModalVisible(image) {
    this.imageZoomComponent
      .show({
        image: image,
      })
      .then(() => {});

    // this.setState({ modalVisible: visible });
  }
  render() {
    //const { get_patient, get_attachments, description, emergency, post_title, pain_level, current_location, posted_date } = this.props.route.params;
    // console.log("<><><><>#  "+get_attachments[0].file_name)
    // const data = this.props.route.params
    // console.log(data)
    const {
      get_patient,
      get_attachments,
      description,
      emergency,
      post_title,
      pain_level,
      current_location,
      posted_date,
      appointment,
      appointment_time,
      post_id,
      src_syst,
    } = this.props.route.params;
    console.log(
      description,
      emergency,
      post_title,
      pain_level,
      current_location,
      posted_date,
    );
    return (
      <View style={styles.container}>
        {this.state.loaderVisibility == true ? (
          <Spinner
            overlayColor={'rgba(0, 0, 0, 0.75)'}
            color={'#08a1d9'}
            textContent={'Updating'}
            visible={this.state.loaderVisibility}
            textStyle={{color: '#fff', fontSize: 15, marginTop: -70}}
          />
        ) : (
          <View></View>
        )}
        <ImageZoomComponent
          ref={imageZoomComponent =>
            (this.imageZoomComponent = imageZoomComponent)
          }
        />
        <ScrollView keyboardShouldPersistTaps="never">
          <View style={{backgroundColor: '#ffffff'}}>
            <View style={{height: 40, width: '100%', alignItems: 'center'}}>
              <Text
                allowFontScaling={false}
                style={{
                  marginTop: 20,
                  fontSize: 14,
                  color: '#000000',
                  fontWeight: '400',
                }}>
                {' '}
                Posted by {get_patient.name}{' '}
                {moment(
                  posted_date.toString().includes('/')
                    ? posted_date
                    : posted_date * 1000,
                ).fromNow()}
              </Text>
            </View>

            <View style={styles.editViewNext}>
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
                    fontSize: 16,
                    color: constants.baseColor,
                    fontWeight: '600',
                  }}>
                  Post Title
                </Text>
              </View>
              <View style={styles.searchSection}>
                <Text
                  allowFontScaling={false}
                  numberOfLines={4}
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    fontSize: 17,
                    fontWeight: '500',
                  }}>
                  {post_title}
                </Text>
              </View>
              <View
                style={{
                  marginLeft: 10,
                  borderWidth: 0.5,
                  marginTop: 10,
                  borderColor: '#cccccc',
                  marginRight: 10,
                }}></View>
            </View>

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
                    fontSize: 16,
                    color: constants.baseColor,
                    fontWeight: '600',
                  }}>
                  Current Location
                </Text>
              </View>
              <View style={styles.searchSection}>
                <Text
                  allowFontScaling={false}
                  numberOfLines={4}
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    fontSize: 17,
                    fontWeight: '500',
                  }}>
                  {current_location}
                </Text>
              </View>
              <View
                style={{
                  marginLeft: 10,
                  borderWidth: 0.5,
                  marginTop: 10,
                  borderColor: '#cccccc',
                  marginRight: 10,
                }}></View>
            </View>

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
                    fontSize: 16,
                    color: constants.baseColor,
                    fontWeight: '600',
                  }}>
                  Emergency
                </Text>
              </View>
              <View style={styles.searchSection}>
                {emergency == 0 ? (
                  <Text
                    allowFontScaling={false}
                    numberOfLines={1}
                    style={{
                      marginLeft: 20,
                      marginRight: 20,
                      fontSize: 17,
                      fontWeight: '500',
                    }}>
                    No
                  </Text>
                ) : (
                  <Text
                    allowFontScaling={false}
                    numberOfLines={1}
                    style={{
                      marginLeft: 20,
                      marginRight: 20,
                      fontSize: 17,
                      fontWeight: '500',
                    }}>
                    Yes
                  </Text>
                )}
              </View>
              <View
                style={{
                  marginLeft: 10,
                  borderWidth: 0.5,
                  marginTop: 10,
                  borderColor: '#cccccc',
                  marginRight: 10,
                }}></View>
            </View>

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
                    fontSize: 16,
                    color: constants.baseColor,
                    fontWeight: '600',
                  }}>
                  Pain Level
                </Text>
              </View>
              <View style={styles.searchSection}>
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    fontSize: 17,
                    fontWeight: '500',
                  }}>
                  {pain_level}
                </Text>
              </View>
              <View
                style={{
                  marginLeft: 10,
                  borderWidth: 0.5,
                  marginTop: 10,
                  borderColor: '#cccccc',
                  marginRight: 10,
                }}></View>
            </View>
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
                    fontSize: 16,
                    color: constants.baseColor,
                    fontWeight: '600',
                  }}>
                  Appointment Request
                </Text>
              </View>
              <View style={styles.searchSection}>
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    fontSize: 17,
                    fontWeight: '500',
                  }}>
                  {appointment == 1 || this.state.appointmentCheck == 1
                    ? 'Yes'
                    : 'No'}
                </Text>
              </View>
              <View
                style={{
                  marginLeft: 10,
                  borderWidth: 0.5,
                  marginTop: 10,
                  borderColor: '#cccccc',
                  marginRight: 10,
                }}></View>
            </View>
            {appointment == 1 || this.state.appointmentCheck == 1 ? (
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
                      fontSize: 16,
                      color: constants.baseColor,
                      fontWeight: '600',
                    }}>
                    Appointment Date & Time
                  </Text>
                </View>
                <View style={styles.searchSection}>
                  <Text
                    numberOfLines={1}
                    style={{
                      marginLeft: 20,
                      marginRight: 20,
                      fontSize: 17,
                      fontWeight: '500',
                    }}>
                    {this.state.appointmentTime}
                  </Text>
                </View>
                <View
                  style={{
                    marginLeft: 10,
                    borderWidth: 0.5,
                    marginTop: 10,
                    borderColor: '#cccccc',
                    marginRight: 10,
                  }}></View>
              </View>
            ) : null}
            {/* <View style={{ backgroundColor: '#fff', marginTop: 10, }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginTop: 5, marginBottom: 5 }}>
                <Text allowFontScaling={false} style={{ marginLeft: 20, fontSize: 16, color: constants.baseColor, fontWeight: '600' }}>Insurance</Text>
              </View>
              <View style={styles.searchSection}>
                <Text allowFontScaling={false} numberOfLines={6} style={{ marginLeft: 20, marginRight: 20, fontSize: 17, fontWeight: '500' }}>
                  {this.state.insurance == 1 ? 'Yes' : 'No'}</Text>
              </View>
              <View style={{ marginLeft: 10, borderWidth: 0.5, marginTop: 10, borderColor: '#cccccc', marginRight: 10 }}></View>
            </View> */}
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
                    fontSize: 16,
                    color: constants.baseColor,
                    fontWeight: '600',
                  }}>
                  Insurance Information
                </Text>
              </View>
              <View style={styles.searchSection}>
                <Text
                  allowFontScaling={false}
                  numberOfLines={6}
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    fontSize: 17,
                    fontWeight: '500',
                  }}>
                  {this.state.insurance == 1
                    ? this.state.insuranceDetails
                    : 'No Details Present'}
                </Text>
              </View>
              <View
                style={{
                  marginLeft: 10,
                  borderWidth: 0.5,
                  marginTop: 10,
                  borderColor: '#cccccc',
                  marginRight: 10,
                }}></View>
            </View>
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
                    fontSize: 16,
                    color: constants.baseColor,
                    fontWeight: '600',
                  }}>
                  Description
                </Text>
              </View>
              <View style={styles.searchSection}>
                <Text
                  allowFontScaling={false}
                  numberOfLines={6}
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    fontSize: 17,
                    fontWeight: '500',
                  }}>
                  {description}
                </Text>
              </View>
              <View
                style={{
                  marginLeft: 10,
                  borderWidth: 0.5,
                  marginTop: 10,
                  borderColor: '#cccccc',
                  marginRight: 10,
                }}></View>
            </View>
            {src_syst.includes('dentalchat.com') ? (
              <View></View>
            ) : (
              <View style={{backgroundColor: '#fff', marginTop: 10}}>
                <Text
                  allowFontScaling={false}
                  style={{
                    marginLeft: 20,
                    fontSize: 16,
                    color: constants.baseColor,
                    fontWeight: '600',
                  }}>
                  Patient Contact Information
                </Text>
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
                      fontSize: 16,
                      color: constants.baseColor,
                      fontWeight: '600',
                    }}>
                    Email
                  </Text>
                </View>
                <View style={styles.searchSection}>
                  <Text
                    numberOfLines={1}
                    style={{
                      marginLeft: 20,
                      marginRight: 20,
                      fontSize: 17,
                      fontWeight: '500',
                    }}>
                    {get_patient.email}
                  </Text>
                </View>
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
                      fontSize: 16,
                      color: constants.baseColor,
                      fontWeight: '600',
                    }}>
                    Contact Number
                  </Text>
                </View>
                <View style={styles.searchSection}>
                  <Text
                    numberOfLines={1}
                    style={{
                      marginLeft: 20,
                      marginRight: 20,
                      fontSize: 17,
                      fontWeight: '500',
                    }}>
                    {get_patient.contact}
                  </Text>
                </View>
                <View
                  style={{
                    marginLeft: 10,
                    borderWidth: 0.5,
                    marginTop: 10,
                    borderColor: '#cccccc',
                    marginRight: 10,
                  }}></View>
              </View>
            )}

            <View style={{flexDirection: 'row'}}>
              {get_attachments.map((item, index) => (
                <TouchableHighlight
                  style={{flexDirection: 'row', marginLeft: 10, marginTop: 10}}
                  onPress={() => {
                    // this.setState({ selectUri: get_attachments[index].file_name })
                    this.setModalVisible({
                      uri:
                        constants.imageUrl +
                        'uploads/patient_post_attachments/' +
                        get_attachments[index].file_name,
                    });
                  }}>
                  <Image
                    style={{width: 50, height: 50}}
                    source={{
                      uri:
                        constants.imageUrl +
                        'uploads/patient_post_attachments/' +
                        get_attachments[index].file_name,
                    }}
                  />
                </TouchableHighlight>
              ))}
            </View>
            {get_attachments.length == 0 ? (
              <View></View>
            ) : (
              <View
                style={{
                  marginLeft: 20,
                  borderWidth: 0.5,
                  marginTop: 10,
                  borderColor: '#cccccc',
                }}></View>
            )}
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
                    fontSize: 16,
                    color: constants.baseColor,
                    fontWeight: '600',
                  }}>
                  Request #:
                </Text>
              </View>
              <View style={styles.searchSection}>
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    fontSize: 17,
                    fontWeight: '500',
                  }}>
                  {post_id}
                </Text>
              </View>
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
                    fontSize: 16,
                    color: constants.baseColor,
                    fontWeight: '600',
                  }}>
                  Source :{' '}
                </Text>
              </View>
              <View style={styles.searchSection}>
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    fontSize: 17,
                    fontWeight: '500',
                  }}>
                  {src_syst}
                </Text>
              </View>
              <View
                style={{
                  marginLeft: 10,
                  borderWidth: 0.5,
                  marginTop: 10,
                  borderColor: '#cccccc',
                  marginRight: 10,
                }}></View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchIcon: {
    marginLeft: 20,
  },
  textInputStyle: {
    width: '100%',
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
    width: '100%',
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
