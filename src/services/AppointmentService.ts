import { useHttp } from "../hooks/useHttp.hook";
import hasRequiredFields from "../utils/hasRequiredFields";
import dayjs from "dayjs";

// импортируем интерфейс
import { IAppointment, ActiveAppointment } from '../shared/interfaces/appointment.interface';

const requiredFields = ['id', 'date', 'name', 'service', 'phone', 'canceled'];

const useAppointmentService = () => {
    const {loadingStatus, request} = useHttp();

    const _apiBase = 'http://localhost:3001/appointments';

    const getAllAppointments = async(): Promise<IAppointment[]> => {
        const res = await request({url: _apiBase});

        if (res.every((item: IAppointment) => hasRequiredFields(item, requiredFields))) {
            return res;
        } else {
            throw new Error("Data doesn't have all the fields");
        }
    };

    // функционла по фильтрации и трансформированию данных - убираем свойство canceled 
    const getAllActiveAppointments = async(): Promise<ActiveAppointment[]> => {
        const appointments = await getAllAppointments();
        const transformed: ActiveAppointment[] = appointments
                    .filter((item) => {
                        return item.canceled === false && dayjs(item.date).diff(undefined, 'minute') > 0; // условия фильтрации -> если по дате запись еще активна (разница между датой посещения и текущем времени в минутах > 0)
                    })
                    .map((item) => {
                        return {
                            id: item.id,
                            name: item.name,
                            date: item.date,
                            service: item.service,
                            phone: item.phone
                        }
                    });

        return transformed;
    }

    return {
        loadingStatus,
        getAllAppointments,
        getAllActiveAppointments
    }
}

export default useAppointmentService;
