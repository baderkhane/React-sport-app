import React, { Component } from "react"
import { WebView } from "react-native-webview"

export default class AppHeader extends Component {

    // IOS
    shouldStartLoadWithRequestHandler = ({ url }) => url === this.props.uri;

    // ANDROID
    navigationStateChangedHandler = ({ url }) => {
        if (url.startsWith('https://') && url !== this.props.uri) {
            this.WebView.stopLoading()
        }
    };

    render() {
        const { uri} = this.props
        return (
            <WebView source={{ uri: uri }} 
                allowsFullscreenVideo={true} 
                onNavigationStateChange={this.navigationStateChangedHandler}
                ref={c => {
                    this.WebView = c
                }}>
            </WebView>
        )
    }
}
