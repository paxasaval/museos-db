import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ItemsService } from 'src/app/services/items.service';

@Component({
  selector: 'app-info-point-card',
  templateUrl: './info-point-card.component.html',
  styleUrls: ['./info-point-card.component.scss']
})
export class InfoPointCardComponent implements OnInit {

  @Input() card:any
  constructor(
    private router:Router,
    private itemService:ItemsService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    
  }

  openInfoPoint(){
    this.router.navigate([`puntos-de-informacion/${this.card.id}`])
  }
  editInfoPoint(){
    
  }

  deleteInfoPoint(){
    
  }
}
