'use strict'
const scrapeIt = require("scrape-it")
const url = 'http://games.espn.com/ffl/schedule?leagueId=165105'

scrapeIt(url, {
    rows: {
        listItem: 'tr',
        data: {
            away: 'td:nth-child(1)',
            home: 'td:nth-child(4)',
            result: 'td:nth-child(6)',
        }
    },
}).then(data => {

    data.rows.splice(0, 1)
    let managers = {}
    let week = 0
    for (let row of data.rows) {
        if (row.away && row.home && row.result && row.result !== 'Preview') {
            if (!managers[row.away]) {
                managers[row.away] = []
            }
            if (!managers[row.home]) {
                managers[row.home] = []
            }

            const results = row.result.split('-')
            managers[row.away].push(Number(results[0]))
            managers[row.home].push(Number(results[1]))
        }
    }
    
    const managerNames = Object.keys(managers)
    const output = {}
    managerNames.forEach(name => {
        const gamesSoFar = managers[name].length
        const wins = Array(gamesSoFar).fill(0)
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
        // TODO:
        const totalWeeklyGames = (managerNames.length - 1)
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
            totalGames: gamesSoFar*totalWeeklyGames,
        }
        // console.log("Total Wins", totalWins)
        // console.log("Total Win PCT:", Number(totalWins/(gamesSoFar*totalWeeklyGames)).toFixed(2))
        // console.log("-----------------------------")
    })

    console.log(JSON.stringify(output))
})



