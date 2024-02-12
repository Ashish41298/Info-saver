import { formatDate, Location } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, OnChanges, OnInit, Output, ViewChild, } from '@angular/core';
import {environment} from '../../../environments/environment';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
import { Folder } from 'src/app/Model/tree-datasource';
import { UsersService } from 'src/app/services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import WebViewer from '@pdftron/webviewer';
// import * as shortid from 'shortid';
// import * as zlib from 'zlib';
import * as pako from 'pako';
// import * as base64 from 'base-64';
import { Base64 } from 'js-base64';
import { DomSanitizer } from '@angular/platform-browser';
// import { parse, format } from 'url';
import { ResizeEvent } from 'angular-resizable-element';
import * as FileSaver from 'file-saver';
import { HttpEventType, HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.css'],
  animations: [
    trigger('slideVertical', [
      state(
        '*',
        style({
          height: 0
        })
      ),
      state(
        'show',
        style({
          height: '*'
        })
      ),
      transition('* => *', [animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')])
    ])
  ]
})

export class FoldersComponent implements OnInit {
  pageWidth: any = window.innerWidth;
  id: any;
  LOAD_MORE: any = 'LOAD_MORE';
  childDataLoaded: boolean = false;

  @ViewChild('drawer') drawer!: MatSidenav;
  panelOpenState = false;
  treeControl = new NestedTreeControl<any>(node =>
    node._id &&
    node.files && node.name && node.parentFolder && node.subfolders
  );
  dataSource = new MatTreeNestedDataSource<Folder>();
  localDataForAll: any;
  constructor(private userservice: UsersService, private authservice: AuthService, private router: Router, private location: Location, private aroute: ActivatedRoute, private snack: MatSnackBar, public sanitizer: DomSanitizer) {
    var datas: any = localStorage.getItem('user');
    this.localDataForAll = JSON.parse(datas);
    console.log(this.localDataForAll)
  }

  date = formatDate(new Date(), 'dd-MM-yyyy hh:mm', 'en');
  ngOnInit(): void {
    this.getfoldersfordata();
    this.gettingfrosession();
  }

  ppclode(event: any) {
    if (event.target.id === "conbox") {
      this.Mitem = false;
      this.Dfiles = false;
    }
  }
  reason = '';
  close(reason: string) {
    this.reason = reason;
    this.drawer.close();
  }
  addedfolders: any = [];
  TREE_DATA: Folder[] = this.addedfolders
  opendi: boolean = false;
  selval: any;
  FolderName: any;
  additms() {
    this.FolderName = '';
    console.log(this.addedfolders);
  }
  dataget(val: any) {
    if (val == "addfo") { this.opendi = true; }
    this.selval = val;
  }
  gfname() {
    if (this.FolderName != '') {
      this.createFolder();
      this.opendi = false;
    }
  }
  closed() {
    this.opendi = false;
    this.folderpopup = false;
    this.selecteddoc = null;
    this.viewpop = false;
    this.gtinnertext = [{ name: "redirect" }];
    this.viewablefiles = '';
    this.cDoc = '';
    this.txtgenfile = false;
    this.docfiledata = ''
  }
  databoder: boolean = false;
  folderpopup: boolean = false;
  selecteddoc: any = [];
  gtinnertext: any = [{ name: "redirect" }];
  innerselfiles: any;

  pathcon(fname: any, event: any) {
    this.docfiledata = fname;
    this.folderpopup = true;
    if (this.pageWidth > 500) {
      // let text = document.getElementById("innnernames")?.innerText;
      if (this.gtinnertext != null) {
        this.gtinnertext.push(fname);
      }else{''};
      this.selecteddoc = { ...fname };
      
      this.innerselfiles = this.selecteddoc.files;
      this.Parentrs = fname._id;
     
      this.gettingsubfolders();
      
    }
  }
  folder!: Folder;
  async createFolder() {
    this.folder = {
      name: this.FolderName,
      parentFolder: this.Parentrs || '',
      files: []
    };
    await this.authservice.addfolderdt(this.folder).subscribe(async (res) => {
      if (await res) {
        if (res == 'Name already exists') {
          this.snack.open("⬇️ Folder already exists", "❌", {
            duration: 2800,
            panelClass: ['Folderexist', 'fristsnacks'],
          });
          let audio = new Audio();
          audio.src = "assets/exist_Notification.mp3";
          audio.load();
          audio.play();
        }
        this.selecteddoc.push(...res);
        console.log(this.selecteddoc)
        this.getfoldersfordata();
      } else { '' }
      console.log(res);
    }, (err) => { console.log(err) });
  }


  directfilearr: any = [];
  docfiledata: any;
  goback() {
    this.location.back();
  }
  smlnotification: boolean = false;
  smlnotificationmfg: any = '';
  cprogress: string = "0%";
  async uploadFile(event: any) {
    const uid: any = this.localDataForAll._id;     //: Observable<Filedt>
    var dname = event.target.files[0];
    console.log(dname);
    var formData = new FormData();
    var samdf: any = {
      uid: uid,
      datas: this.docfiledata
    }
    formData.append('file', dname);
    formData.append('objectData', JSON.stringify(samdf));
    await this.userservice.PostingManagerDB(formData).subscribe(async (event) => {
      if (event.type === HttpEventType.UploadProgress) {
        const dpr:any = Math.round((100 * event.loaded) / event.total) + "%";
        this.cprogress = dpr;
        console.log(this.cprogress)
      } else if (event instanceof HttpResponse) {
        var ress =  await event.body;
        this.cprogress = "0%";
      console.log(ress)
       await this.getfoldersfordata();
      // this.cprogress =  this.userservice.progress;
      if (ress) {
        if(this.docfiledata){
         this.docfiledata.files.push(ress[0]);
        }
        const name = ress.name || ress[0].name;
        console.log(name);
        this.smlnotification = true;
        this.smlnotificationmfg = name + " " + "file uploaded";
        setTimeout(() => {
          this.smlnotification = false;
        }, 2800);
        dname = '';
        samdf = {}
        const gteur = formData.delete("file");
        const gthh = formData.delete('objectData');
        this.docfiledata = '';
        this.selecteddoc = '';
      }
      }
    });
    event.target.value = null;
  }

  documents: Folder[] = [];
  getfoldersfordata(){
    const uid: any = this.localDataForAll._id
    this.authservice.getManager(uid).subscribe(async res => {
      if (res != null) {
        this.documents = res;
        this.addedfolders = await res.filter((red: any) => red.parentFolder == '');
        this.directfilearr = await res.filter((rea: any) => rea.property == true);
        console.log(this.directfilearr )
        const freshdoc = await this.findAndMatch(this.documents);
        this.dataSource.data = await freshdoc;
      }
      else {
        const fold: any = {
          name: "notes"
        }
        this.addedfolders.push(fold);
      }
    });
  }
  findAndMatch(folderdata: any) {
    const result: any = [];

    folderdata.forEach((obj: any) => {
      const matchingObj = folderdata.find((o: any) => o.parentFolder == obj._id);
      if (matchingObj) {
        if (!obj.subfolders) {
          obj.subfolders = [];
        }
        obj.subfolders.push(matchingObj);
        result.push(obj);
      }
    });
    const data: any[] = [result][0];
    return data;
  }
  hasChild = (_: number, node: any) => !!node._id && node.parentFolder && node.subfolders

  locations(inid: any, path: any) {
    const index = inid - 1;
    console.log(path);
    const back = this.gtinnertext[index];
    this.gtinnertext.splice(inid + 1);
    const dinoteds = this.documents.filter(res => res.parentFolder == path._id);
    this.selecteddoc = dinoteds;

  }
  cDoc: any = {};
  urlsng!: string;
  Mitem: boolean = false;
  rightclick(v: any) {
    this.cDoc = v;
    this.Mitem = true;
  }
  Dfiles: boolean = false;
  cFilesInd:any
  filesrightclick(v: any, fileind:any) {
    this.cDoc = v;
    this.Dfiles = true;
    this.cFilesInd = fileind;
  }
  viewpop: boolean = false;
  anotherpop: boolean = false;
  viewablefiles: any = '';
  blburl: any;
  viewfiles(dt: any) {
    if (this.fileTypes.find((type: any) => type.type === dt.mimetype)) {

      this.userservice.dounloadManagerDB(dt.fsidf).subscribe(async res => {
        const datas = await this.BlobGenerator(res, dt.mimetype);
        this.viewablefiles = await res;
        console.log("hiiii  iam " + datas);
        if (this.viewablefiles) {
          this.childDataLoaded = await true;
        } else { '' }
        if (dt.mimetype == "text/plain" || dt.mimetype == "text/txt" || dt.mimetype == "text/html") {
          setTimeout(() => {
            this.childDataLoaded = false;
          }, 2000);
        }
      })
      this.viewpop = true;
    } else {
      this.anotherpop = true;
    }
    setTimeout(() => {
      this.childDataLoaded = false;
    }, 5000);
  }

  BlobGenerator(base64ImageData: any, type: any) {
    const contentType = type;
    const byteCharacters = atob(base64ImageData.substr(`data:${contentType};base64,`.length));
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
  }

  fileTypes: any = [
    { type: 'text/plain', icon: 'fa-file-lines' },
    { type: 'application/pdf', icon: 'fa-file-pdf' },
    { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', icon: 'fa-file-word' },
    { type: 'application/vnd.ms-excel', icon: 'fa-file-excel' },
    { type: 'application/x-zip-compressed', icon: 'fa-file-archive' },
    { type: 'text/txt', icon: 'fa-file-alt' },
    { type: 'image/jpg', icon: 'fa-image' },
    { type: 'image/jpeg', icon: 'fa-image' },
    { type: 'image/png', icon: 'fa-image' },
    { type: 'image/gif', icon: 'fa-image' },
    { type: 'audio/mp3', icon: 'fa-headphones-simple' },
    { type: 'audio/wav', icon: 'fa-headphones' },
    { type: 'audio/mpeg', icon: 'fa-file-audio' },
    { type: 'video/mp4', icon: 'fa-film' },
    { type: 'video/avi', icon: 'fa-file-video' },
    { type: 'text/html', icon: 'fa-file-code' },
    { type: 'application/vnd.ms-powerpoint', icon: 'fa-file-powerpoint' }
  ];
  getFileIcon(fdato: string): string {
    const matchingFileType = this.fileTypes.find((type: any) => type.type === fdato);
    return matchingFileType ? matchingFileType.icon : 'fa-file';
  }
  Parentrs: any;
  async gettingsubfolders() {
    const dinoteds = await this.documents.filter(res => res.parentFolder == this.selecteddoc._id);
    if (dinoteds.length !== 0) {
      console.log(dinoteds);
      this.selecteddoc = dinoteds;
    } else {
      this.selecteddoc = [];
    }
  }
  async DeleteFiles(cDoc: any) {
    var fileID = await cDoc.fsidf;
    const dov = await cDoc;
    var sldata = await this.docfiledata;
    const data = {
      param1: fileID,
      param2: dov,
      param3: sldata
    };
    await this.userservice.ManagerDBdeleting(data).subscribe(async (event) => {
      if (event.type === HttpEventType.UploadProgress) {
        const dpr:any = Math.round((100 * event.loaded) / event.total) + "%";
        this.cprogress = dpr;
        console.log(this.cprogress)
      } else if (event instanceof HttpResponse) {
         this.cprogress = "0%";
         var rep = event.body;
         var name = rep.name || rep[0].name
      if (event.body) {
        console.log(event.body);
        if(this.docfiledata){
        const datasd = this.docfiledata.files.splice(this.cFilesInd,  1);
         }
        this.smlnotification = true;
        this.smlnotificationmfg = `${name} file deleted`;
        setTimeout(() => {
          this.smlnotification = false;
        }, 2800);
        fileID = '';
        sldata = '';
        cDoc = "";
        await this.getfoldersfordata();
      }
    }
    });
  }


  public style: object = {};
  public directFstyle: object = {};

  onResizeEnd(event: ResizeEvent): void {
    this.style = {
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`,
    };

  }
  directFonResizeEnd(event: ResizeEvent): void {
    this.directFstyle = {
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`,
    };
  }
  public In_style: object = {};
  public In_directFstyle: object = {};

  InonResizeEnd(event: ResizeEvent): void {
    this.In_style = {
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`,
    };
  }
  IndirectFonResizeEnd(event: ResizeEvent): void {
    this.In_directFstyle = {
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`,
    };
  }
  Gosted(event: ResizeEvent): void {
    this.style = {
      position: 'fixed',
      left: `${event.rectangle.left}px`,
      top: `${event.rectangle.top}px`,
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`
    };
  }
  brorders_target:boolean = false;
  bgorders(){
    this.iconsorder_target = false;
    this.brorders_target =! this.brorders_target
  }
  clbgmc(){
    this.brorders_target = false;
    this.iconsorder_target = false;
  }
  backgroundColor:any = '#17171a'; // Initial background color value;
  changeBackgroundColor(color: any): void {
      this.backgroundColor = `${color}`;
      localStorage.removeItem('backgroundColor');
      localStorage.setItem('backgroundColor', `${this.backgroundColor}`);
  }
  cfolder_pngs:any = '../../../assets/pngs/—Pngtree—purple folder icon material_4607704.png';
  changefoldericonpngs(pngs: any): void {
    this.cfolder_pngs = `${pngs}`;
    localStorage.removeItem('cfolder_pngs');
    localStorage.setItem('cfolder_pngs', `${this.cfolder_pngs}`);
}
  itschanger:boolean = false;
  itschenger(event:any){
    this.iconschanger = false;
    this.itschanger = true;
    if(event.target.id == 'closerc'){
      event.preventDefault();
      event.stopPropagation();
      this.itschanger = false;
    }
  }
  async gettingfrosession(){
   const daya = await localStorage.getItem('backgroundColor');
    this.backgroundColor = daya;
    const ficol = await localStorage.getItem('iconiconicolors');
    this.iconiconicolors = ficol;
    const folpngs:any = await localStorage.getItem('cfolder_pngs');
    this.cfolder_pngs = folpngs;
    const tetcolor:any = await localStorage.getItem('textColorsss');
    this.textColorsss = tetcolor;
  }
  
  dome(event:any, text:any){
    console.log(text)
   if(text == 'backgroundColor'){
    this.backgroundColor = `${event}`;
    localStorage.removeItem('backgroundColor');
    localStorage.setItem('backgroundColor', `${this.backgroundColor}`);
   }else if(text == "textColorsss"){
    this.textColorsss = `${event}`;
    localStorage.removeItem('textColorsss');
    localStorage.setItem('textColorsss', `${this.textColorsss}`);
   }
   else{
    this.iconiconicolors = `${event}`;
    localStorage.removeItem('iconiconicolors');
    localStorage.setItem('iconiconicolors', `${this.iconiconicolors}`);
   }
   
  }
  iconiconicolors:any;
  iconsorder_target:boolean = false;
  iconsorder(){
    this.brorders_target = false
    this.iconsorder_target =! this.iconsorder_target;
  }
  iconschanger:boolean = false;
  iconschenger(event:any){
    this.itschanger = false;
    this.iconschanger = true;
    if(event.target.id == 'closerc'){
      event.preventDefault();
      event.stopPropagation();
      this.iconschanger = false;
    }
  }
  textColorsss:any;
  Text_color:boolean = false;
  textcolorevent(event:any){
    this.itschanger = false;
    this.iconschanger = false;
    this.Text_color = true;
    if(event.target.id == 'closerc'){
      event.preventDefault();
      event.stopPropagation();
      this.Text_color = false;
    }
  }
  seltypes:string =''
  async gnrtf() {
    if (this.FolderName != '') {
      switch (this.seltypes) {
        case 'docx':
          this.gDocfiles(this.seltypes);
            break;
        case 'pdf':
          this.gtpdf(this.seltypes);
          break;
        default:
            console.log("No such day exists!");
            break;
    }
      this.txtgenfile = false;
    }
  }
  txtgenfile:boolean = false;
  
  async gDocfiles(type:string){
    this.seltypes = await type;
    this.txtgenfile = true;
    await this.FolderName
    if(this.FolderName){
      var bob:any= '';
    await fetch('../../../assets/generated.docx').then(async res=>{
        bob = await res.blob();
      })
  var file = new File([bob], `${this.FolderName}.docx`, { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      this.cupdfs(file);
    }
    this.FolderName = ''
   }
  async gtpdf(type:string){
     this.seltypes = await type;
    this.txtgenfile = true;
    await this.FolderName
    if(this.FolderName){
      var bob:any= '';
    await fetch('../../../assets/generatedpdf.pdf').then(async res=>{
        bob = await res.blob();
      })
  var file = new File([bob], `${this.FolderName}.pdf`, { type: 'application/pdf' });
      this.cupdfs(file);
    }
    this.FolderName='';
  }


  cupdfs(file:any){
    const uid: any = this.localDataForAll._id;   
    var dname:any = file;
    var formData = new FormData();
    if(this.cDoc){
       this.cDoc =this.cDoc;
    }else{
      this.cDoc = this.selecteddoc;
    }
    console.log(this.cDoc)
    var samdf: any = {
      uid: uid,
      datas: this.cDoc
    }
    console.log(samdf);
    formData.append('file', dname);
    formData.append('objectData', JSON.stringify(samdf));
    console.log(formData);

    this.userservice.G_PostingManagerDB(formData).subscribe(async res => {
      await console.log(res);
      await this.getfoldersfordata();
      // this.cprogress = this.userservice.progress;
      if (res) {
        this.smlnotification = true;
        this.smlnotificationmfg = res.filename + " " + "file uploaded";
        setTimeout(() => {
          this.smlnotification = false;
        }, 2800);

        dname = '';
        samdf = {}
        const gteur = formData.delete("file");
        const gthh = formData.delete('objectData');
      }
    });
    this.FolderName = '';
    this.txtgenfile = false;
    this.seltypes = '';
  }

}
