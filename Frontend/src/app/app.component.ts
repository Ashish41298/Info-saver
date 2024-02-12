import { Component} from '@angular/core';
import {environment} from '../environments/environment';
import { UsersService } from './services/users.service';
import {ProfileUser} from '../../src/app/Model/user';
import { switchMap} from 'rxjs';
import { AuthService } from './services/auth.service';
import { FormControl, FormGroup } from '@angular/forms';
// import { UntilDestroy} from '@ngneat/until-destroy';
import {  Router } from '@angular/router';
// @UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private authService:AuthService,private router:Router, private userservice:UsersService){
  }
  user:any ={} || ''
  title = 'Notes';
  showFiller = false;
  storage:any;
  profilepopup:boolean=false;
  deviceWidth:any;
  imgload:boolean = false;
  Nameofuser: any = new FormGroup({
    displayName: new FormControl
  });
  userId:any;
  ngOnInit(): void {
    this.getUser();
  }
  getUser(){
    const getudb:any =  localStorage.getItem('user');
    const deref = JSON.parse(getudb)
    this.userId = deref._id || null
    this.userservice.getUserWithid(this.userId).subscribe((res)=>{
      this.user = res;
      const used =JSON.stringify(res);
      localStorage.setItem('user',used);
      const upd:any =  localStorage.getItem('user');
      const cupd = JSON.parse(upd);
      this.user =cupd
    },(err)=>{console.log("something went to wrong")})
    // --------------------------------all redy commented--------------------
    //this.authService.authstatus().subscribe(res=>{
     // this.user = res
    //  const used =JSON.stringify(res);
    //  localStorage.setItem('user',used);
   // },err =>{console.log(err)})
    // const getudb:any =  localStorage.getItem('user');
    // const deref = JSON.parse(getudb)
    // this.user = deref
  }
  toggle(){
    this.showFiller = !this.showFiller;
  }
  profile(){
    this.profilepopup=!this.profilepopup;
  }
  popclose(){
    this.profilepopup=false;
  }
  loggedout(){
    this.router.navigate(['/login']);
  }
  uploadFile(event: any, user: ProfileUser) {
    this.imgload = true;
    const fileimg = event.target.files[0];
    const formData = new FormData();
    formData.append('file', fileimg);
    this.userservice.Postingimage(formData)
         .subscribe( async res=>{
          if(this.user.fileID){
            await this.userservice.filedeleting(this.user.fileID).subscribe(res=>{},err=>{console.log('prevdele err')});
          }
          if( await res){
            const data:ProfileUser = await {
              _id : user._id,
              email : user.email,
              name : user.name,  
              photoUrl : `${environment.Main_backend_url}data/${fileimg.name}`,
              idToken : user.idToken,
              fileID: res.id
         }
         this.imgload = false;
         this.user = data;
         console.log(this.user)
          await this.userservice.updateUser(this.userId,data).subscribe(res=>{},err=>{console.log('uupd err')});
           
          }
          const used =await JSON.stringify(this.user);
          await localStorage.setItem('user',used);
         }, err=>{console.log("posting err")}
   )
  }
public Name:any = this.user?.name
 saveName(user:any){
    const id =this.userId;
   const data:ProfileUser = {
        _id : user.id,
        email : user.email,
        name : user.name,  
        photoUrl : user.photoUrl,
        idToken : user.idToken,
        fileID:user.fileID
   }
    this.userservice.updateUser(id, data).subscribe( res=>{
      const user = JSON.stringify(res);
      const datas:any =  localStorage.setItem('user', user);
    });
  }
  navigator(){
    this.router.navigate(['/login']);
  }
  onImgError(event:any) { 
    event.target.src = 'assets/user.png';
}
  // @HostListener('window:resize', ['$event'])
  // onResize(event:any) {
  //   this.deviceWidth = `${window.innerWidth}px`;
  // }
  impnotes(){
    this.router.navigate(['/impo']);
  }
  folder(){
    this.router.navigate(['/folder']);
  }
  homenavigate(){
    this.router.navigate(['/notes']);
  }

}
