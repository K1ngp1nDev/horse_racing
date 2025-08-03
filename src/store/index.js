import { createStore } from 'vuex'
import { generateHorses } from '@/utils/horseGenerator'
import { generateSchedule } from '@/utils/scheduleGenerator'

export default createStore({
    state () {
        return {
            horses: [],
            schedule: [],
            currentRound: -1,
            status: 'idle',
            results: [],
            runningTimes: {},
            liveRoundResults: []
        }
    },
    getters: {
        activeRound (state) {
            return state.schedule[state.currentRound] || null
        }
    },
    mutations: {
        SET_HORSES (state, horses){
            state.horses = horses
        },
        SET_SCHEDULE (state, schedule){
            state.schedule = schedule
        },
        SET_STATUS (state, status){
            state.status = status
        },
        SET_CURRENT_ROUND (state, idx){
            state.currentRound = idx
        },
        SET_RUNNING_TIMES (state, timesObj){
            state.runningTimes = timesObj
        },
        CLEAR_LIVE_RESULTS (state){
            state.liveRoundResults = []
        },
        ADD_LIVE_FINISH (state, finish){
            state.liveRoundResults.push(finish)
        },
        NEXT_ROUND (state){
            state.currentRound++
        },
        PUSH_RESULT (state, resultRow){
            state.results.push(resultRow)
        },
        RESET (state) {
            state.currentRound = -1
            state.status = 'idle'
            state.results = []
            state.runningTimes = {}
            state.liveRoundResults = []
        }
    },
    actions: {
        initGame ({ commit }) {
            commit('SET_HORSES', generateHorses(20))
            commit('RESET')
        },
        generateProgram ({ commit, state }) {
            const schedule = generateSchedule(state.horses)
            commit('SET_SCHEDULE', schedule)
            commit('SET_CURRENT_ROUND', 0)
        },
        async startRace ({ dispatch, state }) {
            while (state.currentRound < 6) {
                await dispatch('runRound', state.schedule[state.currentRound])
                if (state.currentRound < 5) {
                    dispatch('prepareNextRound')
                } else {
                    dispatch('finishRace')
                    break
                }
            }
        },
        prepareNextRound ({ commit }) {
            commit('SET_STATUS', 'idle')
            commit('SET_RUNNING_TIMES', {})
            commit('CLEAR_LIVE_RESULTS')
            commit('NEXT_ROUND')
        },
        finishRace ({ commit }) {
            commit('SET_STATUS', 'finished')
            commit('SET_RUNNING_TIMES', {})
            commit('CLEAR_LIVE_RESULTS')
        },
        runRound ({ commit, state }, round) {
            const rawResults = round.horses.map(horse => {
                const speed = horse.condition + Math.random() * 10
                const rawTime = round.distance / speed
                return { horse, rawTime }
            })

            const rawTimes = rawResults.map(r => r.rawTime)
            const minRaw = Math.min(...rawTimes)
            const maxRaw = Math.max(...rawTimes)

            const normalized = rawResults.map(({ horse, rawTime }) => {
                let time
                if (maxRaw === minRaw) {
                    time = 15
                } else {
                    time = ((rawTime - minRaw) / (maxRaw - minRaw)) * (20 - 10) + 10
                }
                return {
                    horse,
                    time: +time.toFixed(2)
                }
            }).sort((a, b) => a.time - b.time)

            const times = {}
            normalized.forEach(r => {
                times[r.horse.id] = r.time
            })

            commit('SET_RUNNING_TIMES', times)
            commit('SET_STATUS', 'running')
            commit('CLEAR_LIVE_RESULTS')

            return new Promise(resolve => {
                normalized.forEach((r, idx) => {
                    setTimeout(() => {
                        commit('ADD_LIVE_FINISH', { horse: r.horse, time: r.time })
                        if (idx === normalized.length - 1) {
                            commit('PUSH_RESULT', { round: round.name, results: normalized })
                            resolve()
                        }
                    }, r.time * 1000)
                })
            })
        }
    }
})
