export interface Admin {
    name?: string,
    cedula?: string,
    rol?: string,
    mail?: string,
    uid?: string,
    phone?: string
}
export interface AdminId extends Admin{id: string}