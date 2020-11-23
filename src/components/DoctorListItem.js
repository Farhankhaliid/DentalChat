/* @flow */

/* @flow */

import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Swipeable from "react-native-swipeable";
import IsEmergencyBox from "./IsEmergencyBox";
import ImageBubble from "./ImageBubble";
import MessagesCountBubble from "./MessagesCountBubble";
import PainLevelBox from "./PainLevelBox";
import TimeAndDatePost from "./TimeAndDatePost";
import PatientLatestMessageContent from "./PatientLatestMessageContent";
import StarRating from "react-native-star-rating";
import Icon from "react-native-vector-icons/dist/FontAwesome";
import Button from "../components/Button";
import constants from "./../constants/constants";
import CardView from "react-native-cardview";

export default class DoctorListItem extends Component {
  render() {
    return (
      <CardView cardElevation={5} cardMaxElevation={5} style={styles.container}>
        <View style={{ width: "100%", height: "100%" }}>
          <View style={styles.navBar}>
            <View style={styles.leftContainer}></View>
            <ImageBubble
              style={{ alignSelf: "center" }}
              image={this.props.item.chat_history_arr.get_doctor.profile_pics}
              firstName={this.props.item.chat_history_arr.get_doctor.first_name}
              lastName={this.props.item.chat_history_arr.get_doctor.last_name}
              size={70}
            />
            <View style={styles.rightContainer}></View>
          </View>
          <View style={styles.viewTopTwo}>
            <Text
              allowFontScaling={false}
              numberOfLines={2}
              style={styles.textTitle}
            >
              {this.props.item.chat_history_arr.get_doctor.first_name +
                " " +
                this.props.item.chat_history_arr.get_doctor.last_name}
            </Text>
          </View>
          <View style={styles.viewSubTopTwo}>
            <Text
              allowFontScaling={false}
              numberOfLines={2}
              style={styles.textSubTitle}
            >
              Dentist
            </Text>
          </View>
          <View style={styles.viewSubTopTwo}>
            <StarRating
              disabled={false}
              maxStars={5}
              starSize={30}
              starColor={"#FF4500"}
              rating={this.props.item.doctor_avg_rating}
            />
          </View>

          <View style={styles.viewSubTopTwo}>
            <Text
              allowFontScaling={false}
              numberOfLines={2}
              style={styles.subTitle}
            >
              {this.props.item.tot_rating_for_doctor +
                " Rating" +
                " | " +
                this.props.item.tot_review_for_doctor +
                " Reviews"}
            </Text>
          </View>
          {this.props.item.chat_history_arr.doctor_clinic.address ? (
            <View style={styles.viewSubTopTwo}>
              <Icon
                style={{ marginRight: 5 }}
                name="map-marker"
                size={15}
                color="#afb1b2"
              />
              <Text
                allowFontScaling={false}
                numberOfLines={2}
                style={styles.subTitle}
              >
                {this.props.item.chat_history_arr.doctor_clinic.address}
              </Text>
            </View>
          ) : (
            <View style={styles.viewSubTopTwo}>
              <Icon
                style={{ marginRight: 5 }}
                name="map-marker"
                size={15}
                color="#afb1b2"
              />
              <Text
                allowFontScaling={false}
                numberOfLines={2}
                style={styles.subTitle}
              >
                Location not shared
              </Text>
            </View>
          )}

          <View style={styles.viewBottom}>
            <TouchableOpacity
              style={styles.viewBottomLeft}
              onPress={this.props.Appointment}
            >
              <Text
                allowFontScaling={false}
                style={{ color: constants.baseColor }}
              >
                Appointment
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.viewBottomRight}
              onPress={this.props.mMassage}
            >
              <Text
                allowFontScaling={false}
                style={{ color: constants.baseColor }}
              >
                Message
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
            onPress={this.props.mSeeProfile}
          >
            <View style={styles.viewSubTopTwo}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color: constants.baseColor
                }}
              >
                See Profile
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </CardView>
    );
  }
}

const rightButtons = [
  <TouchableOpacity style={{ flex: 1 }}>
    <View
      style={{
        backgroundColor: "red",
        flex: 1,
        justifyContent: "center",
        paddingLeft: 10
      }}
    >
      <Text allowFontScaling={false} style={{ color: "white" }}>
        Delete
      </Text>
    </View>
  </TouchableOpacity>
];

const styles = StyleSheet.create({
  container: {
    height: 320,
    backgroundColor: "#ffffff",
    width: "90%",
    marginLeft: "5%",
    marginTop: 5,
    marginBottom: 5
    // borderRadius: 10,
    // shadowColor: 'black',
    // shadowRadius: 2,
    // shadowOpacity: 0.2,
    // elevation: 10, marginBottom: 10
  },
  navBar: {
    height: 75,
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  leftContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  rightContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  viewTop: {
    marginTop: 60,
    alignItems: "center",
    justifyContent: "center",
    padding: 10
  },
  viewTopLeft: {
    flex: 1,
    flexDirection: "row"
  },
  viewTopRight: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  viewTopTwo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  viewSubTopTwo: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  viewBottom: {
    flexDirection: "row",
    height: 60
  },
  viewBottomLeft: {
    height: 40,
    width: "42.5%",
    justifyContent: "center",
    alignItems: "center",
    borderColor: constants.baseColor,
    borderRadius: 15,
    borderWidth: 2,
    marginTop: 10,
    marginLeft: "5%",
    marginRight: "2.5%"
  },
  viewBottomRight: {
    height: 40,
    width: "42.5%",
    justifyContent: "center",
    alignItems: "center",
    borderColor: constants.baseColor,
    borderRadius: 15,
    borderWidth: 2,
    marginTop: 10,
    marginLeft: "2.5%",
    marginRight: "5%"
  },
  viewBottomCenter: {
    borderWidth: 0.5,
    height: 80,
    marginTop: 35,
    borderColor: "#afb1b2",
    justifyContent: "center"
  },
  imgBottom: {
    width: 70,
    height: 70
  },
  textBottom: {
    fontSize: 15,
    fontWeight: "400",
    color: "#2293c0"
  },
  textTitle: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "500",
    color: "#383838"
  },
  textSubTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#383838"
  },
  subTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#afb1b2"
  },
  textPostDate: {
    fontSize: 17,
    fontWeight: "400",
    color: "#afb1b2"
  },
  textDetail: {
    fontSize: 17,
    fontWeight: "400",
    color: "#2293c0"
  }
});
