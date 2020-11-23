import React, { PureComponent, Component } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import PatientAccount from './PatientAccount';
import PatientProfileUpdate from './PatientProfileUpdate';
import SubTab from './SubTab';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import SInfo from 'react-native-sensitive-info';
import constants from './../constants/constants'
const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

const FirstRoute = () => <PatientAccount />;
const SecondRoute = () => <View style={[styles.container, { backgroundColor: '#673ab7' }]} />;





// const SimpleApp2 = StackNavigator({
//   Home: { screen: SubTab }
// });

export default class MainTab extends Component {

  static navigationOptions = {
    header: null,
  };

  state = {
    index: 0,
    routes: [
      { key: 'first' },
      { key: 'second' },
      { key: 'third' },
    ],
  };

  _handleIndexChange = index => this.setState({ index });

  _renderHeader = props => <TabBar {...props} />;

  _renderScene = SceneMap({
    first: more,
    second: more,
    third: more,
  });


  _renderIcon = ({ navigationState }) => ({ route, index }) => {
    const selected = navigationState.index === index;
    console.log("<><><>qw " + selected);
    var imgSource1 = selected ? require('../images/1-bottom-on.png') : require('../images/1-bottom.png');
    var imgSource2 = selected ? require('../images/2-bottom-on.png') : require('../images/2-bottom.png');
    var imgSource3 = selected ? require('../images/3-bottom-on.png') : require('../images/3-bottom.png');


    switch (route.key) {
      case 'first':
        return <Image
          style={{ width: 24, height: 24 }}
          source={imgSource1}
        />;
      case 'second':
        return <Image
          style={{ width: 24, height: 24 }}
          source={imgSource2}
        />;
      case 'third':
        return <Image
          style={{ width: 24, height: 24 }}
          source={imgSource3}
        />;
      default:
        return null;
    }
  };


  renderTabsHeader = (props) => {
    return (
      <TabBar
        {...props}
        pressColor='rgba(255, 255, 255, .1)'
        style={styles.tabBar}
        //labelStyle={labels}
        //renderLabel={false}
        renderIcon={this._renderIcon(props)}
      />
    );
  };




  render() {
    return (
      <TabViewAnimated
        animationEnabled={false}
        swipeEnabled={false}
        style={styles.container}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderFooter={this.renderTabsHeader}
        onIndexChange={this._handleIndexChange}
        onRequestChangeTab={index => this.setState({ index })}
        initialLayout={initialLayout}
      />
    );
  }
}





const styles = StyleSheet.create({

  container: {
    flex: 1,

  },
  tabBar: {
    backgroundColor: 'rgba(255,255,255,1)',
    paddingTop: 0,
  },

  indicator: {
    height: 50,
    backgroundColor: 'rgb(253,247,96)',
  },
  idle: {
    backgroundColor: 'transparent',
    color: '#cccccc',
  },
  selected: {
    backgroundColor: 'transparent',
    color: '#111111',
  },


});