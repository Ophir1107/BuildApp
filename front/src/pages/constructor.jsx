// import { onSaveBoard } from "../store/actions/board.actions"
import { Component } from 'react'
import { connect } from 'react-redux'
import { ReactComponent as LoginSignupLogo } from '../assets/img/logos/login-signup-logo.svg'
import { Link } from 'react-router-dom'
import { PopoverMemberPreview } from '../cmps/Popover/PopoverMemberPreview'
import { constructorService } from '../services/constructor.service'
import { withRouter , Route, BrowserRouter as Router } from 'react-router-dom'
import { AddConstructor} from '../cmps/AddConstructor'
class _Constructor extends Component {

    state = {
        constructorTxt: '',
        constructors: [],

    }

    async componentDidMount() {
        const constructors = await constructorService.getConstructors()
        this.setState({ constructors })
    }

    handleChange = ({ target }) => {

        this.setState({ constructorTxt: target.value })
    }

    removeConstructor(ev , constructorId){
        ev.preventDefault()
        let {constructors} = this.state
        let newConstructors = []
        newConstructors = constructors.filter(constructor => constructor._id !== constructorId)
        console.log(constructors.length)
        constructorService.deleteConstructors(constructorId)
        constructors = newConstructors
        this.setState({constructors})
        // loadBoards(boards)
    }

    onGoBack(){
        // const history = useHistory()
        console.log( "history")
    }

    get filteredConstructors() {
        const { constructors, constructorTxt } = this.state
        const regex = new RegExp(constructorTxt, 'i')
        return constructors.filter(constructor => regex.test(constructor.fullname)).slice(0, 10)
    }


    render() {
        // const constructors = [{_id:"12j34ljk" , userName : "jhon"},{_id:"12jgdhfgh4ljk" , userName : "jhfdgon"}]
        const {constructors} = this.state
        const {loggedInUser , board} = this.props
        return (
            <Router>
                <section>
                    <Link onClick={this.onGoBack} to="/workspace" className="clean-link"><div className="constructors-logo flex align-center justify-center">
                        <LoginSignupLogo />
                        <h1>BuildApp</h1>
                    </div>
                    </Link>
                    <div className="constructors-preview flex column">
                        <input type="text" autoFocus className="pop-over-input" onChange={this.handleChange} />
                        <div className="constructors-table">
                            <div className="constructors-header constructor-preview" >
                                <div><h3>Name</h3></div>
                                <div><h3>Phone Number</h3></div>
                                <div><h3>Field</h3></div>
                            </div>
                            {this.filteredConstructors.map(constructor => <div className="constructor-preview" key={constructor.name}>
                                <div>{constructor.fullname}</div>
                                <div>{constructor.phone ? constructor.phone : 'number invalid' }</div>
                                <div>{constructor.field}</div>
                                <icon onClick={(ev) => this.removeConstructor(ev , constructor._id)}
                            class={`fas fa-archive icon-sm trash-icon`}>
                            </icon>
                                </div>
                                )}
                                
                        </div>
                     {/* onClick={(ev) => onDeleteBoard(ev, board._id , boards)}> */}

                        <Link to="/constructor/add" className="primary-btn add-cons-btn" >Add new constructor</Link>
                        {/* <button className="primary-btn">Send invitation</button> */}
                    </div>
                </section>
                <section className="nested-routes">
                            <Route path="/constructor/add" component={AddConstructor} />
                        </section>
        </Router>
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

const _ConstructorWithRouter = withRouter(_Constructor)
export const Constructor = connect(mapStateToProps, mapDispatchToProps)(_ConstructorWithRouter)