import React, { Component } from 'react';
import { View, Image, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
// import Toast from 'react-native-simple-toast';
import { StatusBar, Header, GreyButton, TextSemiBold, ListHeader, ThemeButton, TextBold, TextMedium, TextRegular } from './../utils/Component';
import Styles from './../utils/Styles';
import Constants from './../utils/Constants';
import Images from './../utils/Images';
import Sizes from './../utils/Size';
import Fonts from './../utils/Fonts';
import ImagePicker from "react-native-image-picker";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import SInfo from 'react-native-sensitive-info'
import Spinner from 'react-native-loading-spinner-overlay';
import constants from './../constants/constants'
import YearPicker from '../components/YearPicker'
import ImageZoomComponent from '../components/ImageZoom'


export default class ProfileScreen extends Component {
  static navigationOptions = {
    // title: 'Please sign in',
    header: null //hide the header
  };

  constructor(props) {
    super(props)
    this.state = {
      picture: {
        uri: "",
        // uri: "https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
      },
      firstName: "",
      lastName: "",
      email: "",
      gender: "",
      country_code: { "id": "", "value": "" },
      country_codes: [{ "id": "1", "value": "+91" }, { "id": "2", "value": "+92" }],
      contact: "",
      gender: { "id": "", "value": "" },
      genders: [{ "id": "0", "value": "Please Select Gender" }, { "id": "1", "value": "Male" }, { "id": "2", "value": "Female" }, { "id": "3", "value": "Rather not say" },],
      visible: false,
      pic: {
        uri: "",
        // uri: "https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
      },
      educationList: [],
      awardList: [],
      insuranceList: [],
      degree: '',
      startYear: 1960,
    }
  }
  back = () => {
    this.props.navigation.goBack();
  }

  showYearPicker = (index) => {
    const selectedYear = parseInt(this.state.educationList[index].completed_year)
    const { startYear } = this.state;
    this.picker
      .show({ startYear, selectedYear })
      .then(({ year }) => {
        let list = this.state.educationList;
        list[index].completed_year = year
        this.setState({
          educationList: list,
        })
      })
  }

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
      this.setState({ dentistTokan: value, visible: true })
      this.mEditProfile();
    });
  }
  mEditProfile() {
    var mThis = this;
    var data = new FormData();
    console.log("TOKEN:" + this.state.token)
    data.append("auth_token", this.state.token)
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        if (this.responseText.indexOf('status') !== -1) {
          mThis.mLoaderShowHide();
          var text = this.responseText;
          console.log(this.responseText);
          var obj = JSON.parse(text);
          console.log(obj)
          if (obj.status == 1) {

            obj.dentist_education_data.forEach(element => {
              if (element.certificate == '') {
                pic = {
                  // uri: constants.imageUrl + 'uploads/certificate/no_image.jpg',
                  // name: 'no_image.jpg'
                };
                element['pic'] = pic
                // element = { ...element, ...pic }
              } else {
                pic = {
                  uri: constants.imageUrl + 'uploads/certificate/' + element.certificate,
                  name: element.org_certificate ? element.org_certificate : element.certificate
                };
                // element = { ...element, ...pic }
                element['pic'] = pic
              }

            });

            obj.dentist_award.forEach(element => {

            })

            console.log("EDUCATION:" + JSON.stringify(obj.dentist_education_data))


            mThis.setState({
              educationList: obj.dentist_education_data,
              awardList: obj.dentist_award,
              insuranceList: obj.dentist_insurance,
            })
          }
          else {
          }
        } else {
          mThis.mNetworkFailed();
        }
      }
    });
    xhr.open("POST", constants.url + "service/dentistservice/dentist-step3");
    xhr.setRequestHeader("access-token", this.state.dentistTokan);
    xhr.send(data);
  }

  addMore = () => {
    let length = this.state.educationList.length + 1
    let id = "moredoc" + length
    let item = { id: id }
    let newArray = [...this.state.educationList]
    newArray.push(item)
    // newArray[index] = { ...newArray[index], [key]: text }
    this.setState({ educationList: newArray });
  }

  delete = (index) => {
    let newArray = [...this.state.educationList]
    // newArray.pop(index)
    newArray.splice(index, 1)
    this.setState({ educationList: newArray });
  }

  addMoreAward = () => {
    let length = this.state.awardList.length + 1
    let id = "moredoc" + length
    let item = { id: id }
    let newArray = [...this.state.awardList]
    newArray.push(item)
    this.setState({ awardList: newArray });
  }

  deleteAward = (index) => {
    let newArray = [...this.state.awardList]
    newArray.splice(index, 1)
    this.setState({ awardList: newArray });
  }

  addMoreInsurance = () => {
    let length = this.state.insuranceList.length + 1
    let id = "moredoc" + length
    let item = { id: id }
    let newArray = [...this.state.insuranceList]
    newArray.push(item)
    this.setState({ insuranceList: newArray });
  }

  deleteInsurance = (index) => {
    let newArray = [...this.state.insuranceList]
    newArray.splice(index, 1)
    this.setState({ insuranceList: newArray });
  }

  mValidation = () => {
    if (this.state.firstName.length <= 0) {
      Alert.alert('first name is required.')
      return false;
    } else if (this.state.lastName.length <= 0) {
      Alert.alert('last name is required.')
      return false;
    } else if (this.state.contact.length <= 0) {
      Alert.alert('mobile no is required.')
      return false;
    } else if (this.state.countryCode.length <= 0) {
      Alert.alert('country code is required.')
      return false;
    }
    this.mLoaderShowHide();
    this.mUpdateProfile();
  }

  mUpdateProfile = () => {
    var mThis = this;
    var data = new FormData();
    this.state.educationList.forEach(element => {
      console.log("INDEX:" + this.state.educationList.indexOf(element))
      // if (element.pic && element.pic.uri){
      data.append("documents[" + this.state.educationList.indexOf(element) + "]", element.pic && element.pic.uri ? element.pic : '');
      // }
    });
    data.append("documents[contains]:", function (e) { for (var n = 0; n < e.length; n)for (var i = this.length; i--;)if (this[i] === e[n]) return !0; return !1 })
    data.append("documentName", JSON.stringify(this.state.educationList));
    data.append("dentist_awards", JSON.stringify(this.state.awardList));
    data.append("dentist_insurance", JSON.stringify(this.state.insuranceList));
    data.append("auth_token", this.state.token)
    console.log(data)
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      // console.log("PROFILE3_RES1:")
      // console.log(xhr)
      // console.log("PROFILE3_RES:" + JSON.stringify(xhr))
      if (this.readyState === 4) {
        if (this.responseText.indexOf('status') !== -1) {

          mThis.mLoaderShowHide();

          var text = this.responseText;
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
    xhr.open("POST", constants.url + "service/dentistservice/update-dentist-profile-step3");
    xhr.setRequestHeader('content-type', 'multipart/form-data');
    xhr.setRequestHeader("access-token", this.state.dentistTokan);
    xhr.send(data);
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
        Alert.alert('Success', 'Profile Updated \n Successfully', [
          { text: 'Dismiss', onPress: () => { this.back() } },
        ], { cancelable: false });
      }, 200);
    });
  }
  mLoaderShowHide() {
    this.setState({
      visible: !this.state.visible
    });
  };
  save = () => {
    // this.mSuccess();
    this.mLoaderShowHide()
    this.mUpdateProfile()
  }

  mNetworkFailed() {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        Alert.alert('Failed', 'The Internet connection appears to be offline, Please try again');
      }, 200);
    });
  }

  showImagePicker() {
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
    }
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
        const myImg = {
          uri: response.uri,
          type: 'image/jpeg',
          name: 'dhsiushdishidsiuhdiuh',
        };
        this.setState({ pic: myImg, imageUpdated: true }, () => {
          console.log("Image captured");
        });
        console.warn(myImg);
      }
    });
  }

  updateEducation = (key, text, index) => {
    let newArray = [...this.state.educationList];
    newArray[index] = { ...newArray[index], [key]: text }
    this.setState({ educationList: newArray });
  }

  updateAwards = (key, text, index) => {
    let newArray = [...this.state.awardList];
    newArray[index] = { ...newArray[index], [key]: text }
    this.setState({ awardList: newArray });
  }

  updateInsurance = (key, text, index) => {
    let newArray = [...this.state.insuranceList];
    newArray[index] = { ...newArray[index], [key]: text }
    this.setState({ insuranceList: newArray });
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
    }
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
        const source = { uri: response.uri, name: name, type: 'image/jpeg', };
        let newArray = this.state.educationList;
        newArray[index] = { ...newArray[index], pic: source, doc_file_name: source.name, org_certificate: source.name }
        // newArray[index].org_certificate = source.name;
        // newArray[index].doc_file_name = source.name;
        this.setState({ educationList: newArray });
        //console.warn("dj"+source.name);
      }
    });
  }

  showLargeImage = (item) => {
    if (item.pic && item.pic.uri) {
      this.props.navigation.navigate('DisplayImage', item.pic)
    }
  }

  setModalVisible(item) {
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
    return (
      <View style={Styles.screen}>
        <YearPicker
          ref={(picker) => this.picker = picker}
        />
        <StatusBar />
        <Spinner overlayColor={'rgba(0, 0, 0, 0.75)'} color={'#08a1d9'} textContent={"Updating"} visible={this.state.visible} textStyle={{ color: '#fff', fontSize: 15, marginTop: -70 }}>
        </Spinner>
        <ImageZoomComponent ref={imageZoomComponent => (this.imageZoomComponent = imageZoomComponent)} />
        <Header title={"Edit Profile"} isbackButton={true} fireEvent={this.back} />
        <KeyboardAwareScrollView style={{ flex: 1 }}>
          <ScrollView>
            <View style={Styles.container}>
              {/* <ListHeader title="Education & training" /> */}
              <View
                style={[Styles.headerLabel, { marginBottom: this.state.educationList.length > 0 ? 0 : 40 }]}
              >
                <View
                  style={Styles.headerLabelLeft}
                >
                  <ListHeader title="Education & Training" />
                </View>
                <View
                  style={Styles.headerLabelRight}
                >
                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      height: 40
                    }}
                    onPress={() => this.addMore()}
                  >
                    <TextRegular
                      title={"Add More"}
                      textStyle={{ color: Constants.themeColor }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {/* <View style={{marginBottom: this.state.educationList.length > 0 ? 0 : 40 }}></View> */}
              {this.state.educationList.map((item, index) =>
                (
                  <View style={[Styles.whiteBox, { marginBottom: 40 }]}>
                    <View style={Styles.inputView}>
                      <View style={Styles.inputIconView}>
                        <Image style={Styles.inputIcon} source={Images.ImgCap} />
                      </View>
                      <View style={Styles.innerInputView}>
                        <TextBold title={"Degree"} textStyle={{ fontSize: Sizes.regular }} />
                        {/* <TextMedium title={item.degree} textStyle={Styles.info}></TextMedium> */}
                        <TextInput
                          placeholder="Please enter your Degree"
                          placeholderTextColor={Constants.black}
                          style={Styles.input}
                          value={item.degree}
                          onChangeText={(text) => this.updateEducation("degree", text, index)}></TextInput>
                      </View>
                    </View>
                    <View style={Styles.inputView}>
                      <View style={Styles.inputIconView}>
                        <Image style={Styles.inputIcon} source={Images.ImgUser} />
                      </View>
                      <TouchableOpacity style={Styles.innerInputView} onPress={() => this.showYearPicker(index)}>
                        <TextBold title={"Year Of Completion"} textStyle={{ fontSize: Sizes.regular }} />
                        <TextMedium title={item.completed_year ? item.completed_year : "Please Select Year"} textStyle={[Styles.info, { marginLeft: 4 }]}></TextMedium>
                      </TouchableOpacity>
                    </View>
                    <View style={Styles.inputView}>
                      <View style={Styles.inputIconView}>
                        <Image style={Styles.inputIcon} source={Images.ImgEmail} />
                      </View>
                      <View style={Styles.innerInputView}>
                        <TextBold title={"College Name"} textStyle={{ fontSize: Sizes.regular }} />
                        {/* <TextMedium title={item.medical_school} textStyle={Styles.info}></TextMedium> */}
                        <TextInput
                          placeholder="Please enter your College Name"
                          placeholderTextColor={Constants.black}
                          style={Styles.input}
                          value={item.medical_school}
                          onChangeText={(text) => this.updateEducation("medical_school", text, index)}></TextInput>
                      </View>
                    </View>
                    <View style={Styles.inputView}>
                      <View style={Styles.inputIconView}>
                        <Image style={Styles.inputIcon} source={Images.ImgEmail} />
                      </View>
                      <View style={Styles.innerInputView}>
                        <TextBold title={"College location"} textStyle={{ fontSize: Sizes.regular }} />
                        {/* <TextMedium title={item.location} textStyle={Styles.info}></TextMedium> */}
                        <TextInput
                          placeholder="Please enter your College location"
                          placeholderTextColor={Constants.black}
                          style={Styles.input}
                          value={item.location}
                          onChangeText={(text) => this.updateEducation("location", text, index)}></TextInput>
                      </View>
                    </View>
                    {/* <View style={Styles.inputView}>
                    <View style={Styles.inputIconView}>
                      <Image style={Styles.inputIcon} source={Images.ImgEmail} />
                    </View>
                    <View style={Styles.innerInputView}>
                      <TextBold title={"Certificate"} textStyle={{ fontSize: Sizes.regular }} />
                      <TextMedium title={item.certificate} textStyle={Styles.info}></TextMedium>
                    </View>
                  </View> */}

                    <View style={Styles.inputView} >
                      <View style={Styles.inputIconView}>
                        <Image style={Styles.inputIcon} source={Images.ImgCertificate} />
                      </View>
                      <TouchableOpacity style={Styles.innerInputView} onPress={() => this.showPicker(index)}>
                        <TextBold title={"Certificate"} textStyle={{ fontSize: Sizes.regular }} />
                        {/* <TextMedium title={item.org_certificate ? item.org_certificate : "Upload Certificate Here ....."} textStyle={[Styles.input, { marginTop: 10 }]}></TextMedium> */}

                        <View style={Styles.cameraViewCertificate}>
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
                            // item.org_certificate ? item.org_certificate :
                            "Upload Certificate Here ....."} textStyle={Styles.inputCertificate}></TextMedium>
                        </View>
                      </TouchableOpacity>
                    </View>

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

              {/** Education & Training End */}
              {/** Awards & Publications Start */}
              <View
                style={[Styles.headerLabel, { marginTop: 0 }]}
              >
                <View
                  style={Styles.headerLabelLeft}
                >
                  <ListHeader title="Awards & Publications" />
                </View>
                <View
                  style={Styles.headerLabelRight}
                >
                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      height: 40
                    }}
                    onPress={() => this.addMoreAward()}
                  >
                    <TextRegular
                      title={"Add More"}
                      textStyle={{ color: Constants.themeColor }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {this.state.awardList.map((item, index) =>
                (
                  <View style={Styles.whiteBox}>
                    <View style={Styles.timing}>
                      <View style={[Styles.timeInfoView, { width: "100%" }]}>
                        <TextInput
                          placeholder="Please enter your Awards"
                          placeholderTextColor={Constants.black}
                          style={[
                            Styles.input,
                            { fontWeight: "bold", width: "90%", paddingLeft: 10 }
                          ]}
                          value={item.award}
                          onChangeText={text =>
                            this.updateAwards("award", text, index)
                          }
                        ></TextInput>
                        {index != 0 ? (
                          <TouchableOpacity
                            style={{
                              height: "100%",
                              alignItems: "center",
                              width: "10%",
                              justifyContent: "center"
                            }}
                            onPress={() => this.deleteAward(index)}
                          >
                            <Image
                              source={Images.ImgDelete}
                              style={{
                                resizeMode: "center",
                                height: 15,
                                width: 15
                              }}
                            />
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    </View>
                  </View>
                ))}

              {/* Awards & Publications End */}
              {/* Network Insurance Start */}
              <View
                style={[Styles.headerLabel, { marginTop: 40 }]}
              >
                <View
                  style={Styles.headerLabelLeft}
                >
                  <ListHeader title="In Network Insurance" />
                </View>
                <View
                  style={Styles.headerLabelRight}
                >
                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      height: 40
                    }}
                    onPress={() => this.addMoreInsurance()}
                  >
                    <TextRegular
                      title={"Add More"}
                      textStyle={{ color: Constants.themeColor }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {this.state.insuranceList.map((item, index) =>
                (
                  <View style={Styles.whiteBox}>
                    <View style={Styles.timing}>
                      <View style={[Styles.timeInfoView, { width: "100%" }]}>
                        <TextInput
                          placeholder="Please enter Network Insurance"
                          placeholderTextColor={Constants.black}
                          style={[
                            Styles.input,
                            { fontWeight: "bold", width: "90%", paddingLeft: 10 }
                          ]}
                          value={item.insurance}
                          onChangeText={text =>
                            this.updateInsurance("insurance", text, index)
                          }
                        ></TextInput>
                        {index != 0 ? (
                          <TouchableOpacity
                            style={{
                              height: "100%",
                              alignItems: "center",
                              width: "10%",
                              justifyContent: "center"
                            }}
                            onPress={() => this.deleteInsurance(index)}
                          >
                            <Image
                              source={Images.ImgDelete}
                              style={{
                                resizeMode: "center",
                                height: 15,
                                width: 15
                              }}
                            />
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    </View>
                  </View>
                ))}

              {/* Network Insurance End */}
              <View style={Styles.profileButtonsView}>
                {/* <ThemeButton title="Add More" fireEvent={this.addMore}></ThemeButton> */}
                {/* <GreyButton title="Back" fireEvent={this.back}></GreyButton> */}
                <ThemeButton title="Save" fireEvent={this.save}></ThemeButton>
              </View>
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
      </View>
    )
  }
}