import { Dimensions } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
export default Constants = {
	deviceHeight: Dimensions.get("window").height,
	deviceWidth: Dimensions.get("window").width,
	statusBarHeight: getStatusBarHeight(),
	themeColor: "#1272f6",
	placeHolderColor: "#3e3f3f",
	disabledColor: "#a5a5a5",
	black: "#4d4d4d",
	backgroundPageColor: "#f5f5f5",
	currency: "PKR",
	green: "#00af58",
	grey: "#d4d7dd",
	white: "#FFFFFF",
	emailcontext: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
}