import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { ConfigurationService } from './configuration.service';
import { BankConfiguration } from '../bank-resolver/Models';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  static configuration: BankConfiguration[] = [];

  constructor(private http: HttpClient, private confSvc: ConfigurationService) {
    this.confSvc.getAllConfiguration().then(
      res => {
        RestService.configuration = res;
      },
      err => { }
    );
  }

  private getUrl(): string {
    // debugger;
    let url = '';
    const __bName = localStorage.getItem('__bName');
    if (null !== RestService.configuration
      && RestService.configuration.length > 0) {
        url = RestService.configuration.filter(e => e.name.toLowerCase() === __bName.toLowerCase())[0].apiUrl
      }
    url += 'api/';
    // console.log(url);
    //  url = 'https://localhost:5001/api/';
    return url;
  }

  public getAll<T>(ofwhat: string): Observable<T> {
    return this.http.get<T>(this.getUrl() + ofwhat);
  }

  public getBankJsonConfig<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

  public postBankJsonConfig<T>(url: string, data: T): Observable<T> {
    return this.http.post<T>(url, data);
  }

// This to get Ux configuration data from Master folder
  public getBankJsonConfigUx<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

// This to put Ux configuration data to Master and UX folder
  public postBankJsonConfigUx<T>(url: string, data: T): Observable<T> {
    return this.http.post<T>(url, data);
  }


  public getSingle<T>(ofwhat: string, id: number): Observable<T> {
    return this.http.get<T>(this.getUrl() + ofwhat + '/' + id);
  }

  public add<T>(ofwhat: string, data: T): Observable<T> {
    return this.http.post<T>((this.getUrl() + ofwhat), data);
  }

  public addUpdDel<T>(ofwhat: string, data: T): Observable<T> {
    debugger;
    return this.http.post<T>((this.getUrl() + ofwhat), data);
  }

  public update<T>(ofwhat: string, data: T): Observable<T> {
    return this.http.put<T>(this.getUrl() + ofwhat, data);
  }

  public delete<T>(ofwhat: string, id: number): Observable<T> {
    return this.http.delete<T>(this.getUrl() + ofwhat + '/' + id);
  }
  /*
    private generic2<T>(method: string, ofwhat: string, data: T = null,
                        id: number = 0): Observable<T> {
      const __bName = localStorage.getItem('__bName');
      debugger;
      this.confSvc.getConfigurationForName(__bName).then(
        res => {
          const url = res.server + 'api/';
          console.log('URL - ' + url);
          debugger;
          switch (method) {
            case 'get':
              return this.http.get<T>(url + ofwhat);
            case 'getSingle':
              return this.http.get<T>(url + ofwhat + '/' + id);
            case 'post':
              return this.http.post<T>((url + ofwhat), data);
            case 'put':
              return this.http.put<T>(url + ofwhat, data);
            case 'delete':
              return this.http.delete<T>(url + ofwhat + '/' + id);
          }
        },
        err => { }
      )
    }

    public getAll<T>(ofwhat: string): Observable<T> {
      // return this.http.get<T>(this.url + ofwhat);
      return this.generic2('get', ofwhat);
    }

    public getSingle<T>(ofwhat: string, id: number): Observable<T> {
      // return this.http.get<T>(this.url + ofwhat + '/' + id);
      return this.generic2('getSingle', ofwhat, null, id);
    }

    public add<T>(ofwhat: string, data: T): Observable<T> {
      return this.generic2('post', ofwhat, data);
    }

    public addUpdDel<T>(ofwhat: string, data: T): Observable<T> {
      return this.generic2('post', ofwhat, data);
    }

    public addUpdDel2<T>(ofwhat: string, data: T): Observable<T> {
      const url = 'http://213.175.201.219/plesk-site-preview/patkai.svc.worldlegaldocs.com/api/';
      return this.http.post<T>((url + ofwhat), data);
    }

    public update<T>(ofwhat: string, data: T): Observable<T> {
      // return this.http.put<T>(this.url + ofwhat, data);
      return this.generic2('put', ofwhat, data);
    }

    public delete<T>(ofwhat: string, id: number): Observable<T> {
      // return this.http.delete<T>(this.url + ofwhat + '/' + id);
      return this.generic2('delete', ofwhat, null, id);
    }*/
}
