export interface Staff {
    name?: string,
    cedula?: string,
    rol?: string,
    mail?: string,
    uid: string,
    phone?: string,
    workingHours?: string,
    museo?: string
}
export interface StaffId extends Staff { id: string }