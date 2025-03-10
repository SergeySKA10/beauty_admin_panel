import useAppointmentService from "../../services/AppointmentService";
import { useState, FormEvent, ChangeEvent, useContext } from "react";
import { IAppointment } from '../../shared/interfaces/appointment.interface';
import { AppointmentContext } from "../../context/appointments/AppointmentsContext";

import "./caform.scss";

function CAForm() {
	const { createNewAppointment } = useAppointmentService();
	const { getActiveAppointments } = useContext(AppointmentContext);

	// изначальный state для формы
	const [formData, setFormData] = useState<IAppointment>({
		id: 1,
		name: '',
		service: '',
		phone: '',
		date: '',
		canceled: false
	});

	// state для disabled
	const [creationStatus, setCreationStatus] = useState<boolean>(false);

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setCreationStatus(true);

		// замена даты в правильный формат внутри метода createNewAppointment
		createNewAppointment(formData)
			.then(() => {
				setCreationStatus(false);
				// сбрасываем форму до изначальных установок
				setFormData({
					id: 1,
					name: '',
					service: '',
					phone: '',
					date: '',
					canceled: false
				});
				getActiveAppointments();
			}).catch(() => {
				alert('error');
			})
	}

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;
		
		setFormData(formData => ({
			...formData,
			[name]: value
		}));

	}

	return (
		<form className="caform" onSubmit={handleSubmit}>
			<div className="caform__title">Create new appointment</div>
			<label htmlFor="name">
				Name<span>*</span>
			</label>
			<input
				type="text"
				name="name"
				id="name"
				placeholder="User name"
				required
				value={formData.name}
				onChange={handleChange}
			/>

			<label htmlFor="service">
				Service<span>*</span>
			</label>
			<input
				type="text"
				name="service"
				id="service"
				placeholder="Service name"
				required
				value={formData.service}
				onChange={handleChange}
			/>

			<label htmlFor="phone">
				Phone number<span>*</span>
			</label>
			<input
				type="tel"
				name="phone"
				id="phone"
				placeholder="+1 890 335 372"
				pattern="^\++[0-9]{1} [0-9]{3} [0-9]{3} [0-9]{3}"
				title="Format should be +1 804 944 567"
				required
				value={formData.phone}
				onChange={handleChange}
			/>

			<label htmlFor="date">
				Date<span>*</span>
			</label>
			<input
				type="text"
				name="date"
				id="date"
				placeholder="DD/MM/YYYY HH:mm"
				pattern="^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$"
				title="Format should be DD/MM/YYYY HH:mm"
				required
				value={formData.date}
				onChange={handleChange}
			/>
			<button disabled={creationStatus}>Create</button>
		</form>
	);
}

export default CAForm;
