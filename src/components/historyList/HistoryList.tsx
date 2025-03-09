import { useContext, useEffect } from "react";
import { AppointmentContext } from "../../context/appointments/AppointmentsContext";
import AppointmentItem from "../appointmentItem.tsx/AppointmentItem";
import Spinner from "../spinner/Spinner";
import Error from "../error/Error";

function HistoryList() {
	const { getAppointments, allAppointments, appointmentLoadingStatus, calendarDate } = useContext(AppointmentContext);

	useEffect(() => {
		getAppointments();
	}, [calendarDate]);

	if (appointmentLoadingStatus === 'error') {
		return (
			<>
				<Error/>
				<button 
					className='schedule__reload'
					onClick={getAppointments}>
						Try to reload
				</button>
				
			</>
		)
	} else if (appointmentLoadingStatus === 'loading') {
		return <Spinner/>
	}

	return (
		<>
			{allAppointments.map(el => {
				return <AppointmentItem 
					key={el.id} 
					{...el}/>
			})}
		</>
	);
}

export default HistoryList;
