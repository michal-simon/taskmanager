/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Calendar from './Calendar'
import CreateEvent from './CreateEvent'
import axios from 'axios'
import { Input, FormGroup, Label, Form } from 'reactstrap'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 900px;
  margin: 1rem auto;
`
const Controls = styled.div`
  display: flex;
  justify-content: space-between;
`
const Button = styled.button`
  background: transparent;
  border: none;
  &:hover {
    color: #777;
  }
`

class Calendars extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            events: [],
            tasks: [],
            users: []
        }
        this.loadPrevMonth = this.loadPrevMonth.bind(this)
        this.loadNextMonth = this.loadNextMonth.bind(this)
        this.setEvents = this.setEvents.bind(this)
        this.getEvents = this.getEvents.bind(this)
        this.buildUserOptions = this.buildUserOptions.bind(this)
        this.buildTaskOptions = this.buildTaskOptions.bind(this)
    }

    componentDidMount () {
        this.getEvents()
        this.getUsers()
        this.getTasks()
    }

    setEvents (events) {
        this.setState({ events: events })
    }

    setMonth (month) {
        this.setState({ month: month })
    }

    getEvents () {
        const url = (this.props.user_id) ? `/api/events/users/${this.props.user_id}` : (this.props.task_id) ? `/api/events/tasks/${this.props.task_id}` : `/api/events`
        axios.get(url)
            .then((r) => {
                this.setState({
                    events: r.data
                })
            })
            .catch((e) => {
                alert(e)
            })
    }

    getTasks () {
        const url = `/api/tasks`
        axios.get(url)
            .then((r) => {
                this.setState({
                    tasks: r.data
                })
            })
            .catch((e) => {
                alert(e)
            })
    }

    getUsers () {
        const url = '/api/users'
        axios.get(url)
            .then((r) => {
                this.setState({
                    users: r.data
                })
            })
            .catch((e) => {
                alert(e)
            })
    }

    handleUserChange (e) {
        window.location.href = (!e.target.value ? '/calendar' : `/calendar-users?user_id=${e.target.value}`)
    }

    handleTaskChange (e) {
        window.location.href = (!e.target.value ? '/calendar' : `/calendar-tasks?task_id=${e.target.value}`)
    }

    buildUserOptions () {
        let userContent
        if (!this.state.users.length) {
            userContent = <option value="">Loading...</option>
        } else {
            userContent = this.state.users.map((user, index) => (
                <option key={index} value={user.id}>{user.first_name + ' ' + user.last_name}</option>
            ))
        }
        return (
            <Input type="select"
                   value={this.props.user_id} name="contributors" id="contributors"
                   onChange={this.handleUserChange.bind(this)}>
                <option value="">Choose:</option>
                {userContent}
            </Input>
        )
    }

    buildTaskOptions () {
        let taskContent
        if (!this.state.tasks.length) {
            taskContent = <option value="">Loading...</option>
        } else {
            taskContent = this.state.tasks.map((task, index) => (
                <option key={index} value={task.id}>{task.title}</option>
            ))
        }
        return (
            <Input type="select"
                   value={this.props.task_id} name="tasks" id="tasks" onChange={this.handleTaskChange.bind(this)}>
                <option value="">Choose:</option>
                {taskContent}
            </Input>
        )
    }

    /**
     *
     * @param year
     */
    setYear (year) {
        this.setState({ year: year })
    }

    loadPrevMonth () {
        let prevMonth = this.state.month - 1
        if (prevMonth < 1) {
            this.setYear(this.state.year - 1)
            prevMonth = 12
        }
        this.setMonth(prevMonth)
    }

    loadNextMonth () {
        let nextMonth = this.state.month + 1
        if (nextMonth > 12) {
            this.setYear(this.state.year + 1)
            nextMonth = 1
        }
        this.setMonth(nextMonth)
    }

    getFilters () {
        const usersList = this.buildUserOptions()
        const taskList = this.buildTaskOptions()
        return (
            <Form inline className="ml-5">

                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <CreateEvent
                        action={this.setEvents}
                        events={this.state.events}
                        modal={true}
                    />
                </FormGroup>

                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    {usersList}
                </FormGroup>

                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    {taskList}
                </FormGroup>
            </Form>
        )
    }

    render () {
        const filters = this.getFilters()
        return (
            <React.Fragment>

                {filters}

                <Container>
                    <Controls>
                        <Button onClick={this.loadPrevMonth}>&laquo; Prev Month</Button>
                        <Button onClick={this.loadNextMonth}>Next Month &raquo;</Button>
                    </Controls>
                    <Calendar
                        year={this.state.year}
                        month={this.state.month}
                        events={this.state.events}
                        action={this.setEvents}
                    />
                </Container>
            </React.Fragment>
        )
    }
}

export default Calendars

