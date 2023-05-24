import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

export default function BadgesComponent() {
    library.add(fab, fas, far)
    return (
        <div className="card">
            <div className="card-header d-flex justify-content-center bg-warning p-2 text-dark bg-opacity-25">
            <h4>Badges</h4>
            </div>
            <div className="card-body bg-warning p-2 text-dark bg-opacity-10">
                <div className="d-flex flex-column px-5 justify-content-evenly mt-3">
                    <div className="d-flex flex-column mb-3">
                        <h3 className="d-flex justify-content-center"><FontAwesomeIcon icon="fa-solid fa-code-branch"/></h3>
                        <p className="d-flex justify-content-center">Example Badge 1</p>
                    </div>
                    <div className="d-flex flex-column mb-3">
                        <h3 className="d-flex justify-content-center"><FontAwesomeIcon icon="fa-solid fa-rotate-left" /></h3>
                        <p className="d-flex justify-content-center">Example Badge 2</p>
                    </div>
                    <div className="d-flex flex-column">
                        <h3 className="d-flex justify-content-center"><FontAwesomeIcon icon="fa-solid fa-shield-halved" /></h3>
                        <p className="d-flex justify-content-center">Example Badge 3</p>
                    </div>
                </div>
            </div>
      </div>
    )
}