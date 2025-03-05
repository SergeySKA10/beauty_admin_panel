import { IAppointment, ActiveAppointment } from "../../shared/interfaces/appointment.interface";

//  создадим enum
export enum ActionsTypes {
    SET_ACTIVE_APPOINTMENTS = 'SET_ACTIVE_APPOINTMENTS',
    SET_ALL_APPOINTMENTS = 'SET_ALL_APPOINTMENTS',
    PATCH_ACTIVE_APPOINTMENTS = 'PATCH_ACTIVE_APPOINTMENTS',
    FETCHING_APPOINTMENTS = 'FETCHING_APPOINTMENTS',
    ERROR_FETCHING_APPOINTMENTS = "ERROR_FETCHING_APPOINTMENTS",
}

// вместо объекта actions создадим отдельный тип действия
export type AppointmentAction = {
    type: ActionsTypes.SET_ACTIVE_APPOINTMENTS;
    payload: ActiveAppointment[]
} | {
    type: ActionsTypes.SET_ALL_APPOINTMENTS;
    payload: IAppointment[]
} | {
    type: ActionsTypes.FETCHING_APPOINTMENTS;
} | {
    type: ActionsTypes.ERROR_FETCHING_APPOINTMENTS;
} | {
    type: ActionsTypes.PATCH_ACTIVE_APPOINTMENTS;
    payload: number
}