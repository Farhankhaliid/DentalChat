import React, { Component } from "react";
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
} from "react-native";
// import Toast from 'react-native-simple-toast';
import {
  StatusBar,
  Header,
  TextSemiBold,
  ListHeader,
  ThemeButton,
  GreyButton,
  TextBold

} from "./../utils/Component";
import RNPickerSelect from 'react-native-picker-select';

import Styles from "./../utils/Styles";
import Constants from "./../utils/Constants";
import Images from "./../utils/Images";
import Sizes from "./../utils/Size";
import Fonts from "./../utils/Fonts";
import ImagePicker from "react-native-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import SInfo from "react-native-sensitive-info";
import Spinner from "react-native-loading-spinner-overlay";
import constants from "./../constants/constants";
import ImageZoomComponent from '../components/ImageZoom'
const PickerData = [
  {
    label: 'Male',
    value: 'Male',
  },
  {
    label: 'Female',
    value: 'Female',
  },
  {
    label: 'Rather not say',
    value: 'Rather not say',
  },
];

export default class ProfileScreen extends Component {
  static navigationOptions = {
    // title: 'Please sign in',
    header: null //hide the header
  };

  constructor(props) {
    super(props);
    this.state = {
      picture: {
        uri: ""
        // uri: "https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
      },
      firstName: "",
      lastName: "",
      email: "",
      gender: "",
      country_code: { id: "", value: "" },
      country_codes: [{ id: "1", value: "+91" }, { id: "2", value: "+92" }],
      contact: "",
      gender: { id: "", value: "" },
      genders: [
        { id: "0", value: "Please Select Gender" },
        { id: "1", value: "Male" },
        { id: "2", value: "Female" },
        { id: "3", value: "Rather not say" }
      ],
      visible: false,
      pic: {
        uri: ""
        // uri: "https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
      }
    };
  }

  back = () => {
    //this.props.navigation.navigate("DentistAccount")
    this.props.navigation.goBack();
  };

  // save = () => {
  //   if (!this.state.picture.uri || !this.state.picture.uri.length) {
  //     Toast.showWithGravity("Please select your profile picture", Toast.SHORT, Toast.BOTTOM)
  //   } else if (!this.state.first_name || !this.state.first_name.length) {
  //     Toast.showWithGravity("Please enter your first name", Toast.SHORT, Toast.BOTTOM)
  //   } else if (!this.state.last_name || !this.state.last_name.length) {
  //     Toast.showWithGravity("Please enter your last name", Toast.SHORT, Toast.BOTTOM)
  //   } else if (!this.state.email || !this.state.email.length || !Constants.emailcontext.test(this.state.email)) {
  //     Toast.showWithGravity("Please enter your valid email ID", Toast.SHORT, Toast.BOTTOM)
  //   } else if (!this.state.gender.id || !this.state.gender.id.length) {
  //     Toast.showWithGravity("Please select your gender", Toast.SHORT, Toast.BOTTOM)
  //   } else if (!this.state.country_code.id || !this.state.country_code.id.length) {
  //     Toast.showWithGravity("Please select your country code", Toast.SHORT, Toast.BOTTOM)
  //   } else if (!this.state.mobile || !this.state.mobile.length || this.state.mobile.length != 10) {
  //     Toast.showWithGravity("Please enter your valid Mobile No.", Toast.SHORT, Toast.BOTTOM)
  //   } else {
  //     this.props.navigation.navigate("second");
  //   }
  // }
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
      this.setState({ dentistTokan: value, visible: true });
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
          mThis.mLoaderShowHide();
          var text = this.responseText;
          console.log(this.responseText);
          var obj = JSON.parse(text);
          console.log(obj);
          if (obj.status == 1) {
            var img = constants.imageUrl + "uploads/patient_profile_image/no_image.jpg";
            if (obj.dentistdetails.docs_details.profile_pics == "") {
              img = {
                uri: constants.imageUrl + "uploads/patient_profile_image/no_image.jpg"
              };
            } else {
              img = {
                uri: constants.imageUrl + "uploads/dentist_profile_image/" + obj.dentistdetails.docs_details.profile_pics
              };
            }

            mThis.setState({
              pic: img,
              dentistId: obj.dentistdetails.docs_details.doctor_id,
              firstName: obj.dentistdetails.docs_details.first_name,
              lastName: obj.dentistdetails.docs_details.last_name,
              contact: obj.dentistdetails.docs_details.contact_number,
              countryCode: obj.dentistdetails.docs_details.conuntry_code,
              gender:
                mThis.state.genders[obj.dentistdetails.docs_details.gender],
              email: obj.dentistdetails.docs_details.email,
              dob: obj.dentistdetails.docs_details.date_of_birth,
              imgOption: "1",
              subscribeStatus: obj.dentistdetails.subcribe_status
            });
          } else {
          }
        } else {
          mThis.mNetworkFailed();
        }
      }
    });
    xhr.open("POST", constants.url + "service/dentistservice/dentist-step1");
    xhr.setRequestHeader("access-token", this.state.dentistTokan);
    xhr.send(data);
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

  mValidation = () => {
    if (this.state.firstName.length <= 0) {
      Alert.alert("first name is required.");
      return false;
    } else if (this.state.lastName.length <= 0) {
      Alert.alert("last name is required.");
      return false;
    } else if (this.state.contact.length <= 0) {
      Alert.alert("mobile no is required.");
      return false;
    } else if (this.state.countryCode.length <= 0) {
      Alert.alert("country code is required.");
      return false;
    }
    this.mLoaderShowHide();
    this.mUpdateProfile();
  };
  mUpdateProfile() {
    var mThis = this;
    var data = new FormData();
    data.append("doctor_id", this.state.dentistId);
    data.append("first_name", this.state.firstName);
    data.append("last_name", this.state.lastName);
    data.append("date_of_birth", this.state.dob);
    data.append("gender", this.state.gender.id);
    data.append("email", this.state.email);
    data.append("conuntry_code", this.state.countryCode);
    data.append("contact_number", this.state.contact);
    data.append("profile_pics", this.state.pic);
    data.append("auth_token", this.state.token);
    console.log(data);
    fetch(
      constants.url + "service/dentistservice/update-dentist-profile-step1",
      {
        method: "POST",
        body: data,
        headers: {
          //Accept: 'application/json',
          //'Content-Type': 'json; charset=UTF-8',
          "Content-Type": "multipart/form-data"
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        //var users = responseJson;
        console.log("PROFILE1_RES:" + responseJson)
        console.log("PROFILE1_RES:" + JSON.stringify(responseJson))
        this.mLoaderShowHide();
        if (responseJson.status == 1) {
          SInfo.setItem(
            "dentist_pic",
            responseJson.update_doc_details.docs_details.profile_pics,
            {
              sharedPreferencesName: "mySharedPrefs",
              keychainService: "myKeychain"
            }
          );
          console.log(responseJson);
          this.mSuccess();
        } else if (responseJson.status == 5) {
          SInfo.setItem("is_patient_login", "0", {
            sharedPreferencesName: "mySharedPrefs",
            keychainService: "myKeychain"
          });
          SInfo.setItem("is_dentist_login", "0", {
            sharedPreferencesName: "mySharedPrefs",
            keychainService: "myKeychain"
          });
          this.props.navigation.navigate("Home");
        } else {
          this.mFailed();
        }
      })
      .catch(error => {
        this.mLoaderShowHide();
        this.mUpdateProfile();
        console.log(error);
        // this.mFailed();
      });
    console.log(data);
    // var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;
    // xhr.addEventListener("readystatechange", function () {
    //   if (this.readyState === 4) {
    //     mThis.mLoaderShowHide();
    //     console.warn("@@@@@" + this.responseText);
    //     // var text = this.responseText;
    //     // var obj = JSON.parse(text);
    //     // if (obj.status == 1) {
    //     //   mThis.mSuccess();
    //     //   SInfo.setItem('dentist_name', obj.update_doc_details.docs_details.first_name + ' ' + obj.update_doc_details.docs_details.last_name, { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
    //     //   SInfo.setItem('dentist_pic', obj.update_doc_details.docs_details.profile_pics + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
    //     // } else {
    //     //   mThis.mFailed();
    //     // }
    //   }
    // });
    // xhr.open("POST", constants.url + "service/dentistservice/update-dentist-profile-step1");
    // xhr.setRequestHeader('content-type', 'multipart/form-data');
    // xhr.send(data);
  }
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
          "Profile Successfully \n Updated",
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
  mLoaderShowHide() {
    this.setState({
      visible: !this.state.visible
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
        let fileName = "dhsiushdishidsiuhdiuh.JPG"
        if (response && response.fileName) {
          let extension = response.fileName.substr(response.fileName.lastIndexOf('.'));
          if (extension && extension != "") {
            fileName = response.fileName
          }

        }

        const myImg = {
          uri: response.uri,
          type: "image/jpeg",
          name: fileName
        };
        this.setState({ pic: myImg, imageUpdated: true }, () => {
          console.log("Image captured");
        });
        console.warn(myImg);
      }
    });
  }

  setModalVisible(image) {
    if (image && image.uri) {
      this.imageZoomComponent
        .show({
          image: image
        })
        .then(() => {
        })
    }

    // this.setState({ modalVisible: visible });
  }

  render() {
    // console.log(this.props.navigation.state.routeName + " Screen");
    const placeholder = {
      label: 'Choose Gender',
      value: null,
      color: '#9EA0A4',
    };
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
        <KeyboardAwareScrollView style={{ flex: 1 }}>
          <View style={Styles.container}>
            <ListHeader title="Basic Information" />
            <View style={Styles.whiteBox}>
              <TouchableOpacity
                style={Styles.cameraView}
                onPress={() => this.showImagePicker()}
              >
                <View style={Styles.cameraBox}>
                  {this.state.pic.uri ? (
                    <View style={Styles.imageLoader}>
                      <ActivityIndicator
                        size="small"
                        color={Constants.themeColor}
                      />
                    </View>
                  ) : null}
                  <TouchableOpacity
                    activeOpacity={1.0}
                    style={Styles.touchableImageStyle}
                    onPress={() =>
                      this.setModalVisible(this.state.pic)
                    }
                  >
                    <Image
                      style={Styles.imageStyle}
                      source={
                        this.state.pic && this.state.pic.uri
                          ? this.state.pic
                          : Images.ImgCamera
                      }
                    />
                  </TouchableOpacity>
                  <Image
                    style={Styles.imageStyle}
                    source={
                      this.state.pic.uri ? this.state.pic : Images.ImgProfile
                    }
                  />
                </View>
                <TextSemiBold
                  title={"Change Profile Photo"}
                  textStyle={{ fontSize: Sizes.regular }}
                ></TextSemiBold>
              </TouchableOpacity>
              <View style={Styles.inputView}>
                <View style={Styles.inputIconView}>
                  <Image style={Styles.inputIcon} source={Images.ImgUser} />
                </View>
                <View style={Styles.innerInputView}>
                  <TextBold
                    title={"First Name"}
                    textStyle={{ fontSize: Sizes.regular }}
                  />
                  <TextInput
                    allowFontScaling={false}
                    allowFontScaling={false}
                    placeholder="Please enter your first name"
                    placeholderTextColor={Constants.black}
                    style={Styles.input}
                    value={this.state.firstName}
                    onChangeText={text => this.setState({ firstName: text })}
                  ></TextInput>
                </View>
              </View>
              <View style={Styles.inputView}>
                <View style={Styles.inputIconView}>
                  <Image style={Styles.inputIcon} source={Images.ImgUser} />
                </View>
                <View style={Styles.innerInputView}>
                  <TextBold
                    title={"Last Name"}
                    textStyle={{ fontSize: Sizes.regular }}
                  />
                  <TextInput
                    allowFontScaling={false}
                    allowFontScaling={false}
                    placeholder="Please enter your last name"
                    placeholderTextColor={Constants.black}
                    style={Styles.input}
                    value={this.state.lastName}
                    onChangeText={text => this.setState({ lastName: text })}
                  ></TextInput>
                </View>
              </View>
              <View style={Styles.inputView}>
                <View style={Styles.inputIconView}>
                  <Image style={Styles.inputIcon} source={Images.ImgEmail} />
                </View>
                <View style={Styles.innerInputView}>
                  <TextBold
                    title={"Email"}
                    textStyle={{ fontSize: Sizes.regular }}
                  />
                  <TextInput
                    allowFontScaling={false}
                    allowFontScaling={false}
                    placeholder="Please enter your email ID"
                    placeholderTextColor={Constants.black}
                    style={Styles.input}
                    value={this.state.email}
                    keyboardType="email-address"
                    onChangeText={text => this.setState({ email: text })}
                  ></TextInput>
                </View>
              </View>
              <View style={Styles.inputView}>
                <View style={Styles.inputIconView}>
                  <Image style={Styles.inputIcon} source={Images.ImgGender} />
                </View>
                <View style={Styles.innerInputView}>
                  <TextBold
                    title={"Gender"}
                    textStyle={{ fontSize: Sizes.regular }}
                  />
                   <RNPickerSelect
                    placeholder={placeholder}
                    value={this.state.gender}
                    // pickerProps={{ style: { height: 214, overflow: 'hidden' } }}
                    onValueChange={(value) => this.setState({ gender: value })}
                    items={PickerData}
                    style={
                      Platform.OS === 'ios'
                        ? styles.inputIOS
                        : styles.inputAndroid
                    }
                    useNativeAndroidPickerStyle={true}
                  />   
                  {/* <Dropdown
                    allowFontScaling={false}
                    placeholder="Select your gender"
                    placeholderTextColor={Constants.black}
                    data={this.state.genders}
                    value={this.state.gender.value}
                    containerStyle={{
                      paddingRight: 10,
                      paddingLeft: 0,
                      width: "80%"
                    }}
                    inputContainerStyle={{
                      borderBottomColor: "transparent"
                    }}
                    pickerStyle={{
                      width: "50%",
                      marginLeft: 10,
                      marginTop: 40
                    }}
                    itemTextStyle={{ color: Constants.black }}
                    itemColor={Constants.black}
                    dropdownOffset={{ top: 10, left: 0 }}
                    onChangeText={(value, index) => {
                      this.setState({ gender: this.state.genders[index] });
                    }}
                  /> */}
                          
                        </View>
              </View>
              <View style={Styles.inputView}>
                <View style={Styles.inputIconView}>
                  <Image style={Styles.inputIcon} source={Images.ImgFlag} />
                </View>
                <View style={Styles.innerInputView}>
                  <TextBold
                    title={"Country Code"}
                    textStyle={{ fontSize: Sizes.regular }}
                  />
                  <TextInput
                    allowFontScaling={false}
                    placeholder="Select your country code"
                    placeholderTextColor={Constants.black}
                    style={Styles.input}
                    value={this.state.countryCode}
                    keyboardType="phone-pad"
                    maxLength={3}
                    onChangeText={text => this.setState({ countryCode: text })}
                  ></TextInput>
                </View>
              </View>
              <View style={[Styles.inputView, { borderBottomWidth: 0 }]}>
                <View style={Styles.inputIconView}>
                  <Image style={Styles.inputIcon} source={Images.ImgPhone} />
                </View>
                <View style={Styles.innerInputView}>
                  <TextBold
                    title={"Mobile"}
                    textStyle={{ fontSize: Sizes.regular }}
                  />
                  <TextInput
                    allowFontScaling={false}
                    placeholder="Please enter your Mobile No."
                    placeholderTextColor={Constants.black}
                    style={Styles.input}
                    value={this.state.contact}
                    keyboardType="phone-pad"
                    maxLength={10}
                    onChangeText={text => this.setState({ contact: text })}
                  ></TextInput>
                </View>
              </View>
            </View>
            <View style={Styles.profileButtonsView}>
              {/* <GreyButton title="Back" fireEvent={this.back}></GreyButton> */}
              <ThemeButton
                title="Save"
                fireEvent={this.mValidation}
              ></ThemeButton>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }

}

const styles = StyleSheet.create({
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
  }
})
