import React, { Component } from "react"
import { Container, Content, DeckSwiper, H1, Card, CardItem, Left, Thumbnail, Body, Icon } from "native-base"
import { Dimensions, Image, FlatList, Linking, View, Text, StyleSheet } from "react-native"
import { storesContext } from "../store"
import { observer } from "mobx-react"
import AutoHeightWebView from "react-native-autoheight-webview"
import Swiper from "react-native-swiper"
import { HTMLText, GenericEmbed, Dailymotion, Twitter} from "../components/Embed"



const TYPE_TO_COMPONENT = {
    text: HTMLText,
    iframe: GenericEmbed,
    twitter: Twitter,
    dailymotion: Dailymotion,
    instagram: GenericEmbed
}


@observer
export default class DetailArticleScreen extends Component {
    static contextType = storesContext

    render() {
        const item = this.context.newsStore.selectedNewsitem
        const slides = this.context.newsStore.slides
        const {component, image, dateStr, title} = item
        const slidesSize = slides.length
        const showDots = slidesSize <= 12
        return (
            <Container>

                <Content style={{ flex: 1 }}>
                    {slidesSize > 0 ?
                        <Swiper height={200} showsPagination={showDots} showsButtons={true} paginationStyle={{
                            bottom: -20
                        }}>
                            {slides.map((item, i) =>
                                <View key={i} style={{ flex: 1 }}>
                                    <Image style={{ height: 200, flex: 1 }} source={{ uri: item.image }} />
                                    <View style={styles.slide_bg}>
                                        <Text style={[styles.slide_bg_head, styles.slide_bg_text]}>{i + 1}/{slidesSize} : {item.title}</Text>
                                        <Text style={styles.slide_bg_text}>{item.caption}</Text>
                                    </View>
                                </View>
                            )}
                        </Swiper>
                        : image && <Image source={{ uri: image }} style={styles.image} />}

                    
                    <View style={[styles.container, showDots && styles.containerIfDot]}>
                        <H1 style={styles.title}>{title}</H1>
                        <Text style={styles.date}>{dateStr}</Text>
                        {component.map((item, i) => {
                            let Embed = TYPE_TO_COMPONENT[item.type]
                            return <Embed key={i} {...item} />
                        })}
                    </View>
                </Content>
            </Container>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        margin: 8,
        marginTop: 20
    },
    containerIfDot: {
        marginTop: 20
    },
    title: {
    },
    image: {
        height: 200, 
        width: null, 
        flex: 1
    },
    date: {
        marginTop: 4, 
        marginBottom: 6, 
        paddingBottom: 6, 
        color: "grey",
        fontSize: 12,
        borderBottomWidth: 1,
        borderRadius: 4,
        borderColor: "#d6d7da",
    },
    
    text: {
        flex: 1, 
        marginTop: 4, 
        width: Dimensions.get("window").width - 20
    },

    // slides
    slide_bg: {
        position: "absolute",
        bottom: 0,
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    slide_bg_head: {
        fontWeight: "bold",
        paddingBottom: 0
    },
    slide_bg_text: {
        color: "white",
        padding: 6
    },
})