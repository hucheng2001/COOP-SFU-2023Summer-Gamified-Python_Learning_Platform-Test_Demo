import { useEffect, useState } from 'react'
import Context from '../context/Context'
import NavComponent from '../components/NavComponent'
import LoginComponent from '../components/LoginComponent'
import HomePageComponent from '../components/HomePageComponent'
import { Pages } from '../context/Pages'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import ProfileComponent from '../components/ProfileComponent'
import StudentProfileComponent from '../components/StudentProfileComponent'
import DiscussionComponent from '../components/DiscussionComponent'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import LeaderboardComponent from '../components/LeaderboardComponent'
import LeaderboardPageComponent from '../components/leaderboard/LeaderboardPageComponent'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [page, setPage] = useState(null)
  const [toast, setToast] = useState(null)
  const [profileView, setProfileView] = useState(null)
  const [openedModule, setOpenedModule] = useState(null)
  const [personalization, setPersonalization] = useState(null)
  const [challengeData, setChallengeData] = useState(null)

  /**
   * 0 => invisible
   * 1 => fill-in-the-blanks
   * 2 => normal editor
   */
  const [editorState, setEditorState] = useState(0)

  const [challengeNumber, setChallengeNumber] = useState(0)
  const [challengeQuestion, setChallengeQuestion] = useState({})
  const [challengeAnswer, setChallengeAnswer] = useState({})
  const [score, setScore] = useState(200)


  const contexts = {
    user,
    setUser,
    openedModule,
    setOpenedModule,
    page,
    setPage,
    profileView,
    setProfileView,
    toast,
    setToast,
    editorState,
    setEditorState,
    personalization,
    setPersonalization,
    challengeData,
    setChallengeData,
    challengeNumber,
    setChallengeNumber,
    challengeQuestion,
    setChallengeQuestion,
    challengeAnswer,
    setChallengeAnswer,
    score,
    setScore
  }

  useEffect(() => {
    const authenticatedUser = localStorage.getItem('auth')
    setUser(authenticatedUser ? JSON.parse(authenticatedUser) : null, () => {
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    setToast(null)
  }, [page, profileView, openedModule])

  if (user) {
    let currentPage = (<HomePageComponent></HomePageComponent>)

    if (page === Pages.PROFILE) {
      currentPage = (<ProfileComponent></ProfileComponent>)
    } else if (page === Pages.STUDENT_PROFILE) {
      currentPage = (<StudentProfileComponent></StudentProfileComponent>)
    } else if (page === Pages.DISCUSSION) {
      currentPage = (<DiscussionComponent></DiscussionComponent>)
    } else if (page === Pages.LEADERBOARD) {
      currentPage = (<LeaderboardPageComponent></LeaderboardPageComponent>)
    }

    return (
      <Context.Provider value={contexts}>
        <div className='layout-page'>
          <NavComponent />
          {currentPage}
        </div>
      </Context.Provider>
    )
  } else {
    if (loading && user) {
      return (
        <Context.Provider value={contexts}>
          <NavComponent />
          <div className="h-100 d-flex align-items-center justify-content-center">
            <Skeleton circle={true} width={50} height={50}></Skeleton>
          </div>
        </Context.Provider>
      )
    } else {
      return (
        <Context.Provider value={contexts}>
          <div className='layout-page'>
            <NavComponent />
            <LoginComponent />
          </div>
        </Context.Provider>
      )
    }
  }
}
