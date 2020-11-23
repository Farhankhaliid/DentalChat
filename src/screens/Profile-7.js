/* @flow */

import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
  Button,
  DeviceEventEmitter
} from "react-native";
import Icon from "react-native-vector-icons/dist/FontAwesome";
import SInfo from "react-native-sensitive-info";
import { Avatar } from "react-native-elements";
import ImagePicker from "react-native-image-picker";
import Spinner from "react-native-loading-spinner-overlay";
import KeyboardSpacer from "react-native-keyboard-spacer";
import PropTypes from "prop-types";
import {
  StatusBar,
  Header,
  GreyButton,
  TextSemiBold,
  ListHeader,
  ThemeButton,
  TextBold,
  TextMedium,
  TextRegular
} from "./../utils/Component";
import Styles from "./../utils/Styles";
import Constants from "./../utils/Constants";
import Images from "./../utils/Images";
import Sizes from "./../utils/Size";
import Fonts from "./../utils/Fonts";
import constants from "./../constants/constants";
import AlertDialog from "../components/AlertDialog";
const DEMO_OPTIONS_1 = [
  "Please Select Gender",
  "Male",
  "Female",
  "Rather not say"
];

var options = {
  title: "Select Image",
  storageOptions: {
    skipBackup: true,
    path: "images"
  }
};

export default class DentistProfileUpdate extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: "Edit Profile",
      tabBarVisible: false,
      tabBarLabel: "More",
      headerTitleAllowFontScaling: false,
      headerTintColor: "#ffffff",
      headerStyle: {
        backgroundColor: constants.baseColor
      },
      tabBarIcon: ({ tintColor }) => (
        <Icon name="ellipsis-h" size={30} color={tintColor} />
      ),
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={{ flexDirection: "row" }}>
            <Icon
              style={{ marginLeft: 15 }}
              name="angle-left"
              size={30}
              color={"#ffffff"}
            />
            <Text
              style={{
                fontSize: 15,
                marginTop: 7,
                marginLeft: 5,
                fontWeight: "500",
                color: "#ffffff"
              }}
            >
              Back
            </Text>
          </View>
        </TouchableOpacity>
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
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
      allLanguage: [], //having all languauge objects
      dentistPersonalStatement: "",
      selectedLanguageId: [], //having only ids of languages
      selectedLanguageData: [] // having selected language object
    };
  }

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

  componentDidMount() {
    DeviceEventEmitter.addListener("language_selected", data => {
      // data1 = JSON.stringify(data1)
      // let data = JSON.parse(data1)
      this.setState({
        selectedLanData: data
      });
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
          // console.log(obj)
          if (obj.status == 1) {
            let selectedLanData = [];
            let selectedLanIds = obj.dentist_lang_details.docs_language.languages.split(
              ","
            );
            console.log("SELECTED_LAN_IDS:" + JSON.stringify(selectedLanIds));
            obj.languages.forEach((element, index) => {
              if (selectedLanIds.indexOf(element.id.toString()) >= 0) {
                selectedLanData.push(element);
              }
            });

            SInfo.setItem(
              "selected_languages",
              JSON.stringify(selectedLanData),
              {
                sharedPreferencesName: "mySharedPrefs",
                keychainService: "myKeychain"
              }
            );
            SInfo.setItem("all_languages", JSON.stringify(obj.languages), {
              sharedPreferencesName: "mySharedPrefs",
              keychainService: "myKeychain"
            });

            mThis.setState(
              {
                allLanguage: obj.languages,
                dentistPersonalStatement:
                  obj.dentist_lang_details.docs_language.personal_statement,
                selectedLanguageId: obj.dentist_lang_details.docs_language.languages.split(
                  ","
                ),
                selectedLanguageData: selectedLanData
              },
              () => {
                // let allLanguage = JSON.parse(JSON.stringify(obj.languages))
                // obj.languages.forEach((element, lanIndex) => {
                //   selectedLanData.forEach((selectedElement) => {
                //     if (selectedElement.id == element.id) {
                //       allLanguage.splice(lanIndex, 1)
                //     }
                //   })
                // });
                // SInfo.setItem('all_languages', JSON.stringify(allLanguage), { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              }
            );
          } else {
          }
        } else {
          mThis.mNetworkFailed();
        }
      }
    });
    xhr.open("POST", constants.url + "service/dentistservice/dentist-step7");
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
      setTimeout(
        () =>
          Alert.alert(
            "Failed",
            "The Internet connection appears to be offline, Please try again"
          ),

        // this.dialog
        //   .show({
        //     title: "Failed",
        //     description:
        //       "The Internet connection appears to be offline, Please try again",
        //     okButtonText:"ok" 
        //   })
        //   .then(({ year }) => {
        //     let list = this.state.educationList;
        //     list[index].completed_year = year;
        //     this.setState({
        //       educationList: list
        //     });
        //   }),
        200
      );
    });
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

    let languages = "";
    let languageName = "";
    let allLanguage = this.state.selectedLanguageData;
    // this.state.allLanguage.forEach((element, index) => {
    //   if (this.state.selectedLanguageId.indexOf(element.id.toString()) >= 0) {
    //     if (languages == "") {
    //       languages = element.id
    //       languageName = element.label
    //     } else {
    //       languages = languages + "," + element.id
    //       languageName = languageName + "," + element.label
    //     }
    //     allLanguage.push(element)
    //   }
    // });

    allLanguage.forEach((element, index) => {
      this.state.selectedLanguageData.forEach((selectedElement, index) => {
        if (selectedElement.id == element.id) {
          if (languages == "") {
            languages = element.id;
            languageName = element.label;
          } else {
            languages = languages + "," + element.id;
            languageName = languageName + "," + element.label;
          }
        }
      });
    });

    var data = new FormData();
    data.append("doctor_id", this.state.dentistId);
    data.append("personal_statement", this.state.dentistPersonalStatement);
    data.append("languages", languages);
    data.append("language_name", languageName);
    data.append("allLanguage", JSON.stringify(allLanguage));
    data.append("pagetype", JSON.stringify(allLanguage));
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
      constants.url + "service/dentistservice/update-dentist-profile-step7"
    );
    // xhr.setRequestHeader('content-type', 'multipart/form-data');
    xhr.setRequestHeader("access-token", this.state.dentistTokan);
    xhr.send(data);
  };

  addMore = () => {
    this.props.navigation.navigate("SearchLanguage", {
      languageSelectedCallback: this.languageSelectedCallback
    });
  };

  languageSelectedCallback = data => {
    console.log("CALLBACK:" + JSON.stringify(data));
    this.setState({
      selectedLanguageData: data
    }),
      () => {
        // isFromAutoComplete = false
      };

    SInfo.setItem("selected_languages", JSON.stringify(data), {
      sharedPreferencesName: "mySharedPrefs",
      keychainService: "myKeychain"
    });

    // this.filterAllLanguage(data);
  };

  delete = index => {
    let newArray = [...this.state.selectedLanguageData];
    // newArray.pop(index)
    newArray.splice(index, 1);
    this.setState({ selectedLanguageData: newArray });

    SInfo.setItem("selected_languages", JSON.stringify(newArray), {
      sharedPreferencesName: "mySharedPrefs",
      keychainService: "myKeychain"
    });
    // SInfo.setItem('all_languages', JSON.stringify(obj.languages), { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });

    // let allLanguage = [...this.state.allLanguage]
  };

  selectLanguage = (id, selected) => {
    if (selected) {
      let newArray = [...this.state.selectedLanguageId];
      newArray.push(id.toString());
      this.setState({ selectedLanguageId: newArray });
    } else {
      let index = this.state.selectedLanguageId.indexOf(id.toString());
      if (index >= 0) {
        let newArray = [...this.state.selectedLanguageId];
        newArray.splice(index, 1);
        this.setState({ selectedLanguageId: newArray });
      }
    }
  };

  // filterAllLanguage = (data) => {

  render() {
    const { navigate } = this.props.navigation;

    if (this.state.gender == 1) {
      this.setState({
        gender: "Male"
      });
    } else if (this.state.gender == 2) {
      this.setState({
        gender: "Female"
      });
    } else if (this.state.gender == 3) {
      this.setState({
        gender: "Rather not say"
      });
    }

    return (
      <View style={[Styles.container, { backgroundColor: "white" }]}>
        <AlertDialog ref={dialog => (this.dialog = dialog)} />
        <Spinner
          overlayColor={"rgba(0, 0, 0, 0.75)"}
          color={"#08a1d9"}
          textContent={"Updating"}
          visible={this.state.visible}
          textStyle={{ color: "#fff", fontSize: 15, marginTop: -70 }}
        ></Spinner>

        <ScrollView>
          <View style={[Styles.container, { backgroundColor: "white" }]}>
            <ListHeader title="Personal Statement" />
            <View>
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#f5f5f5",
                  padding: 10,
                  marginTop: 10,
                  marginLeft: 10,
                  marginRight: 10,
                  height: 200,
                  width: "95%"
                }}
              >
                {/* <Text
                  allowFontScaling={false}
                  style={{ flex: 1, flexWrap: 'wrap', fontSize: 16, color: 'gray', padding: '2%' }}
                >{this.state.dentistPersonalStatement}</Text> */}

                <TextInput
                  allowFontScaling={false}
                  value={this.state.dentistPersonalStatement}
                  keyboardType="default"
                  multiline={true}
                  style={{
                    flex: 1,
                    flexWrap: "wrap",
                    fontSize: 16,
                    color: "gray",
                    padding: "2%",
                    textAlignVertical: "top"
                  }}
                  onChangeText={text =>
                    this.setState({ dentistPersonalStatement: text })
                  }
                />
              </View>
            </View>
            <View
              style={Styles.headerLabel}
            >
              <View
                style={Styles.headerLabelLeft}
              >
                <ListHeader title="Languages" />
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
                    title={"Add Language"}
                    textStyle={{ color: Constants.themeColor }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {this.state.selectedLanguageData.map((item, index) => (
                <View style={Styles.whiteBox}>
                  <View style={[Styles.timing]}>
                    {/* <View style={[Styles.infoIconView, { justifyContent: "center" }]}>
                          <Image source={Images.ImgDoctor} style={Styles.timeIcon}></Image>
                        </View> */}
                    {/* <View
                      style={{
                        width: 30,
                        backgroundColor: constants.baseColor,
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Image
                        source={Images.ImgLage}
                        style={{ height: 30, width: 30 }}
                      ></Image>
                    </View> */}
                    <View style={[Styles.timeInfoView, { width: "100%" }]}>
                      <TextBold
                        title={item.label}
                        textStyle={{
                          fontSize: Sizes.regular,
                          paddingLeft: 10,
                          width: "90%"
                        }}
                      ></TextBold>

                      {index != 0 ? (
                        <TouchableOpacity
                          style={{
                            height: "100%",
                            alignItems: "flex-end",
                            width: "10%",
                            justifyContent: "center"
                          }}
                          onPress={() => this.delete(index)}
                        >
                          <Image
                            source={Images.ImgDelete}
                            style={{
                              resizeMode: "center",
                              height: 25,
                              width: 25
                            }}
                          />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </View>
                </View>
              ))}
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {this.state.allLanguage.map(
                (item, index) =>
                  item.id &&
                    this.state.selectedLanguageId.indexOf(item.id.toString()) >=
                    0 ? (
                      <>
                        {/* <TouchableOpacity style={styles.searchSection} onPress={() => this.selectLanguage(item.id, false)}>
                      <View style={{ width: '30%', backgroundColor: constants.baseColor, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={Images.ImgLage} style={{ height: 30, width: 30 }}></Image>
                      </View>
                      <View style={{ width: '70%', height: 50, backgroundColor: Constants.themeColor, justifyContent: 'center', alignItems: 'center' }}>
                        <TextBold title={item.label} textStyle={[styles.textInputStyle, { color: 'white' }]}></TextBold>
                      </View>

                    </TouchableOpacity>*/}
                      </>
                    ) : (
                      <>
                        {/*  <TouchableOpacity style={styles.searchSection} onPress={() => this.selectLanguage(item.id, true)}>
                      <View style={{ width: '30%', backgroundColor: constants.baseColor, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={Images.ImgLage} style={{ height: 30, width: 30 }}></Image></View>
                      <View style={{ width: '70%', height: 50, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                        <TextBold title={item.label} textStyle={[styles.textInputStyle]}></TextBold>
                        
                      </View>


                    </TouchableOpacity> */}
                      </>
                    )

                // <TouchableOpacity style={styles.searchSection}>
                //   <View style={{ width: '30%', backgroundColor: constants.baseColor, justifyContent: 'center', alignItems: 'center' }}>
                //     <Image source={Images.ImgLage} style={{ height: 30, width: 30 }}></Image></View>
                //   <View style={{ width: '70%', height: 50, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                //     <TextBold title={item.label} textStyle={[styles.textInputStyle]}></TextBold>
                //     {/* <TextInput
                //       allowFontScaling={false}
                //       value={item.label}
                //       keyboardType='default'
                //       placeholder='Degree'
                //       style={styles.textInputStyle}
                //       onChangeText={(text) => this.setState({ degree: text })} /> */}
                //   </View>

                // </TouchableOpacity>

                // <TouchableOpacity style={styles.searchSection}>
                //   <View style={{ width: '30%', backgroundColor: constants.baseColor, justifyContent: 'center', alignItems: 'center' }}>
                //     <Image source={Images.ImgLage} style={{ height: 30, width: 30 }}></Image></View>
                //   <View style={{ width: '70%', height: 50, backgroundColor: 'grey', justifyContent: 'center', alignItems: 'center' }}>
                //     <TextBold title={item.label} textStyle={[styles.textInputStyle]}></TextBold>
                //   </View>

                // </TouchableOpacity>
              )}
            </View>

            <View style={Styles.profileButtonsView}>
              {/* <ThemeButton
                title="Add More"
                fireEvent={this.addMore}
              ></ThemeButton> */}
              {/* <GreyButton title="Back" fireEvent={this.back}></GreyButton> */}
              <ThemeButton title="Publish" fireEvent={this.save}></ThemeButton>
            </View>
            <KeyboardSpacer />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  searchIcon: {
    marginLeft: 20
  },
  textInputStyle: {
    shadowOffset: { width: 1, height: 2 },
    shadowColor: "#ccc",
    borderColor: "#ccc",
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    textAlignVertical: "center",
    textAlign: "center"
  },
  logoutContainer: {
    flex: 1,
    justifyContent: "flex-end"
  },
  optionsListStyle: {
    marginTop: 10,
    marginBottom: 30,
    backgroundColor: "white"
  },
  subtitleView: {
    marginLeft: 30
  },
  maintitleView: {
    marginLeft: 30,
    marginTop: 10
  },
  optiontitleView: {
    marginTop: 10
  },
  subtitleTextStyle: {
    color: "#999"
  },
  maintitleTextStyle: {
    color: "#111",
    fontSize: 18,
    fontWeight: "bold"
  },
  titleAndVersionContainerStyle: {
    justifyContent: "center",
    alignItems: "center",
    height: 150
  },
  titleContainerStyle: {
    marginBottom: 10
  },
  titleTextStyle: {
    fontWeight: "bold",
    fontSize: 15,
    color: "grey"
  },
  versionTextStyle: {
    color: "grey"
  },
  containerRow: {
    height: 60,
    marginTop: 10,
    backgroundColor: "white"
  },
  imageview: {
    marginTop: 5
  },
  profileImage: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  editView: {
    height: 50,
    backgroundColor: "#fff",
    marginTop: 10
  },
  editViewNext: {
    height: 50,
    backgroundColor: "#fff",
    marginTop: 1
  },
  editViewLast: {
    height: 50,
    backgroundColor: "#fff",
    marginTop: 10
  },
  searchSection: {
    marginTop: 10,
    flexDirection: "row",
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: "white",
    borderRadius: 10,
    marginLeft: "3.3%",
    width: "45%",
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: "lightgray"
  },
  searchSection1: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  dropdown: {
    width: 300,
    height: 50,
    marginLeft: 20
  },
  dropdown_text: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: "bold",
    color: "#111"
  },
  dropdown_pop: {
    width: 200,
    height: 160
  },
  dropdown_pop_text: {
    marginVertical: 5,
    marginHorizontal: 6,
    fontSize: 18,
    color: "#ccc"
  }
});

const optionsList = [
  {
    title: "Edit Profie",
    icon: "edit",
    screenName: "DentistEditProfile"
  },
  {
    title: "Change Password",
    icon: "lock",
    screenName: "DentistChangePassword"
  }
];
