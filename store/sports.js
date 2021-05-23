import { observable, action, computed, flow } from "mobx"
import api from "../services/newsfeed"
import { isInternetReachable } from "../utils/network"

export default class NewsStore {
    @observable items = []
    @observable selectedSportId = null // filter news by sport
    @observable state = "pending"

    constructor(rootStore) {
        this.rootStore = rootStore
    }

    sportFromCategories(array) {
        /* get sport from array of categories */
        for(let id of array){
            const sport = this.sport(id)
            if (sport !== undefined)
                return sport
        }
        return {
            id:null,
            name:"inconnu"
        }
    }

    sport(id) {
        return this.sports.find(item => {
            return item.id === id || item.subcategories.includes(id)
        })
    }

    @action setSelectedSportId(id){
        this.selectedSportId = id
        this.rootStore.newsStore.fetchNewsItems(id)
    }

    @computed get sports() {
        let data = []
        for (let item of this.items) {
            data.push({
                id: item.id,
                name: item.name,
                subcategories: item.subcategories
            })
        }
        return data
    }

    fetchSports = flow(function* () {
        this.state = "pending"
        try {
            const sports = yield api.fetchSports()
            this.state = "done"
            this.items = sports
        } catch (error) {
            console.log(error)
            this.state = "error"
        }
    })
}