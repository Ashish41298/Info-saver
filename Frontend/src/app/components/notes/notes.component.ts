import { Component, OnInit, Sanitizer } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FormGroup, FormControl } from '@angular/forms';
import { formatDate } from '@angular/common';
import { UsersService } from '../../services/users.service';
import { ProfileUser } from '../../Model/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CimgdataService } from '../../services/cimgdata.service';
import { ThemePalette } from '@angular/material/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RecorderService } from '../../services/recorder.service';
import { AuthService } from '../../services/auth.service';
import { RecogzService } from '../../services/recogz.service';
import * as FileSaver from 'file-saver';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css'],
})
export class NotesComponent implements OnInit {

  constructor(private usersService: UsersService, private snack: MatSnackBar,
    private img: CimgdataService, private domSanitizer: DomSanitizer, private recoderservice: RecorderService,
    private authservice: AuthService, private speechRecognitionService: RecogzService) {
    this.recoderservice
      .recordingFailed()
      .subscribe(() => (this.isRecording = false));
    this.recoderservice
      .getRecordedTime()
      .subscribe(time => (this.recordedTime = time));
    this.recoderservice.getRecordedBlob().subscribe(data => {
      this.teste = data;
      this.blobUrl = this.domSanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(data.blob)
      );
    });
  }
  clicked = false;
  starhs: boolean = false
  firehs: boolean = false;
  mdpoup: boolean = false;
  themepopup: boolean = false;
  myColor = "rgb(0,0,0,0.1)";
  cdate = formatDate(new Date(), 'dd-MM-yyyy', 'en');
  public disabled = false;
  public color: ThemePalette = 'primary';
  public touchUi: any = false;
  Notesform: any = new FormGroup({
    title: new FormControl,
    discription: new FormControl,
  });
  upNotesform: any = new FormGroup({
    utitle: new FormControl,
    udiscription: new FormControl,
  });
  spicker: any = new FormGroup({
    colorCtr: new FormControl('')
  });
  user!: ProfileUser
  mid: any;
  images: any = [];
  deviceWidth: any;
  deviseHeight: any;
  picimage: any = '';
  imgurls: any = '';
  audio: any = '';
  image_id:any = '';
  audio_id:any = '';
  ctext:any;
  cdesc:any;
  imgload:boolean = false;
  public noteisnot: any = [
    {
      date: this.cdate,
      title: 'Welcome to the 📓!',
      discription: 'This is the default 🗒!',
      important: 0,
      color: '',
      imgurl: this.picimage,
      innerimage: this.imgurls || '',
    }
  ]
  public realnotes: any = [];

  ngOnInit(): void {
    this.notesddd();
  }
  Loader: boolean = false;
  notesddd() {
    this.Loader = true;
    this.usersService.getAllNotes().subscribe(res => {
      console.log(res)
      this.realnotes = res ?? this.noteisnot;
      setTimeout(() => {
        this.Loader = false;
      }, 5000);
    })
  }
 Discard:any
  async submite() {
    const mdnf = {
      date: this.cdate,
      title: this.Notesform.value.title,
      discription: this.Notesform.value.discription,
      important: this.impvalue,
      color: `#${this.spicker.value.colorCtr?.hex}` ?? `#${'#000000'}`,
      imgurl: this.picimage || "assets/white-smoke.jpg",
      imageID: await this.image_id || '',
      innerimage: await this.imgurls || '',
      audioID: await this.audio_id || '',
      audio: await this.audio || ''
    }
    this.usersService.createNotes(mdnf).subscribe(async (res) => {
      this.Discard = res;
      await this.snack.open("✅ Note Added", "❌", {
        duration: 2800, //2800
        panelClass: ['addsnacks', 'fristsnacks'],
      });
      let audio = new Audio();
      audio.src = "assets/addnotification.mp3";
      audio.load();
      audio.play();
      this.usersService.getAllNotes().subscribe(res => this.realnotes = res)
      const lonotes = JSON.stringify(this.realnotes)
      localStorage.setItem('Notes', lonotes);
      this.image_id = '';
      this.audio_id = '';
    });
    this.Notesform.reset();
    this.cleanner();
  }
  onImgError(event: any) {
    event.target.src = 'assets/white-smoke.jpg';
  }
  hsf(e: any, id: any) {
    (e.checked) && (id) ? this.firehs = true : this.firehs = false;
  }
  impvalue: number = 0;
  onChange(elem: any, notes: any, id: number) {
    notes.important = elem.checked ? 1 : 0;
    console.log(notes);
    this.usersService.updateNotes(notes._id, notes).subscribe();
  }
  viewmode: boolean = false;
  viewpopup: boolean = false;
  editmode: boolean = false;
  edit(notes: any, id: number) {
    this.currentimpo = notes;
    this.currentindex = id
    this.viewmode = true;
    this.viewpopup = !this.viewpopup;
  }
  Dclosed:boolean = true;
  open(clear: HTMLTextAreaElement,clearD:HTMLTextAreaElement,Dcval:any) {
    if(Dcval == 'Dclosed'){this.Dclosed = false}else('');
    clear.value = '';
    clearD.value = '';
    this.deviseHeight = `${window.innerHeight}px !important`;
    this.editmode = false;
    this.mdpoup = !this.mdpoup;
    this.cleanner();
    this.picimage = ""
  }


  updateMode: boolean = false;
  updatepopup: boolean = false;
  currentindex: any;
  public currentimpo: any = {};
  upopen(notes: any, id: number) {
    this.deviseHeight = `${window.innerHeight}px !important`;
    this.currentimpo = notes;
    this.currentindex = id
    this.updateMode = false;
    this.updatepopup = !this.updatepopup;
    console.log(notes);

  }
  public colorCtr = this.spicker.value.colorCtr?.hex;
  close() {
    this.deviseHeight = `100vh !important`;
    this.viewpopup = false;
    this.mdpoup = false;
    this.themepopup = false;
    this.updateMode = false;
    this.updatepopup = false;
    if(!this.Discard){this.Discardchanges();}
  }
  themeopen() {
    this.editmode = true;
    this.themepopup = !this.themepopup;
    this.imggallerymd = false;
    this.audiomodel = false;
  }
  themeclose() {
    this.deviseHeight = `100vh !important`;
    this.editmode = false;
    this.themepopup = false;
    this.imggallerymd = false;
    this.audiomodel = false;
    this.imggallerymd = false;
    this.audiomodel = false;
  }

  deletenode(id: number, notes: any) {
    const innerimagedata = JSON.stringify(notes.innerimage);
    this.realnotes.splice(id, 1);
   const did:string = notes._id;
    this.usersService.deleteNotes(did).subscribe(res=> {
      this.snack.open("✅ Note deleted", "❌", {
            duration: 2800, //2800
            panelClass: ['sucessnacks', 'fristsnacks'],
          });
          let audio = new Audio();
          audio.src = "assets/deletenote.mp3";
          audio.load();
          audio.play();
          if(notes.imageID){this.usersService.filedeleting(notes.imageID).subscribe()}
          this.usersService.getAllNotes().subscribe(res => this.realnotes = res)
          // if (notes.audio != '') {
          //   this.authservice.deleteAudio(notes);
          // }
    });
    
  }

  updatend(data: any) {
    this.deviseHeight = `${window.innerHeight}px !important`;
    this.realnotes[data._id] = {
      date: this.cdate,
      title: this.upNotesform.value.utitle,
      discription: this.upNotesform.value.udiscription,
      important: this.impvalue,
      color: `#${this.spicker.value.colorCtr?.hex}`,
      imgurl: this.picimage || 'assets/white-smoke.jpg',
      imageID: this.image_id || '',
      innerimage: this.imgurls || '',
      audioID: this.audio_id || '',
      audio: this.audio || ''
    }
    const id = data._id
    this.usersService.updateNotes(id, this.realnotes[data._id]).subscribe((res) => {
      this.snack.open("✅ Note Upadated", "❌", {
        duration: 2800, //2800
        panelClass: ['stylesnacks', 'fristsnacks'],
      });
      let audio = new Audio();
      audio.src = "assets/updates.mp3";
      audio.load();
      audio.play();
      this.usersService.getAllNotes().subscribe(res => this.realnotes = res);
      this.image_id = '';
      this.audio_id = '';
    });
  }
  imagis = this.img.Images
  pickImages(imitem: any, i: number) {
    console.log(this.images)
    this.picimage = imitem.img ?? 'assets/white-smoke.jpg';
    this.realnotes[this.currentindex].imgurl = imitem.img;
    // this.usersService.updateNotes(id, this.realnotes[data._id]).subscribe();
  }
  addpickImages(imitem: any, i: number) {
    console.log(this.images)
    this.picimage = imitem.img ?? 'assets/white-smoke.jpg';
    // this.usersService.Unotes(this.realnotes).subscribe();
  }
  onDisabledChanged(value: boolean) {
    if (!value) {
      this.spicker.colorCtr.enable();
    } else {
      this.spicker.colorCtr.disable();
    }

  }

  imggallerymd: boolean = false;
  imggmd() {
    this.imgurls = '';
    this.imggallerymd = !this.imggallerymd;
    this.audiomodel = false;
    this.themepopup = false;
    this.innerimgmodel = false;
  }
  audiomodel: boolean = false;
  audioadd() {
    this.imggallerymd = false;
    this.audiomodel = !this.audiomodel;
    this.themepopup = false;
  }
  isRecording = false;
  recordedTime: any;
  blobUrl: any;
  teste: any;
  //---------------------------add innerimage -------------------------
  imgFile:any
  pickimgforinner(event: any) {
    this.imgFile = event.target.files[0]
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imgurls = e.target.result;
    };
    reader.readAsDataURL(this.imgFile);
    console.log(this.imgFile)
  }
  sbminimg(){
      const formData = new FormData();
    formData.append('file', this.imgFile);
      this.usersService.Postingimage(formData).subscribe(res=>{console.log(res)
        if(res){
          this.image_id = res.id;
          this.imgurls = `${environment.Main_backend_url}data/${res.filename}`;
       }})
  }
  updatepickimgforinner(event: any) {
    this.imgload = true;
    this.imgFile = event.target.files[0]
    const reader = new FileReader();
    reader.onload = (e: any) => {
    this.currentimpo.innerimage = e.target.result;};
    reader.readAsDataURL(this.imgFile);
    const formData = new FormData();
    formData.append('file', this.imgFile);
    if(this.currentimpo.imageID){
      this.usersService.filedeleting(this.currentimpo.imageID).subscribe(res=>{});}
          this.usersService.Postingimage(formData).subscribe( async res=>{console.log(res)
            if(res){
              this.image_id =await res.id;
              this.imgurls = await `${environment.Main_backend_url}data/${res.filename}`;
              this.realnotes[this.currentimpo._id] = await {
                date: this.cdate,
                title: this.upNotesform.value.utitle,
                discription: this.upNotesform.value.udiscription,
                important: this.impvalue,
                color: `#${this.spicker.value.colorCtr?.hex}`,
                imgurl: this.picimage || 'assets/white-smoke.jpg',
                imageID: this.image_id || '',
                innerimage: this.imgurls || '',
                audioID: this.audio_id || '',
                audio: this.audio || ''
              }
              this.imgload = false;
              this.usersService.updateNotes(this.currentimpo._id, this.realnotes[this.currentimpo._id]).subscribe((res) => {console.log(res)})
           }})
  }
  cleanner() {
    this.imgurls = null;
  }
  innerimgmodel: boolean = false;
  inimgmodale() {
    this.innerimgmodel = !this.innerimgmodel;
  }
  startRecording() {
    if (!this.isRecording) {
      this.isRecording = true;
      this.recoderservice.startRecording();
    }
  }

  abortRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      this.recoderservice.abortRecording();
    }
  }

  download(): void {
    const url: any = window.URL.createObjectURL(this.teste.blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = this.teste.title;
    link.click();
  }
  updownload() {
    var link:any = document.createElement('a');
    link.href = this.currentimpo.audio;
    link.download = true;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  stopRecording() {
    if (this.isRecording) {
      this.recoderservice.stopRecording();
      this.isRecording = false;
    }
    // if(this.currentimpo != ''){
    //   // this.updateaudio();
    // }
  }
  //======================================>audio<=================================
  showitssave: boolean = false;
  uploadaudio() {
    this.showitssave = true;
    const currentDate = new Date();
    const fileName = `Info-saver-${currentDate.toISOString()}.mp3`;
   const file = new File([this.teste.blob], fileName, { type: this.teste.blob.type });
    const formData = new FormData();
    formData.append('file', file);
      this.usersService.Postingimage(formData).subscribe(res=>{
        setTimeout(() => { this.showitssave = false;}, 1000);
        if(res){
          this.audio_id = res.id;
          this.audio = `${environment.Main_backend_url}data/${res.filename}`;
          console.log(this.audio_id);
       }
      });
  }

  updateaudio() {
    this.showitssave = true;
    const currentDate = new Date();
    const fileName = `Info-saver-${currentDate.toISOString()}.mp3`;
   const file = new File([this.teste.blob], fileName, { type: this.teste.blob.type });
    const formData = new FormData();
    formData.append('file', file);
          this.usersService.Postingimage(formData).subscribe( async res=>{console.log(res)
            if(res){
              this.audio_id =await res.id;
              this.audio = await `${environment.Main_backend_url}data/${res.filename}`;
              this.realnotes[this.currentimpo._id] = await {
                date: this.cdate,
                title: this.upNotesform.value.utitle,
                discription: this.upNotesform.value.udiscription,
                important: this.impvalue,
                color: `#${this.spicker.value.colorCtr?.hex}`,
                imgurl: this.picimage || 'assets/white-smoke.jpg',
                imageID: this.image_id || '',
                innerimage: this.imgurls || '',
                audioID: this.audio_id || '',
                audio: this.audio || ''
              }
              setTimeout(() => { this.showitssave = false;}, 1000);
              this.usersService.updateNotes(this.currentimpo._id, this.realnotes[this.currentimpo._id]).subscribe((res) => {console.log(res)})
           }})
    //  this.currentUser$.subscribe(res => {
    //    const index = res?.uid;
    //      const old:any =this.currentimpo.audio;
    //  this.authservice.updateauthaudio(this.teste.blob, old, `audio/${index}/` + `${unique}` + '.mp3').subscribe(res => {
    //        this.audio = res;
    //        console.log(this.audio);
    //        this.usersService.Unotes(this.realnotes).subscribe();
    //        setTimeout(() => {
    //         this.showitssave = false;
    //       }, 1000);
    //      });
    //  })
  }
  clearRecordedData() {
    if (this.blobUrl != '') {
      this.blobUrl = null;
    };
    if (this.currentimpo.audio != '') {
      if(this.currentimpo.audioID){
        this.usersService.filedeleting(this.currentimpo.audioID).subscribe(res=>{})
      }else('');
      this.currentimpo.audio = null;
    };
  }

  ngOnDestroy(): void {
    this.abortRecording();
  }
  recopopup: boolean = false;
  isrd: boolean = false;
  selectedLanguage = '';
  changeLanguage(languageCode: string) {
    this.selectedLanguage = languageCode;
    this.speechRecognitionService.recognition.lang = languageCode;

  }
  Goto() {
    this.recopopup = !this.recopopup;
  }
  selectedOption: string | any;
  sltradio(value: any) {
    this.selectedOption = value;
  }
  text: any = '';
  desc: any = '';
  start() {
    this.isrd = true;
    this.speechRecognitionService.start();
    this.speechRecognitionService.text = '';
  }
  stop() {
      this.isrd = false;
      this.speechRecognitionService.stop();
      if (this.selectedOption === 'text') {this.text = this.speechRecognitionService.text;} 
      else {this.desc = this.speechRecognitionService.text;}
  }
  Discardchanges(){
  if(this.image_id){this.usersService.filedeleting(this.image_id).subscribe();}else{''};
  if(this.audio_id){this.usersService.filedeleting(this.audio_id).subscribe();}else{''}
  }
  dnnoteimgs(noteinimg:any){
   const id = noteinimg.imageID;
    console.log(noteinimg);
    const url = noteinimg.innerimage;
const parts = url.split('/'); 
const filename = parts[parts.length - 1]; 
     this.usersService.downloadnoteinnerimg(id, filename).pipe(
      catchError((error: HttpErrorResponse) => {
         const datau:any = error.url;
        const img =  noteinimg.innerimage;
           const fileBlob = new Blob([datau]);
           FileSaver.saveAs(fileBlob, `${filename}`);
        return img
      })
    ).subscribe();
  }
}
