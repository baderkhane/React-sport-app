import React, { Component } from "react"
import { FlatList, RefreshControl } from "react-native"
import { Container } from "native-base"
import { AppHeader, MatchLine } from "../components"

import { storesContext } from "../store"
import { observer } from "mobx-react"



@observer
export default class ResultsScreen extends Component {
    static contextType = storesContext

    static navigationOptions = ({ navigation, screenProps }) => ({
        headerTitle: () => <AppHeader navigation={navigation} />,
    });


    constructor(props) {
        super(props)
        this.onRefresh = this.onRefresh.bind(this)
    }

    componentDidMount() {
        this.context.resultsStore.fetchResultsMatches()
    }

    onRefresh() {
        this.context.resultsStore.fetchResultsMatches()
    }

    render() {
        return (
            <Container>
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={this.context.resultsStore.state === "pending"}
                            onRefresh={this.onRefresh}
                            title="Chargement..."
                        />
                    }
                    data={this.context.resultsStore.flatList}
                    renderItem={({ item }) =>
                        <MatchLine navigation={this.props.navigation} {...item} />
                    }
                    keyExtractor={item => item.key}
                />

            </Container>
        )
    }
}