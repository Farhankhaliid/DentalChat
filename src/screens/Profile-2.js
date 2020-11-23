import React, { Component } from "react";
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert
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
import moment from "moment";
import DateTimePicker from "react-native-modal-datetime-picker";
import ImageZoomComponent from '../components/ImageZoom'


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
      sunClose: ""
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

  mUpdateProfile = () => {
    var mThis = this;
    var data = new FormData();
    data.append("doctor_id", this.state.dentistId);
    data.append("business_name", this.state.businessName);
    data.append("web_address", this.state.webAddress);
    data.append("address", this.state.businessAddress);
    data.append("sun_opening_hours_from", this.state.sunOpen);
    data.append("sun_opening_hours_to", this.state.sunClose);
    data.append("mon_opening_hours_from", this.state.monOpen);
    data.append("mon_opening_hours_to", this.state.monClose);
    data.append("tue_opening_hours_from", this.state.tueOpen);
    data.append("tue_opening_hours_to", this.state.tueClose);
    data.append("wed_opening_hours_from", this.state.wedOpen);
    data.append("wed_opening_hours_to", this.state.wedClose);
    data.append("thu_opening_hours_from", this.state.thuOpen);
    data.append("thu_opening_hours_to", this.state.thuClose);
    data.append("fri_opening_hours_from", this.state.friOpen);
    data.append("fri_opening_hours_to", this.state.friClose);
    data.append("sat_opening_hours_from", this.state.satOpen);
    data.append("sat_opening_hours_to", this.state.satClose);
    data.append("clinic_picture", this.state.picture);
    data.append("auth_token", this.state.token);
    console.log(data);
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
      constants.url + "service/dentistservice/update-dentist-profile-step2"
    );
    xhr.setRequestHeader("content-type", "multipart/form-data");
    xhr.setRequestHeader("access-token", this.state.dentistTokan);
    xhr.send(data);
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
            if (obj.dentistdetails.docs_clinics.clinic_picture == "") {
              img = {
                uri: constants.imageUrl + "uploads/clinic_picture/no_image.jpg"
              };
            } else {
              img = {
                uri: constants.imageUrl + "uploads/clinic_picture/" + obj.dentistdetails.docs_clinics.clinic_picture
              };
            }
            mThis.setState({
              visible: false,
              businessName: obj.dentistdetails.docs_clinics.business_name,
              businessAddress: obj.dentistdetails.docs_clinics.address,
              webAddress: obj.dentistdetails.docs_clinics.web_address,
              monOpen: obj.dentistdetails.docs_clinics.mon_opening_hours_from,
              monClose: obj.dentistdetails.docs_clinics.mon_opening_hours_to,
              tueOpen: obj.dentistdetails.docs_clinics.tue_opening_hours_from,
              tueClose: obj.dentistdetails.docs_clinics.tue_opening_hours_to,
              wedOpen: obj.dentistdetails.docs_clinics.wed_opening_hours_from,
              wedClose: obj.dentistdetails.docs_clinics.wed_opening_hours_to,
              thusOpen: obj.dentistdetails.docs_clinics.thu_opening_hours_from,
              thusClose: obj.dentistdetails.docs_clinics.thu_opening_hours_to,
              friOpen: obj.dentistdetails.docs_clinics.fri_opening_hours_from,
              friClose: obj.dentistdetails.docs_clinics.fri_opening_hours_to,
              satOpen: obj.dentistdetails.docs_clinics.sat_opening_hours_from,
              satClose: obj.dentistdetails.docs_clinics.sat_opening_hours_to,
              sunOpen: obj.dentistdetails.docs_clinics.sun_opening_hours_from,
              sunClose: obj.dentistdetails.docs_clinics.sun_opening_hours_to,
              picture: img
            });
          } else {
          }
        } else {
          mThis.mNetworkFailed();
        }
      }
    });
    xhr.open("POST", constants.url + "service/dentistservice/dentist-step2");
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
          picture: myImg
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
        let fileName = "clinic_pic.JPG"
        if (response && response.fileName) {
          let extension = response.fileName.substr(response.fileName.lastIndexOf('.'));
          if (extension && extension != "") {
            fileName = response.fileName
          }

        }

        const source = {
          uri: response.uri,
          type: "image/jpeg",
          name: fileName
        };
        this.setState({ picture: source, imageUpdated: true }, () => {
          console.log("Image captured");
        });
        console.warn(source);
      }
    });
  }
  showFirstDate = dateClicked => {
    this.setState({ isFirstDateOpened: true, selectedIndexDate: dateClicked });
  };

  showLastDate = () => {
    this.setState({ isLastDateOpened: true });
  };

  hideDateTimePicker = () => {
    this.setState({
      isFirstDateOpened: false,
      isLastDateOpened: false
    });
  };

  selectedDate(date, day) {
    this.setState(
      {
        [day]: moment(date).format("hh:mm A"),
        isFirstDateOpened: false
      },
      () => {
        setTimeout(() => {
          this.showLastDate();
        }, 400);
      }
    );
  }

  selectedLastDate(date, day) {
    this.hideDateTimePicker();
    this.setState({
      [day]: moment(date).format("hh:mm A")
    });
  }
  getFirstDate = date => {
    switch (this.state.selectedIndexDate) {
      case 0:
        this.selectedDate(date, "sunOpen");
        break;
      case 1:
        this.selectedDate(date, "monOpen");
        break;
      case 2:
        this.selectedDate(date, "tueOpen");
        break;
      case 3:
        this.selectedDate(date, "wedOpen");
        break;
      case 4:
        this.selectedDate(date, "thusOpen");
        break;
      case 5:
        this.selectedDate(date, "friOpen");
        break;
      case 6:
        this.selectedDate(date, "satOpen");
        break;
    }
  };

  getLastDate = date => {
    switch (this.state.selectedIndexDate) {
      case 0:
        this.selectedLastDate(date, "sunClose");
        break;
      case 1:
        this.selectedLastDate(date, "monClose");
        break;
      case 2:
        this.selectedLastDate(date, "tueClose");
        break;
      case 3:
        this.selectedLastDate(date, "wedClose");
        break;
      case 4:
        this.selectedLastDate(date, "thusClose");
        break;
      case 5:
        this.selectedLastDate(date, "friClose");
        break;
      case 6:
        this.selectedLastDate(date, "satClose");
        break;
    }
  };

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
        <DateTimePicker
          allowFontScaling={false}
          isVisible={this.state.isFirstDateOpened}
          onConfirm={this.getFirstDate}
          mode="time"
          onCancel={this.hideDateTimePicker}
          titleIOS={"Experience From"}
        />
        <DateTimePicker
          allowFontScaling={false}
          isVisible={this.state.isLastDateOpened}
          onConfirm={this.getLastDate}
          onCancel={this.hideDateTimePicker}
          titleIOS={"Experience To"}
          mode="time"
        />
        <ScrollView>
          <View style={Styles.container}>
            <ListHeader title="Business Details" />
            <View style={Styles.whiteBox}>
              <TouchableOpacity
                style={Styles.cameraView}
                onPress={() => this.showImagePicker()}
              >
                <View style={Styles.cameraBox}>
                  {this.state.picture.uri ? (
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
                      this.setModalVisible(this.state.picture)
                    }
                  >
                    <Image
                      style={Styles.imageStyle}
                      source={
                        this.state.picture.uri
                          ? this.state.picture
                          : Images.ImgCamera
                      }
                    />
                  </TouchableOpacity>
                </View>
                <TextSemiBold
                  title={"Change Profile Photo"}
                  textStyle={{ fontSize: Sizes.regular }}
                ></TextSemiBold>
              </TouchableOpacity>
              <View style={Styles.infoView}>
                <View style={Styles.infoIconView}>
                  <Image style={Styles.inputIcon} source={Images.ImgBag} />
                </View>
                <View style={Styles.innerInputView}>
                  <TextBold
                    title={"Business Name"}
                    textStyle={{ fontSize: Sizes.regular }}
                  />
                  {/* <TextMedium title={this.state.businessName} textStyle={Styles.info}></TextMedium> */}
                  <TextInput
                    allowFontScaling={false}
                    placeholder="Please enter your Business name"
                    placeholderTextColor={Constants.black}
                    style={Styles.input}
                    value={this.state.businessName}
                    onChangeText={text => this.setState({ businessName: text })}
                  ></TextInput>
                </View>
              </View>
              <View style={Styles.infoView}>
                <View style={Styles.infoIconView}>
                  <Image style={Styles.inputIcon} source={Images.ImgLocation} />
                </View>
                <View style={Styles.innerInputView}>
                  <TextBold
                    title={"Address"}
                    textStyle={{ fontSize: Sizes.regular }}
                  />
                  <TextInput
                    allowFontScaling={false}
                    placeholder="Please enter your Business Address"
                    placeholderTextColor={Constants.black}
                    style={Styles.input}
                    value={this.state.businessAddress}
                    onChangeText={text =>
                      this.setState({ businessAddress: text })
                    }
                  ></TextInput>
                </View>
              </View>
              <View style={[Styles.infoView, { borderBottomWidth: 0 }]}>
                <View style={Styles.infoIconView}>
                  <Image style={Styles.inputIcon} source={Images.ImgEarth} />
                </View>
                <View style={Styles.innerInputView}>
                  <TextBold
                    title={"Business Website"}
                    textStyle={{ fontSize: Sizes.regular }}
                  />
                  {/* <TextMedium title={this.state.webAddress} textStyle={Styles.info}></TextMedium> */}
                  <TextInput
                    allowFontScaling={false}
                    placeholder="Please enter your WebAddress"
                    placeholderTextColor={Constants.black}
                    style={Styles.input}
                    value={this.state.webAddress}
                    onChangeText={text => this.setState({ webAddress: text })}
                  ></TextInput>
                </View>
              </View>
            </View>
            <ListHeader title="Office Hours" />
            <View style={Styles.whiteBox}>
              <View style={Styles.timing}>
                <View
                  style={[Styles.infoIconView, { justifyContent: "center" }]}
                >
                  <Image
                    source={Images.ImgClock}
                    style={Styles.timeIcon}
                  ></Image>
                </View>
                <TouchableOpacity
                  style={Styles.timeInfoView}
                  onPress={() => {
                    this.showFirstDate(1);
                  }}
                >
                  <TextBold
                    title={"Monday"}
                    textStyle={{ fontSize: Sizes.regular }}
                  ></TextBold>
                  <TextMedium
                    title={`${this.state.monOpen} - ${this.state.monClose}`}
                    textStyle={{ fontSize: Sizes.regular }}
                  ></TextMedium>
                </TouchableOpacity>
              </View>
              <View style={Styles.timing}>
                <View
                  style={[Styles.infoIconView, { justifyContent: "center" }]}
                >
                  <Image
                    source={Images.ImgClock}
                    style={Styles.timeIcon}
                  ></Image>
                </View>
                <TouchableOpacity
                  style={Styles.timeInfoView}
                  onPress={() => {
                    this.showFirstDate(2);
                  }}
                >
                  <TextBold
                    title={"Tuesday"}
                    textStyle={{ fontSize: Sizes.regular }}
                  ></TextBold>
                  <TextMedium
                    title={`${this.state.tueOpen} - ${this.state.tueClose}`}
                    textStyle={{ fontSize: Sizes.regular }}
                  ></TextMedium>
                </TouchableOpacity>
              </View>
              <View style={Styles.timing}>
                <View
                  style={[Styles.infoIconView, { justifyContent: "center" }]}
                >
                  <Image
                    source={Images.ImgClock}
                    style={Styles.timeIcon}
                  ></Image>
                </View>
                <TouchableOpacity
                  style={Styles.timeInfoView}
                  onPress={() => {
                    this.showFirstDate(3);
                  }}
                >
                  <TextBold
                    title={"Wednesday"}
                    textStyle={{ fontSize: Sizes.regular }}
                  ></TextBold>
                  <TextMedium
                    title={`${this.state.wedOpen} - ${this.state.wedClose}`}
                    textStyle={{ fontSize: Sizes.regular }}
                  ></TextMedium>
                </TouchableOpacity>
              </View>
              <View style={Styles.timing}>
                <View
                  style={[Styles.infoIconView, { justifyContent: "center" }]}
                >
                  <Image
                    source={Images.ImgClock}
                    style={Styles.timeIcon}
                  ></Image>
                </View>
                <TouchableOpacity
                  style={Styles.timeInfoView}
                  onPress={() => {
                    this.showFirstDate(4);
                  }}
                >
                  <TextBold
                    title={"Thursday"}
                    textStyle={{ fontSize: Sizes.regular }}
                  ></TextBold>
                  <TextMedium
                    title={`${this.state.thusOpen} - ${this.state.thusClose}`}
                    textStyle={{ fontSize: Sizes.regular }}
                  ></TextMedium>
                </TouchableOpacity>
              </View>
              <View style={Styles.timing}>
                <View
                  style={[Styles.infoIconView, { justifyContent: "center" }]}
                >
                  <Image
                    source={Images.ImgClock}
                    style={Styles.timeIcon}
                  ></Image>
                </View>
                <TouchableOpacity
                  style={Styles.timeInfoView}
                  onPress={() => {
                    this.showFirstDate(5);
                  }}
                >
                  <TextBold
                    title={"Friday"}
                    textStyle={{ fontSize: Sizes.regular }}
                  ></TextBold>
                  <TextMedium
                    title={`${this.state.friOpen} - ${this.state.friClose}`}
                    textStyle={{ fontSize: Sizes.regular }}
                  ></TextMedium>
                </TouchableOpacity>
              </View>
              <View style={Styles.timing}>
                <View
                  style={[Styles.infoIconView, { justifyContent: "center" }]}
                >
                  <Image
                    source={Images.ImgClock}
                    style={Styles.timeIcon}
                  ></Image>
                </View>
                <TouchableOpacity
                  style={Styles.timeInfoView}
                  onPress={() => {
                    this.showFirstDate(6);
                  }}
                >
                  <TextBold
                    title={"Saturday"}
                    textStyle={{ fontSize: Sizes.regular }}
                  ></TextBold>
                  <TextMedium
                    title={`${this.state.satOpen} - ${this.state.satClose}`}
                    textStyle={{ fontSize: Sizes.regular }}
                  ></TextMedium>
                </TouchableOpacity>
              </View>
              <View style={[Styles.timing, { borderBottomWidth: 0 }]}>
                <View
                  style={[Styles.infoIconView, { justifyContent: "center" }]}
                >
                  <Image
                    source={Images.ImgClock}
                    style={Styles.timeIcon}
                  ></Image>
                </View>
                <TouchableOpacity
                  style={Styles.timeInfoView}
                  onPress={() => {
                    this.showFirstDate(0);
                  }}
                >
                  <TextBold
                    title={"Sunday"}
                    textStyle={{ fontSize: Sizes.regular }}
                  ></TextBold>
                  <TextMedium
                    title={`${this.state.sunOpen} - ${this.state.sunClose}`}
                    textStyle={{ fontSize: Sizes.regular }}
                  ></TextMedium>
                </TouchableOpacity>
              </View>
            </View>
            <View style={Styles.profileButtonsView}>
              {/* <GreyButton title="Back" fireEvent={this.back}></GreyButton> */}
              <ThemeButton title="Save" fireEvent={this.save}></ThemeButton>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
