/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Tooltip } from 'reactstrap'
import AddTask from './forms/AddTask'

class Tooltips extends Component {
    constructor (props) {
        super(props)

        this.toggle = this.toggle.bind(this)
        this.state = {
            tooltipOpen: false
        }
    }

    toggle () {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        })
    }

    render () {
        return (
            <span>
                <i className="fa fa-question-circle" id={'Tooltip-' + this.props.id} data-toggle="tooltip"></i>
                <Tooltip placement={this.props.placement} isOpen={this.state.tooltipOpen}
                    target={'Tooltip-' + this.props.id} toggle={this.toggle}>
                      {this.props.content}
                </Tooltip>

                {<AddTask
                    tasks={this.props.tasks}
                    storyType={this.props.storyType}
                    action={this.props.action}
                    status={this.props.id}
                    task_type={this.props.task_type}
                />}
            </span>
        )
    }
}

export default Tooltips
