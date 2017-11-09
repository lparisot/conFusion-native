import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';

import { Dish } from '../shared/dish';
import { ProcessHttpMsgService } from '../services/process-httpmsg.service';

@Injectable()
export class DishService {

  constructor(public http: Http,
              private processHTTPMsgService: ProcessHttpMsgService,
              @Inject('BaseURL') private baseURL) {
    console.log('Hello DishService service');
  }

  getDishes(): Observable<Dish[]> {
    return this.http
      .get(this.baseURL + 'dishes')
      .map(res => { return this.processHTTPMsgService.extractData(res); })
      .catch(error => { return this.processHTTPMsgService.handleError(error); });
  }

  getDish(id: number): Observable<Dish> {
    return this.http
      .get(this.baseURL + 'dishes/'+ id)
      .map(res => { return this.processHTTPMsgService.extractData(res); })
      .catch(error => { return this.processHTTPMsgService.handleError(error); });
  }

  getFeaturedDish(): Observable<Dish> {
    return this.http
      .get(this.baseURL + 'dishes?featured=true')
      .map(res => { return this.processHTTPMsgService.extractData(res)[0]; })
      .catch(error => { return this.processHTTPMsgService.handleError(error); });
  }
}
