import { useState, useEffect, memo } from 'react';
import dayjs from 'dayjs';
import { IAppointment } from '../../shared/interfaces/appointment.interface';
import { Optional } from 'utility-types';

import "./appointmentItem.scss";

type AppointmentProps = Optional<IAppointment, 'canceled'> & {
	modalOpen: (state: number) => void;
}

// создаем мемоизированный компонент, чтобы перерендер происходил тогда, когда меняeтся props

const AppointmentItem = memo(({id, date, name, service, phone, canceled, modalOpen}: AppointmentProps) => {
	// с помощью библиотеки форматируем дату
	const formattedDate = dayjs(date).format("DD/MM/YYYY HH:mm");

	// создаем state для отображения остатка времени (таймера)
	const [timeLeft, changeTimeLeft] = useState<string | null>(null);

	// функция вычисления времени записи
	const getTimeStatus = (): string[] => {
		// вычисление часов и минут
		let h: string = dayjs(date).diff(undefined, 'h') >= 10 ? `${dayjs(date).diff(undefined, 'h')}` : `0${dayjs(date).diff(undefined, 'h')}`;
		let m: string = (dayjs(date).diff(undefined, 'm') % 60) >= 10 ? `${dayjs(date).diff(undefined, 'm') % 60}` : `0${dayjs(date).diff(undefined, 'm') % 60}`;

		return [h, m];
	}

	// формирование таймера помнтуного отсчета до записи
	useEffect(() => {
		// получим часы и минуты
		const [h, m] = getTimeStatus();

		// установим изначальное время
		changeTimeLeft(`${h}:${m}`);
		const timer = setInterval(() => {
			const [h, m] = getTimeStatus();
			changeTimeLeft(`${h}:${m}`);
		}, 60000)
		return () => clearInterval(timer)
	}, [date])

	return (
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
	);
})

export default AppointmentItem;

