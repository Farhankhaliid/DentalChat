import { StyleSheet, Platform } from "react-native";
import Constants from "./Constants";
import Sizes from "./Size";

export default Styles = StyleSheet.create({
  container: {
    width: Constants.deviceWidth,
    // height: Constants.deviceHeight - ((Platform.OS == "ios" ? Constants.statusBarHeight : 0) + 50),
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: Constants.backgroundPageColor
    // marginBottom: 100
  },
  screen: {
    flex: 1,
    justifyContent: "flex-start"
  },
  statusBar: {
    height: Platform.OS == "ios" ? Constants.statusBarHeight + 10 : 0,
    backgroundColor: Constants.themeColor,
    width: Constants.deviceWidth
  },
  themeButton: {
    padding: 10,
    paddingHorizontal: 15,
    marginTop: 20,
    marginVertical: 20,
    backgroundColor: Constants.themeColor,
    borderRadius: 5,
    marginHorizontal: 10
  },
  themeButtonText: {
    color: Constants.white,
    fontSize: Sizes.medium,
    // textTransform: "uppercase",
    // borderWidth: 1,
    borderColor: Constants.themeColor
  },
  buttonStyle: {
    alignItems: "center",
    padding: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    marginTop: 20,
    backgroundColor: Constants.white,
    borderWidth: 1,
    borderColor: Constants.grey,
    borderRadius: 5,
    marginHorizontal: 10
  },
  headerStyles: {
    height: (Platform.OS === 'ios') ? 44 : 49,
    width: Constants.deviceWidth,
    backgroundColor: Constants.themeColor,
    justifyContent: "center",
    alignItems: "center"
    // backgroundColor: "red",
  },
  backButton: {
    width: 100,
    height: (Platform.OS === 'ios') ? 44 : 49,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: 0,
    // backgroundColor: "red",
    flexDirection: "row"
  },
  rightMenu: {
    width: 60,
    height: (Platform.OS === 'ios') ? 44 : 49,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 0,
    // backgroundColor: "red",
    flexDirection: "row"
  },
  buttonText: {
    fontSize: Sizes.extraSmall,
    textTransform: "uppercase"
  },
  cameraBox: {
    width: 65,
    height: 70,
    justifyContent: "center"
    // backgroundColor: "red"
  },
  fullCameraBox: {
    width: Constants.deviceWidth,
    height: "100%",
    justifyContent: "center"
    // backgroundColor: "red"
  },
  cameraBoxCertificate: {
    width: 35,
    height: 50,
    justifyContent: "center",
    alignItems: "center"
    // backgroundColor: "red"
  },
  imageBox: {
    width: 70,
    height: 70,
    backgroundColor: Constants.grey,
    borderRadius: 35,
    marginBottom: 15
  },
  camera: {
    width: 17,
    height: 17
  },
  imageLoader: {
    width: 45,
    height: 45,
    resizeMode: "cover",
    borderRadius: 20,
    position: "absolute",
    top: 12.5,
    zIndex: -1,
    justifyContent: "center",
    alignItems: "center"
  },
  smallImageLoader: {
    width: 30,
    height: 30,
    resizeMode: "cover",
    borderRadius: 13,
    position: "absolute",
    zIndex: -1,
    justifyContent: "center",
    alignItems: "center"
  },
  touchableImageStyle: {
    width: 45,
    height: 45,
    borderRadius: 22,
    resizeMode: "cover",
    position: "absolute",
    top: 12.5,
    zIndex: 1
  },
  imageStyle: {
    width: 45,
    height: 45,
    borderRadius: 22,
    resizeMode: "cover"
  },
  smallImageStyle: {
    width: 45,
    height: 45,
    borderRadius: 22,
    resizeMode: "cover",
    position: "absolute",
    zIndex: 1
  },
  fullImageStyle: {
    width: "100%",
    height: "100%",
    resizeMode: "contain"
  },
  whiteBox: {
    backgroundColor: Constants.white,
    width: "100%",
    alignItems: "center"
  },
  cameraView: {
    width: Constants.deviceWidth - 30,
    flexDirection: "row",
    alignItems: "center",
    height: 70,
    borderBottomWidth: 1,
    borderColor: Constants.grey
  },
  cameraViewCertificate: {
    width: Constants.deviceWidth - 30,
    flexDirection: "row",
    alignItems: "center",
    height: 50
  },
  inputView: {
    width: Constants.deviceWidth - 30,
    flexDirection: "row",
    height: 80,
    borderBottomWidth: 1,
    borderColor: Constants.grey,
    // justifyContent: "center"
    paddingTop: 13
    // paddingBottom: 13,
  },
  inputIcon: { width: 15, height: 15, resizeMode: "contain" },
  input: {
    height: 40,
    width: "100%",
    fontSize: Sizes.regular,
    color: Constants.black
    // fontFamily: Fonts.medium,
    // padding: 0,
    // backgroundColor: "red"
  },
  inputCertificate: {
    height: 50,
    width: "90%",
    fontSize: Sizes.regular,
    color: Constants.black,
    marginTop: 30,
    marginLeft: 10
  },
  infoView: {
    width: Constants.deviceWidth - 30,
    flexDirection: "row",
    // height: 70,
    borderBottomWidth: 1,
    borderColor: Constants.grey,
    paddingTop: 13,
    paddingBottom: 13
  },
  info: {
    fontSize: Platform.OS == "ios" ? Sizes.regular : Sizes.small,
    marginTop: 7
    // backgroundColor: "red"
  },
  infoIconView: {
    width: 40,
    height: "100%"
  },
  inputIconView: {
    width: 40,
    height: 70
  },
  innerInputView: {
    width: Constants.deviceWidth - 70
  },
  timing: {
    width: Constants.deviceWidth - 30,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Constants.grey
  },
  timeIcon: { width: 20, height: 20, resizeMode: "contain" },
  timeInfoView: {
    width: Constants.deviceWidth - 70,
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  profileButtonsView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 50
  },
  headerLabel: {
    flexDirection: "row",
    width: "100%",
    marginTop: 10,
    backgroundColor: Constants.backgroundPageColor
  },
  headerLabelLeft: {
    width: "60%",
    alignItems: "center",
    justifyContent: "center"
  },
  headerLabelRight: {
    width: "40%",
    alignItems: "flex-end",
    paddingEnd: 20
  }
});
