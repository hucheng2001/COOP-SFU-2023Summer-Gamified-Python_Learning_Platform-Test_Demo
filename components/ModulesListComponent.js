import ConditionalsModule from "./modules/ConditionalsModule";
import LoopsModule from "./modules/LoopsModule"

export default function ModulesListComponent() {
    return (
        <div className="row" >
            <div className="col-sm-6">
                <ConditionalsModule></ConditionalsModule>
            </div>
            <div className="col-sm-6">
                <LoopsModule></LoopsModule>
            </div>
        </div>
    )
}