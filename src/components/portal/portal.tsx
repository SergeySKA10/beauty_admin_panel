import { useState, ReactNode, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

// interface для props
interface PortalProps {
    children: ReactNode; 
    wrapperId?: string
}

// фунция по созданию элемента на странице
function createWrapperAndAppendToBody(wrapperId: string) {
    const wrapperElem = document.createElement('div');
    wrapperElem.setAttribute('id', wrapperId);
    // wrapperElem.setAttribute('class', 'modal');
    document.body.append(wrapperElem);

    return wrapperElem;
}

function Portal({children, wrapperId = 'portal-wrapper'}: PortalProps) {
    // создадим состояние для wrapper 
    const [wrapperElement, setWrapperElement] = useState<HTMLElement | null>(null);

    // реализация функционала по получению wrapper или его созданию, если такой отсутствует 
    // пользуемся хуком useLayoutEffect - изменяет state синхронно до перерисовки браузером структуры
    useLayoutEffect(() => {
        // получаем элемент со страницы
        let elem = document.getElementById(wrapperId);
        // флаг - если мы будем создавать элемент, то в последующем удаляем его
        let created = false;

        if (!elem) {
            created = true; // создаем элемент
            elem = createWrapperAndAppendToBody(wrapperId);
        }
        // передвем elem в state
        setWrapperElement(elem);

        return () => {
            if (created) {
                elem?.remove();
            }
        }

    }, [wrapperId])

    // исправление ошибки при первом рендере
    if (wrapperElement === null) return null;

    // возвращаем портал
    return createPortal(children, wrapperElement);
}

export default Portal;