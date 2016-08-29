declare module "flux-standard-action" {
    export interface FluxStandardAction {
        type: string | symbol;
        payload?: any;
        error?: boolean | any;
        meta?: any
    }

    export type FSA = FluxStandardAction;

    export function isFSA(action: any): boolean;

    export function isError(action: any): boolean;
}
