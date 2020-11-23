import React from "react";
import { Text, View, TouchableOpacity, Image, SafeAreaView } from "react-native";
import Fonts from "./Fonts";
import Constants from "./Constants";
import Styles from "./Styles";
import Sizes from "./Size";
import Images from "./Images";

export const TextBold = props => {
  return (
    <Text
      allowFontScaling={false}
      ellipsizeMode={props.ellipsizeMode}
      numberOfLines={props.numberOfLines}
      style={[
        {
          // fontFamily: Fonts.bold,]
          fontWeight: "bold",
          color: props.textColor ? props.textColor : Constants.black
        },
        props.textStyle
      ]}
    >
      {props.title}
    </Text>
  );
};

export const TextSemiBold = props => {
  return (
    <Text
      allowFontScaling={false}
      ellipsizeMode={props.ellipsizeMode}
      numberOfLines={props.numberOfLines}
      style={[
        {
          // fontFamily: Fonts.semiBold,
          color: props.textColor ? props.textColor : Constants.black
        },
        props.textStyle
      ]}
    >
      {props.title}
    </Text>
  );
};

export const TextMedium = props => {
  return (
    <Text
      allowFontScaling={false}
      ellipsizeMode={props.ellipsizeMode}
      numberOfLines={props.numberOfLines}
      style={[
        {
          // fontFamily: Fonts.medium,
          color: props.textColor ? props.textColor : Constants.black
        },
        props.textStyle
      ]}
    >
      {props.title}
    </Text>
  );
};

export const TextRegular = props => {
  return (
    <Text
      allowFontScaling={false}
      ellipsizeMode={props.ellipsizeMode}
      numberOfLines={props.numberOfLines}
      style={[
        {
          // fontFamily: Fonts.regular,
          color: props.textColor ? props.textColor : Constants.black
        },
        props.textStyle
      ]}
    >
      {props.title}
    </Text>
  );
};

export const StatusBar = props => {
  return (
    <View
      style={[
        Styles.statusBar,
        {
          backgroundColor: props.barColor
            ? props.barColor
            : Constants.themeColor
        }
      ]}
    ></View>
  );
};

export const ThemeButton = props => {
  return (
    <TouchableOpacity
      style={[Styles.themeButton, props.buttonStyle]}
      onPress={() => props.fireEvent()}
    >
      <TextBold title={props.title} textStyle={Styles.themeButtonText} />
    </TouchableOpacity>
  );
};

export const GreyButton = props => {
  return (
    <TouchableOpacity
      style={Styles.buttonStyle}
      onPress={() => props.fireEvent()}
    >
      <TextSemiBold
        title={props.title}
        textStyle={[Styles.themeButtonText, { color: Constants.black }]}
      ></TextSemiBold>
    </TouchableOpacity>
  );
};

export const Header = props => {
  console.log(props);
  return (
    // <View >
    //   <SafeAreaView style={{ backgroundColor: Constants.themeColor }}></SafeAreaView>

    <View style={Styles.headerStyles}>
      {props.isbackButton ? (
        <TouchableOpacity
          style={[Styles.backButton]}
          onPress={() => props.fireEvent()}
        >
          <Image
            source={Images.ImgBack}
            style={{ width: 20, height: 20, marginRight: 7 }}
            resizeMode="contain"
          ></Image>
          <TextSemiBold
            title={"Back"}
            textStyle={{ fontSize: Sizes.medium }}
            textColor={Constants.white}
          />
        </TouchableOpacity>
      ) : null}
      <TextBold
        title={props.title}
        textStyle={{ fontSize: Sizes.semiLarge }}
        textColor={Constants.white}
      />

      {props.isRefreshButton ? (
        <TouchableOpacity
          style={[Styles.rightMenu]}
          onPress={() => props.menuEvent()}
        >
          <Image
            source={Images.ImgRefresh}
            style={{ width: 25, height: 25, marginLeft: 10 }}
            resizeMode="contain"
          ></Image>

        </TouchableOpacity>
      ) : null}
    </View>
    // </View>
  );
};

export const ListHeader = props => {
  return (
    <View
      style={{
        width: "100%",
        height: 40,
        backgroundColor: Constants.backgroundPageColor,
        // backgroundColor: "red",
        justifyContent: "center",
        paddingLeft: 15
      }}
    >
      <TextBold
        title={props.title.toUpperCase()}
        textStyle={{ fontSize: 15 }}
      />
    </View>
  );
};
