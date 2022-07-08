import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info-point-detail',
  templateUrl: './info-point-detail.component.html',
  styleUrls: ['./info-point-detail.component.scss']
})
export class InfoPointDetailComponent implements OnInit {

  constructor(
    private router: Router
  ) { }
  goBack() {
    this.router.navigate(['/puntos-de-informacion']);
  }
  ngOnInit(): void {
  }

}
