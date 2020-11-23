/* @flow */

import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import Icon from "react-native-vector-icons/dist/FontAwesome";
import SInfo from "react-native-sensitive-info";
import { ListItem, Button, Avatar } from "react-native-elements";
import PropTypes from "prop-types";
import constants from "./../constants/constants";
import Spinner from "react-native-loading-spinner-overlay";

export default class DentistAccount extends Component {
  static navigationOptions = {
    title: "Edit Profile",
    headerTintColor: "#ffffff",
    headerStyle: {
      backgroundColor: constants.baseColor
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      userProfileImg: "",
      userProfileName: "",
      token: "",
      doctorId: "",
      firebase: "",
      rady: false
    };
  }
  componentDidMount() {
    SInfo.getItem("dentist_pic", {
      sharedPreferencesName: "mySharedPrefs",
      keychainService: "myKeychain"
    }).then(value => {
      console.log("<><><><>" + value);
      if (value == "") {
        this.setState({
          userProfileImg:
            constants.imageUrl + "uploads/dentist_profile_image/no_image.jpg"
        });
      } else {
        this.setState({
          userProfileImg:
            constants.imageUrl + "uploads/dentist_profile_image/" + value
        });
      }
    });
    SInfo.getItem("dentist_name", {
      sharedPreferencesName: "mySharedPrefs",
      keychainService: "myKeychain"
    }).then(value => {
      console.log(value);
      this.setState({
        userProfileName: value
      });
    });
    SInfo.getItem("token", {
      sharedPreferencesName: "mySharedPrefs",
      keychainService: "myKeychain"
    }).then(value => {
      console.log("time to fetch token");
      this.setState({ token: value });
    });
    SInfo.getItem("dentist_id", {
      sharedPreferencesName: "mySharedPrefs",
      keychainService: "myKeychain"
    }).then(value => {
      this.setState({ doctorId: value });
      console.log(value);
    });
    SInfo.getItem("fcmToken", {
      sharedPreferencesName: "mySharedPrefs",
      keychainService: "myKeychain"
    }).then(value => {
      console.log("we recieved fcm token" + value);
      this.setState({ firebase: value });
    });
  }
  proseccLogout() {
    this.setState({ rady: true });
    var data = new FormData();
    data.append("auth_token", this.state.token);
    data.append("doctor_id", this.state.doctorId);
    data.append("device_token", this.state.firebase);
    console.log(data);
    fetch(constants.url + "service/logout", {
      method: "POST",
      body: data,
      headers: {
        //Accept: 'application/json',
        //'Content-Type': 'json; charset=UTF-8',
        "Content-Type": "multipart/form-data"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        SInfo.deleteItem('patientMessagesData', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
        setTimeout(() => {
          this.setState({ rady: false });
        }, 100);
        setTimeout(() => {
          Alert.alert(
            "Message",
            "You have been logged out successfully",
            [
              {
                text: "Ok",
                onPress: () => {
                  AsyncStorage.setItem("postData", "");
                  SInfo.setItem("patientMessagesData", "", {
                    sharedPreferencesName: "mySharedPrefs",
                    keychainService: "myKeychain"
                  });
                  SInfo.setItem("is_patient_login", "0", {
                    sharedPreferencesName: "mySharedPrefs",
                    keychainService: "myKeychain"
                  });
                  SInfo.setItem("is_dentist_login", "0", {
                    sharedPreferencesName: "mySharedPrefs",
                    keychainService: "myKeychain"
                  });
                  this.props.navigation.navigate("Home");
                },
                style: "cancel"
              }
            ],
            { cancelable: false }
          );
        }, 200);
      })
      .catch(error => {
        this.setState({ rady: false });
        console.log(error);
        this.mFailed();
      });
  }
  updateData = () => {
    SInfo.getItem("dentist_pic", {
      sharedPreferencesName: "mySharedPrefs",
      keychainService: "myKeychain"
    }).then(value => {
      console.log("<><><><>" + value);
      if (value == "") {
        this.setState({
          userProfileImg:
            constants.imageUrl + "uploads/dentist_profile_image/no_image.jpg"
        });
      } else {
        this.setState({
          userProfileImg:
            constants.imageUrl + "uploads/dentist_profile_image/" + value
        });
      }
    });
  };
  logOut() {
    Alert.alert(
      "Alert",
      "Are you sure you want to logout",
      [
        {
          text: "Yes",
          onPress: () => {
            this.proseccLogout();
          }
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ],
      { cancelable: false }
    );
  }
  changePass() {
    this.props.navigation.navigate("DentistChangePassword");
  }
  navigateTo(path) {
    this.props.navigation.navigate(path);
  }
  subscripitonPage() {
    this.props.navigation.navigate("DentistSubscription");
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={css.container}>
        {this.state.rady == true ? (
          <Spinner
            overlayColor={"rgba(0, 0, 0, 0.75)"}
            color={"#08a1d9"}
            textContent={"Updating"}
            visible={this.state.rady}
            textStyle={{ color: "#fff", fontSize: 15, marginTop: -70 }}
          />
        ) : (
            <View></View>
          )}
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("DentistProfileUpdate")}
        >
          <View style={css.other_row}>
            <Text allowFontScaling={false} style={css.text_title_tag}>
              Basic Info
            </Text>
            <Icon
              name="angle-right"
              size={30}
              color="#cecece"
              style={{ position: "absolute", right: 10, marginTop: 5 }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.navigateTo("DentistProfileUpdate2")}
        >
          <View style={css.other_row}>
            <Text allowFontScaling={false} style={css.text_title_tag}>
              Business Details
            </Text>
            <Icon
              name="angle-right"
              size={30}
              color="#cecece"
              style={{ position: "absolute", right: 10, marginTop: 5 }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.navigateTo("DentistProfileUpdate3")}
        >
          <View style={css.other_row}>
            <Text allowFontScaling={false} style={css.text_title_tag}>
              Education and Training
            </Text>
            <Icon
              name="angle-right"
              size={30}
              color="#cecece"
              style={{ position: "absolute", right: 10, marginTop: 5 }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.navigateTo("DentistProfileUpdate4")}
        >
          <View style={css.other_row}>
            <Text allowFontScaling={false} style={css.text_title_tag}>
              NPI & State License Info
            </Text>
            <Icon
              name="angle-right"
              size={30}
              color="#cecece"
              style={{ position: "absolute", right: 10, marginTop: 5 }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.navigateTo("DentistProfileUpdate5")}
        >
          <View style={css.other_row}>
            <Text allowFontScaling={false} style={css.text_title_tag}>
              Professional Experience
            </Text>
            <Icon
              name="angle-right"
              size={30}
              color="#cecece"
              style={{ position: "absolute", right: 10, marginTop: 5 }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.navigateTo("DentistProfileUpdate6")}
        >
          <View style={css.other_row}>
            <Text allowFontScaling={false} style={css.text_title_tag}>
              Specialties
            </Text>
            <Icon
              name="angle-right"
              size={30}
              color="#cecece"
              style={{ position: "absolute", right: 10, marginTop: 5 }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.navigateTo("DentistProfileUpdate7")}
        >
          <View style={css.other_row}>
            <Text allowFontScaling={false} style={css.text_title_tag}>
              Personal Statement
            </Text>
            <Icon
              name="angle-right"
              size={30}
              color="#cecece"
              style={{ position: "absolute", right: 10, marginTop: 5 }}
            />
          </View>
        </TouchableOpacity>
        {/* <List style={{ marginTop: 0 }}>
          <ListItem
            style={accountstyles.containerRow}
            title={<View
              style={accountstyles.maintitleView}>
              <Text style={accountstyles.maintitleTextStyle}>{this.state.userProfileName}</Text>
            </View>
            }
            hideChevron
            subtitle={<View
              style={accountstyles.subtitleView}>
              <Text style={accountstyles.subtitleTextStyle}>Patient Account</Text>
            </View>
            }

            avatar={
              <View style={accountstyles.imageview}>
                <Avatar
                  rounded
                  medium
                  source={{ uri: this.state.userProfileImg }} />
              </View>
            }
          />


          <ListItem
            onPress={() => navigate('PatientProfileUpdate')}
            style={{ height: 40, marginTop: 5, backgroundColor: 'white' }}
            title={<View
              style={accountstyles.optiontitleView}>
              <Text style={{ color: '#424242', fontSize: 16, fontWeight: 'bold' }}>Edit Profile</Text>
            </View>
            }
            rightIcon={{ name: 'chevron-right', type: 'font-awesome', style: { marginTop: 10, marginRight: 10, fontSize: 15 } }}
          />

          <ListItem
            onPress={() => navigate('PatientChangePassword')}
            style={{ height: 40, marginTop: 20, backgroundColor: 'white' }}
            title={<View
              style={accountstyles.optiontitleView}>
              <Text style={{ color: '#424242', fontSize: 16, fontWeight: 'bold' }}>Change Password</Text>
            </View>
            }
            leftIcon={{ name: 'lock', type: 'font-awesome', style: { marginTop: 10, fontSize: 20 } }}
            rightIcon={{ name: 'chevron-right', type: 'font-awesome', style: { marginTop: 10, marginRight: 10, fontSize: 15 } }}
          />
        </List> */}

        {/* <View style={css.logoutContainer}>
          <Button
            raised
            icon={{ name: 'logout', type: 'material-community' }}
            title='Logout'
            onPress={() => this.logOut()}
            containerViewStyle={{ marginTop: 10, marginBottom: 10 }}
            backgroundColor='#d14836'
            textStyle={{ color: 'white' }}
          />
        </View> */}
      </View>
    );
  }
}

const css = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4"
  },
  toprow: {
    flexDirection: "row",
    width: "96%",
    height: 85,
    marginLeft: "2%",
    marginRight: "2%",
    marginTop: 10,
    backgroundColor: "#ffffff"
  },
  other_row: {
    flexDirection: "row",
    width: "96%",
    height: 43,
    marginLeft: "2%",
    marginRight: "2%",
    marginTop: 10,
    backgroundColor: "#ffffff"
  },
  logoutContainer: {
    flex: 1,
    width: "90%",
    marginLeft: "5%",
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

  text_name: {
    color: "#111",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
    marginTop: 15
  },

  text_title_tag: {
    color: "#111",
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 15,
    marginTop: 12
  },

  text_sub_tag: {
    color: "#cecece",
    fontSize: 14,
    marginLeft: 15,
    marginTop: 5
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
  }
});
