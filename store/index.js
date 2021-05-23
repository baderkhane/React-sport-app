import { configure } from "mobx"
import React from "react"
import SportsStore from "./sports"
import NewsStore from "./news"
import LivesStore from "./lives"
import MatchStore from "./match"
import ResultsStore from "./results"

configure({ enforceActions: "observed" })

class RootStore {
    constructor() {
        this.sportsStore = new SportsStore(this)
        this.newsStore = new NewsStore(this)
        this.resultsStore = new ResultsStore(this)
        this.livesStore = new LivesStore(this)
        this.matchStore = new MatchStore(this)
    }
}

const rootStore = new RootStore()

export const storesContext = React.createContext({
    sportsStore: rootStore.sportsStore,
    newsStore: rootStore.newsStore,
    resultsStore: rootStore.resultsStore,
    livesStore: rootStore.livesStore,
    matchStore: rootStore.matchStore
})
