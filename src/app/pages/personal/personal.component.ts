import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Staff } from 'src/app/models/staff';
import { StaffService } from 'src/app/services/staff.service';
import { DialogStaffComponent } from './dialog-staff/dialog-staff.component';
export interface dataTable{
    ci?:string;
    name?:string;
    rol?:string;
    museo?:string;
    phone?:string;
}
@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {
  personal_list: Staff[]=[]
  dataSource: dataTable[] = []
  displayedColumns: string[] = ['cedula', 'Nombres y Apellidos', 'Rol', 'Museo','Telefono',' ']

  constructor(
    public dialog: MatDialog,
    private staffService: StaffService,
    ) { }

  openDialogNewStaff(): void{
    const dialogRef = this.dialog.open(DialogStaffComponent, {
      panelClass: 'app-full-bleed-dialog',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  fetchPersonal(){
    this.staffService.getAllStaff().subscribe(
      result=>{
        this.dataSource=[]
        result.forEach(x=>{
          let row: dataTable = {}
          row.ci = x.cedula
          row.name = x.name
          row.rol = x.rol
          row.museo = x.museo
          row.phone = x.phone
          this.dataSource.push(row)
        })
      }
    )
  }
  ngOnInit(): void {
    this.fetchPersonal()
  }

  seePersonal(id:string){
    const dialogRef=this.dialog.open(DialogStaffComponent, {
      panelClass: 'app-full-bleed-dialog',
      data: {
        'edit': false,
        'personal_id': id
      }
    })
  }
  editPersonal(id: string){
    const dialogRef=this.dialog.open(DialogStaffComponent, {
      panelClass: 'app-full-bleed-dialog',
      data: {
        'edit': true,
        'personal_id': id
      }
    })
  }
  deletePersonal(id: string){

  }
}
