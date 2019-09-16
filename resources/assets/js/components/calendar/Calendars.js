import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Calendar from './Calendar';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 900px;
  margin: 1rem auto;
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  background: transparent;
  border: none;
  &:hover {
    color: #777;
  }
`;

class Calendars extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         year: new Date().getFullYear(),
         month: new Date().getMonth() + 1,
         events: []
      };

       this.loadPrevMonth = this.loadPrevMonth.bind(this);
       this.loadNextMonth = this.loadNextMonth.bind(this);
      this.setEvents = this.setEvents.bind(this);
   }

   setEvents(events) {
      console.log(events)
      this.setState({events: events})
   }

   setMonth(month) {
      this.setState({month: month})
   }

   getEvents() {
      const newEvents = [];
      for (let i = 0; i < 5; i++) {
         const beginDay = Math.floor(Math.random() * 28),
             endDay = Math.min(beginDay + Math.floor(Math.random() * 8), 28);
         newEvents.push({
            id: i + 1,
            title: `Event ${i + 1}`,
            beginDate: new Date(this.state.year, this.state.month - 1, beginDay),
            endDate: new Date(this.state.year, this.state.month - 1, endDay),
         });
      }

      this.setEvents(newEvents);
   }

   /**
    *
    * @param year
    */
   setYear(year) {
      this.setState({year: year})
   }

   loadPrevMonth() {
      let prevMonth = this.state.month - 1;
      if (prevMonth < 1) {
         this.setYear(this.state.year - 1);
         prevMonth = 12;
      }
      this.setMonth(prevMonth);
      this.setEvents([])
   };

   loadNextMonth() {
      let nextMonth = this.state.month + 1;
      if (nextMonth > 12) {
         this.setYear(this.state.year + 1);
         nextMonth = 1;
      }
      this.setMonth(nextMonth);
      this.setEvents([])
   };

   render() {

      if(!this.state.events.length) {
         this.getEvents()
      }

      return (
          <Container>
             <Controls>
                <Button onClick={this.loadPrevMonth}>&laquo; Prev Month</Button>
                <Button onClick={this.loadNextMonth}>Next Month &raquo;</Button>
             </Controls>
             <Calendar year={this.state.year} month={this.state.month} events={this.state.events} />
          </Container>
      )
   }
}

export default Calendars;