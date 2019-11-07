import React, { Component } from "react"
import { Link } from "react-router-dom"
import {
    FormGroup, FormText,
    Input,
    Label,
    Card,
    CardHeader,
    InputGroup,
    InputGroupAddon,
    CardBody,
    Button,
    Form
} from "reactstrap"

import "./ResetPassword.css"
import axios from 'axios'

export default class ResetPassword extends Component {
    constructor (props) {
        super(props)

        this.state = {
            code: new URLSearchParams(this.props.location.search).get('token'),
            email: "",
            error: "",
            success: "",
            password: "",
            codeSent: false,
            confirmed: false,
            confirmPassword: "",
            isConfirming: false,
            isSendingCode: false
        }
    }

    validateResetForm () {
        return (
            this.state.password.length > 0 &&
            this.state.password === this.state.confirmPassword
        )
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    handleConfirmClick = async event => {
        event.preventDefault()

        if (!this.validateResetForm()) {
            this.setState({error: 'Please ensure that you complete both password fields and that they match'})
            return false;
        }

        axios.post('/api/login/resetPassword', {
            resetToken: this.state.code,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword
        })
            .then((response) => {

                if (response.data.success === true) {
                    this.setState({success: "Your password has now been reset", isSendingCode: true})
                }
            })
            .catch((error) => {
                this.setState({isSendingCode: false, error: error.response.data})
            })
    }

    renderConfirmationForm () {
        return (
            <div className="col-md-6 offset-md-3">
                <span className="anchor" id="formResetPassword"></span>

                <Card>
                    <CardHeader>
                        <h3 className="mb-0">Confirm Password Reset</h3>
                    </CardHeader>

                    <CardBody>
                        <div className="text-center">

                            {this.renderErrorMessage()}
                            {this.renderSuccessMessage()}

                            <h3><i className="fa fa-lock fa-4x"></i></h3>
                            <h2 className="text-center">Reset Password</h2>
                            <p>You can reset your password here.</p>

                            <Form onSubmit={this.handleConfirmClick}>
                                {/*<FormGroup>*/}
                                {/*    <Label>Confirmation Code</Label>*/}
                                {/*    <Input*/}
                                {/*        autoFocus*/}
                                {/*        type="tel"*/}
                                {/*        value={this.state.code}*/}
                                {/*        onChange={this.handleChange}*/}
                                {/*    />*/}
                                {/*    <FormText color="muted">*/}
                                {/*        Please check your email ({this.state.email}) for the confirmation*/}
                                {/*        code.*/}
                                {/*    </FormText>*/}
                                {/*</FormGroup>*/}
                                {/*<hr/>*/}

                                <FormGroup>
                                    <Label>New Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={this.state.password}
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        onChange={this.handleChange}
                                        value={this.state.confirmPassword}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Button color="primary" type="submit" size="lg" block>Reset Password</Button>
                                </FormGroup>
                            </Form>
                        </div>
                    </CardBody>
                </Card>
            </div>
        )
    }

    renderSuccessMessage () {
        if (!this.state.success.length) {
            return
        }

        return (
            <div className="alert alert-success" role="alert">
                {this.state.success}
            </div>
        )
    }

    renderErrorMessage () {

        if (!this.state.error.length) {
            return
        }

        return (
            <div className="alert alert-danger" role="alert">
                {this.state.error}
            </div>
        )
    }

    render () {
        return (
            <div className="ResetPassword">
                {this.renderConfirmationForm()}
            </div>
        )
    }
}
