import { Injectable, OnChanges } from '@angular/core';
import {environment} from '../../environments/environment';
import { catchError, from, map, Observable, Observer, of, switchMap, throwError } from 'rxjs';
import { ProfileUser } from '../Model/user';
import { AuthService } from './auth.service';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private authService: AuthService,  private http: HttpClient) { }
  baseUri: string = `${environment.Main_backend_url}`;
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  createUser(data: any): Observable<any> {
    let url = `${this.baseUri}users`;
    return this.http.post(url, data).pipe(catchError(this.errorMgmt));
  }
  // Get all employees
  getUser() {
    return this.http.get(`${this.baseUri}`)
  }
  // Get employee
  getUserWithid(id: any): Observable<any> {
    let url = `${this.baseUri}users/${id}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: any) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }
  // Update employee
  updateUser(id: any, data: any): Observable<any> {
    let url = `${this.baseUri}users/${id}`;
    return this.http
      .put(url, data, { headers: this.headers })
      .pipe(catchError(this.errorMgmt));
  }
  // Delete employee
  deleteUser(id: any): Observable<any> {
    let url = `${this.baseUri}users/${id}`;
    return this.http
      .delete(url, { headers: this.headers })
      .pipe(catchError(this.errorMgmt));
  }
  // Error handling
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
  
  /*** this. is the for notes** */
  
  createNotes(data: any): Observable<any> {
    let url = `${this.baseUri}Notes`;
    return this.http.post(url, data).pipe(catchError(this.errornotesmsg));
  }
  // Get all employees
  getAllNotes() {
    return this.http.get(`${this.baseUri}Notes`)
  }
  // Get employee
  getNotes(): Observable<any> {
    let url = `${this.baseUri}Notes/imp`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: any) => {
        return res || {};
      }),
      catchError(this.errornotesmsg)
    );
  }
  // Update employee
  updateNotes(id: any, data: any): Observable<any> {
    let url = `${this.baseUri}Notes/${id}`;
    return this.http
      .put(url, data, { headers: this.headers })
      .pipe(catchError(this.errornotesmsg));
  }
  // Delete employee
  deleteNotes(id: any): Observable<any> {
    let url = `${this.baseUri}Notes/${id}`;
    return this.http.delete(url, { headers: this.headers }).pipe(catchError(this.errornotesmsg));
  }
  // Error handling
  errornotesmsg(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
 
  //uploads////////////////////////////////////////********************** */
   getdbimage():Observable<any>{
   return this.http.get<any>(`${environment.Main_backend_url}data`) ;
   }
  //  dounloadImage(filename:any):Observable<any>{
  //   console.log(filename)
  //     return this.http.get<any>(`http://localhost:4000/api/data/${filename}`)
  //  }
   downloadnoteinnerimg(id:any, name:any):Observable<any>{
      return this.http.get<any>(`${environment.Main_backend_url}data/innernotes/${id}/${name}`);
   }
   Postingimage(formData:any):Observable<any>{
    const getudb:any =  localStorage.getItem('user');
    const dt = JSON.parse(getudb)
    return this.http.post<any>(`${environment.Main_backend_url}file`, formData)
   }
   Postingmulimg(formData:any):Observable<any>{
    return this.http.post<any>(`${environment.Main_backend_url}multipleFiles`, formData);
   }
   filedeleting(id:any):Observable<any>{
    return this.http.get<any>(`${environment.Main_backend_url}data/delete/${id}`)
 }

   //*****************Manager-Part************************/
   //uploads////////////////////////////////////////********************** */
   getmanagerDT():Observable<any>{
    return this.http.get<any>(`${environment.Main_backend_url}Files`)
    }
    dounloadManagerDB(fsidf:any):Observable<any>{
       return this.http.get<any>(`${environment.Main_backend_url}Files/${fsidf}`)
    }
  
    PostingManagerDB(formData:any):Observable<any>{
     return this.http.post<any>(`${environment.Main_backend_url}slfiles`, formData, {
      reportProgress: true,
      observe: "events"
    });
      // .pipe(map(
      //   event => {
      //     if (event.type == HttpEventType.UploadProgress) {
      //       this.progress = Math.round((100 / (event.total || 0) * event.loaded)) + "%";
      //       console.log(this.progress)
      //     } else if (event.type == HttpEventType.Response) {
      //       this.progress = "0%";
      //     }
      //   }
      // ))
    }

    
    G_PostingManagerDB(formData:any):Observable<any>{
      console.log(formData);
      return this.http.post<any>(`${environment.Main_backend_url}G-files`,formData, {
       reportProgress: true,
       observe: "events"
     })
      //  .pipe(map(
      //    event => {
      //      if (event.type == HttpEventType.UploadProgress) {
      //        this.progress = Math.round((100 / (event.total || 0) * event.loaded)) + "%";
      //        console.log(this.progress)
      //      } else if (event.type == HttpEventType.Response) {
      //        this.progress = "0%";
      //      }
      //    }
      //  ))
     }
    PostingmulManagerDB(formData:any):Observable<any>{
     return this.http.post<any>(`${environment.Main_backend_url}multipleFilesmn`, formData)
    }
    ManagerDBdeleting(dmscd:any):Observable<any>{
      console.log(dmscd)
     return this.http.post<any>(`${environment.Main_backend_url}Files/delete`, dmscd, {
      reportProgress: true,
      observe: "events"
    })
      // .pipe(map(
      //   event => {
      //     if (event.type == HttpEventType.UploadProgress) {
      //       this.progress = Math.round((100 / (event.total || 0) * event.loaded)) + "%";
      //       console.log(this.progress)
      //     } else if (event.type == HttpEventType.Response) {
      //       this.progress = "0%";
      //     }
      //   }
      // ))
      
  }
  
  //  deleting(id:any){
  //   return this.http.delete<any>(`http://localhost:4000/api/data/${id}`)
  //  }

//   upload_doc(file:any):Observable<any>{
//     let url =  `http://localhost:4000/uploads`;
//     const req = new HttpRequest('POST', url , file, {
//       reportProgress: true,
//       responseType: 'json'
//     });

//     return this.http.request(req);
//     // let url =  `${this.baseUri}/upload`;
//     // return this.http.post(url, file);
// }


}

