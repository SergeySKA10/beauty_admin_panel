import { useHttp } from "../hooks/useHttp.hook";
import hasRequiredFields from "../utils/hasRequiredFields";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';

// импортируем интерфейс
import { IAppointment, ActiveAppointment } from '../shared/interfaces/appointment.interface';

// расширяем dayjs библиотеку 
dayjs.extend(customParseFormat);

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

    // функционал по внесению изменения данных в бд
    const patchActiveAppointment = async(id: number): Promise<any> => {
        return await request({
            url: `${_apiBase}/${id}`,
            method: "PATCH",
            body: JSON.stringify({
                canceled: true
            })
        });
    }

    const createNewAppointment = async(body: IAppointment): Promise<any> => {
        // создаем уникальный id 
        const id = new Date().getTime();
        body['id'] = id;
        body['date'] = dayjs(body.date, "DD/MM/YYYY HH:mm").format("YYYY-MM-DDTHH:mm");

        return await request({
            url: _apiBase,
            method: 'POST',
            body: JSON.stringify(body)
        })
    }

    return {
        loadingStatus,
        getAllAppointments,
        getAllActiveAppointments,
        patchActiveAppointment,
        createNewAppointment
    }
}

export default useAppointmentService;
