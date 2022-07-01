import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable, reduce } from 'rxjs';
import { Item, ItemId } from '../models/item';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  private itemCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;

  constructor(
    private afs: AngularFirestore
  ) {
    this.itemCollection = afs.collection<Item>('items');
    this.items = this.itemCollection.valueChanges();
  }

  getAllItems() {
    return this.afs.collection<Item>('items').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ItemId
        data.id = a.payload.doc.id
        return data
      }))
    )
  }

  getItemsByName(name: string) {
    return this.afs.collection<Item>('items', ref => ref.where('Nombre', '==', name)).snapshotChanges().pipe(
      map(actions => actions.map(a=> {
        const data = a.payload.doc.data() as ItemId
        data.id = a.payload.doc.id
        return data
      }))
    )
  }

  getItemsById(id: string) {
    return this.afs.collection<Item>('items', ref => ref.where('Id', '==', id)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ItemId
        data.id = a.payload.doc.id
        return data
      }))
    )
  }
  getItemsByCatalog(id_catalog: string) {
    return this.afs.collection<Item>('items', ref => ref.where('Catalogo_id', '==', id_catalog)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ItemId
        const isMatch = (element:any) => (element)=='﻿Id';
        let i  = (Object.keys(data).findIndex(isMatch))
        data.Id = Object.values(data)[i]
        data.id = a.payload.doc.id
        return data
      }))
    )
  }
}
