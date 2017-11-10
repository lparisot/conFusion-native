import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';

import { ProcessHttpMsgService } from './process-httpmsg.service';
import { Leader } from '../shared/leader';

@Injectable()
export class LeaderService {
  constructor(public http: Http,
              private processHTTPMsgService: ProcessHttpMsgService,
              @Inject('BaseURL') private baseURL) {
    console.log('Hello LeaderService service');
  }

  getLeaders(): Observable<Leader[]> {
    return this.http
      .get(this.baseURL + 'leaders')
      .map(res => { return this.processHTTPMsgService.extractData(res); })
      .catch(error => { return this.processHTTPMsgService.handleError(error); });
  }

  getLeader(id: number): Observable<Leader> {
    return this.http
      .get(this.baseURL + 'leaders/'+ id)
      .map(res => { return this.processHTTPMsgService.extractData(res); })
      .catch(error => { return this.processHTTPMsgService.handleError(error); });
  }

  getFeaturedLeader(): Observable<Leader> {
    return this.http
      .get(this.baseURL + 'leaders?featured=true')
      .map(res => { return this.processHTTPMsgService.extractData(res)[0]; })
      .catch(error => { return this.processHTTPMsgService.handleError(error); });
  }
}
