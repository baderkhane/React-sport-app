import { observable, action, computed, flow } from "mobx"
import api from "../services/newsfeed"
import {entities} from "../utils/html"
import stripHtml from "string-strip-html"
import { isInternetReachable } from "../utils/network"
import { IFrame } from "../components/Embed"
const moment = require("moment-timezone")

export default class NewsStore {
    @observable items = []
    @observable state = "pending"
    @observable slides_items = []
    @observable slides_state = "pending"
    @observable selectedItemId = null

    constructor(rootStore) {
        this.rootStore = rootStore
    }

    @computed get selectedNewsitem() {
        /* return selected article (detail page) */
        let item = this.newsitems.find(item => item.id === this.selectedItemId)
        // parse newsitem content to find embed, video...
        item.component = this.extractComponents(item.content)
        return item
    }



    @computed get slides(){
        /* return slides on slides article */
        if (!this.selectedNewsitem.medias || this.slides_state !== "done")
            return []
        let items = []
        for (let slide of this.slides_items){
            const images = slide.media_details
            const sizes = ["thumbnail_750_x_368", "medium_large", "medium", "full", "thumbnail"]
            let image
            for (let size of sizes) {
                if (images.sizes[size]) {
                    image = images.sizes[size].source_url
                    break
                }
            }
            items.push({
                title: stripHtml(slide.title.rendered),
                caption: stripHtml(slide.caption.rendered),
                image: image
            })
        }
        return items
    }

    @computed get newsitems() {
        /* return all newsitems */
        let data = []
        // const selectedSportId = this.rootStore.sportsStore.selectedSportId
        for(let item of this.items) {
            // filtering newsitem
            // if(selectedSportId && !item.categories.includes(selectedSportId))
            //     continue
            if(item.status !== "publish")
                continue
            if(item.is_teaser === true)
                continue
            // get main image, by preference size
            if (!item._embedded | !item._embedded["wp:featuredmedia"])
                continue
            const images = item._embedded["wp:featuredmedia"][0].media_details
            let image
            if (images !== undefined) {
                const sizes = ["thumbnail_750_x_368", "medium_large", "medium", "full", "thumbnail"]
                for (let size of sizes) {
                    if (images.sizes[size]){
                        image = images.sizes[size].source_url
                        break
                    }
                }
            }
            else{
                // newsitems without image : we do not display them (not ready for this...)
                continue
            }
            // "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
            const date = moment(item.date)
            data.push({
                id: item.id,
                key: ""+item.id,
                title: entities.decode(item.title.rendered),
                description: item.excerpt.rendered,
                content: item.content.rendered,
                date,
                dateStr: date.format("DD/MM/YYYY à HH[h]mm"),
                sport: this.rootStore.sportsStore.sportFromCategories(item.categories),
                image,
                medias: item.medias
            })
        }
        return data
    }

    @action
    setSelectedItemId(id) {
        /* set item as active (detail page) */
        this.selectedItemId = id
        if (this.selectedNewsitem.medias)
            this.fetchSlides()
    }

    fetchNewsItems = flow(function* (id) {
        /* fetch all newsitems articles */
        this.state = "pending"
        try {
            const newsItems = yield api.fetchNewsitems(id)
            this.state = "done"
            this.items = newsItems
        } catch (error) {
            console.log(error)
            this.state = "error"
        }
    })

    fetchSlides = flow(function* () {
        /* fetch slides of selected article */
        this.slides_state = "pending"
        try {
            const slides = yield api.fetchSlides(this.selectedNewsitem.medias)
            this.slides_state = "done"
            this.slides_items = slides
        } catch (error) {
            console.log(error)
            this.slides_state = "error"
        }
    })


    extractComponents(text) {

        const PATTERNS = [
            {
                type: "twitter",
                start: "<blockquote class=\"twitter-tweet\"",
                end: "<script async src=\"https://platform.twitter.com/widgets.js\" charset=\"utf-8\"></script>"
            },
            {
                type: "iframe",
                start: "<iframe", 
                end: "</iframe>"
            },
            {
                type: "dailymotion",
                start: "<div class=\"dailymotion_block\"",
                end: "</script>",
                getAdditionalsInfo: (tags)=>{
                    const regex = /data-video="[\w]*"/g
                    const found = tags.match(regex)
                    if(found){
                        return {
                            id: found[0].substring(12, found[0].length-1)
                        }
                    }
                }
            },
            {
                type: "instagram",
                start: "<blockquote class=\"instagram-media\"",
                end: "<script async src=\"//www.instagram.com/embed.js\"></script>"
            }


        ]


        /* transform html article to list of twitter, text, video... components */
        let start = 1
        while (start != -1) {
            for (let pattern of PATTERNS){
              
                start = text.search(pattern.start)
                if (start != -1) {
                    let closeTag = pattern.end
                    let end = text.search(closeTag)
                    if (start && end) {
                        if (end != -1)
                            end = end + closeTag.length
                        const tags = text.substring(start, end)
                        let embed = {
                            type: pattern.type,
                            content: tags
                        }
                        if(pattern.getAdditionalsInfo){
                            const infos = pattern.getAdditionalsInfo(tags)
                            // no infos : we do not use the embed and remove current component
                            if(!infos)
                                return [...this.extractComponents(text.slice(0, start)), ...this.extractComponents(text.slice(end, text.length))]
                            embed = {...embed, ...infos}
                        }
                        
                        // found = true
                        return [...this.extractComponents(text.slice(0, start)), embed, ...this.extractComponents(text.slice(end, text.length))]
                    }
                }
            }            
        }
        return [{ type: "text", content: text }]
    }
}