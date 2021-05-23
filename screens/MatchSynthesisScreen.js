import React, { Component } from "react"
import { Image, StyleSheet, View} from "react-native"
import { Text } from "native-base"
import { storesContext } from "../store"
import { observer } from "mobx-react"
import MatchWrapper from "../components/MatchWrapper"

@observer
class Goal extends Component {
    render() {
        const { chrono, joueur, typeLabel } = this.props
        return (
            <Text style={styles.goal}>
                {chrono}&apos; {joueur} {typeLabel}
            </Text>
        )
    }
}

@observer
class Team extends Component {
    render() {
        const {logo, nom, goals} = this.props
        return (
            <View style={styles.team}>
                <Image source={{ uri: logo }} style={styles.team_image} />
                <Text style={styles.team_text}>{nom}</Text>
                <View>
                    {goals.map((goal) =>
                        <Goal key={goal.id} {...goal}></Goal>
                    )}
                </View>
            </View>
        )
    }
}


@observer
class MatchSynthesis extends Component {
    static contextType = storesContext

    static navigationOptions = {
        title: "Synthèse"
    }

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            // refresh every minute, only not finished match
            if (this.context.matchStore.matchInfo.etat <= 1)
                this.context.matchStore.fetchMatch("silent")
        }, 1000 * 5)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    render() {
        const { equipe1, equipe2, hasPens, date, heure, stade, arbitre } = this.context.matchStore.matchInfo
        return (
            <View>
                {!!stade && <Text style={styles.stade}>{stade}</Text>}

                <View style={styles.result}>
                    <Team {...equipe1}></Team>
                    <View>
                        <Text style={styles.score}>{equipe1.nbGoals}-{equipe2.nbGoals}</Text>
                        {hasPens && <Text style={styles.pens}>TAB : {equipe1.nbPens}-{equipe2.nbPens}</Text>}
                    </View>
                    <Team {...equipe2}></Team>
                </View>

                <Text style={styles.date_hour}>{date} - {heure}</Text>
                {!!arbitre && <Text style={styles.arbitre}>Arbitre : {arbitre}</Text>}
            </View>
        )
    }
}

const navigationOptions = {
    title: "Synthèse",
}

const styles = StyleSheet.create({
    result: {
        flex: 1,
        flexDirection: "row",
        paddingTop: 15,
        backgroundColor: "#fff",
        alignItems: "flex-start"
    },
    team: {
        flex: 1,
        alignItems: "center"
    },
    team_image: {
        width: 50, 
        height: 50
    },
    team_text: {
        textAlign: "center"
    },

    
    score: {
        padding: 10,
        fontSize: 26,
        fontWeight: "bold",
        textAlign: "center"
    },
    pens: {
        fontSize: 13,
        textAlign: "center"
    },
    goal: {
        textAlign: "center",
        fontSize: 11
    },

    stade: {
        marginTop:10,
        color: "grey",
        fontSize: 12,
        textAlign: "center"
    },
    arbitre: {
        color: "grey",
        fontSize: 12,
        textAlign: "center"
    },
    date_hour: {
        marginTop: 20,
        color: "grey",
        fontSize: 12,
        textAlign: "center"
    }

})

export default MatchWrapper(MatchSynthesis, navigationOptions)
