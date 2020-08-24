import React from 'react';
import Icon from '@mdi/react'
import { mdiAccount, mdiLock } from '@mdi/js';
import './LoginRegister.css';
import axios from 'axios';
import {Typography, Card} from "@material-ui/core";
import { Redirect } from 'react-router'

/**
 * Define LoginRegister, a React componment of CS142 project #5
 */
class LoginRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginName: '',
            password: '',
            registerLoginName: '',
            registerPassword: '',
            registerPasswordConfirm: '',
            firstName: '',
            lastName: '',
            location: '',
            description: '',
            occupation:'',
            errorLogin:'',
            errorRegister: '',
            registerFlag: false
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
    }

    handleInputChange(stateChange) {
        this.setState(stateChange);
    }

    handleSubmit(event) {
        event.preventDefault();
        axios.post('http://localhost:3000/admin/login',  { login_name: this.state.loginName, password: this.state.password})
            .then((res) => {
            // console.log(res.data);
            this.setState({errorLogin: ''});
            this.props.handleLoggedInChange({loggedInUser: res.data});
            console.log(this.props.loginFlag);
        }).catch((err) => {
            // console.log(err);
            this.setState({password: '', errorLogin: err.response.data});
        });
    }

    handleRegister(event) {
        event.preventDefault();
        if(this.state.registerPassword !== this.state.registerPasswordConfirm) {
            this.setState({errorRegister: "Passwords do not match!"});
        } else {
            axios.post('http://localhost:3000/user', {
                login_name: this.state.registerLoginName,
                password: this.state.registerPassword,
                first_name: this.state.firstName,
                last_name: this.state.lastName,
                location: this.state.location,
                description: this.state.description,
                occupation: this.state.occupation
            }).then((res) => {
                this.setState({
                    registerFlag: true,
                    registerLoginName: '',
                    registerPassword: '',
                    registerPasswordConfirm: '',
                    firstName: '',
                    lastName: '',
                    location: '',
                    description: '',
                    occupation: '',
                    errorRegister: ''
                });
                console.log(res.data);
            }).catch((err) => {
                this.setState({registerPassword: '', registerPasswordConfirm: '', errorRegister: err.response.data});
            });
        }
    }

    render() {
        if(this.props.loginFlag === true) {
            return (<Redirect to={"/users/"+this.props.loggedInUser._id} />);
        } else {
            return (
                <div>
                    <Card className={"login-card"}>
                <form onSubmit={this.handleSubmit} className={"login-form"}>
                    <Typography variant={"h5"} className={"form-title"}>Sign In</Typography>
                    <label>
                        <Icon path={mdiAccount} size={1} id={"username-icon"}/>
                        <input type="text" className={"short-input"} value={this.state.loginName}
                               onChange={event => this.handleInputChange({loginName: event.target.value})}
                               placeholder={"Login name"}/>
                        <br/>
                        <Icon path={mdiLock} size={1} id={"password-icon"}/>
                        <input type="password" name="password" className={"short-input"} value={this.state.password}
                               onChange={event => this.handleInputChange({password: event.target.value})}
                               placeholder={"Password"}/>
                    </label>
                    <br/>
                    <button type={"submit"}>Login</button>
                    <Typography variant={"body2"} className={"error-message"}>{this.state.errorLogin}</Typography>
                </form></Card>

                    <Card className={"register-card"}>
                    <form onSubmit={this.handleRegister} className={"register-form"}>
                        <Typography variant={"h5"} className={"form-title"}>Sign Up</Typography>
                        <label>
                            <Typography variant={"body2"} className={"register-title"}>Login Name:</Typography>
                            <input type="text" id={"register-login-name-input"} className={"short-input"} value={this.state.registerLoginName}
                                   onChange={event => this.handleInputChange({registerLoginName: event.target.value})}/>
                            <br/>
                            <Typography variant={"body2"} className={"register-title"}>Password:</Typography>
                            <input type="password" name="password" id={"register-password-input"} className={"short-input"} value={this.state.registerPassword}
                                   onChange={event => this.handleInputChange({registerPassword: event.target.value})}/>
                                   <br/>
                            <Typography variant={"body2"} className={"register-title"}>Confirm Password:</Typography>
                            <input type="password" name="password" id={"register-password-confirm-input"} className={"short-input"} value={this.state.registerPasswordConfirm}
                                   onChange={event => this.handleInputChange({registerPasswordConfirm: event.target.value})}/>
                                   <br/>
                            <Typography variant={"body2"} className={"register-title"}>First Name:</Typography>
                            <input type="text" id={"register-first-name-input"} className={"short-input"} value={this.state.firstName}
                                   onChange={event => this.handleInputChange({firstName: event.target.value})}/>
                            <br/>
                            <Typography variant={"body2"} className={"register-title"}>Last Name:</Typography>
                            <input type="text" id={"register-last-name-input"} className={"short-input"} value={this.state.lastName}
                                   onChange={event => this.handleInputChange({lastName: event.target.value})}/>
                            <br/>
                            <Typography variant={"body2"} className={"register-title"}>Location:</Typography>
                            <input type="text" id={"register-location-input"} className={"short-input"} value={this.state.location}
                                   onChange={event => this.handleInputChange({location: event.target.value})}/>
                            <br/>
                            <Typography variant={"body2"} className={"register-title"}>Description:</Typography>
                            <input type="text" id={"register-description-input"} className={"long-input"} value={this.state.description}
                                   onChange={event => this.handleInputChange({description: event.target.value})}/>
                            <br/>
                            <Typography variant={"body2"} className={"register-title"}>Occupation:</Typography>
                            <input type="text" id={"register-occupation-input"} className={"short-input"} value={this.state.occupation}
                                   onChange={event => this.handleInputChange({occupation: event.target.value})}/>
                            <br/>
                        </label>
                        <br/>
                        <button type={"submit"}>Register Me</button>
                        {this.state.registerFlag ? <Typography variant={"body2"} className={"register-message"}>Successfully registered!</Typography>
                            :<Typography variant={"body2"} className={"error-message"}>{this.state.errorRegister}</Typography>}
                    </form>
                    </Card>
                </div>
            );
        }
    }
}

export default LoginRegister;
