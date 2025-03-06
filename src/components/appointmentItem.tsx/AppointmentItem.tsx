import { useState, useEffect, memo } from 'react';
import dayjs from 'dayjs';
import { IAppointment } from '../../shared/interfaces/appointment.interface';
import { Optional } from 'utility-types';
import { CSSTransition } from 'react-transition-group';

import "./appointmentItem.scss";

type AppointmentProps = Optional<IAppointment, 'canceled'> & {
	modalOpen: (state: number) => void;
	getActiveAppointments: () => void;
}

// создаем мемоизированный компонент, чтобы перерендер происходил тогда, когда меняeтся props

const AppointmentItem = memo(({id, date, name, service, phone, canceled, modalOpen, getActiveAppointments}: AppointmentProps) => {
	// с помощью библиотеки форматируем дату
	const formattedDate = dayjs(date).format("DD/MM/YYYY HH:mm");

	// создаем state для отображения остатка времени (таймера)
	const [timeLeft, changeTimeLeft] = useState<string | null>(null);

	// функция вычисления времени записи
	const getTimeStatus = (): number[] => {
		// вычисление часов и минут
		const h: number = dayjs(date).diff(undefined, 'h');
		const m: number = (dayjs(date).diff(undefined, 'm') % 60);

		return [h, m];
	}

	// проверка для значений таймера и добавление 0
	const validateTime = (n: number): string => {
		if (n < 10) {
			return `0${n}`;
		} else {
			return `${n}`;
		}

	}

	// формирование таймера помнтуного отсчета до записи
	useEffect(() => {
		// получим часы и минуты
		const [h, m] = getTimeStatus();

		// установим изначальное время
		changeTimeLeft(`${validateTime(h)}:${validateTime(m)}`);

		// созаем таймер именения времени
		const timer = setInterval(() => {
			const [h, m] = getTimeStatus();

			// условия обновления записей при нулевом времени
			if (m <= 0) {
				if (getActiveAppointments) {
					getActiveAppointments();
				}
				clearInterval(timer);
			} else {
				changeTimeLeft(`${h}:${m}`);
			}
		}, 60000)
		return () => clearInterval(timer)
	}, [date])

	return (
		<CSSTransition key={id} timeout={1000} classNames='appointment'>
			<div className="appointment">
				<div className="appointment__info">
					<span className="appointment__date">{formattedDate}</span>
					<span className="appointment__name">Name: {name}</span>
					<span className="appointment__service">Service: {service}</span>
					<span className="appointment__phone">Phone: {phone}</span>
				</div>
				{!canceled ? (
					<>
						<div className="appointment__time">
							<span>Time left:</span>
							<span className="appointment__timer">{timeLeft}</span>
						</div>
						<button 
							className="appointment__cancel" 
							onClick={() => modalOpen(id)}
						>Cancel</button>
					</>
				) : null}
				{canceled ? <div className="appointment__canceled">Canceled</div> : null}
			</div>
		</CSSTransition>
	);
})

export default AppointmentItem;

