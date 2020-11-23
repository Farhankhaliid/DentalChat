/* @flow */

import React, { Component } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal, TouchableHighlight, Image, Dimensions
} from 'react-native';
import { FormLabel, FormInput, Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import ImageZoom from 'react-native-image-pan-zoom';
import moment from 'moment';
import PropTypes from 'prop-types';
import constants from './../constants/constants';
import SInfo from 'react-native-sensitive-info';
export default class PostDetails extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Post Details',
    tabBarVisible: false,
    headerTintColor: '#ffffff',
    headerStyle: {
      backgroundColor: constants.baseColor
    },
    headerLeft: <TouchableOpacity onPress={() => navigation.goBack()} >
      <View style={{ flexDirection: 'row' }}>
        <Icon style={{ marginLeft: 15 }} name='angle-left' size={30} color={'#ffffff'} />
        <Text style={{ fontSize: 15, marginTop: 7, marginLeft: 5, fontWeight: '500', color: '#ffffff' }} allowFontScaling={false} >Back</Text>
      </View>
    </TouchableOpacity>
  });
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }
  componentDidMount() { }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  render() {
    //const { get_patient, get_attachments, description, emergency, post_title, pain_level, current_location, posted_date } = this.props.navigation.state.params;
    // console.log("<><><><>#  "+get_attachments[0].file_name)
    const data = this.props.navigation.state.params
    console.log(data)
    const { get_patient, get_attachments, description, emergency, post_title, pain_level, current_location, posted_date } = this.props.navigation.state.params;
    console.log(description, emergency, post_title, pain_level, current_location, posted_date)
    return (
      <View style={styles.container}>

        <ScrollView keyboardShouldPersistTaps="never">
          <View style={{ backgroundColor: '#ffffff' }}>
            <View style={{ height: 40, width: "100%", alignItems: 'center' }} >
              <Text allowFontScaling={false} style={{ marginTop: 20, fontSize: 14, color: '#000000', fontWeight: '400' }}> Posted by {get_patient.name} {moment(posted_date).fromNow()}</Text>
            </View>

            <View style={styles.editViewNext}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginTop: 5, marginBottom: 5 }}>
                <Text allowFontScaling={false} style={{ marginLeft: 20, fontSize: 16, color: constants.baseColor, fontWeight: '600' }}>Post Title</Text>
              </View>
              <View style={styles.searchSection}>
                <Text allowFontScaling={false} numberOfLines={4} style={{ marginLeft: 20, marginRight: 20, fontSize: 17, fontWeight: '500' }}>
                  {post_title}</Text>
              </View>
              <View style={{ marginLeft: 20, borderWidth: 0.5, marginTop: 10, borderColor: '#cccccc', }}></View>
            </View>

            <View style={{ backgroundColor: '#fff', marginTop: 10, }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginTop: 5, marginBottom: 5 }}>
                <Text allowFontScaling={false} style={{ marginLeft: 20, fontSize: 16, color: constants.baseColor, fontWeight: '600' }}>Current Location</Text>
              </View>
              <View style={styles.searchSection}>
                <Text allowFontScaling={false} numberOfLines={4} style={{ marginLeft: 20, marginRight: 20, fontSize: 17, fontWeight: '500' }}>
                  {current_location}</Text>
              </View>
              <View style={{ marginLeft: 20, borderWidth: 0.5, marginTop: 10, borderColor: '#cccccc', }}></View>
            </View>

            <View style={{ backgroundColor: '#fff', marginTop: 10, }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginTop: 5, marginBottom: 5 }}>
                <Text allowFontScaling={false} style={{ marginLeft: 20, fontSize: 16, color: constants.baseColor, fontWeight: '600' }}>Emergency</Text>
              </View>
              <View style={styles.searchSection}>
                {emergency == 0 ? <Text allowFontScaling={false} numberOfLines={1} style={{ marginLeft: 20, marginRight: 20, fontSize: 17, fontWeight: '500' }}>
                  No</Text> : <Text allowFontScaling={false} numberOfLines={1} style={{ marginLeft: 20, marginRight: 20, fontSize: 17, fontWeight: '500' }}>
                    Yes</Text>}
              </View>
              <View style={{ marginLeft: 20, borderWidth: 0.5, marginTop: 10, borderColor: '#cccccc', }}></View>
            </View>

            <View style={{ backgroundColor: '#fff', marginTop: 10, }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginTop: 5, marginBottom: 5 }}>
                <Text allowFontScaling={false} style={{ marginLeft: 20, fontSize: 16, color: constants.baseColor, fontWeight: '600' }}>Pain Level</Text>
              </View>
              <View style={styles.searchSection}>
                <Text numberOfLines={1} style={{ marginLeft: 20, marginRight: 20, fontSize: 17, fontWeight: '500' }}>
                  {pain_level}</Text>
              </View>
              <View style={{ marginLeft: 20, borderWidth: 0.5, marginTop: 10, borderColor: '#cccccc', }}></View>
            </View>

            <View style={{ backgroundColor: '#fff', marginTop: 10, }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginTop: 5, marginBottom: 5 }}>
                <Text allowFontScaling={false} style={{ marginLeft: 20, fontSize: 16, color: constants.baseColor, fontWeight: '600' }}>Description</Text>
              </View>
              <View style={styles.searchSection}>
                <Text allowFontScaling={false} numberOfLines={6} style={{ marginLeft: 20, marginRight: 20, fontSize: 17, fontWeight: '500' }}>
                  {description}</Text>
              </View>
              <View style={{ marginLeft: 20, borderWidth: 0.5, marginTop: 10, borderColor: '#cccccc', }}></View>
            </View>

            <TouchableHighlight
              onPress={() => {
                this.setModalVisible(true);
              }}>


              <View style={{ backgroundColor: '#fff', marginTop: 20, marginLeft: 20, }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', }}>

                  {get_attachments.length > 0 ?
                    <Avatar large source={{ uri: constants.imageUrl + "uploads/patient_post_attachments/" + get_attachments[0].file_name }} />
                    : <Avatar large source={{ uri: constants.imageUrl + "uploads/patient_profile_image/no_image.jpg" }} />}
                </View>
              </View>


            </TouchableHighlight>

          </View>





          <Modal
            style={{ backgroundColor: '#000000' }}
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              alert('Modal has been closed.');
            }}>
            <View>

              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(false);

                }} style={{ marginTop: 20, marginLeft: 20, height: 50, width: 50 }} >
                <Icon style={{ marginTop: 20, marginLeft: 20 }}
                  name='times' size={30} color={'#000000'} />
              </TouchableHighlight>

              <ImageZoom cropWidth={Dimensions.get('window').width}
                cropHeight={Dimensions.get('window').height}
                imageWidth={Dimensions.get('window').width}
                imageHeight={200}>




                {get_attachments.length > 0 ?
                  <Image style={{ width: Dimensions.get('window').width, height: 200 }}
                    source={{ uri: constants.imageUrl + "uploads/patient_post_attachments/" + get_attachments[0].file_name }} />
                  :
                  <Image style={{ width: Dimensions.get('window').width, height: 200 }}
                    source={{ uri: constants.imageUrl + "uploads/patient_profile_image/no_image.jpg" }} />
                }
              </ImageZoom>







            </View>

          </Modal>
        </ScrollView>
      </View>
    );

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchIcon: {
    marginLeft: 20
  },
  textInputStyle: {
    width: "100%",
    marginLeft: 20,
    marginRight: 20,
    fontSize: 17,
    fontWeight: '500'
  },
  logoutContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  optionsListStyle: {
    marginTop: 10,
    marginBottom: 30,
    backgroundColor: 'white'
  },
  subtitleView: {
    marginLeft: 30,
  },
  maintitleView: {
    marginLeft: 30,
    marginTop: 10
  },
  optiontitleView: {
    marginTop: 10,
  },
  subtitleTextStyle: {
    color: '#999'
  },
  maintitleTextStyle: {
    color: '#111',
    fontSize: 18,
    fontWeight: 'bold',
  },
  titleAndVersionContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 150
  },
  titleContainerStyle: {
    marginBottom: 10
  },
  titleTextStyle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'grey',
  },
  versionTextStyle: {
    color: 'grey'
  },
  containerRow: {
    height: 60,
    marginTop: 10,
    backgroundColor: 'white'
  },
  imageview: {
    marginTop: 5
  },
  profileImage: {
    marginTop: 10,
    marginLeft: 20
  },
  editView: {
    height: 50,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  editViewNext: {
    backgroundColor: '#fff',
    marginTop: 10,
  },
  editViewLast: {
    height: 50,
    backgroundColor: '#fff',
    marginTop: 60,
  },
  searchSection: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: "100%"
  },
  dropdown: {
    width: 300,
    height: 50,
    marginLeft: 20,
  },
  dropdown_text: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: '500',
    color: '#111',
  },
  dropdown_pop: {
    width: 200,
    height: 100,
  },
  dropdown_pop_text: {
    marginVertical: 5,
    marginHorizontal: 6,
    fontSize: 18,
    color: '#ccc',
  },
});
