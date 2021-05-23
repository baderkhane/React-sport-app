import {computed} from "mobx"
const moment = require("moment-timezone")

export default class MatchList {

    @computed get flatList() {
        const flat = []
        if (this.items.listSportDL) {
            for (let sport of this.items.listSportDL) {
                // TODO : handle others sports
                if (!["FOOT", "Basket", "TENNIS"].includes(sport.name))
                    continue
                let name = sport.name
                if(sport.name === "FOOT")
                    name = "Football"
                flat.push({
                    id: sport.id_sport,
                    key: "sport" + sport.id_sport,
                    type: "sport",
                    name
                })
                for (let compet of sport.listCompetDL) {

                    for (let esm of compet.listEsmDL) {
                        flat.push({
                            id: esm.id_esm,
                            key: "compet" + esm.id_esm + esm.caption_full,
                            type: "compet",
                            name: (compet.shortNameCompet || compet.caption) + " - " + esm.caption
                        })
                        for (let match of esm.lisMatch) {
                            // match, get teams, score... depends of sports
                            // date 2020-01-09 21:15:00
                            let dateStr = ""
                            let heure = ""
                            if(match.date_match){
                                const date = moment(match.date_match, "YYYY-MM-DD HH:mm:ss")
                                dateStr = date.format("DD/MM/YYYY")
                                heure = date.format("HH[h]mm")
                            }
                            new Date()
                            let matchData = {
                                id: match.id_match,
                                sport: sport.name,
                                key: "match" + match.id_match,
                                type: "match",
                                date: dateStr,
                                heure: heure,
                                showDetails: [1, 12].includes(sport.id_sport), // foot
                                etat: match.etat_match, // 0 : A venir -- 1: En cours -- 2: Terminé -- 3: Annulé
                            }
                            if(sport.name === "TENNIS"){
                                let getScore = function (scores) {
                                    let score = []
                                    for (let s of scores) {
                                        if (s.jeu)
                                            score.push(s.jeu)
                                    }
                                    return score
                                }
                                matchData.equipe1 = {
                                    name: match.short_name_eq1,
                                    score: getScore(match.scoreEq1)
                                },
                                matchData.equipe2 = {
                                    name: match.short_name_eq2,
                                    score: getScore(match.scoreEq2)
                                }
                                
                            }
                            else{
                                // "standard" sport, simple score between two teams
                                matchData.equipe1 = {
                                    name: match.nom_eq1,
                                    logo: match.biglogoEq1,
                                    score: match.scoreEq1[0]
                                },
                                matchData.equipe2 = {
                                    name: match.nom_eq2,
                                    logo: match.biglogoEq2,
                                    score: match.scoreEq2[0]
                                }
                            }
                            flat.push(matchData)
                        }
                    }
                }
            }
        }

        if(flat.length === 0 && this.state != "pending"){
            flat.push({
                id: "999",
                key: "error",
                type: "error",
                name: "Aucun élément, vérifiez votre connexion internet."
            })
        }
        return flat
    }
}