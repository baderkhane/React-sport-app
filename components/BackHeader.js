import React, { Component } from "react"
import { Button, Icon, ActionSheet } from "native-base"
import { View, Image, StyleSheet } from "react-native"



export default class BackHeader extends Component {

    render() {
        const { navigation, right } = this.props
        return (
            <View style={styles.header}>
                <Button transparent onPress={() => navigation.goBack()}>
                    <Icon name="menu" style={styles.icon} />
                </Button>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    header: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#000"
    },
    icon: {
        marginTop: 15,
        fontSize: 30,
        color: "#fff"
    }
})
