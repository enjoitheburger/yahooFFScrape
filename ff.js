'use strict'
const scrapeIt = require("scrape-it")

const numberOfTeams = 10

const managers = {}
const fetchTeamPromises = []
for (let i = 1; i <= numberOfTeams; i++) {
    const url = `https://football.fantasysports.yahoo.com/f1/631176/?module=standings&lhst=sched&sctype=team&scmid=${i}`
    fetchTeamPromises.push(scrapeIt(url, {
        managers: {
            listItem: 'section#schedule div:nth-child(2) tbody tr',
            data: {
                week: 'td:nth-child(1)',
                teamName: 'td:nth-child(2) a:nth-child(2)',
                result: 'td:nth-child(3)',
                score: 'td:nth-child(4)',
            }
        },
        managerName: 'section#schedule li.Pbot-xxs'
    }).then(data => {
        const scores = []
        data.managers.forEach(manager => {
            if (manager.result) {
                const gameScores = manager.score.split('-')
                scores.push(gameScores[0].trim())
            }
        })
        managers[data.managerName] = scores
    }))
}

Promise.all(fetchTeamPromises).then(data => {

    const managerNames = Object.keys(managers)
    const output = {}
    managerNames.forEach(name => {
        const gamesSoFar = managers[name].length
        const wins = Array(gamesSoFar).fill(0)
        const losses = Array(gamesSoFar).fill(0)
        const scores = managers[name]
        scores.forEach((score, index) => {
            managerNames.forEach(manName => {
                const otherscore = managers[manName][index]
                if (manName !== name) {
                    if (Number(score) > Number(otherscore)) {
                        wins[index]++
                    }
                }
            })
        })
        const totalWeeklyGames = numberOfTeams - 1
        //console.log(name)
        wins.forEach((numOfWins, index) => {
            //console.log("Week:", index+1)
            //console.log(Number(numOfWins/totalWeeklyGames).toFixed(2))
        })

        const totalWins = wins.reduce((prev, curr) => {
            return prev += curr
        }, 0)

        output[name] = {
            totalWins: totalWins,
            totalGames: gamesSoFar*totalWeeklyGames
        }
        // console.log("Total Wins", totalWins)
        // console.log("Total Win PCT:", Number(totalWins/(gamesSoFar*totalWeeklyGames)).toFixed(2))
        // console.log("-----------------------------")
    })

    console.log(output)
})





