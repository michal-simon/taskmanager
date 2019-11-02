import * as React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap'

class MessageDialog extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            messageText: this.props.message ? this.props.message.comment : ''
        }
        this.onChange = this.onChange.bind(this)
    }

    onChange (e) {
        this.setState({
            messageText: e.target.value
        })
    }

    render () {
        const { mode, submitMessage, toggleOpenState, isDialogOpen } = this.props
        const { messageText } = this.state
        return (

            <div className="well">
                <form className="form-horizontal" role="form">
                    <h4>What's New</h4>
                    <div className="form-group p-2">
                        <textarea className="form-control" placeholder="Update your status" onChange={this.onChange}></textarea>
                    </div>
                    <button onClick={() => submitMessage(messageText, mode)} className="btn btn-primary pull-right" type="button">Post</button>
                    <ul className="list-inline">
                        <li><a href=""><i className="glyphicon glyphicon-upload"></i></a></li>
                        <li><a href=""><i className="glyphicon glyphicon-camera"></i></a></li>
                        <li><a href=""><i className="glyphicon glyphicon-map-marker"></i></a></li>
                    </ul>
                </form>
            </div>



        )
    }
}

export default MessageDialog
