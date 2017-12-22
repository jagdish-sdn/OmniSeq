/** Provider file created for call API's
 * Created: 30-Oct-2017
 * Creator: Jagdish Thakre
*/
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CONFIG } from '../../config/config';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class HttpServiceProvider {

  constructor(
    public http: Http,
    public events: Events
  ) {
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Content-Type', 'application/json; charset=utf-8');
  }

  /**
   * Function created for call post method API
   * Created: 30-Oct-2017
   * Creator: Jagdish Thakre
   */
  public postData(url, data) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    let token = localStorage.getItem("Token");
    if(token){
      token = 'bearer '+ token.replace(/['"]+/g, '');
      headers.append('Authorization', token);
    }    
    let options: any = {
      headers: headers
    };
    url = CONFIG.HTTP_HOST_URL+url;
    return this.http.post(url, data, options)
      .map(this.extractData)
      .catch(this.handleError);
  }  

  /**
   * Function created for call get method API
   * Created: 30-Oct-2017
   * Creator: Jagdish Thakre
   */
  public getData(url) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    let token = localStorage.getItem("Token");
    if(token){
      token = 'bearer '+ token.replace(/['"]+/g, '');
      headers.append('Authorization', token);
    }
    let options: any = {
      headers: headers
    };
    url = CONFIG.HTTP_HOST_URL+url;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  
  private extractData(res: Response) {
    let body = res.json();
    if(body.status == 203){
      this.events.publish("clearSession");
      return {};
    }else{
      return body || {};
    }
  }
  /**
   * Function created for handle error's
   * Created: 30-Oct-2017
   * Creator: Jagdish Thakre
   */
  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }
}
