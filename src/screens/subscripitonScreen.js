/* @flow */

import React, { Component } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  Text,
  Platform,
  Modal,
  Button,
  SafeAreaView
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

import { SearchBar } from "react-native-elements";
import DentistMessageItem from "../components/DentistMessageItem";
import { Data } from "../data/DentistMessagesList";
import Spinner from "react-native-loading-spinner-overlay";
import MessagesIconWithBadge from "../components/MessagesIconWithBadge";
import SInfo from "react-native-sensitive-info";
import Icon from "react-native-vector-icons/Ionicons";
import PropTypes from "prop-types";
import constants from "./../constants/constants";
import timer from "react-native-timer";
import filterImage from "./../images/filterresult.png";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import CheckBox from '@react-native-community/checkbox';
export default class Subscription extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    global.MyDental = "0";
    super(props);
    this.state = {
      visible: false,
      rady: false,
      dataArray: [],
      dataArrayAll: [],
      doctorId: "",
      isRefreshing: false,
      isSearching: false,
      alertMsg: "",
      opration: "",
      type: "",
      more: "0",
      page: 0,
      unreadCount: "0",
      token: "",
      mUnreadCount: 0,
      showModal: false,
      scrollDown: false,
      checkBox: 0,
      SearchBarColor: "#bdc6ce"
    };
  }
  alertOpen = () => {
    Alert.alert(
      "Subscribe",
      "You are transferred to Dentalchat.com webapp to process your subscription request. ",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Ok",
          onPress: () => {
            this.props.navigation.navigate("subscriptionPurchase");
          }
        }
      ],
      { cancelable: false }
    );
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
      this.mLoaderShowHide();
      this.mEditProfile();
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

  mEditProfile() {
    var mThis = this;
    var data = new FormData();
    data.append("auth_token", this.state.token);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        // console.log("CHECK_SUBSCRIPTION:" + xhr)
        // console.log("CHECK_SUBSCRIPTION:" + JSON.stringify(xhr))
        if (this.responseText.indexOf("status") !== -1) {
          mThis.mLoaderShowHide();
          var text = this.responseText;
          console.log(this.responseText);
          var obj = JSON.parse(text);
          console.log(obj);
          if (obj.status == 1) {
            if (obj.dentistdetails.docs_details.payment_status === 0) {
            } else {
              mThis.props.navigation.navigate("DentistTabMenu");
            }
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
  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: constants.baseColor }}>
        <View style={{ width: "100%" }}>
          <TouchableOpacity
            style={{ width: "100%", height: 30 }}
            onPress={() => {
              this.props.navigation.navigate("DentistTabMenu");
            }}
          >
            <Text
              allowFontScaling={false}
              style={{
                textDecorationLine: "underline",
                color: "white",
                fontSize: 20,
                marginLeft: "80%"
              }}
            >
              Skip
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={{ flex: 0.9 }}>
          <View
            style={{
              width: "100%",
              height: 80,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: constants.baseColor,
              marginTop: 30
            }}
          >
            <Text
              allowFontScaling={false}
              style={{ fontSize: 32, fontWeight: "bold", color: "white" }}
            >
              Simple Pricing.
            </Text>
            <Text
              allowFontScaling={false}
              style={{ fontSize: 16, color: "white" }}
            >
              Guaranteed Results.
            </Text>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <View style={styles.triangle}></View>
              <View
                style={{
                  height: 28,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "white",
                  marginTop: 24
                }}
              >
                <Text
                  allowFontScaling={false}
                  style={{ color: constants.baseColor }}
                >
                  FREE FOR 30 DAYS{" "}
                </Text>
              </View>
              <View style={styles.triangle2}></View>
            </View>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 50
            }}
          >
            <View
              style={{
                width: "90%",
                height: 200,
                backgroundColor: "white",
                borderRadius: 5
              }}
            >
              <View
                style={{
                  height: 50,
                  width: "100%",
                  backgroundColor: "#d2ab37",
                  borderTopEndRadius: 5,
                  justifyContent: "center",
                  alignItems: "center",
                  borderTopLeftRadius: 5
                }}
              >
                <Text
                  allowFontScaling={false}
                  style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                >
                  MONTHLY SPECIAL
                </Text>
                <Text
                  allowFontScaling={false}
                  style={{ color: "white", fontSize: 10 }}
                >
                  (Save 49%)
                </Text>
              </View>
              <View
                style={{
                  height: 150,
                  width: "100%",
                  backgroundColor: "white",
                  borderBottomEndRadius: 5,
                  alignItems: "center",
                  borderBottomLeftRadius: 5
                }}
              >
                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    height: 50,
                    marginTop: 5
                  }}
                >
                  <Text
                    allowFontScaling={false}
                    style={{ color: "gray", fontSize: 20, marginTop: -23.5 }}
                  >
                    $
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={{ color: "black", fontSize: 40 }}
                  >
                    199
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={{ color: "gray", fontSize: 20, marginTop: 10 }}
                  >
                    /month
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text allowFontScaling={false} style={{ color: "gray" }}>
                    Regular Price
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={{ fontWeight: "bold", color: "gray" }}
                  >
                    {" "}
                    $389/ month
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: 150,
                    borderRadius: 20,
                    borderWidth: 0.5,
                    borderColor: "gray",
                    height: 30,
                    marginTop: 30
                  }}
                  onPress={() => {
                    // this.props.navigation.navigate('subscriptionPurchase')
                    this.alertOpen();
                  }}
                >
                  <Text
                    allowFontScaling={false}
                    style={{ fontWeight: "bold", color: "gray" }}
                  >
                    SUBSCRIBE
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 50
            }}
          >
            <View
              style={{
                width: "90%",
                height: 200,
                backgroundColor: "white",
                borderRadius: 5
              }}
            >
              <View
                style={{
                  height: 50,
                  width: "100%",
                  backgroundColor: "#00a75c",
                  borderTopEndRadius: 5,
                  justifyContent: "center",
                  alignItems: "center",
                  borderTopLeftRadius: 5
                }}
              >
                <Text
                  allowFontScaling={false}
                  style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                >
                  SUPER SAVER
                </Text>
                <Text
                  allowFontScaling={false}
                  style={{ color: "white", fontSize: 10 }}
                >
                  (Save 68%)
                </Text>
              </View>
              <View
                style={{
                  height: 150,
                  width: "100%",
                  backgroundColor: "white",
                  borderBottomEndRadius: 5,
                  alignItems: "center",
                  borderBottomLeftRadius: 5
                }}
              >
                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    height: 50,
                    marginTop: 5
                  }}
                >
                  <Text
                    allowFontScaling={false}
                    style={{ color: "gray", fontSize: 20, marginTop: -23.5 }}
                  >
                    $
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={{ color: "black", fontSize: 40 }}
                  >
                    125
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={{ color: "gray", fontSize: 20, marginTop: 10 }}
                  >
                    /month
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text allowFontScaling={false} style={{ color: "gray" }}>
                    Regular Price
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={{ fontWeight: "bold", color: "gray" }}
                  >
                    {" "}
                    Billed Yearly
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: 150,
                    borderRadius: 20,
                    borderWidth: 0.5,
                    borderColor: "gray",
                    height: 30,
                    marginTop: 30
                  }}
                  onPress={() => {
                    // this.props.navigation.navigate('subscriptionPurchase')
                    this.alertOpen();
                  }}
                >
                  <Text
                    allowFontScaling={false}
                    style={{ fontWeight: "bold", color: "gray" }}
                  >
                    SUBSCRIBE
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "white",
    borderStyle: "solid",
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderBottomWidth: 35,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: constants.baseColor,
    transform: [{ rotate: "90deg" }],
    // right: -10,
    top: 12
  },
  triangle2: {
    width: 0,
    height: 0,
    backgroundColor: "white",
    borderStyle: "solid",
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderBottomWidth: 35,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: constants.baseColor,
    transform: [{ rotate: "270deg" }],
    top: 12
  }
});
