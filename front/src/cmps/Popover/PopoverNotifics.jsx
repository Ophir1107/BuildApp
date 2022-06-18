import {connect} from 'react-redux'
import { ActivitiesList } from '../ActivitiesList'
import {Popover} from './Popover'
import { onSaveBoard } from "../../store/actions/board.actions";

function _PopoverNotifcs ({board , loggedInUser , onSaveBoard , data}){

    function getNotifcsActivities(){
        // const {board , loggedInUser , onSaveBoard} = this.props
        if(!loggedInUser)return
        const sortedActivities = board.activities.sort((a, b) => b.createdAt - a.createdAt)
        console.log(sortedActivities.filter(unique) , "unique activities")
        const userNotifics=sortedActivities.reduce((acc,activity)=>{
            if(board.members){
                board.members.forEach(member=>{
                    if(loggedInUser._id!==activity.byMember._id){
                        if(!member.lastNotified || member.lastNotified <activity.createdAt)
                        acc.push(activity)
                    }
                })
            }
            return acc
        },[])
        const memberIdx =  board.members.findIndex(member => member._id === loggedInUser._id)
        return userNotifics
    }

    const unique = (value, index, self) => {
        return self.indexOf(value) === index
      }


    const notifcsActivities=getNotifcsActivities().filter(unique).slice(0,data)
    console.log(notifcsActivities , "notifcsActivities")
    // console.log(notifcsActivities.unique() , "notifcsActivities")

    return <Popover title="Notifications">
        <div className="user-notifics">
            <ActivitiesList activities={notifcsActivities} isGeneral={true}/>
            {!notifcsActivities&& <p> No notifications to present...</p> }
        </div>
    </Popover>
}

function mapStateToProps(state){
    return {
        loggedInUser:state.appModule.loggedInUser,
        board:state.boardModule.board
    }
}
const mapDispatchToProps = {
    onSaveBoard
}

export const PopoverNotifics = connect(mapStateToProps,mapDispatchToProps)(_PopoverNotifcs)