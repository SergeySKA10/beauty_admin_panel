import { useHttp } from "../hooks/useHttp.hook";
import hasRequiredFields from "../utils/hasRequiredFields";

// импортируем интерфейс
import { IAppointment } from '../shared/interfaces/appointment.interface';
import { ActiveAppointment } from "../shared/interfaces/appointment.interface";

const requiredFields = ['id', 'date', 'name', 'service', 'phone', 'canceled']

const useAppointmentService = () => {
    const {loadingStatus, request} = useHttp();

    const _apiBase = 'http';

    const getAllAppointments = async(): Promise<IAppointment[]> => {
        const res = await request({url: _apiBase});

        if (res.every((item: IAppointment) => hasRequiredFields(item, requiredFields))) {
            return res;
        } else {
            throw new Error("Data doesn't have all the fields");
        }
    };

    // const getAllActiveAppointments = async(): Promise<ActiveAppointment[]> => {
    //     const appointments = await getAllAppointments();
    //     return appointments.filter((item) => item.canceled === false)
    // }

    // функционла по трансформированию данных - убираем свойство canceled 
    const getAllActiveAppointments = async(): Promise<ActiveAppointment[]> => {
        const appointments = await getAllAppointments();
        const transformData: ActiveAppointment[] = appointments.map((item) => {
            return {
                id: item.id,
                name: item.name,
                date: item.date,
                service: item.service,
                phone: item.phone
            }
        });

        return transformData;
    }

    return {
        loadingStatus,
        getAllAppointments,
        getAllActiveAppointments
    }
}
