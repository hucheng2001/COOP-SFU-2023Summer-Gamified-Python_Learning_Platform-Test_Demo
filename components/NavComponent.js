import { useContext, useEffect } from 'react'
import Context from '../context/Context'
import { Pages } from '../context/Pages'
import ToastComponent from './ToastComponent'
import UserLinkComponent from './UserLinkComponent'
import exitIcon from './icons/exit.png';
import coinIcon from './icons/coin.png';
import logoIcon from './icons/logo.png';
/**
 * The navigation component.
 * @param {*} props 
 * @returns HTML for the navigation bar.
 */
export default function NavComponent(props) {

    // Context: user, opened module, page, toast
    const { user, setUser, setOpenedModule, page, setPage, toast, setToast } = useContext(Context)

    /**
     * Handles the logout button.
     * @param {*} e 
     */
    const handleSignOut = (e) => {
        e.preventDefault()
        localStorage.removeItem('auth')
        setUser(null)
    }

    /**
     * Handles a module being opened.
     * @param {*} e 
     */
    const handleModulesClick = (e) => {
        e.preventDefault()
        setOpenedModule(null)
        setPage(Pages.MODULES)
    }

    /**
     * Handles the user's profile being opened.
     * @param {*} e 
     */
    const handleProfileClick = (e) => {
        e.preventDefault()
        setOpenedModule(null)
        setPage(Pages.PROFILE)
    }

    /**
     * Handles the discussion board being opened.
     * @param {*} e 
     */
    const handleDiscussionClick = (e) => {
        e.preventDefault()
        setOpenedModule(null)
        setPage(Pages.DISCUSSION)
    }

    /**
     * Handles the leaderboard being opened.
     * @param {*} e 
     */
    const handleLeaderboardClick = (e) => {
        e.preventDefault()
        setOpenedModule(null)
        setPage(Pages.LEADERBOARD)
    }

    /**
     * Handles the editor board being opened.
     * @param {*} e 
     */
    const handleEditorClick = (e) => {
        e.preventDefault()
        setOpenedModule(null)
        setPage(Pages.EDITOR)
    }

    const checkIfActive = (pageName) => {
        if (page === pageName) {
            return ' active'
        }

        return ''
    }

    const getToast = () => {
        if (toast) {
            return (
                <ToastComponent title={toast.title} message={toast.message}></ToastComponent>
            )
        }

        return (<></>)
    }

    let navBarContents = (
        <div>
        </div>
    )

    // Makes the toast disappear after a certain amount of time.
    useEffect(() => {
        setTimeout(() => {
            setToast(null)
        }, 6000)
    }, [toast])

    if (user) {

        {/*             
=======
        navBarContents = (
            <div className="collapse navbar-collapse" id="navbarText">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <a className={"nav-link" + checkIfActive(Pages.MODULES)} href="#" onClick={handleModulesClick}>Modules</a>
                    </li>
                    <li className="nav-item">
                        <a className={"nav-link" + checkIfActive(Pages.DISCUSSION)} href="#" onClick={handleDiscussionClick}>Discussion</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Competition</a>
                    </li>
                    <li className="nav-item">
                        <a className={"nav-link" + checkIfActive(Pages.PROFILE)} aria-current="page" href="#" onClick={handleProfileClick}>My Profile</a>
                    </li>
                    <li className="nav-item">
                        <a className={"nav-link" + checkIfActive(Pages.LEADERBOARD)} aria-current="page" href="#" onClick={handleLeaderboardClick}>Leaderboard</a>
                    </li>
                </ul>
>>>>>>> components/NavComponent.js    
                <span className="navbar-text">
                    Signed in as <UserLinkComponent uuid={user.uuid} name={user.name} showOwnName={true} />. (<a href="#" onClick={handleSignOut}>Sign out</a>)
                </span>
                {getToast()} */}
        navBarContents = (
            <ul className="layout-nav-main-list" id="navbarText">
                <li className="layout-nav-main-item">
                    <a className={"nav-link" + checkIfActive(Pages.MODULES)} href="#" onClick={handleModulesClick}>Modules</a>
                </li>
                <li className="layout-nav-main-item">
                    <a className={"nav-link" + checkIfActive(Pages.DISCUSSION)} href="#" onClick={handleDiscussionClick}>Discussion</a>
                </li>
                <li className="layout-nav-main-item">
                    <a className="nav-link" href="#">Competition</a>
                </li>
                <li className="layout-nav-main-item">
                    <a className={"nav-link" + checkIfActive(Pages.PROFILE)} aria-current="page" href="#" onClick={handleProfileClick}>My Profile</a>
                </li>
                <li className="layout-nav-main-item">
                    <a className={"nav-link" + checkIfActive(Pages.LEADERBOARD)} aria-current="page" href="#" onClick={handleLeaderboardClick}>Leaderboard</a>
                </li>
            </ul>
        )
    }

    return (
        <div className="layout-top-nav global-card-base">
            <div className='layout-top-nav-main'>
                <div className="layout-top-nav-title">
                    <img src={logoIcon.src} style={{ width: '28px' }} />
                    <a href="#">Intro. to Python</a>
                </div>
                {navBarContents}
            </div>
            <div className='layout-top-nav-right'>
                {user?.uuid ? <div className='layout-top-nav-icon-group'>
                    <span>165</span>
                    <img src={coinIcon.src} style={{ width: '16px' }} />
                </div> : null}
                <div className='layout-top-nav-icon-group'  style={{ cursor: 'pointer' }} onClick={handleSignOut}>
                    <span>{user?.name}</span>
                    <img src={exitIcon.src} style={{ width: '20px' }} />
                    <span>Sign out</span>
                </div>
            </div>
        </div>
    );
}