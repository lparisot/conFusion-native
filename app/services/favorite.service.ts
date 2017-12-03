import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as LocalNotifications from 'nativescript-local-notifications';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { CouchbaseService } from '../services/couchbase.service';

@Injectable()
export class FavoriteService {
  favorites: Array<number>;
  docId: string = "favorites";

  constructor(
    private dishService: DishService,
    private couchbaseService: CouchbaseService
  ) {
    this.favorites = [];

    let doc = this.couchbaseService.getDocument(this.docId);
    if( doc == null) {
      this.couchbaseService.createDocument({ "favorites": [] }, this.docId);
    }
    else {
      this.favorites = doc.favorites;
    }

    LocalNotifications.hasPermission().then(
        function(granted) {
          console.log("Local notifications permission granted? " + (granted ? 'YES' : 'NO'));
        }
    );
  }

  isFavorite(id: number): boolean {
      return this.favorites.some(el => el === id);
  }

  getFavorites(): Observable<Dish[]> {
    return this.dishService
      .getDishes()
      .map(dishes => dishes.filter(dish => this.favorites.some(el => el === dish.id)));
  }

  addFavorite(dish: Dish): boolean {
    if (!this.isFavorite(dish.id)) {
      this.favorites.push(dish.id);
      this.couchbaseService.updateDocument(this.docId, { "favorites": this.favorites });
      LocalNotifications.schedule([{
        id: dish.id,
        title: "Confusion favorites",
        body: 'Dish ' + dish.name + ' added successfully to favorites'
      }]).then(
        () => console.log('Notification scheduled'),
        (error) => console.log('Error showing notification ' + error)
      );
    }
    return true;
  }

  deleteFavorite(dish: Dish): Observable<Dish[]> {
    let index = this.favorites.indexOf(dish.id);
    if (index >= 0) {
      this.favorites.splice(index, 1);
      this.couchbaseService.updateDocument(this.docId, { "favorites": this.favorites });
      LocalNotifications.schedule([{
        id: dish.id,
        title: "Confusion favorites",
        body: 'Dish ' + dish.name + ' removed successfully from favorites'
      }]).then(
        () => console.log('Notification scheduled'),
        (error) => console.log('Error showing notification ' + error)
      );
      return this.getFavorites();
    }
    else {
      return Observable.throw('Deleting non-existant favorite');
    }
  }
}
