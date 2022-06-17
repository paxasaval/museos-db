import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-point',
  templateUrl: './info-point.component.html',
  styleUrls: ['./info-point.component.scss']
})
export class InfoPointComponent implements OnInit {
  rol = ''

  constructor() { }

  ngOnInit(): void {
    this.rol = localStorage.getItem('rol')!
  }

}
