import React, { Component } from 'react';
import SubjectIcon from '@material-ui/icons/Subject';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import { TextareaAutosize } from '@material-ui/core';
import { connect } from 'react-redux';


export class _CardDescription extends Component {

    state = {
        description: '',
        isInputSelected: false,
    }

    componentDidMount() {
        const { description } = this.props
        this.setState({ description })
    }

    handleChange = ({ target: { value } }) => {
        this.setState({ description: value })
    }

    onEditClicked = (ev) => {
        const {loggedInUser} = this.props
        if (loggedInUser.userType === 'constructor') return
        this.selectedInput.focus()
        this.setState({ isInputSelected: true }, () => {
            this.selectedInput.focus(ev)
        })
    }

    onSaveDescription = () => {
        const { description } = this.state
        this.setState({ isInputSelected: false }, () => {
            this.props.onSaveCardDescription(description)
        })
    }

    render() {
        const {loggedInUser} = this.props
        let { description, isInputSelected } = this.state
        return (<div className="card-description flex column">
            <div className="window-modal-title flex align-center">
                <SubjectIcon />
                <h3>Description</h3>
                <button className={`secondary-btn ${!description || isInputSelected ? 'hidden' : 'show'}`}
                    onClick={(ev) => {
                        if (loggedInUser.userType === 'constructor') return
                        this.onEditClicked(ev)}}>
                    Edit
                     </button>
            </div>
            <div className="card-description-edit flex column">
                <TextareaAutosize
                    className={!description ? 'placeholder-mode' : ''}
                    onFocus={(ev) => {if (loggedInUser.userType ==='constructor') return
                        this.onEditClicked(ev)}}
                    ref={(input) => { this.selectedInput = input; }}
                    onBlur={(ev) => {if (loggedInUser.userType ==='constructor') return
                                     this.onSaveDescription(ev)}}
                    value={description} placeholder="Add a more detailed description..."
                    onChange={(ev)=> { if (loggedInUser.userType ==='constructor') return
                    this.handleChange(ev)}} aria-label="empty textarea" />
                <div className={`description-controls flex align-center ${isInputSelected ? 'show' : 'hidden'}`}>
                    <button className="primary-btn" onClick={() => this.onSaveDescription()}>Save</button>
                    <CloseRoundedIcon className="close-svg" />
                </div>
            </div>
        </div>)
    }
}

function mapStateToProps(state) {
    return {
        loggedInUser: state.appModule.loggedInUser
    }
}
export const CardDescription = connect(mapStateToProps, null)(_CardDescription)
