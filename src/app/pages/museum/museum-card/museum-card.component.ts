import { DialogMuseumComponent } from './../dialog-museum/dialog-museum.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { MuseosService } from 'src/app/services/museos.service';

@Component({
  selector: 'app-museum-card',
  templateUrl: './museum-card.component.html',
  styleUrls: ['./museum-card.component.scss']
})
export class MuseumCardComponent implements OnInit {

  @Input() card:any
  constructor(
    private router:Router,
    private museoService: MuseosService,
    private dialog: MatDialog
    ) { }

  ngOnInit(): void {
  }

  openMuseo(){
    this.router.navigate([`museos/${this.card.id}`])
  }
  editMuseo(){
    const dialogRef = this.dialog.open(DialogMuseumComponent,{
      panelClass: 'app-full-bleed-dialog',
      data: {
        'edit': true,
        'museo_id': this.card.id
      }
    })
  }
  deleteMuseo(){
    this.museoService.deleteMuseo(this.card)
  }
}
