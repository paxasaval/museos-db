import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-museum',
  templateUrl: './dialog-museum.component.html',
  styleUrls: ['./dialog-museum.component.scss']
})
export class DialogMuseumComponent implements OnInit {

  constructor(public dialog: MatDialog) { }
  

  ngOnInit(): void {
  }

}
