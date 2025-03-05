import { AppointmentAction, ActionsTypes } from "./actions";
import { IAppointment, ActiveAppointment } from "../../shared/interfaces/appointment.interface";
import { LoadingStatusOptions } from "../../shared/interfaces/options";


// интерфейс для initialState
export interface IAppointmentState {
    appointmentLoadingStatus: LoadingStatusOptions;
	allAppointments: IAppointment[] | [],
	activeAppointments: ActiveAppointment[] | []
}

export default function reducer(
    state: IAppointmentState, 
    action: AppointmentAction
): IAppointmentState {
    switch(action.type) {
        case ActionsTypes.SET_ALL_APPOINTMENTS:
            return {
                ...state, 
                allAppointments: action.payload, 
                appointmentLoadingStatus: 'idle'}
        case ActionsTypes.SET_ACTIVE_APPOINTMENTS:
            return {...state, 
                activeAppointments: action.payload, 
                appointmentLoadingStatus: 'idle'}
        case ActionsTypes.FETCHING_APPOINTMENTS:
            return {...state, appointmentLoadingStatus: 'loading'}
        case ActionsTypes.ERROR_FETCHING_APPOINTMENTS:
            return {...state, appointmentLoadingStatus: 'error'}
        case ActionsTypes.PATCH_ACTIVE_APPOINTMENTS:
            return {
                ...state,
                allAppointments: state.allAppointments.map(el => {
                    if (el.id === action.payload) {
                        el.canceled = true;
                    }
                    return el;
                }),
                activeAppointments: state.activeAppointments.filter(el => el.id !== action.payload)
            }
        default:
            return state;
    }
}