import React, { Component } from "react";
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView
} from "react-native";
// import Toast from 'react-native-simple-toast';
import {
  StatusBar,
  Header,
  GreyButton,
  ListHeader,
  ThemeButton,
  TextBold,
  TextMedium
} from "./../utils/Component";
import Styles from "./../utils/Styles";
import Constants from "./../utils/Constants";
import Images from "./../utils/Images";
import Sizes from "./../utils/Size";
import ImagePicker from "react-native-image-picker";
import SInfo from "react-native-sensitive-info";
import Spinner from "react-native-loading-spinner-overlay";
import constants from "./../constants/constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import ImageZoomComponent from '../components/ImageZoom'


export default class ProfileScreen extends Component {
  static navigationOptions = {
    // title: 'Please sign in',
    header: null //hide the header
  };

  constructor(props) {
    super(props);
    this.state = {
      degree: "",
      certificate: {
        uri: "",
        name: "",
        fileUpdated: false
      },
      visible: false,
      userProfileImg: "",
      avatarSource: "",
      firstName: "",
      lastName: "",
      contact: "",
      countryCode: "",
      gender: "",
      dentistId: "",
      dentistTokan: "",
      pic: [],
      imgOption: "1",
      email: "",
      dob: "",
      token: "",
      businessName: "",
      businessAddress: "",
      dentistEducation: [],
      dentistInsurance: [],
      dentistAward: [],
      dentistLicense: []
    };
  }

  back = () => {
    this.props.navigation.goBack();
  };

  // save = () => {
  //   if (!this.state.degree || !this.state.degree.length) {
  //     Toast.showWithGravity("Please enter your degree name", Toast.SHORT, Toast.BOTTOM)
  //   } else if (!this.state.certificate.uri || !this.state.certificate.uri.length) {
  //     Toast.showWithGravity("Please upload your certificate", Toast.SHORT, Toast.BOTTOM)
  //   } else {
  //     alert("Saved");
  //   }
  // }
  save = () => {
    // this.mSuccess();
    this.mLoaderShowHide();
    this.mUpdateProfile();
    // this.setState({
    //   visible: true
    // },()=>{

    // });

    // this.setState({
    //   visible: !this.state.visible
    // },()=>{
    //   this.mUpdateProfile();
    // });
  };
  mLoaderShowHide() {
    this.setState({
      visible: !this.state.visible
    });
  }

  componentDidMount() {
    this.props.navigation.setParams({ handleSave: this.mValidation });
    SInfo.getItem("dentist_id", {
      sharedPreferencesName: "mySharedPrefs",
      keychainService: "myKeychain"
    }).then(value => {
      this.setState({ dentistId: value });
    });
    SInfo.getItem("token", {
      sharedPreferencesName: "mySharedPrefs",
      keychainService: "myKeychain"
    }).then(value => {
      console.log("time to fetch token");
      this.setState({ token: value });
    });
    SInfo.getItem("dentist_tokan", {
      sharedPreferencesName: "mySharedPrefs",
      keychainService: "myKeychain"
    }).then(value => {
      this.setState({ dentistTokan: value });
      this.mEditProfile();
    });
  }

  mEditProfile() {
    var mThis = this;
    var data = new FormData();
    data.append("auth_token", this.state.token);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        if (this.responseText.indexOf("status") !== -1) {
          var text = this.responseText;
          console.log(this.responseText);
          var obj = JSON.parse(text);
          console.log(obj);
          if (obj.status == 1) {
            obj.dentist_license_data.forEach(element => {
              if (element.license_photo == "") {
                pic = {
                  // uri: constants.imageUrl + "uploads/license_photo/no_image.jpg",
                  // name: "no_image.jpg"
                };
                element["pic"] = pic;
              } else {
                pic = {
                  uri:
                    constants.imageUrl +
                    "uploads/license_photo/" +
                    element.license_photo,
                  name: element.org_license
                    ? element.org_license
                    : element.license_photo
                };
                element["pic"] = pic;
              }

              if (element.license_details) {
                let license = element.license_details;
                element["license"] = license;
              }
            });

            console.log("LICENSE:" + JSON.stringify(obj.dentist_license_data));
            mThis.setState({
              dentistLicense: obj.dentist_license_data,
              dentistEducation: obj.dentist_education_data,
              dentistInsurance: obj.dentist_insurance,
              dentistAward: obj.dentist_award
            });
          } else {
          }
        } else {
          mThis.mNetworkFailed();
        }
      }
    });
    xhr.open("POST", constants.url + "service/dentistservice/dentist-step4");
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
    };
    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        let source = { uri: response.uri };

        const myImg = {
          uri: response.uri,
          type: "image/jpeg",
          name: "dhsiushdishidsiuhdiuh"
        };
        this.setState({
          imgOption: "2",
          avatarSource: source,
          pic: myImg
        });
      }
    });
  }

  mUpdateProfile = () => {
    console.log("ACCESS_TOKEN:" + this.state.dentistTokan);
    var mThis = this;
    var data = new FormData();
    this.state.dentistLicense.forEach(element => {
      data.append(
        "documents[" + this.state.dentistLicense.indexOf(element) + "]",
        element.pic && element.pic.uri ? element.pic : ""
      );
    });
    data.append("documents[contains]:", function (e) {
      for (var n = 0; n < e.length; n)
        for (var i = this.length; i--;) if (this[i] === e[n]) return !0;
      return !1;
    });
    data.append("documentName", JSON.stringify(this.state.dentistLicense));
    data.append("auth_token", this.state.token);
    console.log("DENTIST_TOKEN:" + this.state.dentistTokan)
    console.log("AUTH_TOKEN:" + this.state.token)
    console.log(data);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      // console.log("PROFILE4_RES:" + JSON.stringify(xhr))
      // console.log("PROFILE4_RES1:")
      // console.log(xhr)
      // console.log("PROFILE4_RES2:" + JSON.stringify(xhr))
      // mThis.mLoaderShowHide();
      // if (this._hasError) {
      //   mThis.mFailed();
      // } else {
      //   if (this.status == 1) {
      //     mThis.mSuccess();
      //   } else if (this.status == 5) {
      //     SInfo.setItem("is_patient_login", "0", {
      //       sharedPreferencesName: "mySharedPrefs",
      //       keychainService: "myKeychain"
      //     });
      //     SInfo.setItem("is_dentist_login", "0", {
      //       sharedPreferencesName: "mySharedPrefs",
      //       keychainService: "myKeychain"
      //     });
      //     mThis.props.navigation.navigate("Home");
      //   } else {
      //     mThis.mFailed();
      //   }
      // }
      if (this.readyState === 4) {
        console.log("RES:", this.responseText)
        if (this.responseText.indexOf("status") !== -1) {
          mThis.mLoaderShowHide();

          var text = this.responseText;
          console.log(this.responseText);
          var obj = JSON.parse(text);
          console.log(obj);
          if (obj.status == 1) {
            // SInfo.setItem('dentist_pic', responseJson.update_doc_details.docs_details.profile_pics, { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
            // console.log(responseJson)
            mThis.mSuccess();
          } else if (obj.status == 5) {
            SInfo.setItem("is_patient_login", "0", {
              sharedPreferencesName: "mySharedPrefs",
              keychainService: "myKeychain"
            });
            SInfo.setItem("is_dentist_login", "0", {
              sharedPreferencesName: "mySharedPrefs",
              keychainService: "myKeychain"
            });
            mThis.props.navigation.navigate("Home");
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
    xhr.open(
      "POST",
      constants.url + "service/dentistservice/update-dentist-profile-step4"
    );
    xhr.setRequestHeader("content-type", "multipart/form-data");
    xhr.setRequestHeader("access-token", this.state.dentistTokan);
    xhr.send(data);
  };

  mFailed() {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        Alert.alert("Failed", "Profile Updation failed");
      }, 200);
    });
  }

  mSuccess() {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        Alert.alert(
          "Success",
          "Profile Updated \n Successfully",
          [
            {
              text: "Dismiss",
              onPress: () => {
                this.back();
              }
            }
          ],
          { cancelable: false }
        );
      }, 200);
    });
  }

  mNetworkFailed() {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        Alert.alert(
          "Failed",
          "The Internet connection appears to be offline, Please try again"
        );
      }, 200);
    });
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
        console.warn("User cancelled image picker");
      } else if (response.error) {
        //  console.log(JSON.stringify(source));
        console.warn("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        //  console.log('User tapped custom button: ', response.customButton);
      } else {
        delete response.data;
        // user.picture = response.uri;
        let datas = response.uri.split("/");
        let name = datas[datas.length - 1];
        const source = { uri: response.uri, name: name };
        let newArray = [...this.state.dentistLicense];
        // newArray.push(item)
        newArray[index] = {
          ...newArray[index],
          pic: source,
          doc_file_name: source.name
        };
        console.log("IMAGE_ADDED:" + JSON.stringify(newArray[index]));
        this.setState({ dentistLicense: newArray });
        // this.setState({ certificate: source, fileUpdated: true }, () => {
        //   console.log("Image captured");
        // });
        console.warn(source);
      }
    });
  }

  addMore = () => {
    let length = this.state.dentistLicense.length + 1;
    let id = "moredoc" + length;
    let item = { id: id };
    let newArray = [...this.state.dentistLicense];
    newArray.push(item);
    // newArray[index] = { ...newArray[index], [key]: text }
    this.setState({ dentistLicense: newArray });
  };

  delete = index => {
    let newArray = [...this.state.dentistLicense];
    // newArray.pop(index)
    newArray.splice(index, 1);
    this.setState({ dentistLicense: newArray });
  };

  updateLicenseData = (key, text, index) => {
    let newArray = [...this.state.dentistLicense];
    if (key == "license_details") {
      newArray[index] = { ...newArray[index], license: text };
    }
    newArray[index] = { ...newArray[index], [key]: text };
    console.log("LICENSE_DETAIL:" + JSON.stringify(newArray));
    this.setState({ dentistLicense: newArray });
  };

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
    let { certificate } = this.state;
    return (
      <View style={Styles.screen}>
        <StatusBar />
        <Spinner
          overlayColor={"rgba(0, 0, 0, 0.75)"}
          color={"#08a1d9"}
          textContent={"Updating"}
          visible={this.state.visible}
          textStyle={{ color: "#fff", fontSize: 15, marginTop: -70 }}
        ></Spinner>
        <ImageZoomComponent ref={imageZoomComponent => (this.imageZoomComponent = imageZoomComponent)} />
        <Header
          title={"Edit Profile"}
          isbackButton={true}
          fireEvent={this.back}
        />
        <ScrollView>
          <View style={Styles.container}>
            <ListHeader title="Npi & State License Info" />
            {this.state.dentistLicense.map((item, index) => (
              <View style={[Styles.whiteBox, { marginBottom: 40 }]}>
                <View style={Styles.inputView}>
                  <View style={Styles.inputIconView}>
                    <Image style={Styles.inputIcon} source={Images.ImgCap} />
                  </View>
                  <View style={Styles.innerInputView}>
                    <TextBold
                      title={"License"}
                      textStyle={{ fontSize: Sizes.regular }}
                    />
                    <TextInput
                      placeholder="Enter License Detail Here ....."
                      placeholderTextColor={Constants.black}
                      style={Styles.input}
                      value={item.license_details}
                      onChangeText={text =>
                        this.updateLicenseData("license_details", text, index)
                      }
                    ></TextInput>
                  </View>
                </View>
                <TouchableOpacity
                  style={[Styles.inputView, { borderBottomWidth: 0 }]}
                  onPress={() => this.showPicker(index)}
                >
                  <View style={Styles.inputIconView}>
                    <Image
                      style={Styles.inputIcon}
                      source={Images.ImgCertificate}
                    />

                    {/* {
                      item.pic && item.pic.uri ?
                        <View style={Styles.imageLoader} >
                          <ActivityIndicator size="small" color={Constants.themeColor} />
                        </View> : null
                    } */}
                    {/* <Image style={Styles.imageStyle} source={ item.pic && item.pic.uri ? item.pic : Images.ImgCertificate} /> */}
                  </View>
                  <View style={Styles.innerInputView}>
                    <TextBold
                      title={"Certificate"}
                      textStyle={{ fontSize: Sizes.regular }}
                    />
                    {/* <TextMedium title={item.certificate.name ? item.certificate.name : "Upload Certificate Here ....."} textStyle={[Styles.input, { marginTop: 10 }]}></TextMedium> */}
                    {/* <TextMedium title={item.pic && item.pic.name ? item.pic.name : "Upload Certificate Here ....."} textStyle={[Styles.input, { marginTop: 10 }]}></TextMedium> */}
                    <View style={Styles.cameraViewCertificate}>
                      <TouchableOpacity style={[Styles.cameraBoxCertificate]}>
                        {item.pic && item.pic.uri ? (
                          <View style={Styles.smallImageLoader}>
                            <ActivityIndicator
                              size="small"
                              color={Constants.themeColor}
                            />
                          </View>
                        ) : null}
                        <TouchableOpacity
                          style={Styles.smallImageStyle}
                          onPress={() =>
                            this.setModalVisible(item)
                          }
                        >
                          <Image
                            style={Styles.smallImageStyle}
                            source={
                              item.pic && item.pic.uri
                                ? item.pic
                                : Images.ImgCamera
                            }
                          />
                        </TouchableOpacity>
                      </TouchableOpacity>
                      <TextMedium
                        title={
                          // item.pic && item.pic.name
                          //   ? item.pic.name:
                          "Upload Certificate Here ....."
                        }
                        textStyle={Styles.inputCertificate}
                      ></TextMedium>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* <ThemeButton title="Delete" buttonStyle={{ backgroundColor: '#FF0000', alignSelf: 'flex-start', paddingLeft: 10 }} fireEvent={this.delete(index)}></ThemeButton> */}

                {index != 0 ? (
                  <>
                    <TouchableOpacity
                      style={[
                        Styles.themeButton,
                        {
                          backgroundColor: "#FF0000",
                          alignSelf: "flex-start",
                          paddingLeft: 10
                        }
                      ]}
                      onPress={() => this.delete(index)}
                    >
                      <TextBold
                        title={"Delete"}
                        textStyle={Styles.themeButtonText}
                      />
                    </TouchableOpacity>
                  </>
                ) : (
                    <></>
                  )}
              </View>
            ))}
            <View style={Styles.profileButtonsView}>
              <ThemeButton
                title="Add More"
                fireEvent={this.addMore}
              ></ThemeButton>
              {/* <GreyButton title="Back" fireEvent={this.back}></GreyButton> */}
              <ThemeButton title="Save" fireEvent={this.save}></ThemeButton>
            </View>
          </View>

        </ScrollView>
      </View>
    );
  }
}
