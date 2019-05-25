import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { ToastrManager } from 'ng6-toastr-notifications';

@Injectable({
  providedIn: 'root'
})
export class HttpIntercepterService {

  private _baseURL = environment.url;
  constructor(private http: HttpClient, public toastr: ToastrManager) { }

  getDataFromServer(url: any): Observable<any> {
    return this.http.get(this._baseURL + '/' + url).pipe(map(
      (response: any) => response),
    )
  }

  postDataToServer(url: any, body: any): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this._baseURL + '/' + url, body, { headers: headers }).catch((e: any) => Observable.throw(this.errorHandler(e)))
      .pipe(map((response: any) => response));
  }

  deleteDataFromServer(url: any): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this._baseURL + '/' + url, { headers: headers }).catch((e: any) => Observable.throw(this.errorHandler(e)))
      .pipe(map((response: any) => response));
  }

  errorHandler(err: any): void {
    this.toastr.errorToastr(err.error.errors.message, 'Oops!');
  }
}
