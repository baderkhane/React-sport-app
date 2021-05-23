import axios from "axios"
import {Toast} from "native-base"
const moment = require("moment-timezone")
const md5Hex = require("md5-hex")

const API_URL = "https://www.sports.fr/wp-json/wp/v2/"

const API_URL2 = "http://api.sports.fr/sports_api/api/?call={\"typeFlux\":\"sports\",\"api_key\":\"sportsv1_2f60621d12300157770640912902c89b\",\"method\":\"Listing.getList\",\"params\":{\"type\":\"home\", \"id\":57}}"

const instance = axios.create({
    baseURL: API_URL,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
})


// instance.interceptors.request.use((config) => {
//     return config
// }, (error) => {
//     console.log(error)
//     return Promise.reject(error)
// })

instance.interceptors.response.use((response) => {
    return response
}, (error) => {
    //Let's handle error api here through UI box
    Toast.show({
        text: "Le serveur a retourné une erreur. Veuillez réessayer plus tard.",
        duration: 3000
    })
    return Promise.reject(error)
})

const getToken = function() {
    // the token depends of the day
    // python -c 'import hashlib, datetime ; print(hashlib.md5("b09IA5D5A7kws" + datetime.date.today().strftime("%Y%m%d")).hexdigest())'
    // get CET date
    let date = moment().tz("Europe/London").format("YYYYMMDD")
    return "sportsv1_"+md5Hex("b09IA5D5A7kws"+date)
}

export default {

    async fetchSports() {
        const sports = await instance.get("categories", {
            params: {
                categories_sport: "1",
                api_key: getToken(),
                per_page: 50
            }
        })
        return sports.data
    },

    async fetchNewsitems(categoryId) {
        let params = {
            api_key: getToken(),
            per_page: 20,
            _embed_images: true
        }
        if (categoryId)
            params.categories = categoryId

        const newsitems = await instance.get("posts", {
            params
        })
        
        return newsitems.data
    },

    async fetchSlides(url) {
        const slides = await instance.get(url)
        // console.log(slides.data)
        return slides.data
    }
}
