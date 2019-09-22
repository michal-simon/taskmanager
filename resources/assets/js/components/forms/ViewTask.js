/* eslint-disable no-unused-vars */
import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import TabContent from '../tabs/TabContent'
import Tooltips from '../Tooltip'

class ViewTask extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            modal: false,
            errors: []
        }
        this.toggle = this.toggle.bind(this)
    }

    toggle () {
        this.setState({
            modal: !this.state.modal
        })
    }

    render () {
        return (
            <div>
                <a href="#" onClick={this.toggle}>{this.props.task.title}</a>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>
                        Add Story
                    </ModalHeader>

                    <ModalBody>
                        <TabContent
                            task_type={this.props.task_type}
                            allTasks={this.props.allTasks}
                            action={this.props.action}
                            task={this.props.task}
                        />
                    </ModalBody>

                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}><i
                            className="fas fa-times-circle"></i> Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default ViewTask
