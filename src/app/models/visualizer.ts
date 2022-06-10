export interface Visualizer {
    name?: string,
    cedula?: string,
    rol?: string,
    mail?: string,
    uid?: string,
    phone?: string
}
export interface Visualizerid extends Visualizer{ id: string }