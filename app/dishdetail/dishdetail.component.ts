import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { TNSFontIconModule } from "nativescript-ngx-fonticon";
import { Toasty } from 'nativescript-toasty';
import 'rxjs/add/operator/switchMap';

import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';
import { DishService } from '../services/dish.service';
import { FavoriteService } from '../services/favorite.service';

@Component({
  selector: 'app-dishdetail',
  moduleId: module.id,
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.css']
})
export class DishdetailComponent implements OnInit {
  dish: Dish;
  comment: Comment;
  errMess: string;
  avgStars: string;
  numComments: number;
  favorite: boolean = false;

  constructor(
    private dishService: DishService,
    private favoriteService: FavoriteService,
    private route: ActivatedRoute,
    private routerExtensions: RouterExtensions,
    private fonticon: TNSFontIconModule,
    @Inject('BaseURL') private baseURL) { }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.dishService.getDish(+params['id']))
      .subscribe(
        dish => {
          this.dish = dish;
          this.favorite = this.favoriteService.isFavorite(this.dish.id);
          this.numComments = this.dish.comments.length;

          let total = 0;
          this.dish.comments.forEach(comment => total += comment.rating);
          this.avgStars = (total / this.numComments).toFixed(2);
        },
        errmess => { this.dish = null; this.errMess = <any>errmess; }
      );
  }

  goBack(): void {
    this.routerExtensions.back();
  }

  addToFavorites() {
    if (!this.favorite) {
      console.log('Adding to favorites', this.dish.name);
      this.favorite = this.favoriteService.addFavorite(this.dish.id);
      const toast = new Toasty("Added dish " + this.dish.name, "short", "bottom");
      toast.show();
    }
  }
}
