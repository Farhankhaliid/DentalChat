// /* @flow */

// import React, { Component } from 'react';
// import { StackNavigator, TabNavigator } from 'react-navigation';

// import Home from './screens/Home';
// import DentistLogin from './screens/DentistLogin';
// import DentistDashboard from './screens/DentistDashboard';
// import DentistMessages from './screens/DentistMessages';
// import DentistAccount from './screens/DentistAccount';
// import DentistChatWindow from './screens/DentistChatWindow';
// import PostDetails from './screens/PostDetails';
// import DentistEditProfile from './screens/DentistEditProfile';
// import DentistChangePassword from './screens/DentistChangePassword';
// import DentistForgotPassword from './screens/DentistForgotPassword';

// import PatientLogin from './screens/PatientLogin';


// const DentistMessageStackNav = StackNavigator({
//   DentistMessages: {
//      screen: DentistMessages
//    },
//   DentistChatWindow: {
//     screen: DentistChatWindow,
//   },
//   PostDetails: {
//     screen: PostDetails
//   }
// }, {
//   navigationOptions: {
//     headerBackTitleStyle: {
//       color: constants.baseColor
//     },
//     headerTitleStyle: {
//       color: 'black'
//     },
//     headerTintColor: constants.baseColor,
//     headerBackTitle: null
//   }
// });

// const DentistDashboardStackNav = StackNavigator({
//   DentistDashboard: {
//      screen: DentistDashboard
//    },
// }, {
//   navigationOptions: {
//     headerBackTitleStyle: {
//       color: constants.baseColor
//     },
//     headerTitleStyle: {
//       color: 'black'
//     },
//     headerTintColor: constants.baseColor
//   }
// });

// const DentistAccountStackNav = StackNavigator({
//   DentistAccount: {
//      screen: DentistAccount
//    },
//   DentistEditProfile: {
//      screen: DentistEditProfile
//   },
//   DentistChangePassword: {
//      screen: DentistChangePassword
//   }
// }, {
//   navigationOptions: {
//     headerBackTitleStyle: {
//       color: constants.baseColor
//     },
//     headerTitleStyle: {
//       color: 'black'
//     },
//     headerBackTitle: null,
//     headerTintColor: constants.baseColor
//   }
// });

// const DentistLoginStack = StackNavigator({
//   Home: {
//      screen: Home
//    },
//   DentistLogin: {
//     screen: DentistLogin,
//   },
//   DentistForgotPassword: {
//     screen: DentistForgotPassword
//   },
// }, {
//   navigationOptions: {
//     headerBackTitleStyle: {
//       color: constants.baseColor
//     },
//     headerTitleStyle: {
//       color: 'black'
//     },
//     headerBackTitle: null,
//     headerTintColor: constants.baseColor
//   }
// });

// const DentistTabMenu = TabNavigator({
//   DentistDashboardStackNav: {
//      screen: DentistDashboardStackNav,
//    },
//   DentistMessageStackNav: {
//      screen: DentistMessageStackNav
//    },
//   DentistAccountStackNav: {
//      screen: DentistAccountStackNav
//    }
// }, {
//   tabBarOptions: {
//     activeTintColor: constants.baseColor,
//     style: {
//       padding: 3,
//     }
//   }
// });

// const PatientLoginStack = StackNavigator({
//   Home: {
//      screen: Home
//    },
//   PatientLogin: {
//     screen: PatientLogin,
//   },
//   DentistForgotPassword: {
//     screen: DentistForgotPassword
//   },
// }, {
//   navigationOptions: {
//     headerBackTitleStyle: {
//       color: constants.baseColor
//     },
//     headerTitleStyle: {
//       color: 'black'
//     },
//     headerBackTitle: null,
//     headerTintColor: constants.baseColor
//   }
// });

// const SimpleApp = StackNavigator({
//   DentistLoginStack: {
//     screen: DentistLoginStack
//   },
//   DentistTabMenu: {
//      screen: DentistTabMenu
//    },
//    PatientLoginStack: {
//      screen: PatientLoginStack
//    }
// }, {
//   navigationOptions: {
//     headerBackTitleStyle: {
//       color: constants.baseColor
//     },
//     headerTitleStyle: {
//       color: 'black'
//     },
//     headerBackTitle: null,
//     headerTintColor: constants.baseColor,
//     header: null,
//     gesturesEnabled: false
//   }
// });


// export default class App extends Component {
//   render() {
//     return (
//       <SimpleApp />
//     );
//   }
// }
