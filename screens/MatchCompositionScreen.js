import React, { Component } from "react"
import { Image, StyleSheet, View } from "react-native"
import { Left, List, ListItem, Text, Icon, Body, Right, Thumbnail } from "native-base"
import { storesContext } from "../store"
import { observer } from "mobx-react"
import MatchWrapper from "../components/MatchWrapper"
import { GoalIcon, InIcon, OutIcon, RougeIcon, JauneIcon, Avatar } from "../assets/icons"

@observer
class PlayerComposition extends Component {
    render() {
        const { but, entrant, sortant, jaune, rouge, portrait } = this.props
        return (
            <View style={styles.player}>
                <View style={styles.player_portrait}>
                    {portrait ? <Thumbnail small source={{ uri: portrait }} /> : <Avatar width={32} height={32} style={{ marginLeft: 2 }} />}
                </View>
                <View style={styles.player_name}>
                    <Text>{this.props.nom}</Text>
                </View>
                <View style={styles.player_icons}>
                    {[...Array(but)].map((elem, i) => <GoalIcon key={i} width={16} height={16} />)}
                    {entrant && <InIcon width={16} height={16} />}
                    {sortant && <OutIcon width={16} height={16} />}
                    {rouge && <RougeIcon width={16} height={16} />}
                    {jaune && <JauneIcon width={16} height={16} />}
                </View>
            </View>
        )
    }
}

@observer
class TeamComposition extends Component {
    render() {
        const { effectif, nom, logo } = this.props.team
        return (
            <View style={styles.team_composition}>
                <Image
                    style={styles.logo}
                    source={{ uri: logo }}
                />
                <Text style={styles.team_name}>{nom}</Text>
                <List>
                    <ListItem style={styles.list_header}><Text style={styles.list_header_text}>Entraineur</Text></ListItem>
                    {effectif.coach.map((item) =>
                        <PlayerComposition key={item.id} {...item}></PlayerComposition>
                    )}
                    <ListItem style={styles.list_header}><Text>Joueurs</Text></ListItem>
                    {effectif.joueurs.map((item) =>
                        <PlayerComposition key={item.id} {...item}></PlayerComposition>
                    )}
                    <ListItem style={styles.list_header}><Text>Remplaçants</Text></ListItem>
                    {effectif.remplacants.map((item) =>
                        <PlayerComposition key={item.id} {...item}></PlayerComposition>
                    )}
                </List>
            </View>
        )
    }
}


@observer
class MatchComposition extends Component {
    static contextType = storesContext

    constructor(props) {
        super(props)
    }

    getEffectifs() {
        return this.context.matchStore.listEffectifs
    }

    render() {
        if (this.context.matchStore.listEffectifs.length === 0)
            return (<Text style={{ margin: 10 }}>La composition est indisponible pour ce match.</Text>)
        return (
            <View>
                <TeamComposition team={this.getEffectifs()[0]}></TeamComposition>
                <TeamComposition team={this.getEffectifs()[1]}></TeamComposition>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: "#fff",
    },
    list_header: {
        height: 10
    },
    list_header_text: {
        color: "#505050"
    },
    team_composition: {
        // justifyContent: "center",
        // alignItems: "center"
    },
    team_name: {
        alignSelf: "center",
        fontSize: 20
    },
    logo: {
        alignSelf: "center",
        marginTop: 6,
        width: 50,
        height: 50
    },
    player: {
        flexDirection: "row",
        height: 42
    },
    player_portrait: {
        flex: 1,
    },
    player_name: {
        flex: 4,
        paddingTop: 4
    },
    player_icons: {
        flex: 1,
        flexDirection: "row",
        marginTop: 8
    }
})

export default MatchWrapper(MatchComposition)
