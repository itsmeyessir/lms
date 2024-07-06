import { useState, useEffect } from 'react';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [eventDate, setEventDate] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  useEffect(() => {
    // Fetch events from the API
    fetch('/api/calendar')
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  const addEvent = () => {
    if (eventDate && eventTitle) {
      const newEvent = {
        id: events.length + 1,
        date: eventDate,
        title: eventTitle,
        description: eventDescription,
      };
      setEvents([...events, newEvent]);
      setEventDate('');
      setEventTitle('');
      setEventDescription('');
      // Send the new event to the API
      fetch('/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });
    }
  };

  const deleteEvent = (eventId) => {
    const updatedEvents = events.filter((event) => event.id !== eventId);
    setEvents(updatedEvents);
    // Send the delete request to the API
    fetch(`/api/calendar/${eventId}`, {
      method: 'DELETE',
    });
  };

  const displayReminders = () => {
    return events.map((event) => (
      <li key={event.id} data-event-id={event.id}>
        <strong>{event.title}</strong> - {event.description} on {new Date(event.date).toLocaleDateString()}
        <button className="delete-event" onClick={() => deleteEvent(event.id)}>Delete</button>
      </li>
    ));
  };

  const next = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    setCurrentYear((prev) => (currentMonth === 11 ? prev + 1 : prev));
  };

  const previous = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    setCurrentYear((prev) => (currentMonth === 0 ? prev - 1 : prev));
  };

  const jump = (event) => {
    const { value, name } = event.target;
    if (name === 'month') {
      setCurrentMonth(parseInt(value));
    } else {
      setCurrentYear(parseInt(value));
    }
  };

  const daysInMonth = (iMonth, iYear) => {
    return 32 - new Date(iYear, iMonth, 32).getDate();
  };

  const getEventsOnDate = (date, month, year) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date &&
        eventDate.getMonth() === month &&
        eventDate.getFullYear() === year
      );
    });
  };

  const hasEventOnDate = (date, month, year) => {
    return getEventsOnDate(date, month, year).length > 0;
  };

  const createEventTooltip = (date, month, year) => {
    const eventsOnDate = getEventsOnDate(date, month, year);
    return (
      <div className="event-tooltip">
        {eventsOnDate.map((event) => (
          <p key={event.id}>
            <strong>{event.title}</strong> - {event.description} on {new Date(event.date).toLocaleDateString()}
          </p>
        ))}
      </div>
    );
  };

  const showCalendar = (month, year) => {
    let firstDay = new Date(year, month, 1).getDay();
    let date = 1;
    const calendarBody = [];
    for (let i = 0; i < 6; i++) {
      const row = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          row.push(<td key={j}></td>);
        } else if (date > daysInMonth(month, year)) {
          break;
        } else {
          const eventClasses = ['date-picker'];
          if (
            date === new Date().getDate() &&
            year === new Date().getFullYear() &&
            month === new Date().getMonth()
          ) {
            eventClasses.push('selected');
          }
          if (hasEventOnDate(date, month, year)) {
            eventClasses.push('event-marker');
          }
          row.push(
            <td key={j} className={eventClasses.join(' ')} data-date={date} data-month={month + 1} data-year={year}>
              <span>{date}</span>
              {hasEventOnDate(date, month, year) && createEventTooltip(date, month, year)}
            </td>
          );
          date++;
        }
      }
      calendarBody.push(<tr key={i}>{row}</tr>);
    }
    return calendarBody;
  };

  return (
    <div className="wrapper">
      <div className="container-calendar">
        <div id="left">
          <h1>Calendar</h1>
          <div id="event-section">
            <h3>Add Event</h3>
            <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
            <input type="text" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} placeholder="Event Title" />
            <input type="text" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} placeholder="Event Description" />
            <button id="addEvent" onClick={addEvent}>Add</button>
          </div>
          <div id="reminder-section">
            <h3>Reminders</h3>
            <ul id="reminderList">{displayReminders()}</ul>
          </div>
        </div>
        <div id="right">
          <h3 id="monthAndYear">{`${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][currentMonth]} ${currentYear}`}</h3>
          <div className="button-container-calendar">
            <button id="previous" onClick={previous}>‹</button>
            <button id="next" onClick={next}>›</button>
          </div>
          <table className="table-calendar" id="calendar" data-lang="en">
            <thead id="thead-month">
              <tr>{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => <th key={index} data-days={day}>{day}</th>)}</tr>
            </thead>
            <tbody id="calendar-body">{showCalendar(currentMonth, currentYear)}</tbody>
          </table>
          <div className="footer-container-calendar">
            <label htmlFor="month">Jump To: </label>
            <select id="month" name="month" value={currentMonth} onChange={jump}>
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
            <select id="year" name="year" value={currentYear} onChange={jump}>
              {Array.from({ length: 81 }, (_, i) => i + 1970).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
