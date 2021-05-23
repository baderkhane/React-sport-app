import { observable, computed, flow } from "mobx"
import api from "../services/sports"
import MatchList from "./matchlist"
import { isInternetReachable } from "../utils/network"

export default class LivesStore extends MatchList {
    @observable items = []
    @observable state = "pending"

    constructor(rootStore) {
        super()
        this.rootStore = rootStore
    }

    fetchLiveMatches = flow(function* () {
        // get live matches
        this.state = "pending"
        try {
            const items = yield api.fetchLiveMatches()
            this.state = "done"
            // items[0].listSportDL[0].listCompetDL[0].listEsmDL[0].lisMatch[0].scoreEq1 = [Math.floor(Math.random() * Math.floor(100))]
            this.items = items[0]
        } catch (error) {
            this.state = "error"
        }
    })
}