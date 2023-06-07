import { useContext, useState, useEffect } from 'react'
import Context from '../context/Context'
import { giveStudentScore, getStudentScore, takeStudentScore, getStudentLevel } from '../data/Students'
import UserLinkComponent from './UserLinkComponent'
import AchievementComponent from '../components/AchievementComponent'
import achievementsJson from '../data/achievements.json'
import { getFriends } from '../data/Students.js'
import { Friendship } from '../context/Friendship.js'
import levelsJson from '../data/levels.json'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
// import Box from '@mui/material/Box';

import axios from 'axios'
import styles from '../styles/Button.module.css'

import Editor from "@monaco-editor/react"
// import CircularProgress from '@material-ui/core/CircularProgress';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Badges from "./Badges";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from "@fortawesome/free-solid-svg-icons";


/**
 * Component for the user's own profile.
 * ToDo: Combine this with StudentProfileComponent.
 * See StudentProfileComponent for details.
 * @param {*} props 
 * @returns HTML for user's own profile
 */
export default function ProfileComponent(props) {
    const { user } = useContext(Context)
    const [achievements, setAchievements] = useState([])
    const [friends, setFriends] = useState(null)

    const currentScore = getStudentScore(user)

    const leftPoint = currentScore - leftPoint

    // const loadAchievements = () => {
    //     const studentAchievements = user.achievements
    //     const achievements = achievementsJson.achievements.filter(a => studentAchievements.includes(a.id))

    //     setAchievements(achievements.map(achievement => {
    //         return (<AchievementComponent id={achievement.id} description={achievement.description} emoji={achievement.emoji} />)
    //     }))
    // }

    const getFriendsList = () => {
        setFriends([])
        getFriends(user, Friendship.ACCEPTED).then(f => {
            if (f.length === 0) {
                setFriends([(<li>No friends yet.</li>)])
                return
            }

            setFriends(f.map((friend, index) => {
                return (<li key={index}><UserLinkComponent uuid={friend.uuid} name={friend.name} /></li>)
            })
            )
        })
    }

    const getFriendsElement = () => {
        if (friends === null) {
            return (<Skeleton count={3}></Skeleton>)
        } else {
            return (
                <ul>
                    {friends}
                </ul>
            )
        }
    }

    const containerStyles = {
        height: 20,
        width: '100%',
        backgroundColor: "#e0e0de",
        borderRadius: 50,
        margin: 50
/* <<<<<<< components/ProfileComponent.js */
    }
/*
=======
      }
    
>>>>>>> components/ProfileComponent.js
*/
    const fillerStyles = {
        height: '100%',
        width: `67%`,
        backgroundColor: 'red',
        borderRadius: 'inherit',
        textAlign: 'right'
    }
/* <<<<<<< components/ProfileComponent.js

=======
    
>>>>>>> components/ProfileComponent.js */
    const labelStyles = {
        padding: 5,
        color: 'white',
        fontWeight: 'bold'
    }

    const progressContainerStyles = {
        height: 50,
        width: '50%',
        textAlign: "center",
        marginTop: 20,
        marginBottom: 20
    }

    useEffect(() => {
        // loadAchievements()
        getFriendsList()
    }, [])

/* <<<<<<< components/ProfileComponent.js */
    function show_point() {
        currentScore.then((value) => {
            document.getElementById('p').innerHTML = 'Current point : ' + value + '</p>';
        });
    }
/* =======
>>>>>>> components/ProfileComponent.js */
    function showProfileValues() {
        currentScore.then((score) => {
            // currentScore
            document.getElementById('p').innerHTML = 'Current points : ' + score;

            let currentLevelPromise = getStudentLevel(user)
            currentLevelPromise.then((currentLevel) => {
                let levelProgress = 0
                // Level progress is not calculated when user is at max level
                if (currentLevel < 5 && currentLevel >= 0) {
                    // The points between the current level baseline and the next level
                    let levelDistance = levelsJson[currentLevel + 1] - levelsJson[currentLevel]

                    levelProgress = score - levelsJson[currentLevel]

                    // Calculates the percentage the user is between current level and next level
                    levelProgress = Math.floor((levelProgress / levelDistance) * 100)
                }

                // If the user is at max level show the bar at 100%
                if (currentLevel >= 5) {
/* <<<<<<< components/ProfileComponent.js */
                    document.getElementById("level").innerHTML =
/* =======
                    document.getElementById("level").innerHTML = 
>>>>>>> components/ProfileComponent.js */
                        "<div style='display: grid; grid-template-columns: repeat(3, 1fr);'>" +
                        "<div style='font-weight: bold;'>Level " + (currentLevel - 1) + "</div>" +
                        "<div>" +
                        "<div style=\"height: 70%; width: 100%; border-radius: 5px; background-color: #e0e0de;\">" +
/* <<<<<<< components/ProfileComponent.js */
                        "<div style=\"height: 100%; width: 100%;" +
                        "background-color: green; border-radius: inherit; \">" +
                        "</div>" +
                        "</div>" +
                        "<span style=\"padding: 5; font-weight: bold;\">" +
                        score + " / " + score +
/*=======
                            "<div style=\"height: 100%; width: 100%;" +
                                "background-color: green; border-radius: inherit; \">" +
                            "</div>" +
                        "</div>" +
                        "<span style=\"padding: 5; font-weight: bold;\">" +
                            score + " / " + score +
>>>>>>> components/ProfileComponent.js */
                        "</span>" +
                        "</div>" +
                        "<div style='font-weight: bold;'>Level " + currentLevel + "</div>" +
                        "</div>"
                } else {
/* <<<<<<< components/ProfileComponent.js */
                    document.getElementById("level").innerHTML =
/* =======
                    document.getElementById("level").innerHTML = 
>>>>>>> components/ProfileComponent.js */
                        "<div style='display: grid; grid-template-columns: repeat(3, 1fr);'>" +
                        "<div style='font-weight: bold;'>Level " + currentLevel + "</div>" +
                        "<div>" +
                        "<div style=\"height: 70%; width: 100%; border-radius: 5px; background-color: #e0e0de;\">" +
/* <<<<<<< components/ProfileComponent.js */
                        "<div style=\"height: 100%; width:" + levelProgress + "%;" +
                        "background-color: green; border-radius: inherit; \">" +
                        "</div>" +
                        "</div>" +
                        "<span style=\"padding: 5; font-weight: bold;\">" +
                        score + " / " + levelsJson[currentLevel + 1] +
/* =======
                            "<div style=\"height: 100%; width:" + levelProgress + "%;" +
                                "background-color: green; border-radius: inherit; \">" +
                            "</div>" +
                        "</div>" +
                        "<span style=\"padding: 5; font-weight: bold;\">" +
                            score + " / " + levelsJson[currentLevel + 1] +
>>>>>>> components/ProfileComponent.js */
                        "</span>" +
                        "</div>" +
                        "<div style='font-weight: bold;'>Level " + (currentLevel + 1) + "</div>" +
                        "</div>"
                }
            });
        });
    }

    return (
        <div className="global-card-base home_page layout-card">
            <div className="layout-card-header">
                <div className="layout-card-title">
                    My Profile
                </div>
            </div>
            <div className="layout-card-main">
                <div className="container mx-auto">
                    <div className="grid lg:grid-col-3" >
                        <div className="row ">

                            <div className="col-md-auto ">
                                <div className="global-card-base  layout-card">
                                    <div className="layout-card-header">
                                        <div className="layout-card-title">
                                            Modules
                                        </div>
                                    </div>
                                    <div className="layout-card-main">
                                        <div className='modules-topic-list'>
                                            <ul>
                                                {/* <li>Conditonal Statement &emsp; <CircularProgress  variant="static" value={70} size={20} /> </li> */}
                                                <li>Introduction to Python Programming</li>
                                                <li>Topic Two</li>
                                                <li>Topic Three</li>
                                                <li>Topic Four</li>
                                                <li>Topic Five</li>
                                                <li>Topic Six</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm ">
                                <div className="global-card-base layout-card">
                                    <div className="layout-card-header">
                                        <div className="layout-card-title">
                                            Achievements
                                        </div>
                                    </div>
                                    <div className="layout-card-main">
                                        {/* <ul className="achievement-list">
                            {
                                achievements.length === 0 ? <p>No achievements yet.</p> : achievements.map(achievement => {
                                    return (
                                        <li>
                                            {achievement}
                                        </li>
                                    )
                                })
                            }
                        </ul> */}
                                        <div className="" >
                                            <Router>
                                                <Routes>
                                                    <Route path="/" element={<Badges />} />
                                                </Routes>
                                            </Router>
                                        </div>
                                    </div>

                                </div>
                                <div className="global-card-base layout-card" style={{ marginTop: '24px' }}>
                                    <div className="layout-card-header">
                                        <div className="layout-card-title">
                                            Balance
                                        </div>
                                    </div>
                                    <div className="layout-card-main">
                                        <div className="balance-icon">
                                            <div onload={show_point()}></div>
                                            <div><FontAwesomeIcon icon={faCoins} size="3x" /></div>
                                            {/* <span > Earned: 1300 pts <br/>[ 1700 points left ]</span> */}
                                            <span id="p">22</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* <div className="row">
                  </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}