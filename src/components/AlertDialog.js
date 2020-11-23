import React, { Component } from "react";
import {
  Modal,
  View,
  Picker,
  Platform,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from "react-native";
import {
  ThemeButton,
  GreyButton,
  TextBold,
  TextRegular
} from "../utils/Component";
import Constants from "../utils/Constants";

export default class AlertDialog extends Component {
  constructor(props) {
    super(props);
    let { visible } = props;
    this.state = {
      visible: visible || false
    };
  }

  show = async ({
    title,
    description,
    okButtonText,
    cancelButtonText
  }) => {
    let promise = new Promise(resolve => {
      this.result = result => {
        resolve({result});
      };
      this.setState({
        visible: true,
        description: description,
        title: title,
        okButtonText: okButtonText,
        cancelButtonText: cancelButtonText
      });
    });
    return promise;
  };

  dismiss = () => {
    this.setState({
      visible: false
    });
  };

  onCancelPress = () => {
    const result = this.result;
    result && result("Cancle");
    this.dismiss();
  };

  onConfirmPress = () => {
    const result = this.result;
    result && result("ok");
    this.dismiss();
  };

  render() {
    const { title, description, visible, onPressOkButton, onPressCancelButton ,okButtonText,cancelButtonText} = this.state;
    if (!visible) return null;

    return (
      <Modal transparent={true} style={styles.modal}>
        <View style={styles.outerContainer}>
          <View style={styles.innerContainer}>
            <View style={styles.textContainer}>
              {title ? (
                <View style={styles.title}>
                  <TextBold
                    title={title}
                    textStyle={{ fontSize: 18, color: "black" }}
                  />
                </View>
              ) : null}
              {description ? (
                <View style={styles.description}>
                  <TextRegular
                    title={description}
                    textStyle={{
                      fontSize: 16,
                      textAlign: "center",
                      color: "black"
                    }}
                  />
                </View>
              ) : null}
            </View>
            <View
              style={{ width: "100%", height: 0.8, backgroundColor: "gray" }}
            />
            <View style={styles.button}>
              {okButtonText ? (
                <TouchableOpacity style={styles.onPressOkButton} onPress={()=>this.onConfirmPress()}>
                  <TextBold
                    title={okButtonText?okButtonText:"Ok"}
                    textStyle={{
                      fontSize: 18,
                      textAlign: "center",
                      color: Constants.themeColor
                    }}
                  />
                </TouchableOpacity>
              ) : null}
              {cancelButtonText ? (
                <TouchableOpacity style={styles.onPressOkButton} onPress={()=>this.onCancelPress()}>
                  <TextBold
                    title={description}
                    textStyle={{
                      fontSize: 18,
                      textAlign: "center",
                      color: Constants.themeColor
                    }}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  outerContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(128,128,128,0.4)"
  },
  innerContainer: {
    width: "100%",
    padding: 15
  },
  textContainer: {
    width: "100%",
    padding: 20,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: "white"
  },
  title: {
    alignItems: "center",
    justifyContent: "center"
  },
  description: {
    alignItems: "center",
    justifyContent: "center",
    margin: 5
  },
  button: {
    width: "100%",
    flexDirection: "row",
    backgroundColor:'white'
  },
  OkButton: {
    backgroundColor:'green',
    flex: 1,
    alignItems: "center",
    padding:10,
    justifyContent: "center"
  }
});
