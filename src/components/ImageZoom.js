import React, { Component } from "react";
import {
  Modal,
  View,
  Picker,
  Platform,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image
} from "react-native";
import constants from './../constants/constants';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import ImageZoom from 'react-native-image-pan-zoom';

export default class ImageZoomComponent extends Component {
  constructor(props) {
    super(props);
    let { visible } = props;
    this.state = {
      visible: false
    };
  }

  show = async ({
    image
  }) => {
    let promise = new Promise(resolve => {
      this.result = result => {
        resolve({ result });
      };
      console.log("IMAGE_ZOOM:" + JSON.stringify(image))
      this.setState({
        visible: true,
        image: image
      });
    });
    return promise;
  };

  dismiss = () => {
    this.setState({
      visible: false,
      image: ""
    });
  };


  render() {
    const { visible } = this.state;
    if (!visible) return null;

    return (
      <Modal
        animationType="slide"
        transparent={false}
        style={styles.modal}>
        <View style={{ height: "100%", width: "100%", backgroundColor: "white" }}>

          <TouchableOpacity
            onPress={() => {
              this.dismiss();
            }} style={{ marginTop: 20, marginLeft: 20, height: 50, width: 50 }} >
            <Icon style={{ marginTop: 20, marginLeft: 20 }}
              name='times' size={30} color={'#000000'} />
          </TouchableOpacity>

          {/* <View style={{ position: 'absolute', top: '45%', bottom: 0, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            {
              this.state.image && (this.state.image.uri != "") ?
                <View style={Styles.imageLoader} >
                  <ActivityIndicator size="small" color={Constants.themeColor} />
                </View> : null
            }
          </View> */}

          <ImageZoom cropWidth={Dimensions.get('window').width}
            cropHeight={Dimensions.get('window').height - 100}
            imageWidth={Dimensions.get('window').width}
            imageHeight={Dimensions.get('window').height - 100}>

            {this.state.image && (this.state.image.uri != "") ?
              <Image style={{ width: Dimensions.get('window').width, height: "100%", resizeMode: "contain" }}
                source={this.state.image} />
              :
              <Image style={{ width: Dimensions.get('window').width, height: "100%", resizeMode: "contain" }}
                source={{ uri: constants.imageUrl + "uploads/patient_profile_image/no_image.jpg" }} />
            }
          </ImageZoom>


        </View>
      </Modal >
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
  }
});
