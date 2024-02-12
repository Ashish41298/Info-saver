import { HttpClient, HttpRequest } from '@angular/common/http';
import { Component, OnInit, Pipe } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

// import {PipePipe} from '../pipe.pipe'
import { Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
@Component({
  selector: 'app-impnotes',
  templateUrl: './impnotes.component.html',
  styleUrls: ['../notes/notes.component.css', './impnotes.component.css']
})
export class ImpnotesComponent implements OnInit {
  constructor(private usersevice:UsersService,private snack: MatSnackBar,private router:Router, private http:HttpClient) {}
  txtdd:any ='';
  Dsc:any = '';
  Notesform: any = new FormGroup({
    text: new FormControl,
    Desc: new FormControl,
  });
starhs: boolean = false
firehs: boolean = false;
mdpoup: boolean = false;
themepopup: boolean = false;
myColor = "rgb(0,0,0,0.1)";
realnotes:any=[];
deviseHeight: any;
upNotesform: any = new FormGroup({
 utitle: new FormControl,
 udiscription: new FormControl,
});
notes:any;
rdb:any = [];
ngOnInit() {
 this.deviseHeight = `${window.innerHeight}px !important`;
 this.getimpdb();
}
async getimpdb(){
 this.usersevice.getNotes().subscribe(res=>{
this.realnotes = res;
 })
  
}
hsf(e: any, id: any) {
 (e.checked) && (id) ? this.firehs = true : this.firehs = false;
}
editmode: boolean = false;
currentimpo:any;
currentindex:any;
viewmode:boolean = false;
viewpopup:boolean = false;
edit(notes: any, id: number) {
 this.currentimpo = notes;
 console.log(this.currentimpo);
 
 this.currentindex = id
 this.viewmode = true;
 this.viewpopup = !this.viewpopup;
}
open() {
 this.editmode = false;
 this.mdpoup = !this.mdpoup;
}
updateMode: boolean = false;
updatepopup: boolean = false;
upopen() {
 this.updateMode = false;
 this.updatepopup = !this.updatepopup;
}
close() {
 this.viewpopup = false;
}
themeopen() {
 this.editmode = true;
 this.themepopup = !this.themepopup;
}
themeclose() {
 this.editmode = false;
 this.themepopup = false;
}
async onChange(elem: any,notes:any,id:number) {
  
 notes.important = await elem.checked ? 1 : 0;
 await this.usersevice.updateNotes(notes._id,notes).subscribe(async res=>{
  console.log(res)
  if(res.important != 1){
 await  this.realnotes.splice(id, 1);
  }

 })
}
nof:boolean =false;
ngDoCheck() {
if(this.realnotes.length <= 0){
 this.nof = true;
}else{
 this.nof =false;
}
}
routes(){
this.router.navigate(['/notes']);
}


}
