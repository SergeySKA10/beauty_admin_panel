import { useState, useCallback } from "react";
import { LoadingStatusOptions, HTTPRequestMethods } from "../shared/interfaces/options";

// интерфейс для заголовков запросов
interface HTTPHeaders {
    [key: string]: string
}

// интерфейс для функции request 
interface RequestConfig {
    url: string;
    method?: HTTPRequestMethods;
    body?: string | null; // string - так как работаем с json форматом
    headers?: HTTPHeaders
}



export const useHttp = () => {
    const [loadingStatus, setLoadingStatus] = useState<LoadingStatusOptions>('idle');
    // const [error, setError] = useState<string | null>(null);
    
    const request = useCallback(
        async ({
            url,
            method = 'GET',
            body = null,
            headers = {"Content-Type": "application/json"}
        }: RequestConfig) => {
            setLoadingStatus('loading');

            try {
                const response = await fetch(url, {method, body, headers}); // у response автоматически сформируется интерфейс Response

                if (!response.ok) {
                    throw new Error(`Could not fetch ${url}, status: ${response.status}`); // также автоматически сформируются типы у status и ok
                }

                const data = await response.json(); // тип any 

                setLoadingStatus('idle');
                return data;
            } catch (e) {
                setLoadingStatus('error');
                throw e;
            }
    }, []);

    return {
        loadingStatus,
        request
    }
}