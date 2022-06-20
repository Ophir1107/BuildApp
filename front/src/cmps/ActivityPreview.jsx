import React, { Component } from 'react'
import { ProfileAvatar } from './ProfileAvatar'
import Moment from 'react-moment'


export class ActivityPreview extends Component {

    get fullActivity() {
        const { activity: { actionType, txt,  cardTitle , listTitle}, isGeneral } = this.props
        const activityLoc =  listTitle
        switch (actionType) {
            case 'attached':
                return `צירף קובץ ${txt} ל ${cardTitle}`
            case 'add':
                return `הוסיף ${cardTitle} ל ${activityLoc}`
            case 'removed':
                return `removed ${cardTitle} מ ${activityLoc}`
            case 'joined':
                return `joined ${activityLoc}`
            case 'completed':
                return `השלים ${cardTitle} ב ${activityLoc}`
            case 'archived':
                return `העביר לארכיון ${activityLoc}`
            case 'moved':
                return `העביר ${activityLoc} מ${txt}`
            case 'changed':
                return `changed ${txt}`
            case 'changed-date':
                return `שינה את תאריך הסיום מ ${cardTitle} ל ${txt}`
            case 'renamed':
                return `שינה את שם הפרויקט ל ${txt}`
            case 'left':
                return `עזב ${activityLoc}`
            case 'marked':
                return `סימן ${txt} ב ${activityLoc}`
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