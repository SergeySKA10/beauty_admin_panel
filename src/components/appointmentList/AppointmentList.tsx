import {useContext, useEffect, useState} from 'react';
import AppointmentItem from "../appointmentItem.tsx/AppointmentItem";
import CancelModal from '../modal/CancelModal';
import { AppointmentContext } from "../../context/appointments/AppointmentsContext";
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';

function AppointmentList() {
	// достаем данные из контекста
	const {activeAppointments, getActiveAppointments, appointmentLoadingStatus} = useContext(AppointmentContext);

	// создаем state для модального окна
	const [isOpen, setIsOpen] = useState(false); 
	// создаем state для получения id выбранной записи
	const [selectedId, selectId] = useState(0);

	// запрос данных
	useEffect(() => {
		getActiveAppointments(); // делаем запрос
	}, []);

	// формирование контента
	if (appointmentLoadingStatus === 'loading') {
		return <Spinner/>
	} else if (appointmentLoadingStatus === 'error') {
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
	}

	return (
		<>
			{activeAppointments.map(el => {
				return <AppointmentItem 
					{...el} 
					modalOpen={setIsOpen} 
					key={el.id}
					selectId={() => selectId(el.id)}/>	
			})}
			{isOpen ? <CancelModal handleClose={setIsOpen} selectedId={selectedId}/> : null}
		</>
	)
}

export default AppointmentList;
