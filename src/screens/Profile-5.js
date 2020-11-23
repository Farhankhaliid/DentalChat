import React, { Component } from 'react';
import { View, Image, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
// import Toast from 'react-native-simple-toast';
import { StatusBar, Header, GreyButton, ListHeader, ThemeButton, TextBold, TextMedium } from './../utils/Component';
import Styles from './../utils/Styles';
import Constants from './../utils/Constants';
import Images from './../utils/Images';
import Sizes from './../utils/Size';
import ImagePicker from "react-native-image-picker";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import SInfo from 'react-native-sensitive-info'
import Spinner from 'react-native-loading-spinner-overlay';
import constants from './../constants/constants'
import ImageZoomComponent from '../components/ImageZoom'

export default class ProfileScreen extends Component {
  static navigationOptions = {
    // title: 'Please sign in',
    header: null //hide the header
  };

  constructor(props) {
    super(props)
    var d = new Date();
    d.setDate(d.getDate() - 30);
    this.state = {
      degree: "",
      certificate: {
        uri: "",
        name: ""
      },
      fileUpdated: false,
      isFirstDateOpened: false,
      isLastDateOpened: false,
      start_date: d,
      end_date: d,
      profile_name: "",
      emp_name: "",
      location: "",
      visible: false,
      userProfileImg: '',
      avatarSource: '',
      firstName: '',
      lastName: '',
      contact: '',
      countryCode: '',
      gender: '',
      dentistId: '',
      dentistTokan: '',
      pic: [],
      imgOption: '1',
      email: '',
      dob: '',
      token: '',
      businessName: '',
      businessAddress: '',
      dentistEducation: [0, 1],
      dentistInsurance: [],
      dentistAward: [],
      dentistLicense: [{ license: "#sakjsakjska" }, { license: '#nosonodsnods' }],
      dentistExperieneceData: [],
      dateItemIndex: 0
    }
  }

  mLoaderShowHide() {
    this.setState({
      visible: !this.state.visible
    });
  };

  componentDidMount() {
    this.props.navigation.setParams({ handleSave: this.mValidation });
    SInfo.getItem('dentist_id', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      this.setState({ dentistId: value, })
    });
    SInfo.getItem('token', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      console.log('time to fetch token')
      this.setState({ token: value, })
    });
    SInfo.getItem('dentist_tokan', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      this.setState({ dentistTokan: value, })
      this.mEditProfile()
    });
  }


  mEditProfile() {
    var mThis = this;
    var data = new FormData();
    data.append("auth_token", this.state.token)
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        if (this.responseText.indexOf('status') !== -1) {

          var text = this.responseText;
          console.log(this.responseText);
          var obj = JSON.parse(text);
          console.log(obj)
          if (obj.status == 1) {

            obj.dentist_experience_data.forEach(element => {
              if (element.exp_photo == '') {
                pic = {
                  // uri: constants.imageUrl + 'uploads/exp_document/no_image.jpg',
                  // name: 'no_image.jpg'
                };
                element['pic'] = pic
                // element = { ...element, ...pic }
              } else {
                pic = {
                  uri: constants.imageUrl + 'uploads/exp_document/' + element.exp_photo,
                  name: element.org_exp ? element.org_exp : element.exp_photo
                };
                // element = { ...element, ...pic }
                element['pic'] = pic
              }

            });

            console.log("EXPERIENCE:" + JSON.stringify(obj.dentist_experience_data))

            mThis.setState({ dentistExperieneceData: obj.dentist_experience_data })
          }
          else {
          }
        } else {
          mThis.mNetworkFailed();
        }
      }
    });
    xhr.open("POST", constants.url + "service/dentistservice/dentist-step5");
    xhr.setRequestHeader("access-token", this.state.dentistTokan);
    xhr.send(data);
  }




  renderCustomActions() {

    const options = {
      rotation: 360,
      allowsEditing: true,
      noData: true,
      mediaType: "photo",
      maxWidth: 300,
      maxHeight: 300,
      storageOptions: {
        skipBackup: false
      }
    }
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };

        const myImg = {
          uri: response.uri,
          type: 'image/jpeg',
          name: 'dhsiushdishidsiuhdiuh',
        };
        this.setState({
          imgOption: '2',
          avatarSource: source,
          pic: myImg
        });
      }
    });

  }

  mFailed() {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        Alert.alert('Failed', 'Profile Updation failed');
      }, 200);
    });
  }

  mSuccess() {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        Alert.alert('Success', 'Profile Successfully \n Updated', [
          { text: 'Dismiss', onPress: () => { this.back() } },
        ], { cancelable: false });
      }, 200);
    });
  }

  back = () => {
    this.props.navigation.goBack();
  }


  mNetworkFailed() {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        Alert.alert('Failed', 'The Internet connection appears to be offline, Please try again');
      }, 200);
    });
  }

  showFirstDate = () => {
    this.setState({ isFirstDateOpened: true });
  };

  showLastDate = () => {
    this.setState({ isLastDateOpened: true });
  };

  hideDateTimePicker = () => {
    this.setState({
      isFirstDateOpened: false,
      isLastDateOpened: false
    })
  }

  getFirstDate = (date) => {
    let index = this.state.dateItemIndex
    let newArray = [...this.state.dentistExperieneceData];
    newArray[index] = { ...newArray[index], exp_from: moment(date).format("DD/MM/YYYY") }
    this.setState({
      dentistExperieneceData: newArray,
      isFirstDateOpened: false,
      isLastDateOpened: false
    }, () => {
      console.log("First date has been picked: ", date);
    });
    // this.setState({
    //   start_date: date, isFirstDateOpened: false,
    //   isLastDateOpened: false
    // }, () => {
    //   console.log("First date has been picked: ", date);
    // });
  }

  getLastDate = (date) => {
    let index = this.state.dateItemIndex
    let newArray = [...this.state.dentistExperieneceData];
    newArray[index] = { ...newArray[index], exp_to: moment(date).format("DD/MM/YYYY") }
    this.setState({
      dentistExperieneceData: newArray,
      isFirstDateOpened: false,
      isLastDateOpened: false
    }, () => {
      console.log("Last date has been picked: ", date);
    });
    // this.setState({
    //   end_date: date, isFirstDateOpened: false,
    //   isLastDateOpened: false
    // }, () => {
    //   console.log("Last date has been picked: ", date);
    // });
  }

  back = () => {
    this.props.navigation.goBack()
  }

  // save = () => {
  //   if (!this.state.profile_name || !this.state.profile_name.length) {
  //     Toast.showWithGravity("Please enter the profile", Toast.SHORT, Toast.BOTTOM)
  //   } else if (!this.state.emp_name || !this.state.emp_name.length) {
  //     Toast.showWithGravity("Please enter the employee name", Toast.SHORT, Toast.BOTTOM)
  //   } else if (!this.state.location || !this.state.location.length) {
  //     Toast.showWithGravity("Please enter the location", Toast.SHORT, Toast.BOTTOM)
  //   } else if (!this.state.start_date || !this.state.end_date) {
  //     Toast.showWithGravity("Please select the experience dates", Toast.SHORT, Toast.BOTTOM)
  //   } else if (this.state.start_date >= this.state.end_date) {
  //     Toast.showWithGravity("Invalid experience dates", Toast.SHORT, Toast.BOTTOM)
  //   } else if (!this.state.certificate.uri || !this.state.certificate.uri.length) {
  //     Toast.showWithGravity("Please upload your certificate", Toast.SHORT, Toast.BOTTOM)
  //   } else {
  //     alert("Saved");
  //   }
  // }
  save = () => {
    // this.mSuccess();
    this.mLoaderShowHide()
    this.mUpdateProfile()
  }

  mUpdateProfile = () => {
    var mThis = this;
    var data = new FormData();
    this.state.dentistExperieneceData.forEach(element => {
      console.log("INDEX:" + this.state.dentistExperieneceData.indexOf(element))
      // if (element.pic && element.pic.uri){
      data.append("documents[" + this.state.dentistExperieneceData.indexOf(element) + "]", element.pic && element.pic.uri ? element.pic : '');
      // }
    });
    data.append("documents[contains]:", function (e) { for (var n = 0; n < e.length; n)for (var i = this.length; i--;)if (this[i] === e[n]) return !0; return !1 })
    data.append("documentName", JSON.stringify(this.state.dentistExperieneceData));
    data.append("auth_token", this.state.token)
    console.log(data)
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      // console.log("PROFILE5_RES:" + JSON.stringify(xhr))
      if (this.readyState === 4) {
        console.log("RES:", this.responseText)
        if (this.responseText.indexOf('status') !== -1) {

          mThis.mLoaderShowHide();

          var text = this.responseText;
          console.log(this.responseText);
          var obj = JSON.parse(text);
          console.log(obj)
          if (obj.status == 1) {
            // SInfo.setItem('dentist_pic', responseJson.update_doc_details.docs_details.profile_pics, { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
            // console.log(responseJson)
            mThis.mSuccess();


          }
          else if (obj.status == 5) {
            SInfo.setItem('is_patient_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
            SInfo.setItem('is_dentist_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
            mThis.props.navigation.navigate('Home')
          } else {
            mThis.mFailed();
          }
        } else {
          mThis.mNetworkFailed();
          mThis.mLoaderShowHide();
        }
      } else {
        mThis.mLoaderShowHide();
      }
    });
    xhr.open("POST", constants.url + "service/dentistservice/update-dentist-profile-step5");
    xhr.setRequestHeader('content-type', 'multipart/form-data');
    xhr.setRequestHeader("access-token", this.state.dentistTokan);
    xhr.send(data);
  }


  addMore = () => {
    let length = this.state.dentistExperieneceData.length + 1
    let id = "moredoc" + length
    let item = { id: id }
    let newArray = [...this.state.dentistExperieneceData]
    newArray.push(item)
    // newArray[index] = { ...newArray[index], [key]: text }
    this.setState({ dentistExperieneceData: newArray });
  }

  delete = (index) => {
    let newArray = [...this.state.dentistExperieneceData]
    // newArray.pop(index)
    newArray.splice(index, 1)
    this.setState({ dentistExperieneceData: newArray });
  }


  showPicker(index) {
    // this.setState({ loading: true });
    const options = {
      rotation: 360,
      allowsEditing: true,
      noData: true,
      mediaType: "photo",
      maxWidth: 300,
      maxHeight: 300,
      storageOptions: {
        skipBackup: true
      }
    };
    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);
      // this.setState({ loading: false });
      if (response.didCancel) {
        //   console.log(JSON.stringify(source));
        console.warn('User cancelled image picker');
      } else if (response.error) {
        //  console.log(JSON.stringify(source));
        console.warn('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        //  console.log('User tapped custom button: ', response.customButton);
      } else {
        delete response.data;
        // user.picture = response.uri;
        let datas = response.uri.split("/");
        let name = datas[datas.length - 1];
        const source = { uri: response.uri, name: name };
        let newArray = this.state.dentistExperieneceData;
        newArray[index] = { ...newArray[index], pic: source, doc_file_name: source.name, org_exp: source.name }

        // newArray[index].certificate = source.name;
        this.setState({ dentistExperieneceData: newArray });
        // this.setState({ certificate: source, fileUpdated: true }, () => {
        //   console.log("Image captured");
        // });
        console.warn(source);
      }
    });
  }

  updateProfessionalExperience = (key, text, index) => {
    let newArray = [...this.state.dentistExperieneceData];
    newArray[index] = { ...newArray[index], [key]: text }
    this.setState({ dentistExperieneceData: newArray });
  }
  showLargeImage = (item) => {
    if (item.pic && item.pic.uri) {
      this.props.navigation.navigate('DisplayImage', item.pic)
    }
  }

  setModalVisible(item) {
    console.log("IMAGE:" + JSON.stringify(item))
    if (item && item.pic && item.pic.uri) {
      this.imageZoomComponent
        .show({
          image: item.pic
        })
        .then(() => {
        })
    }
  }

  render() {
    // console.log(this.props.navigation.state.routeName + " Screen");
    let { certificate, start_date, end_date } = this.state;
    return (
      <View style={Styles.screen}>
        <StatusBar />
        <Spinner overlayColor={'rgba(0, 0, 0, 0.75)'} color={'#08a1d9'} textContent={"Updating"} visible={this.state.visible} textStyle={{ color: '#fff', fontSize: 15, marginTop: -70 }}>
        </Spinner>
        <ImageZoomComponent ref={imageZoomComponent => (this.imageZoomComponent = imageZoomComponent)} />
        <Header title={"Edit Profile"} isbackButton={true} fireEvent={this.back} />
        <DateTimePicker isVisible={this.state.isFirstDateOpened}
          onConfirm={this.getFirstDate}
          onCancel={this.hideDateTimePicker}
          titleIOS={"Experience From"}
          maximumDate={new Date()}
          date={this.state.start_date}
        />
        <DateTimePicker isVisible={this.state.isLastDateOpened}
          onConfirm={this.getLastDate}
          onCancel={this.hideDateTimePicker}
          titleIOS={"Experience To"}
          maximumDate={new Date()}
          date={this.state.start_date}
        />

        <KeyboardAwareScrollView contentContainerStyle={Styles.container}>
          <ScrollView>
            <View style={Styles.container}>
              <ListHeader title="Professional Experience" />
              {this.state.dentistExperieneceData.map((item, index) => (
                <View style={[Styles.whiteBox, { marginBottom: 40 }]}>
                  <View style={Styles.inputView}>
                    <View style={Styles.inputIconView}>
                      <Image style={Styles.inputIcon} source={Images.ImgContact} />
                    </View>
                    <View style={Styles.innerInputView}>
                      <TextBold title={"Profile"} textStyle={{ fontSize: Sizes.regular }} />
                      <TextInput
                        placeholder="Enter Your Profile Here ....."
                        placeholderTextColor={Constants.black}
                        style={Styles.input}
                        value={item.prof_exp}
                        onChangeText={(text) => this.updateProfessionalExperience("prof_exp", text, index)}></TextInput>
                    </View>
                  </View>
                  <View style={Styles.inputView}>
                    <View style={Styles.inputIconView}>
                      <Image style={Styles.inputIcon} source={Images.ImgUser} />
                    </View>
                    <View style={Styles.innerInputView}>
                      <TextBold title={"Employee Name"} textStyle={{ fontSize: Sizes.regular }} />
                      <TextInput
                        placeholder="Enter Employee Name Here ....."
                        placeholderTextColor={Constants.black}
                        style={Styles.input}
                        value={item.dental_business}
                        onChangeText={(text) => this.updateProfessionalExperience("dental_business", text, index)}></TextInput>
                    </View>
                  </View>
                  <View style={Styles.inputView}>
                    <View style={Styles.inputIconView}>
                      <Image style={Styles.inputIcon} source={Images.ImgLocation} />
                    </View>
                    <View style={Styles.innerInputView}>
                      <TextBold title={"Location"} textStyle={{ fontSize: Sizes.regular }} />
                      <TextInput
                        placeholder="Enter Location Here ....."
                        placeholderTextColor={Constants.black}
                        style={Styles.input}
                        value={item.location}
                        onChangeText={(text) => this.updateProfessionalExperience("location", text, index)}></TextInput>
                    </View>
                  </View>
                  <TouchableOpacity style={Styles.inputView} onPress={() => this.setState({ isFirstDateOpened: true, dateItemIndex: index })}>
                    <View style={Styles.inputIconView}>
                      <Image style={Styles.inputIcon} source={Images.ImgCalendar} />
                    </View>
                    <View style={Styles.innerInputView}>
                      <TextBold title={"Experience From "} textStyle={{ fontSize: Sizes.regular }} />
                      <TextMedium title={item.exp_from} textStyle={[Styles.input, { marginTop: 10 }]}></TextMedium>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={Styles.inputView} onPress={() => this.setState({ isLastDateOpened: true, dateItemIndex: index })}>
                    <View style={Styles.inputIconView}>
                      <Image style={Styles.inputIcon} source={Images.ImgCalendar} />
                    </View>
                    <View style={Styles.innerInputView}>
                      <TextBold title={"Experience To"} textStyle={{ fontSize: Sizes.regular }} />
                      <TextMedium title={item.exp_to} textStyle={[Styles.input, { marginTop: 10 }]}></TextMedium>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={[Styles.infoView, { borderBottomWidth: 0 }]} onPress={() => this.showPicker(index)}>
                    <View style={Styles.infoIconView}>
                      <Image style={Styles.inputIcon} source={Images.ImgCertificate} />
                    </View>
                    <View style={Styles.innerInputView}>
                      <TextBold title={"Certificate"} textStyle={{ fontSize: Sizes.regular }} />
                      {/* <TextMedium title={item.org_exp ? item.org_exp : "Upload Certificate Here ....."} textStyle={[Styles.info]}></TextMedium> */}
                      <View style={[Styles.cameraViewCertificate]}>
                        <TouchableOpacity style={[Styles.cameraBoxCertificate]}>
                          {
                            item.pic && item.pic.uri ?
                              <View style={Styles.smallImageLoader} >
                                <ActivityIndicator size="small" color={Constants.themeColor} />
                              </View> : null
                          }
                          <TouchableOpacity style={Styles.smallImageStyle} onPress={() => this.setModalVisible(item)}>
                            <Image style={Styles.smallImageStyle} source={item.pic && item.pic.uri ? item.pic : Images.ImgCamera} />
                          </TouchableOpacity>
                        </TouchableOpacity>
                        <TextMedium title={
                          // item.org_exp ? item.org_exp :
                          "Upload Certificate Here ....."} textStyle={Styles.inputCertificate}></TextMedium>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {
                    index != 0 ?
                      <>
                        <TouchableOpacity style={[Styles.themeButton, { backgroundColor: '#FF0000', alignSelf: 'flex-start', paddingLeft: 10 }]} onPress={() => this.delete(index)}>
                          <TextBold title={"Delete"} textStyle={Styles.themeButtonText} />
                        </TouchableOpacity>
                      </>
                      : <></>
                  }
                </View>
              ))}
              <View style={Styles.profileButtonsView}>
                <ThemeButton title="Add More" fireEvent={this.addMore}></ThemeButton>
                {/* <GreyButton title="Back" fireEvent={this.back}></GreyButton> */}
                <ThemeButton title="Save" fireEvent={this.save}></ThemeButton>
              </View>
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
      </View >
    )
  }
}