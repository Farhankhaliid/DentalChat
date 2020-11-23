import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import Icon from 'react-native-vector-icons/FontAwesome'
import { Dimensions } from 'react-native'
import DentistDashboard from './DentistDashboard';
import DentistMessages from './DentistMessages';
import DentistAccount from './DentistAccount';
import SInfo from 'react-native-sensitive-info';
import PropTypes from 'prop-types';
import constants from './../constants/constants'
const deviceW = Dimensions.get('window').width

const basePx = 375

function px2dp(px) {
  return px * deviceW / basePx
}

class Home extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text allowFontScaling={false} style={styles.welcome}>
          Home
        </Text>
      </View>
    )
  }
}

class Profile extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text allowFontScaling={false} style={styles.welcome}>
          Profile
        </Text>
      </View>
    )
  }
}

export default class TabDemo extends Component {


  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'home'
    };

  }


  static getPost = (url, type) => {
    const { navigation: navigate } = this.props;
    SInfo.setItem('url', url, { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
    SInfo.setItem('typess', type, { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
    navigate('DentistMessages')
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <TabNavigator style={styles.container}>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'home'}
          title="Home"
          selectedTitleStyle={{ color: "#3496f0" }}
          renderIcon={() => <Icon name="home" size={px2dp(22)} color="#666" />}
          renderSelectedIcon={() => <Icon name="home" size={px2dp(22)} color="#3496f0" />}
          badgeText="1"
          onPress={() => this.demoCall()}>
          <DentistDashboard />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'profile'}
          title="Profile"
          selectedTitleStyle={{ color: "#3496f0" }}
          renderIcon={() => <Icon name="user" size={px2dp(22)} color="#666" />}
          renderSelectedIcon={() => <Icon name="user" size={px2dp(22)} color="#3496f0" />}
          onPress={() => this.setState({ selectedTab: 'profile' })}>
          <Profile />
        </TabNavigator.Item>
      </TabNavigator>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});