import { ActivityPreview } from './ActivityPreview'
export function ActivitiesList({ activities, isGeneral , isNotification}) {
   
    const sortedActivities = activities.slice(0,20)
    console.log(activities.slice(0,20) , "20 activities")
    
    return (
        <div className="activities-list">
            {sortedActivities.map(activity => {
                return <ActivityPreview key={activity.id} activity={activity} isGeneral={isGeneral} isNotification={isNotification} />
            })}
        </div>
    )
} 