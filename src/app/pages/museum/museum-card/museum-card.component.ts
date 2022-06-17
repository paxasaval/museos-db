import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-museum-card',
  templateUrl: './museum-card.component.html',
  styleUrls: ['./museum-card.component.scss']
})
export class MuseumCardComponent implements OnInit {

  @Input() card:any
  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  openMuseo(){
    this.router.navigate([`museos/${this.card.id}`])
  }
  editMuseo(){

  }
  deleteMuseo(){

  }
}
