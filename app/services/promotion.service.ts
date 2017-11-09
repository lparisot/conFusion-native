import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';

import { Promotion } from '../shared/promotion';
import { ProcessHttpMsgService } from './process-httpmsg.service';

@Injectable()
export class PromotionService {
  constructor(public http: Http,
              private processHTTPMsgService: ProcessHttpMsgService,
              @Inject('BaseURL') private baseURL) {
    console.log('Hello PromotionService service');
  }

  getPromotions(): Observable<Promotion[]> {
    return this.http
      .get(this.baseURL + 'promotions')
      .map(res => { return this.processHTTPMsgService.extractData(res); })
      .catch(error => { return this.processHTTPMsgService.handleError(error); });
  }

  getPromotion(id: number): Observable<Promotion> {
    return  this.http
      .get(this.baseURL + 'promotions/'+ id)
      .map(res => { return this.processHTTPMsgService.extractData(res); })
      .catch(error => { return this.processHTTPMsgService.handleError(error); });
  }

  getFeaturedPromotion(): Observable<Promotion> {
    return this.http
      .get(this.baseURL + 'promotions?featured=true')
      .map(res => { return this.processHTTPMsgService.extractData(res)[0]; })
      .catch(error => { return this.processHTTPMsgService.handleError(error); });
  }
}
