
import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {catchError, Observable, throwError } from "rxjs";
import { Folder } from "../Model/tree-datasource";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { SafeResourceUrl, DomSanitizer } from "@angular/platform-browser";

@Injectable()
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  uid: any
  constructor(private http: HttpClient,public sanitizer: DomSanitizer) {
     const dt = JSON.parse(localStorage.getItem('user')!);
    if(dt){
      this.uid = dt._id;
    }
  }
  baseUri: string = `${environment.Main_backend_url}`;
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  /// file manager //////
  getManager(id:any): Observable<any> {
    let url = `${this.baseUri}Folder${id}`;
    return this.http.get(url).pipe(catchError(this.errorMgmt));
  }
  addfolderdt(folder: Folder): Observable<any> {
    const data: any = [{ userID: this.uid }, folder];
    let url = `${this.baseUri}Files`;
    return this.http.post(url, data).pipe(catchError(this.errorMgmt));
  }

  addfandupd(folder: any, slfolder: any): Observable<any> {
    const pid = folder._id;
    const data: any = [{ userID: this.uid }, folder, slfolder];
    console.log(folder);

    let url = `${this.baseUri}folders`;
    return this.http.post(url, data).pipe(catchError(this.errorMgmt));
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => {
      return errorMessage;
    });
  }

  // urlDoc: string = `https://view.officeapps.live.com/op/embed.aspx?src=https://stackblitz.com/storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBdkpMIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--e75389b18343665404852ed4cba8bd25938fa9bd/file-sample_1MB.doc`;
  urlDoc: string = `https://view.officeapps.live.com/op/embed.aspx?src=`;
  urlxl: string =
    "https://view.officeapps.live.com/op/embed.aspx?src=https://go.microsoft.com/fwlink/?LinkID=521962";

  urlppt: string =
    "https://view.officeapps.live.com/op/embed.aspx?src=  http://www.dickinson.edu/download/downloads/id/1076/sample_powerpoint_slides.pptx";

  urlSafe: SafeResourceUrl | undefined;
  selectDocumentType(type: any) {
    switch (type) {
      case "doc":
        this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.urlDoc
        )
        break;
      case "xl":
        this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.urlxl
        );
        break;
      case "ppt":
        this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.urlppt
        );
        break;
      default:
        this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.urlDoc
        );
    }
  }

}





