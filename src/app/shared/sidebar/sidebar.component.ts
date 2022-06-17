import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {



  constructor(private authservice: AuthService) { }
  logOut(){
    this.authservice.logout().subscribe(()=>{
      window.location.reload();
    })
  }
  ngOnInit(): void {
  }

}
