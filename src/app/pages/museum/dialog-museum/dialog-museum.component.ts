import { HotToastService } from '@ngneat/hot-toast';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Museo } from 'src/app/models/museo';
import { MuseosService } from 'src/app/services/museos.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-museum',
  templateUrl: './dialog-museum.component.html',
  styleUrls: ['./dialog-museum.component.scss']
})
export class DialogMuseumComponent implements OnInit {

  img?: File
  title = 'Agregar Museo'
  museumForm = new FormGroup(({
    name: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    schedule: new FormControl('', [Validators.required]),
    supervisor: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required]),
  }))

  myControl = new FormControl();


  constructor(
    public dialog: MatDialog,
    private toast: HotToastService,
    private museosService: MuseosService,
    private dialogRef: MatDialogRef<DialogMuseumComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }


  ngOnInit(): void {
    if(this.data['edit']){
      this.title='Editar Museo'
      this.museosService.getMuseoById(this.data['museo_id']).subscribe(
        result=>{
          this.museumForm.setValue({
            name:result.name,
            address:result.address,
            description:result.description,
            schedule:result.schedule,
            supervisor:result.supervisor,
            image:null
          })

        }
      )
    }
  }

  get name() {
    return this.museumForm.get('name')
  }
  get address() {
    return this.museumForm.get('address')
  }
  get descrition() {
    return this.museumForm.get('descrition')
  }
  get schedule() {
    return this.museumForm.get('schedule')
  }
  get supervisor() {
    return this.museumForm.get('supervisor')
  }
  get image() {
    return this.museumForm.get('image')
  }

  submit() {
    if (!this.museumForm.valid) {
      return
    } else {
      const load = this.toast.loading("Cargando...")
      const { name, address, description, schedule, supervisor } = this.museumForm.value;
      var newMuseum: Museo = {};
      newMuseum.name = name
      newMuseum.address = address
      newMuseum.description = description
      newMuseum.schedule = schedule
      newMuseum.supervisor = supervisor
      this.museosService.onUploadImage(this.img!).then(
        img => {
          img.ref.getDownloadURL().then(
            path => {
              newMuseum.image = path
              this.museosService.postMuseo(newMuseum).then(
                result=>{
                  load.close()
                  this.toast.success('Museo creado con exito')
                  this.close()
                }
              )
            }
          )
        }
      )
    }
  }
  onFileSelected(event: any) {
    this.img = event.target.files[0];
  }

  close(){
    this.dialogRef.close()
  }

}
