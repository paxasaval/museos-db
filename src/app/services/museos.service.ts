import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { Museo, MuseoId } from '../models/museo';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class MuseosService {
  private museoCollection: AngularFirestoreCollection<Museo>;
  museos: Observable<Museo[]>;

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.museoCollection = afs.collection<Museo>('museos');
    this.museos = this.museoCollection.valueChanges();
   }

   getAllMuseos() {
    return this.afs.collection<Museo>('museos').snapshotChanges().pipe(
      map(actions => actions.map(a=>{
        const data = a.payload.doc.data() as MuseoId
        data.id = a.payload.doc.id
        return data
      }))
    )
   }

   getMuseoById(museo: string) {
    return this.afs.doc<Museo>(`museos/${museo}`).snapshotChanges().pipe(
      map(a=> {
        const data = a.payload.data() as MuseoId
        data.id = a.payload.id
        return data
      })
    )
   }

   getMuseoByName(name: string) {
    return this.afs.collection<Museo>('museos', ref => ref.where('name', '==', name)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as MuseoId
        data.id = a.payload.doc.id
        return data
      }))
    )
   }

   updateMuseo(id:string, museo: any){
    const museoReference = this.afs.doc<Museo>(`museos/${id}`)
    return museoReference.set(museo)
  }

   postMuseo(museo: Museo){
    return this.afs.collection<Museo>('museos').add(museo)
   }

   deleteMuseo(museo: MuseoId) {
    console.log(museo)
    this.afs.doc<Museo>('museos/' + museo.id).delete();
   }

   onUploadImage(file: File) {
    const filePath = `museos/${file.name}`
    const ref = this.storage.ref(filePath)
    return this.storage.upload(filePath, file)
   }

}
