import { RolService } from './../../services/rol.service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  user_id!:string
  name!:string
  rol!:string
  seePersonal=false
  seePoint=false
  seeMuseos=false
  seeConfig=false

  constructor(
    private authservice: AuthService,
    private userService: UserService,
    private rolService: RolService,
    ) { }
  logOut(){
    this.authservice.logout().subscribe(()=>{
      window.location.reload();
    })
  }

  fetchUserInfo(){
    this.userService.getUserById(this.user_id).subscribe(
      result=>{
        this.name=result.name!
        if(result.rol==='KcyTEOBshsvabhvqmcpz'){
          this.rol='Administrador'
          this.seePersonal=true
          this.seeMuseos=true
          this.seeConfig=true
          this.seePoint=true
        }
        if(result.rol==='ZFwDIYvZia8PKqIRS9Ng'){
          this.rol='Gestor'
          this.seeMuseos=true
          this.seePoint=true
        }
        if(result.rol==='kKjkKRN2Kzz01dDxLevq'){
          this.rol='Visualizador'
          this.seeMuseos=true
          this.seePoint=true
        }
      }
    )
  }

  ngOnInit(): void {
    this.user_id=localStorage.getItem('user')!
    this.fetchUserInfo()
    console.log(this.user_id)
  }

}
