import React, { Component } from "react";
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput
} from "react-native";
// import Toast from 'react-native-simple-toast';
import {
  StatusBar,
  Header,
  GreyButton,
  TextSemiBold,
  ListHeader,
  ThemeButton,
  TextBold,
  TextMedium
} from "./../utils/Component";
import Styles from "./../utils/Styles";
import Constants from "./../utils/Constants";
import Images from "./../utils/Images";
import Sizes from "./../utils/Size";
import Fonts from "./../utils/Fonts";
import ImagePicker from "react-native-image-picker";
import SInfo from "react-native-sensitive-info";
import Spinner from "react-native-loading-spinner-overlay";
import constants from "./../constants/constants";
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
      webAddress: "",
      monOpen: "",
      monClose: "",
      tueOpen: "",
      tueClose: "",
      wedOpen: "",
      wedClose: "",
      thusOpen: "",
      thusClose: "",
      friOpen: "",
      friClose: "",
      satOpen: "",
      satClose: "",
      sunOpen: "",
      sunClose: "",
      dentistSkills: []
    };
  }

  back = () => {
    this.props.navigation.goBack();
  };

  save = () => {
    // this.mSuccess();
    this.mLoaderShowHide();
    this.mUpdateProfile();
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
    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        if (this.responseText.indexOf("status") !== -1) {
          var text = this.responseText;
          console.log(this.responseText);
          var obj = JSON.parse(text);
          console.log(obj);
          if (obj.status == 1) {
            mThis.setState({ dentistSkills: obj.dentist_skills });
          } else {
          }
        } else {
          mThis.mNetworkFailed();
        }
      }
    });
    xhr.open("POST", constants.url + "service/dentistservice/dentist-step6");
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
        const source = { uri: response.uri };
        this.setState({ picture: source, imageUpdated: true }, () => {
          console.log("Image captured");
        });
        console.warn(source);
      }
    });
  }

  updateDentistSkills = (key, text, index) => {
    let newArray = [...this.state.dentistSkills];
    newArray[index] = { ...newArray[index], [key]: text };
    this.setState({ dentistSkills: newArray });
  };

  addMore = () => {
    let length = this.state.dentistSkills.length + 1;
    let id = "choice" + length;
    let item = { id: id };
    let newArray = [...this.state.dentistSkills];
    newArray.push(item);
    // newArray[index] = { ...newArray[index], [key]: text }
    this.setState({ dentistSkills: newArray });
  };

  delete = index => {
    let newArray = [...this.state.dentistSkills];
    // newArray.pop(index)
    newArray.splice(index, 1);
    this.setState({ dentistSkills: newArray });
  };

  mUpdateProfile = () => {
    var mThis = this;
    var data = new FormData();
    data.append("dentist_skills", JSON.stringify(this.state.dentistSkills));
    data.append("auth_token", this.state.token);
    console.log(data);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
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
      constants.url + "service/dentistservice/update-dentist-profile-step6"
    );
    // xhr.setRequestHeader('content-type', 'multipart/form-data');
    xhr.setRequestHeader("access-token", this.state.dentistTokan);
    xhr.send(data);
  };

  render() {
    // console.log(this.props.navigation.state.routeName + " Screen");
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
        <Header
          title={"Edit Profile"}
          isbackButton={true}
          fireEvent={this.back}
        />
        <ScrollView>
          <View style={Styles.container}>
            <ListHeader title="Specialities" />
            {this.state.dentistSkills.map((item, index) => (
              <View style={Styles.whiteBox}>
                <View style={Styles.timing}>
                  {/* <View
                    style={[Styles.infoIconView, { justifyContent: "center" }]}
                  >
                    <Image
                      source={Images.ImgDoctor}
                      style={Styles.timeIcon}
                    ></Image>
                  </View> */}
                  <View style={[Styles.timeInfoView, { width: "100%" }]}>
                    {/* <TextBold title={item.skills} textStyle={{ fontSize: Sizes.regular }}></TextBold> */}
                    <TextInput
                      placeholder="Please enter your Skills"
                      placeholderTextColor={Constants.black}
                      style={[
                        Styles.input,
                        { fontWeight: "bold", width: "90%", paddingLeft: 10 }
                      ]}
                      value={item.skills}
                      onChangeText={text =>
                        this.updateDentistSkills("skills", text, index)
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
                        onPress={() => this.delete(index)}
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
