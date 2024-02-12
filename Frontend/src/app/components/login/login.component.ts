import { Component,OnInit} from '@angular/core';
import { GoogleLoginProvider, SocialAuthService, SocialAuthServiceConfig, SocialUser } from "@abacritt/angularx-social-login";
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { ProfileUser } from 'src/app/Model/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 constructor(private social: SocialAuthService,private authservice:AuthService, private userservice:UsersService, private router:Router){
 this.dt = localStorage.getItem('user');
 this.mdata = JSON.parse(this.dt);
 }
logdata:boolean = false;
user:any | null = null;
loggedIn:any;
dt:any 
mdata:any 
 ngOnInit() {
  if(!this.mdata){
    this.social.authState.subscribe(user=>{
      this.user = user;
      if(!this.mdata){
        this.login(this.user);
       }else('')
    });
  }else{''}
   if(this.mdata){
     this.user = this.mdata;
   }else{this.logdata = true;}
   
}
signInWithGoogle() {
  this.social.signIn(GoogleLoginProvider.PROVIDER_ID);
}
login(euser:any){
  if(euser){
    let setuser:ProfileUser = {
      _id: euser?.id,
      email: euser?.email,
      name: euser?.name,
      photoUrl: euser?.photoUrl,
      idToken: euser?.idToken,
      fileID: ''
    }
     this.userservice.createUser(setuser).subscribe(res => {
        this.user = res;
        console.log(res)
        if(res){
          const user =JSON.stringify(setuser)
          localStorage.setItem('user', user);
          this.logdata = false;
          this.router.navigate(['./notes']).then(()=> window.location.reload());
        }
      },err =>{
        console.log(err)
      });
  }
}

signOut(): void {
  if(this.user?._id){
    this.userservice.deleteUser(this.user?._id).subscribe(async res=>{
   if(res){
      await this.social.authState;
     await localStorage.removeItem('user');
     await localStorage.clear();
     await this.router.navigate(['./login']).then(()=> window.location.reload());
     if(this.mdata?.fileID){
      this.userservice.filedeleting(this.mdata.fileID).subscribe(res=>{},err=>{console.log('prevdele err')});
    }else{''}
   }
    })
    this.logdata = true;
  }else{''}
}

}