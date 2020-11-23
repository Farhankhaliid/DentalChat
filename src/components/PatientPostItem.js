/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import Swipeable from 'react-native-swipeable';
import IsEmergencyBox from './IsEmergencyBox';
import ImageBubble from './ImageBubble';
import MessagesCountBubble from './MessagesCountBubble';
import PainLevelBox from './PainLevelBox';
import TimeAndDatePost from './TimeAndDatePost';
import PatientLatestMessageContent from './PatientLatestMessageContent';
import constants from './../constants/constants'
export default class PatientPostItem extends Component {

  render() {
    return (

      <View style={styles.container}>

        <View style={styles.viewTop}>
          <View style={styles.viewTopLeft}>
            <TimeAndDatePost postedDate={this.props.item.posted_date} />
          </View>
          <TouchableOpacity style={styles.viewTopRight} onPress={this.props.onPress3}>
            <View style={styles.viewTopRight}>
              <Text allowFontScaling={false} style={styles.textDetail}>
                Post Details >
                </Text>
            </View>
          </TouchableOpacity>
        </View>



        <View style={styles.viewTopTwo}>
          <Text allowFontScaling={false} numberOfLines={2} style={styles.textTitle}>
            {this.props.item.post_title}
          </Text>
        </View>

        <View style={styles.viewBottom}>
          <TouchableOpacity style={styles.viewBottomLeft} onPress={this.props.onPress2}>
            <View style={styles.viewBottomLeft}>
              <Image style={styles.imgBottom} source={require('../images/post1.png')} />
              <View style={{ flexDirection: 'column' }}>
                <Text allowFontScaling={false} style={styles.textBottom}>
                  {this.props.item.doctor_count} Dentist
            </Text>
                <Text allowFontScaling={false} style={styles.textBottom}>
                  Responded
            </Text>
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.viewBottomCenter}></View>
          <TouchableOpacity style={styles.viewBottomRight} onPress={this.props.onPress}>
            <View style={styles.viewBottomRight}>
              <Image style={styles.imgBottom} source={require('../images/post2.png')} />
              <View style={{ flexDirection: 'column' }}>
                <Text allowFontScaling={false} style={styles.textBottom}>
                  Messages ({this.props.item.all_chat_count})
            </Text>
                <Text allowFontScaling={false} style={styles.textBottom}>
                  Unread ({this.props.item.unread_chat_count})
            </Text>
              </View>
            </View>
          </TouchableOpacity>

        </View>

      </View>
    );
  }
}
const rightButtons = [
  <TouchableOpacity style={{ flex: 1 }}>
    <View style={{ backgroundColor: 'red', flex: 1, justifyContent: 'center', paddingLeft: 10 }}>
      <Text allowFontScaling={false} style={{ color: 'white' }} >Delete</Text>
    </View>
  </TouchableOpacity>
];
const styles = StyleSheet.create({
  container: {
    height: 130,
    backgroundColor: '#ffffff'
  },
  viewTop: {
    flexDirection: 'row',
    padding: 10
  },
  viewTopLeft: {
    flex: 1,
    flexDirection: 'row'
  },
  viewTopRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  viewTopTwo: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
  },
  viewBottom: {
    flexDirection: 'row',
    height: 60,
  },
  viewBottomLeft: {
    width: "50%",
    marginRight: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  viewBottomRight: {
    width: "50%",
    marginLeft: 1,
    justifyContent: 'center',
    alignItems: 'center', flexDirection: 'row'
  },
  viewBottomCenter: {
    borderWidth: 0.5,
    height: 80,
    borderColor: '#afb1b2',
    justifyContent: 'center'
  },
  imgBottom: {
    width: 30,
    height: 30,
    marginRight: 15
  },
  textBottom: {
    fontSize: 14,
    fontWeight: '300',
    color: constants.baseColor
  },
  textTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#383838'
  },
  textPostDate: {
    fontSize: 17,
    fontWeight: '400',
    color: '#afb1b2'
  },
  textDetail: {
    fontSize: 15,
    fontWeight: '400',
    color: constants.baseColor
  },
});
