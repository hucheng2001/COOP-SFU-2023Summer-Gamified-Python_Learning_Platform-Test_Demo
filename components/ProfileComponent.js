import { useContext, useState, useEffect } from 'react'
import Context from '../context/Context'
import { giveStudentScore, getStudentScore, takeStudentScore } from '../data/Students'
import UserLinkComponent from './UserLinkComponent'
import AchievementComponent from '../components/AchievementComponent'
import achievementsJson from '../data/achievements.json'
import { getFriends } from '../data/Students.js'
import { Friendship } from '../context/Friendship.js'
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
    }

    const fillerStyles = {
        height: '100%',
        width: `67%`,
        backgroundColor: 'red',
        borderRadius: 'inherit',
        textAlign: 'right'
    }

    const labelStyles = {
        padding: 5,
        color: 'white',
        fontWeight: 'bold'
    }

    useEffect(() => {
        // loadAchievements()
        getFriendsList()
    }, [])

    function show_point() {
        currentScore.then((value) => {
            document.getElementById('p').innerHTML = 'Current point : ' + value + '</p>';
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