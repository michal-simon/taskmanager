/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Calendar from './Calendar'
import CreateEvent from './CreateEvent'
import axios from 'axios'

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
            events: []
        }
        this.loadPrevMonth = this.loadPrevMonth.bind(this)
        this.loadNextMonth = this.loadNextMonth.bind(this)
        this.setEvents = this.setEvents.bind(this)
        this.getEvents = this.getEvents.bind(this)
    }

    componentDidMount () {
        this.getEvents()
    }

    setEvents (events) {
        this.setState({ events: events })
    }

    setMonth (month) {
        this.setState({ month: month })
    }

    getEvents () {
        axios.get('/api/events')
            .then((r) => {
                this.setState({
                    events: r.data
                })
            })
            .catch((e) => {
                alert(e)
            })
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

    render () {
        return (
            <Container>
                <CreateEvent
                    action={this.setEvents}
                    events={this.state.events}
                />
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
        )
    }
}

export default Calendars

