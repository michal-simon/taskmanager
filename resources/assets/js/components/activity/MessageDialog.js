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
            <Modal isOpen={isDialogOpen} toggle={toggleOpenState} className={this.props.className}>
                <ModalHeader toggle={toggleOpenState}>
                    {`${mode} Message`}
                </ModalHeader>

                <ModalBody>
                    {`Please fill in the field below to ${mode.toLowerCase()} message`}.

                    <Input
                        value={messageText}
                        autoFocus={true}
                        margin="dense"
                        id="message"
                        label="Message"
                        type="text"
                        onChange={this.onChange}
                    />
                </ModalBody>

                <ModalFooter>
                    <Button onClick={toggleOpenState} color="primary">Cancel</Button>
                    <Button onClick={() => submitMessage(messageText, mode)} color="primary">Submit</Button>
                </ModalFooter>
            </Modal>
        )
    }
}

export default MessageDialog
