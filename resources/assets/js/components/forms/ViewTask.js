/* eslint-disable no-unused-vars */
import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import TabContent from '../tabs/TabContent'
import CompleteTask from '../CompleteTask'

class ViewTask extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            modal: false,
            errors: []
        }
        this.toggle = this.toggle.bind(this)
    }

    toggle (e) {
        e.preventDefault()
        this.setState({
            modal: !this.state.modal
        })
    }

    render () {
        return (
            <div>
                <a href='#' onClick={this.toggle}><h4 className="mb-1">{this.props.task.title}</h4></a>
                <Modal size="lg" isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>
                        Task
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
                        <Button color="secondary" onClick={this.toggle}>Close</Button>
                        <CompleteTask
                            action={this.props.action}
                            tasks={this.props.allTasks}
                            taskId={this.props.task.id}
                        />
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default ViewTask
