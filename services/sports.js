import axios from "axios"
import { Toast } from "native-base"

const API_URL = "http://orange.sport365.fr/resultats/xml/api/api_orange.php"

const instance = axios.create({
    baseURL: API_URL,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
})

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

export default {

    async fetchLiveMatches() {
        /* get list of current match */
        const live = await instance.get("", {
            params: {
                action: "livescoring"
            }
        })
        return live.data
    },

    async fetchResultsMatches() {
        /* get list of current match */
        const live = await instance.get("", {
            params: {
                action: "livescoring",
                day: "SCORE"
            }
        })
        return live.data
    },



    async fetchLiveMatch(matchId) {
        /* get live match base info */        
        const live = await instance.get("", {
            params: {
                action: "matchlive",
                id_match: matchId,
                format: "json"
            }
        })
        // console.log(live)
        return live.data
    },


    async fetchLiveEffectif(matchId) {
        /* get team composition from a match */ 
        const live = await instance.get("", {
            params: {
                action: "matcheffectif",
                id_match: matchId,
                format: "json"
            }
        })
        // console.log(live)
        return live.data
    },

}
