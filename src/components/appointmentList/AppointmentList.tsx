import {useCallback, useContext, useEffect, useState} from 'react';
import AppointmentItem from "../appointmentItem.tsx/AppointmentItem";
import CancelModal from '../modal/CancelModal';
import { AppointmentContext } from "../../context/appointments/AppointmentsContext";
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';
import { TransitionGroup } from 'react-transition-group';

function AppointmentList() {
	// достаем данные из контекста
	const {activeAppointments, getActiveAppointments, appointmentLoadingStatus, calendarDate} = useContext(AppointmentContext);

	// создаем state для модального окна
	const [isOpen, setIsOpen] = useState(false); 
	// создаем state для получения id выбранной записи
	const [selectedId, selectId] = useState(0);

	// запрос данных
	useEffect(() => {
		getActiveAppointments(); // делаем запрос
	}, [calendarDate]);

	// создаем функцию открытия модального окна и кешируем ее работу, чтобы недопустить лишнего рендера компонентов
	const handleOpenModal = useCallback((id: number): void => {
		setIsOpen(true);
		selectId(id);
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
		<TransitionGroup className='schedule__list'>
			{activeAppointments.map(el => {
				return <AppointmentItem 
					{...el} 
					modalOpen={handleOpenModal}
					getAppointments={getActiveAppointments} 
					key={el.id}/>	
			})}
			<CancelModal handleClose={setIsOpen} selectedId={selectedId} isOpen={isOpen}/>
		</TransitionGroup>
	)
}

export default AppointmentList;
