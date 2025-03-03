import {useContext, useEffect, useState, ReactNode } from 'react';
import AppointmentItem from "../appointmentItem.tsx/AppointmentItem";
import { AppointmentContext } from "../../context/appointments/AppointmentsContext";
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';

function AppointmentList() {
	// достаем данные из контекста
	const {activeAppointments, getActiveAppointments, appointmentLoadingStatus} = useContext(AppointmentContext);
	// контент для рендеринга
	const [content, setContent] = useState<ReactNode>(null);

	// запрос данных
	useEffect(() => {
		getActiveAppointments(); // делаем запрос
	}, []);

	// формирование контента
	useEffect(() => {
		switch(appointmentLoadingStatus) {
			case 'idle':
				setContent(content => activeAppointments.map(el => {
					return <AppointmentItem {...el} key={el.id}/>
				}));
				break;
			case 'loading':
				setContent(content => <Spinner/>);
				break;
			case 'error':
				setContent(content => {
					return (
						<>
							<Error/>
							<button 
								className='schedule__reload'
								onClick={getActiveAppointments}>
									Try to reload
							</button>
							
						</>
					)
				});
				break;
			default:
				setContent(content => null);
		}
	}, [appointmentLoadingStatus]);

	return (
		<>
			{content}
		</>
	);
}

export default AppointmentList;
