import React, { Component } from 'react'
import { TextareaAutosize } from '@material-ui/core';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import { utilsService } from '../services/utils.service'
import { connect } from 'react-redux'

export class _CardAdd extends Component {

    state = {
        titleTxt: ''
    }

    componentDidMount() {
        const { loggedInUser } = this.props
    }

    handleChange = (ev) => {
        const { value } = ev.target;
        if (ev.key === 'Enter') {
            ev.preventDefault();
            this.onAddCard()
            return;
        }
        this.setState({ titleTxt: value });
    }

    onAddCard = () => {
        const { titleTxt } = this.state;
        if (!titleTxt) {
            this.textArea.focus();
            return;
        }

        const { board, currList, onSaveBoard } = this.props;
        const listIdx = board.lists.findIndex(list => list.id === currList.id);

        const card = {
            id: utilsService.makeId(),
            title: titleTxt,
            description: '',
            comments: [],
            checklists: [],
            members: [],
            byMember: 'loggedinUser', 
            labelIds: [],
            createdAt: Date.now(),
            startDate: 0,
            dueDate: 0,
            attachs: [],
            isReject: false,
            style: {
                coverMode: '',
                bgColor: ''
            }
        }

        board.lists[listIdx].cards.push(card)
        onSaveBoard(board)
        this.setState({ titleTxt: '' }, () => {
            this.textArea.focus()
        })
    }

    render() {
        const { titleTxt } = this.state
        const { toggleCardAdd , loggedInUser } = this.props;
        return (
            <div className="card-add">
                <TextareaAutosize className="card-add-input" ref={(textArea) => this.textArea = textArea} value={titleTxt} autoFocus onChange={this.handleChange} onKeyDown={this.handleChange} placeholder="Enter a title for this card..." aria-label="empty textarea" />
                {loggedInUser.userType !== 'client' && (<div>
                    <button className="primary-btn" onMouseDown={this.onAddCard}>Add Task</button>
                    <CloseRoundedIcon onMouseDown={() => toggleCardAdd()} />
                </div>)}
                <div>
                    <button className="primary-btn" onMouseDown={this.onAddCard}>Add Reject</button>
                    <CloseRoundedIcon onMouseDown={() => toggleCardAdd()} />
                </div>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
      loggedInUser: state.appModule.loggedInUser,
    }
  }

  
  export const CardAdd = connect(mapStateToProps)(_CardAdd)
  