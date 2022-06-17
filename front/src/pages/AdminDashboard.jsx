import React, { Component } from 'react'
import { connect } from 'react-redux'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded'
import { ScreenOverlay } from '../cmps/ScreenOverlay'
import AssignmentIcon from '@material-ui/icons/Assignment';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import { ReactComponent as ExclamationIcon } from '../assets/img/icons/exclamation-lg.svg'
import { ReactComponent as ChartIcon } from '../assets/img/icons/chart.svg'
import { CircularProgressbar } from 'react-circular-progressbar';
import { Loader } from '../cmps/Loader'
import 'react-circular-progressbar/dist/styles.css';
import { AdminChart } from '../cmps/AdminChart';


class _AdminDashboard extends Component {

    state = {
        chartsData: null
    }

    componentDidMount() {
        const cardsPerMemberMap = this.cardsPerMemberMap
        const cardsPerLabelMap = this.cardsPerLabelMap
        const cardsPerListMap = this.cardsPerListMap
        this.setState({ chartsData: { cardsPerMemberMap, cardsPerLabelMap, cardsPerListMap } })
    }

    get allCards() {
        const { lists } = this.props.board
        return lists.reduce((acc, list) => {
            acc = acc.concat(list.cards)
            return acc
        }, [])
    }


    cardsCount=(lists)=> {
        const cardsCount = lists.reduce((acc, list) => {
            acc += list.cards.length
            return acc
        }, 0)
        return cardsCount
    }

    allCardsCount(cards_type) {
        const { boards } = this.props
        let cards_count = 0
        for (let i=0 ; i<boards.length; i++){
            const lists = boards[i].lists
            if (cards_type == "all") cards_count += this.cardsCount(lists)
            if (cards_type == "soon") cards_count += this.dueSoonCardsCount(lists)
            if (cards_type == "overdue") cards_count += this.overdueCardsCount(lists)
        }
        return cards_count
    }

    overdueCardsCount=(lists)=> {
        const overdueCardsCount = lists.reduce((acc, list) => {
            const overdueCardsCountPerList = list.cards.reduce((acc, card) => {
                if (card.dueDate < Date.now() && card.dueDate && !card.isDone) acc++
                return acc
            }, 0)
            acc += overdueCardsCountPerList
            return acc
        }, 0)
        return overdueCardsCount
    }

    dueSoonCardsCount=(lists)=> {
        const dueSoonCardsCount = lists.reduce((acc, list) => {
            const dueSoonCardsCountPerList = list.cards.reduce((acc, card) => {
                if (card.dueDate && Date.now() <= card.dueDate) {
                    const timeDiff = card.dueDate - Date.now()
                    if ((timeDiff < 86400000) && card.dueDate) acc++
                }
                return acc
            }, 0)
            acc += dueSoonCardsCountPerList
            return acc
        }, 0)
        return dueSoonCardsCount
    }


    get criticalTasksCount() {
        const { lists } = this.props.board
        const criticalTasksCount = lists.reduce((acc, list) => {
            const criticalTasksCountList = list.cards.reduce((acc, card) => {
                if (card.urgency) {
                    acc++
                }
                return acc
            }, 0)
            acc += criticalTasksCountList
            return acc
        }, 0)
        return criticalTasksCount
    }

    getUsers = () => {
        const { boards } = this.props
        let userIds = []
        let filteredUsers = []
        for(let i=0 ; i<boards.length; i++) {
            const {members} = boards[i]
            for(let j =0 ; j<members.length; j++){
                if (members[j].userType !== 'manager') continue
                if(!userIds.includes(members[j]._id)) {
                    userIds.push(members[j]._id)
                    filteredUsers.push(members[j])
                }
            }
        }
     
        return filteredUsers
    }


    get cardsPerMemberMap() {
        const members = this.getUsers()
        console.log(members ,"im innnn!!!")

        let data = []
        const {boards} = this.props
        for(let i=0 ; i<members.length; i++) {
            data.push(this.getUserData(members[i]))
        }
        return data
    }

    getUserData = (user) => {
        const {boards} = this.props
        const userData = []
        // finaluserData.name= user.username
        for (let i=0 ; i<boards.length; i++) {
            // let userData = []
            const boardData = []
            if(boards.members.includes(user)){
                boardData = this.getBoardData(boards[i]) 
                console.log(boardData , "board data")
            }
            // userDate[board[i].title+'open'] = boardData.openTasks
            // userDate[board[i].title+'complite'] = boardData.complitedTasks
            // userDate[board[i].title+'onTime'] = boardData.onTime
            // userDate[board[i].title+'overDue'] = boardData.overDue
            userData.push(boardData.openTasks)
            userData.push(boardData.complitedTasks)
            userData.push(boardData.onTime)
            userData.push(boardData.overDue)
        }
        console.log(userData , "user data")
    }

    getBoardData = (board) => {
        let openTasks = 0
        let complitedTasks = 0
        let overDue = 0
        let onTime = 0
        console.log(board , "board when trying to get data")
        for (let i=0 ; i< board.length ; i++) {
            // lists[i].cards.forEach((card) => {
            //     if(!card.isDone) openTasks++
            //     else {
            //         complitedTasks++
            //         if(!card.isOverDue) onTime++
            //     }
            //     if (card.isOverDue || (card.dueDate < Date.now() && card.dueDate ) ) overDue++
            // })
        }
        return {
            openTasks,
            complitedTasks,
            overDue,
            onTime
        }
    }

    

    //     const allCards = this.allCards
    //     const cardsPerMemberMap = members.reduce((acc, member) => {
    //         if (!acc[member.fullname]) acc[member.fullname] = 0
    //         const cardsPerMemberCount = allCards.reduce((acc, card) => {
    //             const memberIdx = card.members.findIndex(currMember => currMember._id === member._id)
    //             if (memberIdx > -1 && !card.isDone) acc++
    //             return acc
    //         }, 0)
    //         acc[member.fullname] = cardsPerMemberCount
    //         return acc
    //     }, {})
    //     return cardsPerMemberMap
    // }

    // get cardsPerLabelMap() {
    //     const { labels } = this.props.board
    //     const allCards = this.allCards
    //     const cardsPerLabelMap = labels.reduce((acc, label) => {
    //         if (!acc[label.title]) acc[label.title] = { count: 0 }
    //         const cardsPerLabelCount = allCards.reduce((acc, card) => {
    //             const labelIdx = card.labelIds.findIndex(currLabelId => currLabelId === label.id)
    //             if (labelIdx > -1 && !card.isDone) acc++
    //             return acc
    //         }, 0)
    //         acc[label.title].count = cardsPerLabelCount
    //         return acc
    //     }, {})
    //     return cardsPerLabelMap


    // }

    // get cardsPerListMap() {
    //     const { lists } = this.props.board
    //     const cardsPerListMap = lists.reduce((acc, list) => {
    //         if (!acc[list.title]) acc[list.title] = 0
    //         acc[list.title] = list.cards.length
    //         return acc
    //     }, {})
    //     return cardsPerListMap
    // }

    get progressCircleStyle() {
        return {
            path: {
                stroke: ` #2fb4f5`,
                transition: 'stroke-dashoffset 0.5s ease 0s',
                transformOrigin: 'center center',
            },
            trail: {
                stroke: '#ffffff',
                strokeLinecap: 'butt',
                transform: 'rotate(0.25turn)',
                transformOrigin: 'center center',
            },
            text: {
                fill: '#ffffff',
                fontSize: '25px',

            },
        }
    }

    // createListCardsData = (board , i , type) => {
    //     let openTasks = 0
    //     let complitedTasks = 0
    //     let overDue = 0
    //     let onTime = 0
    //     list.cards.forEach((card) => {
    //         if(!card.isDone) openTasks++
    //         else {
    //             complitedTasks++
    //             if(!card.isOverDue) onTime++
    //         }
    //         if (card.isOverDue || (card.dueDate < Date.now() && card.dueDate ) ) overDue++
    //     })
    //     if (type === "total") return {
    //         name: list.title ,
    //         open: openTasks ,
    //         complited: complitedTasks ,
    //         amt : Math.floor(Math.random()*200)+ 2100
    //     }   
    //     if (type === "onTime") return {
    //         name: list.title ,
    //         onTime: onTime ,
    //         overDue: overDue ,
    //         amt : Math.floor(Math.random()*200)+ 2100
    //     }   
    // }
    get dueSoonPercentage() {
        return +((this.allCardsCount("soon") / this.allCardsCount("all") * 100).toFixed(1))
    }
    get overduePercentage() {

        return +((this.allCardsCount("overdue") / this.allCardsCount("all") * 100).toFixed(1))
    }


    goBackToBoard = () => {
        const { board } = this.props
        this.props.history.push(`/workspace`)
    }

    render() {
        const { chartsData } = this.state
        // const data1 = this.cardsPerMemberMap
        // console.log(data1 , "data1")
        if (!chartsData) return <Loader />
        return (
            <>
                <ScreenOverlay styleMode="heavy-dark" />
                <section className="dashboard-container flex column">
                    <CloseRoundedIcon className="close-svg" onClick={() => this.goBackToBoard()} />
                    <div className="general-statistics flex justify-center wrap">

                        <div className="stats flex justify-space-between  ">
                            <div className="content flex  column justify-space-between">

                                <h3 className="flex align-center"><AssignmentIcon /> סה"כ משימות וריג'קטים </h3>
                                <h4>{this.allCardsCount("all")}</h4>
                            </div>
                            <ChartIcon />
                        </div>

                        <div className="stats flex justify-space-between  ">
                            <div className="content flex  column justify-space-between">
                                <h3 className="flex align-center">  <QueryBuilderIcon /> מסתיימות בקרוב </h3>
                                <h4>{this.allCardsCount("soon")}</h4>
                            </div>
                            <CircularProgressbar value={this.dueSoonPercentage} text={`${this.dueSoonPercentage}%`}
                                styles={this.progressCircleStyle} />
                        </div>

                        <div className="stats flex justify-space-between  ">
                            <div className="content flex  column justify-space-between">

                                <h3 className="flex align-center"><ExclamationIcon />באיחור </h3>
                                <h4>{this.allCardsCount("overdue")}</h4>
                            </div>
                            <CircularProgressbar value={this.overduePercentage} text={`${this.overduePercentage}%`}
                            // <CircularProgressbar value={this.overduePercentage} text={`${this.overduePercentage}%`}
                                styles={this.progressCircleStyle} />
                        </div>
                    </div>
                    {/* <ProjectsCharts/> */}
                    {/* <BoardCharts chartsData={chartsData} /> */}
                </section>

                <section> <div className="StackedBarChart">
                    {/* <AdminChart/> */}


                </div>
                </section>
            
            </>
        )
    }
}

function mapStateToProps(state) {
    return {
        boards: state.boardModule.boards,
    }
}

export const AdminDashboard = connect(mapStateToProps, null)(_AdminDashboard)
