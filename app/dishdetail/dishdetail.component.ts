import { Component, OnInit, Inject, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { TNSFontIconModule } from "nativescript-ngx-fonticon";
import { Toasty } from 'nativescript-toasty';
import 'rxjs/add/operator/switchMap';
import { action } from 'ui/dialogs';
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";

import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';
import { DishService } from '../services/dish.service';
import { FavoriteService } from '../services/favorite.service';
import { CommentModalComponent } from "../comment/comment.component";

@Component({
  selector: 'app-dishdetail',
  moduleId: module.id,
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.css']
})
export class DishdetailComponent implements OnInit {
  dish: Dish;
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
    private modalService: ModalDialogService,
    private vcRef: ViewContainerRef,
    @Inject('BaseURL') private baseURL) { }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.dishService.getDish(+params['id']))
      .subscribe(
        dish => {
          this.dish = dish;
          this.favorite = this.favoriteService.isFavorite(this.dish.id);
          this.updateStats();
        },
        errmess => { this.dish = null; this.errMess = <any>errmess; }
      );
  }

  updateStats() {
    this.numComments = this.dish.comments.length;

    let total = 0;
    this.dish.comments.forEach(comment => total += comment.rating);
    this.avgStars = (total / this.numComments).toFixed(2);
  }

  goBack(): void {
    this.routerExtensions.back();
  }

  addToFavorites() {
    if (!this.favorite) {
      console.log('Adding to favorites', this.dish.name);
      this.favorite = this.favoriteService.addFavorite(this.dish.id);
      const toast = new Toasty("Added dish " + this.dish.name + " to favorites", "short", "bottom");
      toast.show();
    }
  }

  openDialog() {
    const actionMenu = {
      'Add to Favorites': () => this.addToFavorites(),
      'Add Comment':      () => this.addAComment()
    };

    let options = {
      title: 'Actions',
      cancelButtonText: 'Cancel',
      actions: Object.keys(actionMenu)
    };

    action(options).then(result => {
      let action = actionMenu[result];
      if (action) action();
    });
  }

  addAComment() {
    let options: ModalDialogOptions = {
      viewContainerRef: this.vcRef,
      fullscreen: false
    };

    this.modalService
      .showModal(CommentModalComponent, options)
      .then((comment: Comment) => {
        if (comment != null) {
          this.dish.comments.push(comment);

          this.updateStats();
        }
      });
  }
}
