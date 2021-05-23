import { observable, computed, flow } from "mobx"
import MatchList from "./matchlist"
import api from "../services/sports"
import { isInternetReachable } from "../utils/network"

export default class ResultsStore extends MatchList {
    @observable items = []
    @observable state = "pending"

    constructor(rootStore) {
        super()
        this.rootStore = rootStore
    }

    fetchResultsMatches = flow(function* () {
        // get live matches
        this.state = "pending"
        try {
            const items = yield api.fetchResultsMatches()
            this.state = "done"
            this.items = items[0]
        } catch (error) {
            this.state = "error"
        }
    })
}