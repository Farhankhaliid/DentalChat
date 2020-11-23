import React, { Component } from 'react'
import { View, Image, ActivityIndicator, ScrollView } from 'react-native';
import { StatusBar, Header } from './../utils/Component';

import Styles from './../utils/Styles';
import Constants from './../utils/Constants';

class DisplayImage extends Component {
    static navigationOptions = {
        // title: 'Please sign in',
        header: null //hide the header
    };

    constructor() {
        super()
        this.state = {
            picture: {
                uri: "",
            },
        }
    }

    componentDidMount() {
        const data = this.props.navigation.state.params
        this.setState({ picture: data })
        // SInfo.getItem('displayImage', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
        //     this.setState({ picture: value, })
        // });
    }

    back = () => {
        this.props.navigation.goBack();
    }

    render() {
        return (
            <View style={Styles.screen}>
                <StatusBar />
                <Header title={"Image"} isbackButton={true} fireEvent={this.back} />

                {/* <ScrollView> */}
                <View style={Styles.container}>
                    <View style={Styles.fullCameraBox}>
                        <View style={{position:'absolute',top:'45%',bottom:0,width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                            {
                                this.state.picture.uri ?
                                    <View style={Styles.imageLoader} >
                                        <ActivityIndicator size="small" color={Constants.themeColor} />
                                    </View> : null
                            }
                        </View>

                        <Image style={Styles.fullImageStyle} source={this.state.picture.uri ? this.state.picture : Images.ImgCamera} />
                    </View>
                </View>
                {/* </ScrollView> */}
            </View>
        );
    };
}

export default DisplayImage