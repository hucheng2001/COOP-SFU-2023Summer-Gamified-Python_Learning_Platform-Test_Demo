import React, { useEffect, useState } from 'react'
import { getLeaderboardData } from "../../data/LeaderboardData"
import List from "./List";

export default function LeaderboardPageComponent() {

    const [data, setData] = useState([{}])
    //     [{
    //         name : "default1",
    //         score : 4444
    //     }, {
    //         name : "default2",
    //         score : 1234
    //     }]
    // )

    useEffect(() => {
        console.log("Leaderboard Page Mounted!\nReading Firebase Data!");
        const theData = getLeaderboardData()
        theData.then(value => {
            setData(value)
        })
    }, [])

    const labels = [{
/* <<<<<<< components/leaderboard/LeaderboardPageComponent.js */
        rank: "Rank",
        name: "Name",
        score: "Score",
        mcqsolved: "MCQ's Solved",
        challsolved: "Challenge Questions Solved",
        badges: "Badges",
        rank: "Rank",
        name: "Name",
        score: "Score",
        num_mcq_solved: "Multiple Choice",
        num_challenge_solved: "Challenge Questions",
        badges: "Badges"
/* =======
        rank : "Rank",
        name : "Name", 
        score : "Score",
        num_mcq_solved : "Multiple Choice",
        num_challenge_solved : "Challenge Questions",
        badges : "Badges"
>>>>>>> components/leaderboard/LeaderboardPageComponent.js */
    }]

    return (
        <div className='global-card-base layout-card' style={{ margin: '28px 38px' }}>
            <div className='layout-card-header'>
                <h2 className='layout-card-title'>Leaderboard</h2>
            </div>
            <div className="layout-card-main">
                <div className='layout-list-main'>
                    <List data={labels} isHeader={true} />
                    <List data={data} isHeader={false} />
                </div>
            </div>
        </div>
    )
}
