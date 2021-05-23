import React from "react"
import { Platform, Dimensions } from "react-native"
import { createStackNavigator } from "react-navigation-stack"
import { createBottomTabNavigator, createMaterialTopTabNavigator } from "react-navigation-tabs"

import TabBarIcon from "../components/TabBarIcon"
import HomeScreen from "../screens/HomeScreen"
import DetailArticleScreen from "../screens/DetailArticleScreen"
import LivesScreen from "../screens/LivesScreen"
import MatchSynthesisScreen from "../screens/MatchSynthesisScreen"
import MatchCompositionScreen from "../screens/MatchCompositionScreen"
import MatchFeedScreen from "../screens/MatchFeedScreen"
import ResultsScreen from "../screens/ResultsScreen"
import { createDrawerNavigator } from "react-navigation-drawer"
import SideMenu from "../components/SideMenu"



// const config = Platform.select({
//     web: { headerMode: "screen" },
//     
//     default: {},
// })

const config = {
    defaultNavigationOptions: {
        
        headerTintColor: "#fff",
        headerStyle: {
            backgroundColor: "#000",
        },
    },
}

const HomeStack = createStackNavigator(
    {
        Home : HomeScreen,
        Detail : DetailArticleScreen
    },
    config
)

HomeStack.navigationOptions = {
    
    tabBarLabel: "Accueil",
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name="md-home"
        />
    ),
    tabBarOptions: {
        activeTintColor: "#000"
    },
}


/********************* LIVE  **********************/
const MatchTabs = createMaterialTopTabNavigator(
    {
        Synthesis: MatchSynthesisScreen,
        Composition: MatchCompositionScreen,
        Feed: MatchFeedScreen
    },
    config
)



const LivesStack = createStackNavigator(
    {
        Lives: LivesScreen,
    },
    config
)

LivesStack.navigationOptions = {
    tabBarLabel: "Live",
    tabBarIcon: ({ focused }) => (
        <TabBarIcon focused={focused} name="md-eye" />
    ),
    tabBarOptions: {
        activeTintColor: "#000"
    },
}



// /********************* RESULTS  **********************/
const ResultStack = createStackNavigator(
    {
        Results: ResultsScreen
    },
    config
)

ResultStack.navigationOptions = {
    tabBarLabel: "Résultats",
    tabBarIcon: ({ focused }) => (
        <TabBarIcon focused={focused} name={Platform.OS === "ios" ? "ios-trophy" : "md-trophy"} />
    ),
    tabBarOptions: {
        activeTintColor: "#000"
    },
}


// const VideoStack = createStackNavigator(
//     {
//         Video: VideoScreen,
//     },
//     config
// )

// VideoStack.navigationOptions = {
//     tabBarLabel: "Videos",
//     tabBarIcon: ({ focused }) => (
//         <TabBarIcon focused={focused} name={Platform.OS === "ios" ? "ios-videocam" : "md-videocam"} />
//     ),
//     tabBarOptions: {
//         activeTintColor: "#000"
//     },
// }


const tabNavigator = createBottomTabNavigator(
    {
        HomeStack: {
            screen: HomeStack,
            // navigationOptions: ({ navigation }) => ({
            //     headerMode: "none"
            // })
        },
        LivesStack,
        ResultStack
        // VideoStack,
    }
)

const stackNavigator = createStackNavigator(
    {
        tabNavigator: {
            screen: tabNavigator,
            navigationOptions: ({ navigation }) => ({
                header: null,
            })
        },
        MatchTabs: {
            screen: MatchTabs
        }
    },
    config
)

const dashboardStack = createDrawerNavigator(
    {
        Dashboard: stackNavigator,
    },
    {
        headerMode: "none",
        contentComponent: SideMenu,
        drawerWidth: Dimensions.get("window").width * 3/4,
    })
export default dashboardStack


