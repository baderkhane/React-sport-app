import React, { Component } from "react"
import { Image, FlatList, TouchableHighlight, RefreshControl, View } from "react-native"
import { ActionSheet, Button, Container, Icon, Text, H2 } from "native-base"

import { storesContext } from "../store"
import { observer } from "mobx-react"
import { AppHeader} from "../components"

@observer
class NewsItem extends Component {
    static contextType = storesContext

    goToDetails(id) {
        this.context.newsStore.setSelectedItemId(id)
        this.props.navigation.navigate("Detail", {
            matchId: id,
        })
    }

    render() {
        const { id, title, sport, image } = this.props
        return (
            <TouchableHighlight onPress={() => this.goToDetails(id)}>
                <View>
                    <Image source={{ uri: image }} style={{ height: 200, width: null, flex: 1 }} />
                    <View style={styles.news_bg}>
                        <H2 style={styles.news_bg_text}>{title}</H2>
                    </View>
                    <View style={styles.news_sport}>
                        <Text style={styles.news_sport_text}>{sport.name}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
}

@observer
export default class HomeScreen extends Component {
    static contextType = storesContext

    static navigationOptions = ({ navigation, screenProps }) => ({
        headerTitle: () => <AppHeader navigation={navigation} right={<Button transparent onPress={() =>
            ActionSheet.show(
                {
                    options: navigation.getParam("sports"),
                    title: "Filtrer par sport",
                    cancelButtonIndex: navigation.getParam("sports").length > 1 ? navigation.getParam("sports").length -1 :0,    
                },
                buttonIndex => {                
                    navigation.getParam("setSport")(buttonIndex)                     
                }
            )}
        >
            <Icon name="more" style={styles.icon} />
        </Button>} />,
    });

    constructor(props) {
        super(props)
        this.onRefresh = this.onRefresh.bind(this)
        this.setSport = this.setSport.bind(this)
    }

    onRefresh() {
        this.context.newsStore.fetchNewsItems(this.context.sportsStore.selectedSportId)
    }

    setSport(index) {
        let sportId
        const sports = this.context.sportsStore.sports
        if(index == 0) // first is "all sports"
            sportId = null
        else if (index === undefined || index > sports.length)
            return
        else
            sportId = sports[index - 1].id
        
        this.context.sportsStore.setSelectedSportId(sportId)
        this.list.scrollToOffset({ animated: true, offset: 0 })
    }

    async componentDidMount() {
        await this.context.sportsStore.fetchSports()
        this.context.newsStore.fetchNewsItems()
        this.props.navigation.setParams({ sports: ["Tous"].concat(this.context.sportsStore.sports.map((item) => item.name)).concat(["Annuler"]) })
        this.props.navigation.setParams({ setSport: this.setSport })
    }

    render() {
        return (
            <Container>
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={this.context.newsStore.state === "pending"}
                            onRefresh={this.onRefresh}
                            title="Chargement..."
                        />
                    }
                    data={this.context.newsStore.newsitems}
                    renderItem={({ item }) =>
                        <NewsItem {...item} navigation={this.props.navigation}/>
                    }
                    keyExtractor={item => item.key}
                    ref={c => {
                        this.list = c
                    }}
                />
            </Container>
        )
    }
}

const styles = {
    news_bg: {
        position: "absolute", 
        bottom: 0, 
        justifyContent: "center", 
        backgroundColor: "rgba(0, 0, 0, 0.7)"
    },
    news_bg_text: {
        color: "white",
        padding: 10
    },
    news_sport: {
        position: "absolute",
        top: 0,
        right:0,
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)"
    },
    news_sport_text: {
        color: "white",
        padding: 5
    },
    icon: {
        marginTop: 15,
        fontSize: 30,
        color: "#fff"
    }
}