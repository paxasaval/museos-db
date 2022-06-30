import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { Country, CountryId } from '../models/country';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private countriesCollection: AngularFirestoreCollection<Country>;
  countries: Observable<Country[]>;

  constructor(
    private afs: AngularFirestore
  ) {
    this.countriesCollection = afs.collection<Country>('paises');
    this.countries = this.countriesCollection.valueChanges();
  }

  getAllCountries() {
    return this.afs.collection<Country>('paises').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as CountryId
        const isMatch = (element:any) => (element)=='﻿Iden';
        let i  = (Object.keys(data).findIndex(isMatch))
        data.Iden = Object.values(data)[i]
        data.id = a.payload.doc.id
        return data
      }))
    )
  }

  getCountryByName(name: String) {
    return this.afs.collection<Country>('paises', ref => ref.where('pais_de_procedencia', '==', name)).snapshotChanges().pipe(
      map(actions => actions.map(a=> {
        const data = a.payload.doc.data() as CountryId
        data.id = a.payload.doc.id
        return data
      }))
    )
  }

  getCountryById(id: string) {
    return this.afs.doc<Country>(`paises/${id}`).snapshotChanges().pipe(
      map(a => {
        const data = a.payload.data() as CountryId
        data.id = a.payload.id
        return data
      })
    )
  }

  getCountryByIden(iden: string) {
    return this.afs.collection<Country>('paises', ref => ref.where('Iden', '==', iden)).snapshotChanges().pipe(
      map(actions => actions.map(a=> {
        const data = a.payload.doc.data() as CountryId
        data.id = a.payload.doc.id
        return data
      }))
    )
  }
}
