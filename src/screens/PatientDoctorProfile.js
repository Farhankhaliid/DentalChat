/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Alert,
  Modal
} from 'react-native';
import ImageBubble from '../components/ImageBubbleDocterImg';
import StarRating from 'react-native-star-rating';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Button from '../components/Button';
import Spinner from 'react-native-loading-spinner-overlay';
import PropTypes from 'prop-types';
import constants from './../constants/constants'
import SInfo from 'react-native-sensitive-info';
export default class PatientDoctorProfile extends Component {
  static navigationOptions = ({ navigation ,route}) => ({
    title: route.params.chat_history_arr.get_doctor.first_name + ' ' +route.params.chat_history_arr.get_doctor.last_name,
    tabBarVisible: false,
    headerTintColor: '#ffffff',
    headerStyle: {
      backgroundColor: constants.baseColor
    },
    headerLeft: <TouchableOpacity onPress={() => navigation.goBack()} >
      <View style={{ flexDirection: 'row' }}>
        <Icon style={{ marginLeft: 15 }} name='angle-left' size={30} color={'#ffffff'} />
        <Text allowFontScaling={false} style={{ fontSize: 15, marginTop: 7, marginLeft: 5, fontWeight: '500', color: '#ffffff' }}>Back</Text>
      </View>
    </TouchableOpacity>
  });
  constructor(props) {
    super(props);
    this.state = {
      customStarCount: 0,
      visible: true,
      doctorId: '',
      patientId: '',
      postId: '',
      doctorFirstName: '',
      doctorLastName: '',
      doctorProfilePic: '',
      doctorAddress: '',
      txtReview: '',
      avgRating: 0,
      reviewCount: 0,
      iconStatus: 0,
      reviews: [],
      modalVisible: false,
      token: ''
    };
  }
  componentDidMount() {
    const { post_id, patient_id, current_location, chat_history_arr } = this.props.route.params;
    this.setState({
      postId: post_id,
      patientId: patient_id,
      doctorAddress: chat_history_arr.doctor_clinic.address,
      iconStatus: chat_history_arr.is_favourite

    });
    SInfo.getItem('token', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      console.log('time to fetch token')
      console.log(value)
      this.setState({ token: value, }, () => {
        console.log(chat_history_arr.get_doctor.doctor_id)
        this.mListDoctorDetails(chat_history_arr.get_doctor.doctor_id);
      })
    });

  }
  modalVisibility = () => {
    this.setState({ modalVisible: !this.state.modalVisible })
  }
  mListDoctorDetails(id) {
    var mThis = this;
    var rawData = [];
    var data = new FormData();
    data.append("auth_token", 'z7NHOmfvqRPAoKM');
    data.append("doctor_id", id);
    console.log(data)
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        mThis.mLoaderShowHide();
        if (this.responseText.indexOf('status') !== -1) {
          var text = this.responseText;
          console.log('<><><>abc' + this.responseText);
          var obj = JSON.parse(text);
          console.log(obj)
          for (i in obj.doctor_details) {
            mThis.setState({
              doctorId: obj.doctor_details[i].doctor_id,
              doctorFirstName: obj.doctor_details[i].first_name,
              doctorLastName: obj.doctor_details[i].last_name,
              doctorProfilePic: obj.doctor_details[i].profile_pics,
              avgRating: obj.doctor_avg_rating,
              reviewCount: obj.doctor_review_ratings.length,
            });
          }
          for (i in obj.doctor_review_ratings) {
            rawData.push(
              <View style={{ flex: 1 }}>
                <TouchableOpacity style={{ backgroundColor: 'white', height: 60, flexDirection: 'row', justifyContent: 'space-between', padding: 8 }} activeOpacity={0.7}>
                  <View style={{ flex: 18 }} >
                    <ImageBubble
                      image={obj.doctor_review_ratings[i].get_patient_details.image}
                      firstName={obj.doctor_review_ratings[i].get_patient_details.name}
                      lastName={obj.doctor_review_ratings[i].get_patient_details.last_name}
                      size={50} />
                  </View>
                  <View style={{ flex: 55, justifyContent: 'space-between', backgroundColor: 'white', paddingLeft: 5 }}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', }}>
                        <Text allowFontScaling={false} numberOfLines={1} style={{ fontSize: 18, fontWeight: 'bold', marginRight: 5 }}>
                          {obj.doctor_review_ratings[i].get_patient_details.name + " " + obj.doctor_review_ratings[i].get_patient_details.last_name}
                        </Text>
                      </View>
                      <View style={{ marginTop: 5, flexDirection: 'row', }}>
                        <Text allowFontScaling={false} numberOfLines={2} style={styles.postTextStyle}>
                          {obj.doctor_review_ratings[i].review}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )
          }
          mThis.setState({
            reviews: rawData
          });

        }
        else if (this.responseText.indexOf('status') == 5) {
          SInfo.setItem('is_patient_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('is_dentist_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          this.props.navigation.navigate('Home')
        } else {
          mThis.mFailed();
        }
      }
    });
    xhr.open("POST", constants.url + 'list-doctor-details');
    xhr.send(data);
  }
  mFailed() {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        Alert.alert('Failed', 'The Internet connection appears to be offline');
      }, 200);
    });
  }
  mSuccess(msg) {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        Alert.alert('Success', msg);
      }, 200);
    });
  }
  onCustomStarRatingPress(rating) {
    this.setState({
      customStarCount: rating,
    });
  }
  mLoaderShowHide() {
    this.setState({
      visible: !this.state.visible
    });
  };
  mValidation() {
    if (this.state.customStarCount <= 0) {
      Alert.alert('Please add rating first.')
      return false;
    } else if (this.state.txtReview.length <= 0) {
      Alert.alert('Please add review first.')
      return false;
    }
    this.modalVisibility()
    this.mLoaderShowHide();
    this.mSaveReviewRatingForDoctors();
  }
  mSaveReviewRatingForDoctors() {
    this.mLoaderShowHide();
    var mThis = this;
    var data = new FormData();
    data.append("patient_id", this.state.patientId);
    data.append("doctor_id", this.state.doctorId);
    data.append("post_id", this.state.postId);
    data.append("rating", this.state.customStarCount);
    data.append("review", this.state.txtReview);
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
  mNetworkFailed() {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        Alert.alert('Failed', 'The Internet connection appears to be offline');
      }, 200);
    });
  }
  mAppointmentRequest() {
    this.mLoaderShowHide();
    var mThis = this;
    var data = new FormData();
    data.append("auth_token", this.state.token);
    data.append("patient_id", this.state.patientId);
    data.append("doctor_id", this.state.doctorId);
    data.append("post_id", this.state.postId);
    data.append("is_appoitment", "1");
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        mThis.mLoaderShowHide();
        if (this.responseText.indexOf('status') !== -1) {
          var text = this.responseText;
          console.log('<><><>abc' + this.responseText);
          var obj = JSON.parse(text);
          mThis.mSuccess('Your request appointment submitted');
        } else {
          mThis.mNetworkFailed();
        }
      }
    });
    xhr.open("POST", constants.url + 'set-appointment-patient');
    xhr.send(data);
  }
  myFavorite = () => {
    if (this.state.iconStatus == 0) {
      this.setState({
        iconStatus: 1,
      });
      this.mMarkFavouriteDoctors('Doctor has been marked favourite successfully.');
    } else {
      this.setState({
        iconStatus: 0,
      });
      this.mMarkFavouriteDoctors('Doctor removed from favourite list successfully.');
    }
  }
  mMarkFavouriteDoctors(msg) {
    this.mLoaderShowHide();
    var mThis = this;
    var data = new FormData();
    data.append("auth_token", this.state.token);
    data.append("patient_id", this.state.patientId);
    data.append("doctor_id", this.state.doctorId);
    data.append("is_favourite", this.state.iconStatus);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        mThis.mLoaderShowHide();
        if (this.responseText.indexOf('status') !== -1) {
          var text = this.responseText;
          console.log('<><><>abc' + this.responseText);
          var obj = JSON.parse(text);
          mThis.mSuccess(msg);
        } else {
          mThis.mNetworkFailed();
        }
      }
    });
    xhr.open("POST", constants.url + 'mark-favourite-doctors');
    xhr.send(data);
  }


  render() {
    return (
      <View style={styles.container}>
        <View>
          <Spinner overlayColor={'rgba(0, 0, 0, 0.75)'} color={'#08a1d9'} textContent={"Updating"} visible={this.state.visible} textStyle={{ color: '#fff', fontSize: 15, marginTop: -70 }} />
        </View>
        <ScrollView style={{ marginTop: 10 }} >
          <View style={{ height: 220, flex: 1, marginTop: 30 }} >
            <View style={styles.navBar}>
              <View style={styles.leftContainer}>
              </View>
              <ImageBubble
                style={{ alignSelf: "center" }}
                image={this.state.doctorProfilePic}
                firstName={this.state.doctorFirstName}
                lastName={this.state.doctorLastName}
                size={90} />
              <View style={styles.rightContainer}>
                <TouchableOpacity onPress={this.myFavorite} style={{ marginRight: 30 }}>
                  {this.state.iconStatus === 1 ? <Icon name='heart' size={40} color={'#ff0000'} /> : <Icon name='heart-o' size={40} color={'#ff0000'} />}
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.viewTopTwo}>
              <Text allowFontScaling={false} numberOfLines={2} style={styles.textTitle}>{this.state.doctorFirstName + " " + this.state.doctorLastName}</Text>
            </View>
            <View style={styles.viewSubTopTwo}>
              <Text allowFontScaling={false} numberOfLines={2} style={styles.textSubTitle}>
                Dentist
          </Text>
            </View>
            <View style={styles.viewSubTopTwo}>
              <StarRating
                disabled={false}
                maxStars={5}
                starSize={30}
                starColor={'#FF4500'}
                rating={this.state.avgRating} />
            </View>
            <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
              <Text allowFontScaling={false} numberOfLines={2} style={styles.subTitle}>
                {this.state.avgRating + " Rating | " + this.state.reviewCount + " Reviews"}
              </Text>
            </View>
            <View style={styles.viewSubTopTwo}>
              <Icon style={{ marginRight: 5 }} name="map-marker" size={15} color="#afb1b2" />
              <Text allowFontScaling={false} numberOfLines={2} style={styles.subTitle}>
                {this.state.doctorAddress}
              </Text>
            </View>
          </View>

          <View>
            <View style={{ backgroundColor: '#fff', marginTop: 1, }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginTop: 5, marginBottom: 5 }}>
                <Text allowFontScaling={false} style={{ marginLeft: 20, fontSize: 16, color: constants.baseColor, fontWeight: '600' }}>Education</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', }}>
                <TextInput
                  allowFontScaling={false}
                  editable={false}
                  keyboardType='default'
                  placeholder='not added'
                  style={{ width: "90%", marginLeft: 20, marginRight: 20, fontSize: 17, fontWeight: '500' }} />
              </View>
              <View style={{ marginLeft: 20, borderWidth: 0.5, marginTop: 10, borderColor: '#cccccc', }}></View>
            </View>
            <View style={{ backgroundColor: '#fff', marginTop: 1, }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginTop: 5, marginBottom: 5 }}>
                <Text allowFontScaling={false} style={{ marginLeft: 20, fontSize: 16, color: constants.baseColor, fontWeight: '600' }}>Language Spoken</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', }}>
                <TextInput
                  allowFontScaling={false}
                  editable={false}
                  keyboardType='default'
                  placeholder='not added'
                  style={{ width: "90%", marginLeft: 20, marginRight: 20, fontSize: 17, fontWeight: '500' }} />
              </View>
              <View style={{ marginLeft: 20, borderWidth: 0.5, marginTop: 10, borderColor: '#cccccc', }}></View>
            </View>
            <View style={{ backgroundColor: '#fff', marginTop: 1, }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginTop: 5, marginBottom: 5 }}>
                <Text allowFontScaling={false} style={{ marginLeft: 20, fontSize: 16, color: constants.baseColor, fontWeight: '600' }}>Specialities</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', }}>
                <TextInput
                  allowFontScaling={false}
                  editable={false}
                  keyboardType='default'
                  placeholder='not added'
                  style={{ width: "90%", marginLeft: 20, marginRight: 20, fontSize: 17, fontWeight: '500' }} />
              </View>
              <View style={{ marginLeft: 20, borderWidth: 0.5, marginTop: 10, borderColor: '#cccccc', }}></View>
            </View>
            <View style={{ backgroundColor: '#fff', marginTop: 1, }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginTop: 5, marginBottom: 5 }}>
                <Text allowFontScaling={false} style={{ marginLeft: 20, fontSize: 16, color: constants.baseColor, fontWeight: '600' }}>Professional Statement</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', }}>
                <TextInput
                  allowFontScaling={false}
                  editable={false}
                  keyboardType='default'
                  placeholder='not added'
                  style={{ width: "90%", marginLeft: 20, marginRight: 20, fontSize: 17, fontWeight: '500' }} />
              </View>
              <View style={{ marginLeft: 20, borderWidth: 0.5, marginTop: 10, borderColor: '#cccccc', }}></View>
            </View>
            <View style={{ backgroundColor: '#fff', marginTop: 1, }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginTop: 5, marginBottom: 5 }}>
                <Text allowFontScaling={false} style={{ marginLeft: 20, fontSize: 16, color: constants.baseColor, fontWeight: '600' }}>In Network Insurance</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', }}>
                <TextInput
                  allowFontScaling={false}
                  editable={false}
                  keyboardType='default'
                  placeholder='not added'
                  style={{ width: "90%", marginLeft: 20, marginRight: 20, fontSize: 17, fontWeight: '500' }} />
              </View>
              <View style={{ marginLeft: 20, borderWidth: 0.5, marginTop: 10, borderColor: '#cccccc', }}></View>
            </View>
            <View style={styles.viewBottom}>
              <View style={styles.viewBottomLeft}>
                <Button onPress={() => this.mAppointmentRequest()} name='Request Appointment' buttonType='profileBtn' />
              </View>
              <View style={styles.viewBottomLeft}>
                <Button onPress={() => this.modalVisibility()} name='Write Review' buttonType='profileBtn' />
              </View>
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
                <View style={{ width: '90%', backgroundColor: 'white' }}>
                  <View style={{ justifyContent: 'center', backgroundColor: '#fff', marginTop: 20, alignItems: 'center' }}>
                    <Text allowFontScaling={false} style={{ fontSize: 22, color: constants.baseColor, fontWeight: '600' }}>Add Review</Text>
                  </View>
                  <View style={{ justifyContent: 'center', backgroundColor: '#fff', marginTop: 10, alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#fff', marginTop: 5, marginBottom: 5 }}>
                      <StarRating
                        disabled={false}
                        maxStars={5}
                        rating={this.state.customStarCount}
                        selectedStar={(rating) => this.onCustomStarRatingPress(rating)}
                        starColor={'#FF4500'}
                      />
                    </View>
                  </View>
                  <View style={{ backgroundColor: '#fff', marginTop: 10, }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', }}>
                      <TextInput
                        allowFontScaling={false}
                        keyboardType='default'
                        placeholder='Your Feedback'
                        style={{ width: "75%", marginLeft: 20, marginRight: 20, fontSize: 17, fontWeight: '500' }}
                        onChangeText={(text) => this.setState({ txtReview: text })} />
                      <TouchableOpacity onPress={() => this.mValidation()}>
                        <Icon style={{ marginRight: 20 }} name='play' size={40} color={constants.baseColor} />
                      </TouchableOpacity>

                    </View>
                    <View style={{ width: "75%", marginLeft: 20, borderWidth: 0.5, marginTop: 5, borderColor: constants.baseColor, }}></View>
                  </View>

                </View>
              </View>
            </Modal>
            <View style={{ justifyContent: 'center', backgroundColor: '#fff', marginTop: 20, alignItems: 'center' }}>
              <Text allowFontScaling={false} style={{ fontSize: 22, color: constants.baseColor, fontWeight: '600' }}>Reviews</Text>
            </View>
            <View style={{ backgroundColor: '#fff', }}>
              {this.state.reviews}
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
    backgroundColor: '#ffffff'
  },
  navBar: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  viewTop: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  viewTopLeft: {
    flex: 1,
    flexDirection: 'row'
  },
  viewTopRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  viewTopTwo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewSubTopTwo: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewBottom: {
    marginTop: 5,
    flexDirection: 'row',
    height: 75
  },
  viewBottomLeft: {
    width: "50%",
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewBottomRight: {
    width: "50%",
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewBottomCenter: {
    borderWidth: 0.5,
    height: 80,
    marginTop: 35,
    borderColor: '#afb1b2',
    justifyContent: 'center'
  },
  imgBottom: {
    width: 70,
    height: 70
  },
  textBottom: {
    fontSize: 15,
    fontWeight: '400',
    color: '#2293c0'
  },
  textTitle: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: '500',
    color: '#383838'
  },
  textSubTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#383838'
  },
  subTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#afb1b2'
  },
  textPostDate: {
    fontSize: 17,
    fontWeight: '400',
    color: '#afb1b2'
  },
  textDetail: {
    fontSize: 17,
    fontWeight: '400',
    color: '#2293c0'
  },
});
