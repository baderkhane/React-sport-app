import React, { Component } from "react"
import { Button, Icon, ActionSheet } from "native-base"
import { View, Image, StyleSheet } from "react-native"



export default class AppHeader extends Component {

    render() {
        const { navigation, right} = this.props
        return (
            <View style={styles.header}>
                <Button transparent onPress={() => navigation.toggleDrawer()}>
                    <Icon name="menu" style={styles.icon}/>
                </Button>
                <View style={{flex:1}}>
                    <Image source={require("../assets/images/logo.png")} style={{ width: 140, height: 60, marginLeft:10, resizeMode:"contain"}} />
                </View>
                {right}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    header: {
        flex: 1,
        flexDirection: "row"
    },
    icon: {
        marginTop: 15,
        fontSize: 30, 
        color: "#fff"
    }
})
