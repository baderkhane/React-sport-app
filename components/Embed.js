import React, { Component, PureComponent } from "react"
import { Linking, View, Text } from "react-native"
import AutoHeightWebView from "react-native-autoheight-webview"
import HTML from "react-native-render-html"
import Video from "./Video"

class HTMLComponent extends Component {

    // force open link in browser
    shouldStartLoadWithRequest = (event) => {
        Linking.canOpenURL(event.url).then(supported => {
            if (supported) {
                Linking.openURL(event.url)
            }
            return false
        })
    }


    // shouldStartLoadWithRequestHandler = ({ url }) => {
    //     onShouldStartLoadWithRequest = { event => {
    //         if (event.url !== uri) {
    //             Linking.openURL(event.url)
    //             return false
    //         }
    //         return true
    //     }
    // }
    //     // return url === "about:blank"
    // }

    // navigationStateChangedHandler = (event) => {
    //     // do not allow user to load content into webview
    //     // about:blank is used by twitter to load its content so we allow it
    //     // console.log(url)
    //     // if (url !== "about:blank") {
    //     //     this.WebView.stopLoading()
    //     //     // Linking.openURL(url)
    //     // }
    //     console.log("navigation")
    //     console.log(event)
    //     if (event.navigationType === "click") {
    //         this.webview.stopLoading()
    //         Linking.openURL(event.url)
    //     }
    // }
}

export class HTMLText extends HTMLComponent {
    render() {
        const { content } = this.props
        return (
            <HTML html={content} onLinkPress={(event, href) => {
                Linking.openURL(href)
            }}></HTML>
        )
    }
} 

export class GenericEmbed extends HTMLComponent {
    render() {
        const { content } = this.props
        return (
            <AutoHeightWebView source={{ html: content }}
                allowsFullscreenVideo={true}
                javaScriptEnabled={true}
                onShouldStartLoadWithRequest={this.shouldStartLoadWithRequest}
                ref={c => {
                    this.WebView = c
                }}>
            </AutoHeightWebView>
        )
    }
}


export class Twitter extends HTMLComponent {

    render() {
        const { content } = this.props
        return (
            <AutoHeightWebView source={{ html: content, baseUrl: "https://twitter.com" }}
                allowsFullscreenVideo={true}
                onShouldStartLoadWithRequest={this.shouldStartLoadWithRequest}
                // onNavigationStateChange={this.navigationStateChangedHandler}
                ref={c => {
                    this.WebView = c
                }}>
            </AutoHeightWebView>
        )
    }
}


export class Dailymotion extends HTMLComponent {

    render() {
        const { id } = this.props
        //  width="480" height="270"
        const content = `<iframe frameborder="0" src="https://www.dailymotion.com/embed/video/${id}" allowfullscreen allow="autoplay"></iframe>`

        return (
            <AutoHeightWebView source={{ html: content }}
                allowsFullscreenVideo={true}
                onShouldStartLoadWithRequest={this.shouldStartLoadWithRequest}
                ref={c => {
                    this.WebView = c
                }}>
            </AutoHeightWebView>
        )
    }
}