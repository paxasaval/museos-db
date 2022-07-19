import { Timestamp } from "firebase/firestore"

export interface RecordVisit {
    museum?: string,
    date?: Timestamp,
    name?: string,
    identification?: string,
    country?: string,
    numberOfCompanions?: number,
    adults?: number,
    children?: number,
    men?: number,
    women?: number,
    transport?: string,
    reasonForVisit?: string,
    comment?: string
}
export interface RecordVisitId extends RecordVisit { id: string }
