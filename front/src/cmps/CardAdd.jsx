import React, { Component } from 'react'
import { TextareaAutosize } from '@material-ui/core';
import FmdBadIcon from '@mui/icons-material/FmdBad';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import { utilsService } from '../services/utils.service'
import { boardService } from '../services/board.service'
import { connect } from 'react-redux'

export class _CardAdd extends Component {

    state = {
        titleTxt: '' ,
        isUrgent: false ,
        isNew : true ,
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
    
    onAddCard = (isReject) => {
        const { titleTxt , isUrgent, isNew } = this.state;
        if (!titleTxt) {
            this.textArea.focus();
            return;
        }

        const { board, currList, onSaveBoard , loggedInUser} = this.props;
        const listIdx = board.lists.findIndex(list => list.id === currList.id);

        const card = {
            id: utilsService.makeId(),
            title: titleTxt,
            description: '',
            comments: [],
            checklists: [],
            members: [],
            byMember: loggedInUser, 
            labelIds: [],
            createdAt: Date.now(),
            startDate: 0,
            dueDate: 0,
            attachs: [],
            isReject: isReject,
            isUrgent: isUrgent,
            isNew: isNew ,
            style: {
                coverMode: (isUrgent) ? 'full':'',
                bgColor: ''
            }
        }
        const cardToEdit = boardService.addActivityToCard(card , 'add' , loggedInUser , null , board.lists[listIdx].title)
        // this.props.onEditBoard(board)
        const boardToEdit = boardService.addActivityToBoard(board, cardToEdit.activity[0])
        console.log(card.activity , "cardActivity")
        board.lists[listIdx].cards.push(cardToEdit)
        onSaveBoard(boardToEdit)
        // onSaveBoard(board)
        this.setState({ titleTxt: '' }, () => {
            this.textArea.focus()
        })
    }
    
    onToggleUrgentTask = ()=>{ 
        const isUrgent = this.state.isUrgent
        this.setState({isUrgent : !isUrgent})
    }

    render() {
        const { titleTxt , isUrgent} = this.state
        const { toggleCardAdd , loggedInUser } = this.props;
        return (
            <div className="card-add">
                <div className="card-add-input-container">
                    <TextareaAutosize className="card-add-input" ref={(textArea) => this.textArea = textArea} value={titleTxt} autoFocus onChange={this.handleChange} onKeyDown={this.handleChange} placeholder="הוסף כותרת למשימה" aria-label="empty textarea" />
                    <FmdBadIcon className="card-preview-urgent-btn" style={{color: isUrgent ? '#EB5A46' : '#6b778c'}} onClick={this.onToggleUrgentTask}/>
                </div>
                <div className="flex">
                    {loggedInUser.userType !== 'client' && loggedInUser.userType !== 'constructor' && (<div>
                        <button className="primary-btn" onMouseDown={(ev) => this.onAddCard(false)}>הוסף משימה</button>
                    </div>)}
                    <button className="primary-btn" onMouseDown={(ev) => this.onAddCard(true)}>הוסף ריג'קט</button>
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
  