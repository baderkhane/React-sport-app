import React, { Component } from "react"
import { ScrollView } from "react-native-gesture-handler"
import SafeAreaView from "react-native-safe-area-view"
import { Linking, StyleSheet } from "react-native"
import { Icon, List, ListItem, Text } from "native-base"
import Constants from "expo-constants"
import { jsBuildNumber } from "../build.json"
import { expo } from "../app.json"

export default class SideMenu extends Component {
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <List>
                        <ListItem button onPress={() => { Linking.openURL("https://www.facebook.com/Sports.fr/") }}>
                            <Icon name="logo-facebook" style={styles.icon} /><Text>Facebook</Text>
                        </ListItem>
                        <ListItem button onPress={() => { Linking.openURL("https://twitter.com/sports_fr") }}>
                            <Icon name="logo-twitter" style={styles.icon} /><Text>Twitter</Text>
                        </ListItem>
                        <ListItem button onPress={() => { Linking.openURL("https://www.instagram.com/sports.fr_officiel") }}>
                            <Icon name="logo-instagram" style={styles.icon} /><Text>Instagram</Text>
                        </ListItem>
                        <ListItem button onPress={() => { Linking.openURL("https://www.sports.fr/mentions-legales") }}>
                            <Text>Politique de confidentialité</Text>
                        </ListItem>
                    </List>
                </ScrollView>
                <List>
                    <ListItem>
                        <Text style={styles.build}>App version {expo.version} - Build {jsBuildNumber}</Text>
                    </ListItem>
                </List>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30
    },
    icon: {
        marginRight: 10
    },
    build: {
        fontSize: 10,
        color: "grey"
    }
})