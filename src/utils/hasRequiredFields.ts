// функция по проверке наличия свойств у ответа с сервера
export default function hasRequiredFields(
    obj: Record<string, any>, // ответ с сервера
    requiredFields: string[] // поля ввиде массива
): boolean {
    return requiredFields.every((field) => {
        return Object.hasOwn(obj, field)
    })
}