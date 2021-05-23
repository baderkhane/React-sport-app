import React, { Component } from "react"
import { FlatList, RefreshControl, Text } from "react-native"
import { Container } from "native-base"
import { storesContext } from "../store"
import { observer } from "mobx-react"
import { AppHeader, MatchLine } from "../components"
import { isInternetReachable } from "../utils/network"

@observer
export default class LivesScreen extends Component {
    static contextType = storesContext

    static navigationOptions = ({ navigation, screenProps }) => ({
        headerTitle: () => <AppHeader navigation={navigation} />,
    });

    constructor(props) {
        super(props)
        this.refresh = this.refresh.bind(this)
    }

    componentDidMount() {
        this.context.livesStore.fetchLiveMatches()
        // refresh page every minute
        this.interval = setInterval(() => this.refresh(), 1000*60)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    refresh() {
        this.context.livesStore.fetchLiveMatches()
    }

    render() {
        return (
            <Container>
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={this.context.livesStore.state === "pending"}
                            onRefresh={this.refresh}
                            title="Chargement..."
                        />
                    }
                    data={this.context.livesStore.flatList}
                    renderItem={({ item }) =>
                        <MatchLine navigation={this.props.navigation} {...item} />
                    }
                    keyExtractor={item => item.key}
                />

            </Container>
        )
    }
}