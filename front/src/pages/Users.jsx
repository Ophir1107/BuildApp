import { Component } from 'react'
import { connect } from 'react-redux'
import { ReactComponent as LoginSignupLogo } from '../assets/img/logos/login-signup-logo.svg'
import { Link } from 'react-router-dom'
import { PopoverMemberPreview } from '../cmps/Popover/PopoverMemberPreview'
import { userService } from '../services/user.service'
import { withRouter , Route, BrowserRouter as Router } from 'react-router-dom'
class _Users extends Component {

    state = {
        usersTxt: '',
        users: [],

    }

    async componentDidMount() {
        const users = await userService.getUsers()
        this.setState({ users })
    }

    handleChange = ({ target }) => {

        this.setState({ userTxt: target.value })
    }

    removeUser(ev , userId){
        ev.preventDefault()
        let {users} = this.state
        let newUsers = []
        newUsers = users.filter(user => user._id !== userId)
        console.log(users.length)
        userService.deleteUser(userId)
        users = newUsers
        this.setState({users})
    }

    onGoBack(){
        console.log( "history")
    }

    get filteredUsers() {
        const { users, userTxt } = this.state
        const regex = new RegExp(userTxt, 'i')
        return users.filter(user => regex.test(user.fullname))
    }


    render() {
        const {users} = this.state
        const {loggedInUser , board} = this.props
        return (
            <Route>
                <section>
                    <Link onClick={this.onGoBack} to="/workspace" className="clean-link"><div className="users-logo flex align-center justify-center">
                        <h1>BuildApp</h1>
                    </div>
                    </Link>
                    <div className="users-preview flex column">
                        <div className='users-actions'>
                        <Link to="/signup" className="primary-btn add-cons-btn" >הוספת משתמש חדש</Link>
                        <input type="text" autoFocus className="pop-over-input" onChange={this.handleChange} placeholder="חיפוש משתמשים" />
                        </div>
                        <div className="users-table">
                            <div className="users-header user-preview" >
                                <div><h3>שם</h3></div>
                                <div><h3>טלפון</h3></div>
                                <div><h3>אימייל</h3></div>
                                <div><h3>תפקיד</h3></div>
                                <div><h3>תחום עיסוק</h3></div>
                            </div>
                            {this.filteredUsers.map(user => <div className="user-preview" key={user.name}>
                                <div>{user.fullname}</div>
                                <div>{user.phone ? user.phone : 'number invalid' }</div>
                                <div>{user.email ? user.email : 'email invalid' }</div>
                                <div>{user.userType ? user.userType : 'userType invalid' }</div>
                                <div>{user.field ? user.field : '-----'}</div>
                                <icon onClick={(ev) => this.removeUser(ev , user._id)}
                            class={`fas fa-archive icon-sm trash-icon`}>
                            </icon>
                                </div>
                                )}
                                
                        </div>
                    </div>
                </section>
                <section className="nested-routes">
                        </section>
        </Route>
         ) }




}
function mapStateToProps(state) {
    return {
        board: state.boardModule.board,
        loggedInUser: state.boardModule.loggedInUser
    }
}

const mapDispatchToProps = {
    // onSaveBoard
}

const _UsersWithRouter = withRouter(_Users)
export const Users = connect(mapStateToProps, mapDispatchToProps)(_UsersWithRouter)