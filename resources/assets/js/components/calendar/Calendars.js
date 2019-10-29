/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import Calendar from './Calendar'
import CreateEvent from './CreateEvent'
import axios from 'axios'
import {Input, FormGroup, Label, Form, Card, CardHeader, CardBody} from 'reactstrap'
import WeekCalendar from './WeekCalendar'
import CalendarEvent from "./CalendarEvent";

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
    constructor(props) {
        super(props)
        this.state = {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            events: [],
            tasks: [],
            users: []
        }

        this.calendar_type = 'week'
        this.loadPrevMonth = this.loadPrevMonth.bind(this)
        this.loadNextMonth = this.loadNextMonth.bind(this)
        this.setEvents = this.setEvents.bind(this)
        this.getEvents = this.getEvents.bind(this)
        this.buildUserOptions = this.buildUserOptions.bind(this)
        this.buildTaskOptions = this.buildTaskOptions.bind(this)
        this.filterEvents = this.filterEvents.bind(this)
        this.eventRender = this.eventRender.bind(this)
    }

    componentDidMount() {
        this.getEvents()
        this.getUsers()
        this.getTasks()
    }

    setEvents(events) {
        this.setState({events: events})
    }

    setMonth(month) {
        this.setState({month: month})
    }

    getEvents() {
        const url = (this.props.user_id) ? `/api/events/users/${this.props.user_id}` : (this.props.task_id) ? `/api/events/tasks/${this.props.task_id}` : '/api/events'
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

    getTasks() {
        const url = '/api/tasks'
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

    getUsers() {
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

    filterEvents(e) {
        const url = (!e.target.value) ? '/api/events' : (e.target.name === 'user') ? `/api/events/users/${e.target.value}` : `/api/events/tasks/${e.target.value}`

        axios.get(url)
            .then((r) => {
                this.setState({
                    events: r.data
                })
            })
            .catch((e) => {
                console.warn(e)
            })
    }

    buildUserOptions() {
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
                   value={this.props.user_id} name="user" id="contributors"
                   onChange={this.filterEvents.bind(this)}
            >
                <option value="">Choose:</option>
                {userContent}
            </Input>
        )
    }

    buildTaskOptions() {
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
                   value={this.props.task_id} name="task" id="tasks" onChange={this.filterEvents.bind(this)}
            >
                <option value="">Choose:</option>
                {taskContent}
            </Input>
        )
    }

    /**
     *
     * @param year
     */
    setYear(year) {
        this.setState({year: year})
    }

    loadPrevMonth() {
        let prevMonth = this.state.month - 1
        if (prevMonth < 1) {
            this.setYear(this.state.year - 1)
            prevMonth = 12
        }
        this.setMonth(prevMonth)
    }

    loadNextMonth() {
        let nextMonth = this.state.month + 1
        if (nextMonth > 12) {
            this.setYear(this.state.year + 1)
            nextMonth = 1
        }
        this.setMonth(nextMonth)
    }

    getFilters() {
        const usersList = this.buildUserOptions()
        const taskList = this.buildTaskOptions()
        return (
            <Form inline className="pull-right">

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

    eventRender(event, i) {
        return (
            <CalendarEvent
                calendar_type="week"
                allEvents={this.state.events}
                events={this.state.events}
                event={event}
                action={this.setEvents}
                key={event.id}
            />
        )
    }

    render() {
        const filters = this.getFilters()
        const {events} = this.state

        const calendar = this.calendar_type === 'month' ?
            <React.Fragment>
                <Controls>
                    <Button onClick={this.loadPrevMonth}>&laquo; Prev Month</Button>
                    <Button onClick={this.loadNextMonth}>Next Month &raquo;</Button>
                </Controls>
                <Calendar
                    year={this.state.year}
                    month={this.state.month}
                    events={events}
                    action={this.setEvents}
                />
            </React.Fragment>
            : <WeekCalendar
                calendar_type="week"
                events={events}
                emptyRender={this.emptyRender}
                eventRender={this.eventRender}
                past={true}
            />

        return (
            <div>
                <Card>
                    <CardHeader>
                        <h2>Calendar</h2> Week|Month
                        {filters}
                    </CardHeader>
                    <CardBody>
                        {calendar}
                    </CardBody>
                </Card>
            </div>
        )
    }
}

export default Calendars
