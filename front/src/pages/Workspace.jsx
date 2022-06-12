import { connect } from 'react-redux'
import React, { Component } from 'react'
import { loadBoards, onSaveBoard } from '../store/actions/board.actions'
import { BoardList } from '../cmps/BoardList'
import { ReactComponent as BoardIcon } from '../assets/img/icons/board.svg'
import { Loader } from '../cmps/Loader'
import { boardService } from '../services/board.service'
import { Route } from 'react-router-dom'
import { AdminDashboard } from './AdminDashboard'

class _Workspace extends Component {
    state = {
        boards: [] ,
    }

    componentDidMount() {
        this.props.loadBoards()
        const {boards} = this.props
        this.setState({ boards })
    }

    get favoriteBoards() {
        const boards = this.getUserBoards
        console.log(boards.filter(board => board.isFavorite === true) , "favaorite")
        return boards.filter(board => board.isFavorite === true)
    }

    get getUserBoards(){
        const {loggedInUser } = this.props
        let { boards} =this.state
        if (!boards) boards = this.props.boards
        if (loggedInUser && loggedInUser.userType === 'admin') return boards
        let userBoards = []
        for(let i=0 ; i<boards.length ; i++){
            let boardMembers = boards[i].members
            for(let j=0 ; j<boardMembers.length ; j++){
                if (loggedInUser && boardMembers[j]._id === loggedInUser._id){
                    userBoards.push(boards[i])
                }
            }
        }
        return userBoards
    }

    onDeleteBoard(ev, boardId , oldBoards){
        ev.preventDefault()
        let boards = oldBoards
        let newBoards = []
        console.log(boards.length)
        boardService.remove(boardId)
        newBoards = boards.filter(board => board._id !== boardId)
        boards = newBoards
        this.props.boards = boards

    }





    render() { 
        // let boards = this.getUserBoards()
        // const {loggedInUser , boards} = this.props
        return (
            <section className="workspace-container flex align-flex-start justify-center ">
                <Route path="/workspace/dashboard" component={AdminDashboard} />
                <div className="boards-wrapper flex column">
                    {/* <div className="boards-preview flex column">
                        <div className="preview-title flex align-center">
                            <i className="far fa-star"></i>
                            <h3>פרויקטים מסומנים</h3>
                        </div>
                        <BoardList onToggleFavorite={this.onToggleFavorite} isFavorite={true} />
                    </div> */}
                    <div className="boards-preview">
                        <div className="preview-title flex align-center">
                            <BoardIcon />
                            <h3>פרויקטים</h3>
                        </div>
                        <BoardList onToggleFavorite={this.onToggleFavorite}  isFavorite={false} />
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
    onSaveBoard

}

export const Workspace = connect(mapStateToProps, mapDispatchToProps)(_Workspace)