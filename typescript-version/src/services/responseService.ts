


export interface ResponseData<T> {
    isDone : boolean;
    data: T;
}

export interface ResponseError {
    isDone : boolean;
    error: string | Error;

}


export default class  ResponseService {

    static createResponseError (error: Error) : ResponseError {
        return {
            isDone: false,
            error : error.message || error
        }

    }

    static createResponseData<T>(data: T) : ResponseData<T>{
        return {
            isDone: true,
            data
        }
    }
}
