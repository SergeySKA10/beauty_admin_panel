import React, { createContext, useReducer, useEffect, useMemo } from "react"
import reducer, { IAppointmentState } from "./reducer";
import { ActionsTypes } from "./actions";
import { Value } from "react-calendar/dist/cjs/shared/types";
import useAppointmentService from "../../services/AppointmentService";

// изначальный state
const initialState: IAppointmentState = {
    appointmentLoadingStatus: 'idle',
	allAppointments: [],
	activeAppointments: [],
    calendarDate: [null, null]
}

// создадим интерфейс для props для компонента
interface ProviderProps {
    children: React.ReactNode
}

// интерфес для контекста
interface AppointmentContextValue extends IAppointmentState {
    getAppointments: () => void;
    getActiveAppointments: () => void;
    setDateAndFilter: (newDate: Value) => void
}

// создадим context с изначальными значениями которые далее заменяться
// изначальное значение не сильно важно, так как в последующем замениться из value
// которые попадет в provider, но не должно быть расхождение по типам
export const AppointmentContext = createContext<AppointmentContextValue>({
    appointmentLoadingStatus: initialState.appointmentLoadingStatus,
    allAppointments: initialState.allAppointments,
    activeAppointments: initialState.activeAppointments,
    calendarDate: initialState.calendarDate,
    // метод по получению данных
    getAppointments: () => {},
    getActiveAppointments: () => {},
    // метод фильтрации данных в зависимости от выбранной даты
    setDateAndFilter: (newDate: Value) => {}
});

// создадим компонент провайдер
const AppointmentContextProvider = ({children}: ProviderProps) => {
    // используем useReducer, создаем state в компоненете который будет использоваться внутри всех children 
    const [state, dispatch] = useReducer(reducer, initialState); 

    // вытаскиваем переменные с useAppointmentService
    const { loadingStatus, getAllAppointments, getAllActiveAppointments } = useAppointmentService();

    // context который будет передаваться в props children 
    const value: AppointmentContextValue = {
        appointmentLoadingStatus: loadingStatus,
        allAppointments: state.allAppointments,
        activeAppointments: state.activeAppointments,
        calendarDate: state.calendarDate,
        // метод по получению данных
        getAppointments: () => {
            // делаем запрос и обновляем state
            getAllAppointments().then(data => {
                // фильтруем данные в зависимости от полученной даты
                const filterDate = data.filter(el => {
                    if (Array.isArray(state.calendarDate) && state.calendarDate[0] && state.calendarDate[1]) {
                        if (new Date(el.date).getTime() >= new Date(state.calendarDate[0]).getTime()
                        && new Date(el.date).getTime() <= new Date(state.calendarDate[1]).getTime()) {
                            return el;
                        }
                    } else {
                        return el;
                    }
                })

                dispatch({type: ActionsTypes.SET_ALL_APPOINTMENTS, payload: filterDate}) // обновляем state
            })
            .catch(() => {
                dispatch({type: ActionsTypes.ERROR_FETCHING_APPOINTMENTS})
            })  
        },
        getActiveAppointments: () => {
            // делаем запрос по получению только активных записей
            getAllActiveAppointments().then(data => {
                // фильтруем данные в зависимости от полученной даты
                const filterDate = data.filter(el => {
                    if (Array.isArray(state.calendarDate) && state.calendarDate[0] && state.calendarDate[1]) {
                        if (new Date(el.date).getTime() >= new Date(state.calendarDate[0]).getTime()
                        && new Date(el.date).getTime() <= new Date(state.calendarDate[1]).getTime()) {
                            return el;
                        }
                    } else {
                        return el;
                    }
                })

                dispatch({type: ActionsTypes.SET_ACTIVE_APPOINTMENTS, payload: filterDate}) // обновляем state 
            })
            .catch(() => {
                dispatch({type: ActionsTypes.ERROR_FETCHING_APPOINTMENTS})
            })
        },
        setDateAndFilter: (newDate: Value) => {
            dispatch({type: ActionsTypes.SET_CALENDAR_DATE, payload: newDate});
        }
    }

    return (
        <AppointmentContext.Provider value={value}>
            {children}
        </AppointmentContext.Provider>
    )
}

export default AppointmentContextProvider;
