import React, { Component } from 'react'
import { ProfileAvatar } from './ProfileAvatar'
import Moment from 'react-moment'


export class ActivityPreview extends Component {

    get fullActivity() {
        const { activity: { actionType, txt,  cardTitle , listTitle}, isGeneral } = this.props
        const activityLoc =  listTitle
        switch (actionType) {
            case 'attached':
                return `attached ${txt} to ${cardTitle}`
            case 'add':
                return `added ${cardTitle} to ${activityLoc}`
            case 'removed':
                return `removed ${cardTitle} from ${activityLoc}`
            case 'joined':
                return `joined ${activityLoc}`
            case 'completed':
                return `completed ${cardTitle} on ${activityLoc}`
            case 'archived':
                return `archived ${activityLoc}`
            case 'moved':
                return `moved ${activityLoc} from ${txt}`
            case 'changed':
                return `changed ${txt}`
            case 'changed-date':
                return `changed the due date of ${cardTitle} to ${txt}`
            case 'renamed':
                return `renamed this board to ${txt}`
            case 'left':
                return `left ${activityLoc}`
            case 'marked':
                return `marked ${txt} on ${activityLoc}`
            default:
                return ''
        }
    }

    render() {
        const { activity: { actionType, txt, createdAt, byMember, cardTitle }, isGeneral } = this.props
        return (
            <div className="activity-preview flex">
                <ProfileAvatar member={byMember} size={32} />
                {actionType === 'comment' &&
                    <div className="comment-content">
                        <div className="main">
                            <span className="member-name">{byMember.fullname}</span>
                            {isGeneral && `on ${cardTitle}`}
                            <Moment className="publish-time" fromNow>{createdAt}</Moment>
                        </div>
                        <div className="comment-body">
                            <span>{txt}</span>
                        </div>
                    </div>}
                {actionType !== 'comment' &&
                    <div className="activity-content flex column">
                        <div className="main">
                            <span className="member-name">{byMember.fullname}</span>
                            {this.fullActivity}
                        </div>
                        <Moment className="publish-time" fromNow>{createdAt}</Moment>
                    </div>}
            </div>
        )
    }

}