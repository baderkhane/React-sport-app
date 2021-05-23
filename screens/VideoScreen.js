import React from "react"
import { View, Text } from "react-native"
import { Video } from "../components"


export default function VideoScreen() {
    /**
     * 
     */
    return (
        <View style={{ flex: 1 }}>
            {/* <Text>A venir</Text> */}
            <Video uri="https://www.dailymotion.com/embed/video/klLSOqqJNurTpXvC3ok" style={{ flex: 1 }}/>
            
        </View>
    )

}

VideoScreen.navigationOptions = {
    title: "Les vidéos",
}
