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


export class _Constructor extends Component {

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
      
        
            {loggedInUser.userType==='admin' &&
            <div className="login-signup flex column ">
                <h3>Add new constructor</h3>
                <Formik initialValues={constructorInfo} validateOnChange={false} validateOnBlur={false} validate={this.validate} onSubmit={this.onSubmit}>
                    <Form className="flex column">
                        <Field type="fullname" placeholder="Enter fullname" name="fullname" autoFocus />
                        <ErrorMessage name="fullname" component="p" />
                        <Field type="phone" placeholder="Enter phone number" name="phone" />
                        <ErrorMessage name="username" component="p" />



                        <Field name="field" as="select" placeholder="Select type of user"
                            //component="select"
                            value = {this.value}
                            className = "LoginSelectBar"
                        >
                            <option defaultValue disabled>Select field </option>
                            <option value = "air">מיזוג</option>
                            <option value = "electricity">חשמלאי</option>
                            <option value = "plumbing">אינסטלציה</option>
                            <option value = "construction">בינוי</option>
                            
                            
                            
                        </Field>

                        <button type="submit" className="primary-btn login-signup-btn">Add</button>
                    </Form>
                </Formik>
                <hr />
                <Link to="/login">Already have an account ? Log In</Link>
            </div>
    }
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

export const Constructor = connect(mapStateToProps, mapDispatchToProps)(_Constructor)


