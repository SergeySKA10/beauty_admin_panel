import { Calendar as LibCalendar } from 'react-calendar';
import { useContext } from 'react';
import { AppointmentContext } from '../../context/appointments/AppointmentsContext';
import 'react-calendar/dist/Calendar.css';
import "./calendar.scss";

function Calendar() {
	// получаем state из контекста 
	const { calendarDate, setDateAndFilter } = useContext(AppointmentContext);
	
	return <div className="calendar">
		<LibCalendar 
			onChange={(value) => {
				setDateAndFilter(value);
			}} 
			value={calendarDate} selectRange/>
	</div>;
}

export default Calendar;
