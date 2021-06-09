import { Action } from '@ngrx/store';
import * as fromMensaje from './mensaje.action';

export interface appState{
    texto: string
}

export const initialState = {
    texto: 'Texto de prueba'
}

export function miReducer(state: appState = initialState, action: fromMensaje.MensajeActions){
    console.log(action)
    switch(action.type){
        case fromMensaje.SPANISH:
            return {
                ...state,
                texto: action.payload
            }
        case fromMensaje.ENGLISH:
            return {
                ...state,
                texto: action.payload
            }    
        default:
            return status;
    }
}