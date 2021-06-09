import { Action } from "@ngrx/store";

export const SPANISH = '[Mensaje] Spanish';
export const ENGLISH = '[Mensaje] English';

export class SpanishMensaje implements Action{
    readonly type = SPANISH;

    constructor(public payload: string){}
}

export class EnglishMensaje implements Action{
    readonly type = ENGLISH;

    constructor(public payload: string){}
}

export type MensajeActions = SpanishMensaje | EnglishMensaje;