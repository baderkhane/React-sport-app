import React, { Component } from "react"
import { Image, View, StyleSheet } from "react-native"
import { ListItem, Text, Body, Right, Icon } from "native-base"
import PropTypes from "prop-types"
import { observer } from "mobx-react"


@observer
class Team extends Component {
    render() {
        const {name, logo, reverse} = this.props
        return (
            <View style={[styles.team, reverse && styles.team_reverse]}>
                {logo ? <Image source={{ uri: logo }} style={styles.logo} /> : <Text></Text>}
                <Text style={[styles.name, reverse && styles.name_reverse]}>{name}</Text>
            </View>
        )
    }
}

Team.propTypes = {
    name: PropTypes.string.isRequired,
    logo: PropTypes.string,
    reverse: PropTypes.bool
}

Team.defaultProps = {
    reverse: false
}

const baseScoreProps = {
    heure: PropTypes.string,
    etat: PropTypes.number,
    equipe1: PropTypes.object,
    equipe2: PropTypes.object
}

@observer
class TeamSportScore extends Component {
    getScore() {
        /* return score or hour */
        const { equipe1, equipe2, etat, heure } = this.props
        if (etat === 0)
            return heure
        return equipe1.score + " - " + equipe2.score
    }

    render() {
        const { equipe1, equipe2 } = this.props
        return (
            <View style={styles.line}>
                <Team {...equipe1}></Team>
                <Text style={styles.scores}>
                    {this.getScore()}
                </Text>
                <Team {...equipe2} reverse={true}></Team>
            </View>
        )
    }
}

TeamSportScore.propTypes = baseScoreProps


@observer
class TennisScore extends Component {

    render() {
        const { equipe1, equipe2, etat, heure } = this.props
        let score
        if (etat === 0)
            score = <Text style={styles.scores}>{heure}</Text>
        else
            score = <View style={styles.tennis_score}>
                <View style={styles.tennis_score_line}>
                    {equipe1.score.map((item, i) => <Text key={i} style={styles.tennis_score_single}>{item}</Text>)}
                </View>
                <View style={styles.tennis_score_line}>
                    {equipe2.score.map((item, i) => <Text key={i} style={styles.tennis_score_single}>{item}</Text>)}
                </View>
            </View>
        
        return (
            <View style={{flex:1, flexDirection:"row"}}>
                <View style={{ flex: 1, flexDirection: "column" }}>
                    <Text>{equipe1.name}</Text>
                    <Text>{equipe2.name}</Text>
                </View>
                <View>
                    {score}
                </View>
            </View>
        )
    }
}

TennisScore.propTypes = baseScoreProps


@observer
export default class MatchLine extends Component {

    constructor(props){
        super(props)
        this.goToDetails = this.goToDetails.bind(this)
    }


    goToDetails(id) {
        if (this.props.showDetails){
            this.props.navigation.navigate("MatchTabs", {
                matchId: id,
            })
        }
    }

    render() {
        if (this.props.type == "error")
            return (
                <ListItem><Text>{this.props.name}</Text></ListItem>
            )
        else if (this.props.type == "sport")
            return (
                <ListItem><Text style={styles.list_header_text1}>{this.props.name}</Text></ListItem>
            )
        else if (this.props.type == "compet")
            return (
                <ListItem><Text style={styles.list_header_text2}>{this.props.name}</Text></ListItem>
            )
        else if (this.props.type == "match"){
            const { id, sport, equipe1, equipe2, etat, heure, showDetails } = this.props
            // component dependant of sport
            let Score
            if(sport === "TENNIS")
                Score = TennisScore
            else
                Score = TeamSportScore
            return (
                <ListItem noIndent button onPress={() => this.goToDetails(id)}>
                    <Body>                    
                        <Score equipe1={equipe1} equipe2={equipe2} etat={etat} heure={heure} />
                    </Body>
                    {showDetails && <Right style={{flex:0.14}}>
                        <Icon name="arrow-forward" />
                    </Right>}
                </ListItem>
            )
        }
    }
}

MatchLine.propTypes = {
    type: PropTypes.oneOf(["sport", "compet", "match", "error"]).isRequired,
    id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]).isRequired,
    name: PropTypes.string,
    navigation: PropTypes.object,
    equipe1: PropTypes.object,
    equipe2: PropTypes.object
}


const styles = StyleSheet.create({
    line: {
        flexDirection: "row"
    },
    list_header: {
        marginLeft: 5,
        marginTop: 0,
        padding: 0,
        height: 20,
    },
    list_header_text1: {
        fontWeight: "bold",
        fontSize: 20,
        textTransform: "uppercase"
    }, 
    list_header_text2: {
        paddingLeft: 5,
        color: "#505050"
    }, 
    team: {
        flex: 1,
        flexDirection: "row",
        
    },
    scores: {
        flex: 0
    },
    team_reverse: {
        flexDirection: "row-reverse",
        textAlign: "right"
    },
    name: {
        fontSize: 12,
        flexWrap: "wrap", 
        flexShrink: 0
    },
    name_reverse: {
        textAlign: "right"
    },
    logo: {
        width: 20,
        height: 20
    },
    tennis_score: {
        flexDirection: "column"
    },
    tennis_score_line: {
        flexDirection: "row"
    },
    tennis_score_single: {
    }
})
