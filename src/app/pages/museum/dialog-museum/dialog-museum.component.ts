import { RolService } from './../../../services/rol.service';
import { UserService } from './../../../services/user.service';
import { HotToastService } from '@ngneat/hot-toast';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Museo } from 'src/app/models/museo';
import { MuseosService } from 'src/app/services/museos.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { RolesService } from 'src/app/services/roles.service';
import { Observable } from 'rxjs';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import { StaffService } from 'src/app/services/staff.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
@Component({
  selector: 'app-dialog-museum',
  templateUrl: './dialog-museum.component.html',
  styleUrls: ['./dialog-museum.component.scss']
})
export class DialogMuseumComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  img?: File
  title = 'Agregar Museo'
  mail:string[]=[]
  id?:string

  filterStaff?: Observable<string[]>;
  supervisors: string[] = [];
  StaffCtrl = new FormControl('');

  museumForm = new FormGroup(({
    name: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    schedule: new FormControl('', [Validators.required]),
    supervisor: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required]),
  }))

  myControl = new FormControl();

  @ViewChild('userInput') userInput!: ElementRef<HTMLInputElement>;

  constructor(
    public dialog: MatDialog,
    private toast: HotToastService,
    private museosService: MuseosService,
    private dialogRef: MatDialogRef<DialogMuseumComponent>,
    private userService: UserService,
    private RolService: RolesService,
    private staffService: StaffService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }


  fetchUserGestor(){
    this.RolService.getRolByName('gestor').subscribe(
      result=>{
        this.userService.getUserByRol(result[0].id).subscribe(
          res=>{
            res.forEach(user=>{
              this.mail.push(user.id)
            })
          }
        )
      }
    )
  }

  ngOnInit(): void {
    this.fetchUserGestor()
    if(this.data['edit']){
      this.museumForm.get('image')?.setValidators(null)
      this.title='Editar Museo'
      this.museosService.getMuseoById(this.data['museo_id']).subscribe(
        result=>{
          this.id=result.id
          this.museumForm.setValue({
            name:result.name,
            address:result.address,
            description:result.description,
            schedule:result.schedule,
            supervisor:result.supervisor,
            image: null
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
              if(this.id){
                this.museosService.updateMuseo(this.id,newMuseum).then(
                  result=>{
                    load.close()
                    this.toast.success('Museo actualizado con exito')
                    this.close()
                  }
                )
              }else{
                this.museosService.postMuseo(newMuseum).then(
                  result=>{
                    load.close()
                    this.toast.success('Museo creado con exito')
                    this.close()
                  }
                )
              }

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

  add(event:MatChipInputEvent):void{
    const value = (event.value || '').trim();
    if(value){
      this.supervisors.push(value);
    }
    event.chipInput!.clear();
    this.StaffCtrl.setValue(null);
  }
  remove(user: string): void {
    const index = this.supervisors.indexOf(user);
    if(index>=0){
      this.supervisors.splice(index,1);
    }
  }
  
  selected(event:MatAutocompleteSelectedEvent):void{
    this.supervisors.push(event.option.viewValue);
    this.userInput.nativeElement.value='';
    this.StaffCtrl.setValue(null);
  }
}
