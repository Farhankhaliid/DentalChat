/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import moment from 'moment';
import constants from './../constants/constants'
//2017-07-20 06:16:52

export default class TimeAndDatePost extends Component {
  getDisplayTimeAndDate(postedDate) {
    var dd = '';
    if(postedDate && postedDate.toString().includes("/")){
      var datum = Date.parse(postedDate.replace(/-/g, "/"));
      // console.log('<><><><><><>  ' + datum / 1000);
      dd = datum / 1000;
    }else{
      dd = postedDate
    }
    


    var d = new Date(dd * 1000),	// Convert the passed timestamp to milliseconds
      yyyy = d.getFullYear(),
      mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
      dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
      hh = d.getHours(),
      h = hh,
      min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
      ampm = 'AM',
      time;

    // ie: 2013-02-18, 8:35 AM	
    return time = mm + '-' + dd + '-' + yyyy + '  ' + h + ':' + min;
    // console.log("<><><><>  " + time);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text allowFontScaling={false} style={styles.timeTextStyle}>
          {this.getDisplayTimeAndDate(this.props.postedDate)}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  timeTextStyle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#afb1b2'

  },
});
