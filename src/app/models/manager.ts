export interface Manager {
    name?: string,
    cedula?: string,
    rol?: string,
    mail?: string,
    uid: string,
    phone?: string,
    workingHours?: string,
    museo?: string
}
export interface ManagerId extends Manager { id: string }