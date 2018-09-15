'use strict'
const scrapeIt = require("scrape-it")
const url = 'http://games.espn.com/ffl/schedule?leagueId=165105&seasonId=2017'

scrapeIt(url, {
    rows: {
        listItem: 'tr[bgcolor=#f2f2e8], tr[bgcolor=#f8f8f2]',
        data: {
            away: 'td:nth-child(1) > a',
            home: 'td:nth-child(4) > a',
            result: 'td:nth-child(6)',
        }
    },
}).then(data => {

    const output = {}
    //data.rows.splice(0, 1)
    let managers = {}
    let week = 0
    for (let row of data.rows) {
        const awayManagerName = row.away
        const homeManagerName = row.home
        if (awayManagerName && homeManagerName && row.result && row.result !== 'Preview') {
            // Initialize scores array
            if (!managers[awayManagerName]) {
                managers[awayManagerName] = []
            }
            if (!managers[homeManagerName]) {
                managers[homeManagerName] = []
            }

            const results = row.result.split('-')
            managers[awayManagerName].push(Number(results[0]))
            managers[homeManagerName].push(Number(results[1]))

            if (results[0] > results[1]) {
                output[awayManagerName] ? output[awayManagerName].actualWins++ : output[awayManagerName] = { actualWins: 0 }
            } else {
                output[homeManagerName] ? output[homeManagerName].actualWins++ : output[homeManagerName] = { actualWins: 0 }
            }
        }
    }
    
    const managerNames = Object.keys(managers)
    const totalWeeklyGames = (managerNames.length - 1)
    
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

        const totalWins = wins.reduce((prev, curr) => {
            return prev += curr
        }, 0)

        output[name].totalWins = totalWins
        output[name].totalGames = gamesSoFar * totalWeeklyGames
        output[name].totalNumberOfWeeks = gamesSoFar
        // console.log("Total Wins", totalWins)
        // console.log("Total Win PCT:", Number(totalWins/(gamesSoFar*totalWeeklyGames)).toFixed(2))
        // console.log("-----------------------------")
    })
    
    console.log(JSON.stringify(output))
})



