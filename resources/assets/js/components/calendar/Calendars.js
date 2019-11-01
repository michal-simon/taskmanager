import React from 'react'
import styled from 'styled-components'
import Calendar from './Calendar'
import CreateEvent from './CreateEvent'
import axios from 'axios'
import { FormGroup, Form, Card, CardHeader, CardBody} from 'reactstrap'
import WeekCalendar from './WeekCalendar'
import CalendarEvent from "./CalendarEvent";
import TaskDropdown from "../common/TaskDropdown";
import UserDropdown from "../common/UserDropdown";
import CustomerDropdown from "../common/CustomerDropdown";
import EventTypeDropdown from "../common/EventTypeDropdown";

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
            filters: [],
            calendar_type: 'month'
        }

        this.loadPrevMonth = this.loadPrevMonth.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.loadNextMonth = this.loadNextMonth.bind(this)
        this.setEvents = this.setEvents.bind(this)
        this.getEvents = this.getEvents.bind(this)
        this.filterEvents = this.filterEvents.bind(this)
        this.eventRender = this.eventRender.bind(this)
    }

    componentDidMount() {
        this.getEvents()
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

    filterEvents(e) {

        const column = event.target.id
        const value = event.target.value
        const project_id = this.props.project_id ? this.props.project_id : 0

        if (value === 'all') {
            const updatedRowState = this.state.filters.filter(filter => filter.column !== column)
            this.setState({filters: updatedRowState})
            return true
        }

        this.setState(prevState => ({
            filters: {
                ...prevState.filters,
                [column]: value,
            },
        }));

        return true
    }

    handleSubmit(event) {
        event.preventDefault()

        axios.post('/api/events/filterEvents',
            this.state.filters)
            .then((response) => {
                this.setState({events: response.data})
            })
            .catch((error) => {
                alert(error)
            })
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

    renderErrorFor () {

    }

    resetFilters() {
        this.props.reset()
    }

    getFilters() {
        return (
            <Form inline className="pull-right" onSubmit={this.handleSubmit}>

                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <CreateEvent
                        action={this.setEvents}
                        events={this.state.events}
                        modal={true}
                    />
                </FormGroup>

              <TaskDropdown
                  name="event_task.task_id"
                  renderErrorFor={this.renderErrorFor}
                  handleInputChanges={this.filterEvents}
              />
              <UserDropdown
                  name="event_user.user_id"
                  renderErrorFor={this.renderErrorFor}
                  handleInputChanges={this.filterEvents}
              />
              <CustomerDropdown
                  renderErrorFor={this.renderErrorFor}
                  handleInputChanges={this.filterEvents}
              />
              <EventTypeDropdown
                  renderErrorFor={this.renderErrorFor}
                  handleInputChanges={this.filterEvents}
                  customers={this.props.customers}
              />

                <button className="mr-2 ml-2 btn btn-success">Submit</button>
                <button onClick={this.resetFilters} className="btn btn-primary">Reset</button>
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

                key={event.id}
            />
        )
    }

    setCalendarType (event) {
        const type = event.target.getAttribute('data-type')
        this.setState({ calendar_type: type })
    }

    render () {
        const filters = this.getFilters()
        const {events} = this.state

        const calendar = this.state.calendar_type === 'month' ?
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
                calendar_type={this.state.calendar_type}
                events={events}
                emptyRender={this.emptyRender}
                eventRender={this.eventRender}
                past={true}
            />

        return (
            <div>
                <Card>
                    <CardHeader>
                        <h2>Calendar</h2> <a data-type="week" onClick={this.setCalendarType.bind(this)}> Week </a> | <a data-type="month" onClick={this.setCalendarType.bind(this)}> Month </a>
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
