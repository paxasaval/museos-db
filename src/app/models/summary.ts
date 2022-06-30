import { Timestamp } from "firebase/firestore"

export interface Region_visit {
    region?: string,
    visit?: number
}

export interface Country_visit {
    country?: string,
    total_visits?: number
}

export interface DataRegionsVisit {
    region?: string,
    countries?: Country_visit[],
    visit?: number
}

export interface Place_record {
    item_id?: string,
    total_visits?: number
}

export interface Transport_visit {
    item_id?: string,
    total_visits?: number
}

export interface LastMonth_visit {
    month?: string,
    total_visits?: number
}

export interface LastYear_visit {
    year?: string,
    total_visits?: number
}

export interface Reason_visit {
    item_id?: string,
    total_visits?: number
}

export interface Summary {
    cutoff_date?: Timestamp,
    avg_tourist_visit?: number,
    avg_visits_days?: number,
    total_record?: number,
    country_visit?: Country_visit[],
    place_record?: Place_record[],
    lastMonth_visit?: number,
    month_visit?: LastMonth_visit[],
    lastYear_visit?: LastYear_visit[],
    region_visit?: DataRegionsVisit[],
    transport_visit?: Transport_visit[],
    reason_visit?: Reason_visit[]
}
export interface SummaryId extends Summary { id: string }
