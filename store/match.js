import { observable, computed, flow } from "mobx"
import api from "../services/sports"
import { isInternetReachable } from "../utils/network"

const MEDIA_PREFIX = "https://www.sport365.fr/static/sport/bddimages"

// 0 : A venir -- 1: En cours -- 2: Terminé -- 3: Annulé
const ETATS = {
    "166": 0,
    "168": 1,
    "167": 2,
    "169": 3,
    "170": 3,
    "171": 3,
}

export default class MatchStore {
    @observable matchId = null
    @observable match = {}
    @observable effectifs = []
    @observable state = "initial"
    @observable error = ""

    constructor(rootStore) {
        this.rootStore = rootStore
    }


    goalsForTeam(teamId) {
        let goalsData = []
        let goals = this.match.comment.filter((item) => { return item.id_equipe == teamId && ["BUT", "PEN_OK"].includes(item.type_event)})
        const csc = this.match.comment.filter((item) => { return item.id_equipe != teamId && ["BUT_CSC"].includes(item.type_event) })
        goals = goals.concat(csc)
        for(let goal of goals){
            let typeLabel = ""
            // ignore TAB goals 
            if (goal.periode === "TAB")
                continue
            if (goal.type_event === "PEN_OK")
                typeLabel = "(s.p.)"
            else if (goal.type_event === "BUT_CSC")
                typeLabel = "(c.s.c.)"
            goalsData.push({
                id: goal.event_id,
                type: goal.type_event,
                typeLabel,
                joueur: goal.nom_joueur,
                chrono: goal.event_time
            })
        }
        goalsData = goalsData.reverse()
        return goalsData
    }


    @computed get matchInfo() {
        /* sanitize match info to display */
        let info = {}
        if(!this.match.matchinfo)
            return {}
        const url_logo1 = this.match.matchinfo.equipe1.url_logo
        const url_logo2 = this.match.matchinfo.equipe2.url_logo
        info = {
            id: this.match.matchinfo.id_match,
            etat: ETATS[this.match.matchinfo.id_etat],
            date: this.match.matchinfo.dateMatch,
            heure: this.match.matchinfo.heureMatch,
            stade: this.match.matchinfo.nom_stade,
            arbitre: this.match.matchinfo.arbitre,
            nomEnsemble: this.match.matchinfo.nomEnsemble,
            nomEpreuve: this.match.matchinfo.nomEpreuve,
            equipe1: {
                id: this.match.matchinfo.equipe1.id_equipe,
                nom: this.match.matchinfo.equipe1.equipe,
                logo: (!url_logo1 || url_logo1.startsWith("http")) ? url_logo1 : MEDIA_PREFIX + url_logo1,
                nbGoals: this.match.matchinfo.pointsEquipe1,
                nbPens: this.match.matchinfo.ptsPensEq1,
                goals: this.goalsForTeam(this.match.matchinfo.equipe1.id_equipe)
            },
            equipe2: {
                id: this.match.matchinfo.equipe2.id_equipe,
                nom: this.match.matchinfo.equipe2.equipe,
                logo: !url_logo2 || (url_logo2.startsWith("http")) ? url_logo2 : MEDIA_PREFIX + url_logo2,
                nbGoals: this.match.matchinfo.pointsEquipe2,
                nbPens: this.match.matchinfo.ptsPensEq2,
                goals: this.goalsForTeam(this.match.matchinfo.equipe2.id_equipe)
            },
            hasPens: this.match.matchinfo.ptsPensEq1 >= "1" || this.match.matchinfo.ptsPensEq2 >= "1",
            live: this.match.matchinfo.is_live === "1" && this.match.matchinfo.chrono_actif
        }
        return info
    }

    @computed get listEffectifs() {
        /* return all players / coach with metadata */
        const matchInfo = this.matchInfo
        let effectifs = [
            { ...matchInfo.equipe1 },  
            { ...matchInfo.equipe2 }
        ]
        // iterate through teams
        for (let [index, team] of Object.entries(this.effectifs)) {
            let effectif = {}
            // composition not available yet
            if(!team.effectif)
                return []

            let joueurs = team.effectif
            
            // first make a list of game participant
            const participants = []
            for (let joueur of joueurs) {

                let participant = {
                    id: joueur.id_individu,
                    nom: joueur.surnom_prioritaire == "1" ? joueur.surnom : joueur.prenom_individu + " " + joueur.nom_individu,
                    portrait: (!joueur.photo || joueur.photo.startsWith("http")) ? joueur.photo : MEDIA_PREFIX + joueur.photo,
                    fonction: joueur.nom_fonction,
                    dossard: joueur.dossard,
                    rouge: false,
                    jaune: false,
                    entrant: false,
                    sortant: false,
                    but: 0,
                    csc: 0
                }
                if (joueur.stat) {
                    if (joueur.stat.event){
                        participant.but = joueur.stat.event.filter((evt) => ["BUT", "PEN_OK"].includes(evt.type_event) && evt.tag_periode !== "TAB").length
                        participant.csc = joueur.stat.event.filter((evt) => ["BUT_CSC"].includes(evt.type_event)).length
                        participant.entrant = joueur.stat.event.find((evt) => ["ENTRANT"].includes(evt.type_event)) ? true : false
                        participant.sortant = joueur.stat.event.find((evt) => ["SORTANT"].includes(evt.type_event)) ? true : false
                        participant.jaune = joueur.stat.event.find((evt) => ["JAUNE"].includes(evt.type_event)) ? true : false
                        participant.rouge = joueur.stat.event.find((evt) => ["ROUGE"].includes(evt.type_event)) ? true : false
                    }
                }
                participants.push(participant)
            }
            effectif.coach = participants.filter(item => item.fonction === "Entraineur")
            effectif.joueurs = participants.filter(item => item.fonction === "Joueur")
            effectif.remplacants = participants.filter(item => item.fonction === "Remplacant")
            effectifs[index].effectif = effectif
        }
        return effectifs
    }

    @computed get comments() {
        /* fil du match */ 
        let comments = []
        
        for(let comment of this.match.comment){
            if(!comment.event_id)
                continue
            const eqId = comment.id_equipe
            const equipe = this.match.matchinfo.equipe2.id_equipe === eqId ? 1 : 0
            comments.push({
                id: comment.event_id,
                commentaire: comment.commentaire.replace("\t", ""),
                chrono: comment.event_time,
                equipe,
                type_event: comment.type_event,
                entrant: comment.type_event == "ENTRANT",
                sortant: comment.type_event == "SORTANT",
                jaune: comment.type_event == "JAUNE",
                rouge: comment.type_event == "ROUGE",
                but: ["PEN_OK", "BUT", "BUT_CSC"].includes(comment.type_event)
            })
        }
        return comments
    }

    setMatch = flow(function* (matchId) {
        const isNewId = matchId !== this.matchId
        this.matchId = matchId
        if (this.state !== "pending" && isNewId) {
            yield this.fetchMatch()
        }
    })

    fetchMatch = flow(function* (mode) {
        if(mode !== "silent"){
            this.state = "pending"
            this.error = ""
        }
        try{
            yield Promise.all([this.fetchLiveMatch(), this.fetchLiveEffectif()])
            this.state = "done"
        }
        catch(error){
            if(mode !== "silent"){
                this.state = "error"
                if (typeof error === "string"){
                    this.error = error
                }
                else{
                    this.error = "Une erreur est survenue"
                }
            }
        }
    })

    fetchLiveMatch = flow(function* () {        
        this.match = yield api.fetchLiveMatch(this.matchId)
        // console.log(this.match)
        if(!this.match || this.match.length == 0)
            throw "Le match n'existe pas"
    })

    fetchLiveEffectif = flow(function* () {
        this.effectifs = yield api.fetchLiveEffectif(this.matchId)
        // console.log(this.effectifs)
    })
}
