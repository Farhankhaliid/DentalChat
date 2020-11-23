import React, { Component } from "react";
import {
  View,
  Picker,
  Platform,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from "react-native";
import { ThemeButton, GreyButton } from "../utils/Component";

export default class YearPicker extends Component {
  constructor(props) {
    super(props);
    let { startYear, endYear, selectedYear, visiable } = props;
    let years = this.getYears(startYear, endYear);
    selectedYear = selectedYear || years[years.length - 1];
    this.state = {
      years,
      selectedYear,
      visiable: visiable || false
    };
  }

  show = async ({ startYear, endYear, selectedYear }) => {
    let years = this.getYears(startYear, endYear);
    selectedYear = selectedYear || years[years.length - 1];
    let promise = new Promise(resolve => {
      this.confirm = year => {
        resolve({
          year
        });
      };
      this.setState({
        visiable: true,
        years,
        startYear: startYear,
        endYear: endYear,
        selectedYear: selectedYear
      });
    });
    return promise;
  };

  dismiss = () => {
    this.setState({
      visiable: false
    });
  };

  getYears = (startYear, endYear) => {
    startYear = startYear || new Date().getFullYear();
    endYear = endYear || new Date().getFullYear();
    let years = [];
    for (let i = startYear; i <= endYear; i++) {
      years.push(i);
    }
    return years;
  };

  renderPickerItems = data => {
    let items = data.map((value, index) => {
      return (
        <Picker.Item key={"r-" + index} label={"" + value} value={value} />
      );
    });
    return items;
  };

  onCancelPress = () => {
    this.dismiss();
  };

  onConfirmPress = () => {
    const confirm = this.confirm;
    const { selectedYear } = this.state;
    confirm && confirm(selectedYear);
    this.dismiss();
  };

  render() {
    const { years, selectedYear, visiable } = this.state;
    if (!visiable) return null;

    return (
      <View style={styles.modal}>
        <View
          style={
            Platform.OS == "android"
              ? [styles.outerContainer, styles.outerAndroid]
              : [styles.outerContainer, styles.outerIOS]
          }
        >
          {Platform.OS == "ios" ? (
            <View style={styles.toolBar}>
              <TouchableOpacity
                style={styles.toolBarButton}
                onPress={this.onCancelPress}
              >
                <Text style={styles.toolBarButtonText}>Cancle</Text>
              </TouchableOpacity>
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                style={styles.toolBarButton}
                onPress={this.onConfirmPress}
              >
                <Text style={styles.toolBarButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          ) : null}
          <View style={styles.innerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={selectedYear}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ selectedYear: itemValue })
              }
            >
              {this.renderPickerItems(years)}
            </Picker>
          </View>
          {Platform.OS == "android" ? (
            <View style={styles.profileButtonsView}>
              <GreyButton
                title="Cancle"
                fireEvent={this.onCancelPress}
              ></GreyButton>
              <ThemeButton
                title="Confirm"
                fireEvent={this.onConfirmPress}
              ></ThemeButton>
            </View>
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  outerContainer: {
    backgroundColor: "white",
    position: "absolute",
    left: 0,
    right: 0
  },
  outerAndroid: {
    margin: 15,
    padding: 30,
    alignSelf: "center",
    borderRadius: 5,
    top: Dimensions.get("window").height / 2 - 35
  },
  outerIOS: {
    bottom: 0
  },
  toolBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 44,
    borderBottomWidth: 1,
    borderColor: "#EBECED"
  },
  toolBarButton: {
    height: 44,
    justifyContent: "center",
    paddingHorizontal: 16
  },
  toolBarButtonText: {
    fontSize: 15,
    color: "#2d4664"
  },
  innerContainer: {
    flex: 1,
    flexDirection: "row"
  },
  picker: {
    flex: 1
  },

  profileButtonsView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20
  }
});
