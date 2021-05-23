import React, { Component } from "react"
import { FlatList, StyleSheet, View } from "react-native"
import { Text } from "native-base"
import { storesContext } from "../store"
import { observer } from "mobx-react"
import MatchWrapper from "../components/MatchWrapper"
import { GoalIcon, InIcon, OutIcon, RougeIcon, JauneIcon } from "../assets/icons"
import HTML from "react-native-render-html"

@observer
class CommentLine extends Component {
    render() {
        const {equipe, commentaire, but, entrant, sortant, jaune, rouge, chrono} = this.props
        return(
            <View style={[styles.comment, equipe === 0 ? styles.eq1 : styles.eq2, but && styles.goal]}>
                <View style={styles.context}>
                    <View style={styles.chrono}>
                        <Text style={styles.chrono_text}>{chrono}&apos;</Text>
                    </View>
                    {but && <GoalIcon width={16} height={16} />}
                    {entrant && <InIcon width={16} height={16} />}
                    {sortant && <OutIcon width={16} height={16} />}
                    {rouge && <RougeIcon width={16} height={16} />}
                    {jaune && <JauneIcon width={16} height={16} />}
                </View>
                <View style={styles.text}>
                    <HTML html={commentaire} style={styles.comment_text}></HTML>
                </View>
            </View>
        )
    }
}

@observer
class MatchFeed extends Component {
    static contextType = storesContext

    constructor(props) {
        super(props)
    }

    render() {
        const comments = this.context.matchStore.comments
        if (comments.length === 0)
            return (<Text style={{ margin: 10 }}>Les commentaires de ce direct ne sont pas encore disponibles.</Text>)
        return (
            <View style={styles.container}>
                <FlatList
                    data={comments}
                    renderItem={({ item }) => <CommentLine {...item } />}
                    keyExtractor={item  => item.id}
                />
            </View>
        )
    }
}

const navigationOptions = {
    title: "Le fil",
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#eee",
        flex: 1,
    },
    comment: {
        flex: 1,
        flexDirection: "row",
        marginTop: 2,
        marginBottom: 2,
        padding: 5,
        paddingRight: 10,
        backgroundColor: "#fff",
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: "#d6d7da",
        fontSize: 8,
        elevation: 2
    },
    context: {
        flex:0
    },
    text: {
        flex:1,
        paddingLeft: 5
    },
    chrono_text: {
        fontWeight: "bold"
    },
    comment_text: {
        fontSize: 14
    },
    eq1: {
        marginRight: 20,
        marginLeft: 5
    },
    eq2: {
        marginLeft: 20,
        marginRight: 5
    },
    goal: {
        backgroundColor: "#aaffaa",
    }
    
})

export default MatchWrapper(MatchFeed, navigationOptions)