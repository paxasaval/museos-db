import { RolesService } from './../../services/roles.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Museo } from 'src/app/models/museo';
import { MuseosService } from 'src/app/services/museos.service';
import { DialogMuseumComponent } from './dialog-museum/dialog-museum.component';

@Component({
  selector: 'app-museum',
  templateUrl: './museum.component.html',
  styleUrls: ['./museum.component.scss']
})
export class MuseumComponent implements OnInit {
  rol = ''
  museos: Museo[] = []
  constructor(
     private dialog: MatDialog,
     private museosService: MuseosService,
     private rolesService: RolesService
    ) { }

  openDialogNewMuseum(): void {
    const dialogRef = this.dialog.open(DialogMuseumComponent, {
      panelClass: 'app-full-bleed-dialog',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  fetchMuseos(){
    this.museosService.getAllMuseos().subscribe(
      result=>{
        this.museos=result
      }
    )
  }
  ngOnInit(): void {
    this.rol = localStorage.getItem('rol')!

    this.fetchMuseos()
  }

}
