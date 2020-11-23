import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  DeviceEventEmitter
} from "react-native";
import { SearchBar } from "react-native-elements";
import SInfo from "react-native-sensitive-info";
import constants from "./../constants/constants";
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
import Images from "./../utils/Images";
import Sizes from "./../utils/Size";
import { ScrollView } from "react-native-gesture-handler";

class SearchLanguage extends Component {
  static navigationOptions = {
    // title: 'Please sign in',
    header: null //hide the header
  };

  constructor() {
    super();
    this.state = {
      token: "",
      text: "",
      selectedLanguageData: [],
      allLanguage: [],
      allSearchedlanguage: []
    };
  }

  componentDidMount() {
    SInfo.getItem("token", {
      sharedPreferencesName: "mySharedPrefs",
      keychainService: "myKeychain"
    }).then(value => {
      console.log("time to fetch token");
      this.setState({ token: value });
    });
    SInfo.getItem("selected_languages", {
      sharedPreferencesName: "mySharedPrefs",
      keychainService: "myKeychain"
    }).then(value => {
      this.setState({ selectedLanguageData: JSON.parse(value) });
    });
    SInfo.getItem("all_languages", {
      sharedPreferencesName: "mySharedPrefs",
      keychainService: "myKeychain"
    }).then(value => {
      this.setState({
        allLanguage: JSON.parse(value),
        allSearchedlanguage: JSON.parse(value)
      });
    });
  }

  mSearchFilterFunction(text) {
    const newData = this.state.allLanguage.filter(function (item) {
      const itemData = item.label.toUpperCase();
      const textData = text.toUpperCase();
      if (itemData.indexOf(textData) > -1) {
        return itemData.indexOf(textData) > -1;
      }
    });

    if (!text || text === "") {
      this.setState({
        allSearchedlanguage: this.state.allLanguage,
        text: text
      });
    } else if (!Array.isArray(newData) && !newData.length) {
      this.setState({
        allSearchedlanguage: []
      });
    } else {
      this.setState({
        allSearchedlanguage: newData,
        text: text
      });
    }
  }

  back = () => {
    this.props.navigation.goBack();
  };

  itemSelected = item => {
    let newArray = [...this.state.selectedLanguageData];
    // DeviceEventEmitter.emit("language_selected", item)
    // this.back()

    const filteredData = newArray.filter(function (existedItem) {
      const itemData = existedItem.label.toUpperCase();
      const textData = item.label.toUpperCase();
      if (itemData.indexOf(textData) > -1) {
        return itemData.indexOf(textData) > -1;
      }
    });

    console.log("FILTERED:" + JSON.stringify(filteredData));

    if (Array.isArray(filteredData) && filteredData.length == 0) {
      newArray.push(item);
    }

    const { navigation } = this.props;
    navigation.goBack();
    navigation.state.params.languageSelectedCallback(newArray);
  };

  renderHeader = () => {
    return (
      <View style={{ flexDirection: "row", width: "100%" }}>
        <SearchBar
          placeholder="Search here ..."
          containerStyle={{
            backgroundColor: "white",
            width: "100%",
            paddingRight: 0
          }}
          inputStyle={{ color: "#000" }}
          inputContainerStyle={{ backgroundColor: "#bdc6ce", marginRight: 10 }}
          lightTheme
          onChangeText={text => this.mSearchFilterFunction(text)}
          value={this.state.text}
        />
      </View>
    );
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={Styles.screen}>
        <StatusBar />
        <Header
          title={"Search Language"}
          isbackButton={true}
          fireEvent={this.back}
        />
        <View style={styles.container}>
          {this.renderHeader()}
          <ScrollView>
            {this.state.allSearchedlanguage.map((item, index) => (
              <TouchableOpacity
                style={Styles.whiteBox}
                onPress={() => this.itemSelected(item)}
              >
                <View style={Styles.timing}>
                  {/* <View style={{ width: 30, backgroundColor: constants.baseColor, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={Images.ImgLage} style={{ height: 30, width: 30 }}></Image>
                      </View> */}
                  <View style={Styles.timeInfoView}>
                    <TextBold
                      title={item.label}
                      textStyle={{ fontSize: Sizes.regular, paddingLeft: 10 }}
                    ></TextBold>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default SearchLanguage;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
