import React, { Component } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { ReactComponent as LogoRight } from '../assets/img/logos/auth-right-logo.svg'
import { ReactComponent as LogoLeft } from '../assets/img/logos/auth-left-logo.svg'
import { onAddConstructor } from '../store/actions/app.actions.js'
import { ReactComponent as LoginSignupLogo } from '../assets/img/logos/login-signup-logo.svg'
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import Select, { SelectChangeEvent } from '@mui/material/Select';


export class _AddConstructor extends Component {

    state = {
        constructorInfo: {
            fullname: '',
            phone: '',
            field: '',
            projects: []
        },
        pageMode: 'constructor'
    }

    componentDidMount() {
        const { loggedinUser } = this.props
    }

    componentDidUpdate() {
        const { loggedInUser } = this.props
        // if ( loggedInUser) this.props.history.push('/workspace')
    }

    validate = (values) => {
        const errors = {}
        if (!values.fullname) {
            errors.fullname = 'Required'
        } else if (values.fullname.length < 4) {
            errors.username = 'Please use at least 6 characters'
        }
        if (values.phone.length < 8) {
            errors.password = 'Invalid phone number'
        }
        return errors
    }

    onSubmit = (values) => {
        console.log(values , "cons fromn ")
        const { onAddConstructor  } = this.props
        onAddConstructor(values)
        // if ( loggedInUser) this.props.history.push('/workspace')
    }

    render() {
        const { constructorInfo } = this.state
        const { loggedInUser } = this.props
        return (<section className="login-signup-container">
            <Link to="/" className="clean-link"><div className="logo flex align-center justify-center">
                <LoginSignupLogo />
                <h1>BuildApp</h1>
            </div>
            </Link>
     
            <div className="left-logo">
                <LogoLeft />
            </div>
            <div className="right-logo">
                <LogoRight />
            </div>
        </section>
        )
    }
}

function mapStateToProps(state) {
    return {
        loggedInUser: state.appModule.loggedInUser,
        loginErr: state.appModule.loginErr
    }
}


const mapDispatchToProps = {
    onAddConstructor,

}

export const AddConstructor = connect(mapStateToProps, mapDispatchToProps)(_AddConstructor)


