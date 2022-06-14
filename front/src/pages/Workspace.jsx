// import { connect } from 'react-redux'
// import React, { Component } from 'react'
// import { loadBoards, onSaveBoard } from '../store/actions/board.actions'
// import { BoardList } from '../cmps/BoardList'
// import { ReactComponent as BoardIcon } from '../assets/img/icons/board.svg'
// import { Loader } from '../cmps/Loader'
// import { boardService } from '../services/board.service'
// import { Route } from 'react-router-dom'
// import { AdminDashboard } from './AdminDashboard'

// class _Workspace extends Component {
//     state = {
//         boards: [] ,
//     }

//     componentDidMount() {
//         this.props.loadBoards()
//         const {boards} = this.props
//         console.log(boards , 'in workspace')
//         this.setState({ boards })
//     }

//     // get favoriteBoards() {
//     //     const boards = this.getUserBoards
//     //     console.log(boards.filter(board => board.isFavorite === true) , "favaorite")
//     //     return boards.filter(board => board.isFavorite === true)
//     // }

//     // get getUserBoards(){
//     //     const {loggedInUser } = this.props
//     //     let { boards} =this.state
//     //     if (!boards) boards = this.props.boards
//     //     if (loggedInUser && loggedInUser.userType === 'admin') return boards
//     //     let userBoards = []
//     //     for(let i=0 ; i<boards.length ; i++){
//     //         let boardMembers = boards[i].members
//     //         for(let j=0 ; j<boardMembers.length ; j++){
//     //             if (loggedInUser && boardMembers[j]._id === loggedInUser._id){
//     //                 userBoards.push(boards[i])
//     //             }
//     //         }
//     //     }
//     //     return userBoards
//     // }

//     onDeleteBoard(ev, boardId , oldBoards){
//         ev.preventDefault()
//         let boards = oldBoards
//         let newBoards = []
//         console.log(boards.length)
//         boardService.remove(boardId)
//         newBoards = boards.filter(board => board._id !== boardId)
//         boards = newBoards
//         this.props.boards = boards

//     }





//     render() { 
//         // let boards = this.getUserBoards
//         const {loggedInUser , boards} = this.props
//         return (
//             <section className="workspace-container flex align-flex-start justify-center ">
//                 <Route path="/workspace/dashboard" component={AdminDashboard} />
//                 <div className="boards-wrapper flex column">
               
//                     <div className="boards-preview">
//                         <div className="preview-title flex align-center">
//                             <BoardIcon />
//                             <h3>פרויקטים</h3>
//                         </div>
//                         <BoardList  />
//                     </div>
//                 </div>
//             </section>
//         )
//     }
// }

// function mapStateToProps(state) {
//     return {
//         boards: state.boardModule.boards,
//         loggedInUser: state.appModule.loggedInUser
//     }
// }

// const mapDispatchToProps = {
//     loadBoards,
//     onSaveBoard

// }

// export const Workspace = connect(mapStateToProps, mapDispatchToProps)(_Workspace)


import { connect } from 'react-redux'
import React, { Component } from 'react'
import { loadBoards, onSaveBoard , onSaveBoards } from '../store/actions/board.actions'
import { BoardList } from '../cmps/BoardList'
import { ReactComponent as BoardIcon } from '../assets/img/icons/board.svg'
import { boardService } from '../services/board.service'
// import { loadBoards, onSaveBoard } from '../store/actions/board.actions'
import { Loader } from '../cmps/Loader'

class _Workspace extends Component {
    state = {
        boards : []
    }
    componentDidMount() {
        this.props.loadBoards()
    }

    get favoriteBoards() {
        const { boards } = this.props
        return boards.filter(board => board.isFavorite)
    }

    onToggleFavorite = (ev, boardId) => {
        ev.preventDefault()
        const { boards, onSaveBoard } = this.props
        const board = boards.find(board => board._id === boardId)
        board.isFavorite = !board.isFavorite
        onSaveBoard(board)
    }

    getUserBoards =() => {
        const {loggedInUser , boards } = this.props
        if(loggedInUser && loggedInUser.userType === 'admin') return boards
        let userBoards = []
        console.log(boards.length , "board length")
        for(let i=0 ; i<boards.length ; i++){
            let boardMembers = boards[i].members
            console.log(boardMembers , "board members")
            for(let j=0 ; j<boardMembers.length ; j++){
                if (loggedInUser && boardMembers[j]._id === loggedInUser._id){
                    userBoards.push(boards[i])
                    console.log(userBoards.length , "boards length")
                }
            }
        }
        // this.setState({boards : userBoards})
        return userBoards
    }
    
    onDeleteBoard =(ev, boardId) =>{ 
        ev.preventDefault()
        let {boards , onSaveBoards} = this.props
        // console.log('boards from delete' , boards)
        // console.log(boards.length)
        boards=this.getUserBoards()
        boards = boards.filter(board => board._id !== boardId)
        this.setState({boards})
        // this.setState({boardId : ''})
        // console.log(boards , "this state")
        boardService.remove(boardId)
        onSaveBoards(boards)
        // this.componentDidMount()
    }


    render() {
        const boards = this.getUserBoards()
        const {loggedInUser} = this.props
        console.log("i have boards in my pocket" , boards)
        if (!boards) return <Loader />
        return (
            <section className="workspace-container flex align-flex-start justify-center ">
                <div className="boards-wrapper flex column">
                    {/* <div className="boards-preview flex column">
                        <div className="preview-title flex align-center">
                            <i className="far fa-star"></i>
                            <h3>Starred boards</h3>
                        </div>
                        <BoardList onToggleFavorite={this.onToggleFavorite} boards={this.favoriteBoards} />
                    </div> */}
                    <div className="boards-preview">
                        <div className="preview-title flex align-center">
                            {/* <BoardIcon /> */}
<<<<<<< HEAD
                            <h3>פרויקטים</h3>
=======
                            <h3>Workspace</h3>
>>>>>>> 1de62c9bf89408c7919031524e0b4bd46bfba77f
                        </div>
                        <BoardList onToggleFavorite={this.onToggleFavorite} boards={boards} 
                        loggedInUser={loggedInUser} onDeleteBoard={this.onDeleteBoard}/>
                    </div>
                </div>
            </section>
        )
    }
}

function mapStateToProps(state) {
    return {
        boards: state.boardModule.boards,
        loggedInUser: state.appModule.loggedInUser
    }
}

const mapDispatchToProps = {
    loadBoards,
    onSaveBoard,
    onSaveBoards,
}

export const Workspace = connect(mapStateToProps, mapDispatchToProps)(_Workspace)