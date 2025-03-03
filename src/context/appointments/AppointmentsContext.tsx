import React, { createContext, useReducer } from "react"
import reducer, { IAppointmentState } from "./reducer";
import { ActionsTypes } from "./actions";
import useAppointmentService from "../../services/AppointmentService";

// изначальный state
const initialState: IAppointmentState = {
    appointmentLoadingStatus: 'idle',
	allAppointments: [],
	activeAppointments: []
}

// создадим интерфейс для props для компонента
interface ProviderProps {
    children: React.ReactNode
}

// интерфес для контекста
interface AppointmentContextValue extends IAppointmentState {
    getAppointments: () => void;
    getActiveAppointments: () => void;
}

// создадим context с изначальными значениями которые далее заменяться
// изначальное значение не сильно важно, так как в последующем замениться из value
// которые попадет в provider, но не должно быть расхождение по типам
export const AppointmentContext = createContext<AppointmentContextValue>({
    appointmentLoadingStatus: initialState.appointmentLoadingStatus,
    allAppointments: initialState.allAppointments,
    activeAppointments: initialState.activeAppointments,
    // метод по получению данных
    getAppointments: () => {},
    getActiveAppointments: () => {}
});

// создадим компонент провайдер
const AppointmentContextProvider = ({children}: ProviderProps) => {
    // используем useReducer, создаем state в компоненете который будет использоваться внутри всех children 
    const [state, dispatch] = useReducer(reducer, initialState); 

    // вытаскиваем переменные с useAppointmentService
    const { loadingStatus, getAllAppointments, getAllActiveAppointments} = useAppointmentService();

    // context который будет передаваться в props children 
    const value: AppointmentContextValue = {
        appointmentLoadingStatus: loadingStatus,
        allAppointments: state.allAppointments,
        activeAppointments: state.activeAppointments,
        // метод по получению данных
        getAppointments: () => {
            // делаем запрос и обновляем state
            getAllAppointments().then(data => {
                dispatch({type: ActionsTypes.SET_ALL_APPOINTMENTS, payload: data}) // обновляем state
            })  
        },
        getActiveAppointments: () => {
            // делаем запрос по получению только активных записей
            getAllActiveAppointments().then(data => {
                dispatch({type: ActionsTypes.SET_ACTIVE_APPOINTMENTS, payload: data}) // оновляем state 
            })
        }
    }

    return (
        <AppointmentContext.Provider value={value}>
            {children}
        </AppointmentContext.Provider>
    )
}

export default AppointmentContextProvider;
