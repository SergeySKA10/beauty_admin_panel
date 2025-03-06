import Portal from "../portal/portal";
import { useRef, useEffect, useState, useContext } from "react";
import useAppointmentService from "../../services/AppointmentService";
import { AppointmentContext } from "../../context/appointments/AppointmentsContext";
import { CSSTransition } from "react-transition-group";
import "./modal.scss";

interface IMpdalProps {
	handleClose: (state: boolean) => void;
	selectedId: number;
	isOpen: boolean;
}

function CancelModal({handleClose, selectedId, isOpen}: IMpdalProps) {
	// получаем функции запросов из контекста
	const { getActiveAppointments } = useContext(AppointmentContext);

	// достаем запрос по изменению данных в бд (в обоход context так как работает толко с этим компонентом)
	const {patchActiveAppointment} = useAppointmentService();

	const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
	const [cancelStatus, setCancelStatus] = useState<boolean | null>(null);

	// // функция по отмене записи
	const handleCancelAppointment = (id: number) => {
		setBtnDisabled(true);
		patchActiveAppointment(id)
			.then(() => {
				setCancelStatus(true);
			})
			.catch(() => {
				setCancelStatus(false);
				setBtnDisabled(false);
			})
	}

	// функция закрытия модального окна
	const closeModal = () => {
		handleClose(false);
		// проверка на отмену записи пользователем
		if (cancelStatus) {
			getActiveAppointments();
		}
	}

	// создадим реф - типизируем его так как он будет работать с div
	const nodeRef = useRef<HTMLDivElement>(null);

	// функция закрытия модального окна при нажатии на клавишу Escape
	function keyboardCloseModal(e: KeyboardEvent): void {
		if (e.code === 'Escape') {
			closeModal();
		}
	}

	useEffect(() => {
		window.addEventListener('keydown', keyboardCloseModal);

		return () => {
			window.removeEventListener('keydown', keyboardCloseModal);
		}
	}, [cancelStatus]);

	return (
		<Portal>
			<CSSTransition 
				in={isOpen} 
				timeout={{enter: 500, exit: 500}} 
				unmountOnExit 
				classNames='modal'
				nodeRef={nodeRef}
			>
				<div className="modal" ref={nodeRef}>
					<div className="modal__body">
						<span className="modal__title">
							Are you sure you want to delete the appointment?
						</span>
						<div className="modal__btns">
							<button className="modal__ok" disabled={btnDisabled} onClick={() => {
								handleCancelAppointment(selectedId);
							}}>Ok</button>
							<button className="modal__close" onClick={closeModal}>Close</button>
						</div>
						<div className="modal__status">{cancelStatus ? 'Success' : null}</div>
					</div>
				</div>
			</CSSTransition>
		</Portal>
	);
}

export default CancelModal;
