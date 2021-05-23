import React, { Component } from "react"
import {  RefreshControl, Text } from "react-native"
import { Container, Content, Spinner } from "native-base"
import { storesContext } from "../store"
import { observer } from "mobx-react"

@observer
export default function MatchWrapper(WrappedComponent, navigationOptions) {
    /* wrapper component for match screens */
    return class extends Component {
        static contextType = storesContext
        static navigationOptions = navigationOptions

        // static navigationOptions = ({ navigation, screenProps }) => ({
        //     headerTitle: () => <BackHeader navigation={navigation} />,
        // });

        constructor(props) {
            super(props)
            this.refresh = this.refresh.bind(this)
        }

        refresh() {
            this.context.matchStore.fetchMatch()
        }

        componentDidMount() {
            console.log(this.getMatchId())
            this.context.matchStore.setMatch(this.getMatchId())
        }

        getMatchId() {
            // return "162163" // exemple match : lyon - nice
            return this.props.navigation.getParam("matchId")
        }

        render() {
            if (this.context.matchStore.error){
                return (<Container><Text>{this.context.matchStore.error}</Text></Container>)
            }
            else if (this.context.matchStore.state !== "done"){
                return (<Container><Spinner color="black"></Spinner></Container>)
            }
            return (
                <Container>
                    {/* <BackHeader navigation={this.props.navigation} /> */}
                    <Content
                        refreshControl={
                            <RefreshControl
                                refreshing={this.context.matchStore.state === "pending"}
                                onRefresh={this.refresh}
                                title="Chargement..."
                            />
                        }>
                        {/* <Text>match id : {this.getMatchId()}</Text> */}

                        <WrappedComponent {...this.props} />
                    </Content>
                </Container>
            )
        }
}
}