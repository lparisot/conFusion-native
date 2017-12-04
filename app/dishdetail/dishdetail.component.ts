import { Component, OnInit, Inject, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { TNSFontIconModule } from "nativescript-ngx-fonticon";
import { Toasty } from 'nativescript-toasty';
import 'rxjs/add/operator/switchMap';
import { action } from 'ui/dialogs';
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { Page } from "ui/page";
import { Animation, AnimationDefinition } from "ui/animation";
import { View } from "ui/core/view";
import { SwipeGestureEventData, SwipeDirection } from "ui/gestures";
import { Color } from 'color';
import * as enums from "ui/enums";
import * as SocialShare from 'nativescript-social-share';
import { ImageSource, fromUrl } from 'image-source';

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
  showComments: boolean = false;

  cardImage: View;
  commentList: View;
  cardLayout: View;

  constructor(
    private dishService: DishService,
    private favoriteService: FavoriteService,
    private route: ActivatedRoute,
    private routerExtensions: RouterExtensions,
    private fonticon: TNSFontIconModule,
    private modalService: ModalDialogService,
    private vcRef: ViewContainerRef,
    private page: Page,
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
      this.favorite = this.favoriteService.addFavorite(this.dish);
      const toast = new Toasty("Added dish " + this.dish.name + " to favorites", "short", "bottom");
      toast.show();
    }
  }

  openDialog() {
    const actionMenu = {
      'Add to Favorites': () => this.addToFavorites(),
      'Add Comment':      () => this.addAComment(),
      'Social Sharing':   () => this.socialShare()
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

  onSwipe(args: SwipeGestureEventData) {
    if (this.dish) {
      this.cardImage = <View>this.page.getViewById<View>("cardImage");
      this.cardLayout = <View>this.page.getViewById<View>("cardLayout");
      this.commentList = <View>this.page.getViewById<View>("commentList");

      if (args.direction === SwipeDirection.up && !this.showComments ) {
        this.animateUp();
      }
      else if (args.direction === SwipeDirection.down && this.showComments ) {
        this.animateDown();
      }
    }
  }

  showAndHideComments() {
    this.cardImage = <View>this.page.getViewById<View>("cardImage");
    this.cardLayout = <View>this.page.getViewById<View>("cardLayout");
    this.commentList = <View>this.page.getViewById<View>("commentList");

    if (!this.showComments ) {
      this.animateUp();
    }
    else if (this.showComments ) {
      this.animateDown();
    }
  }

  animateUp() {
    let definitions = new Array<AnimationDefinition>();
    let a1: AnimationDefinition = {
      target: this.cardImage,
      scale: { x: 1, y: 0 },
      translate: { x: 0, y: -200 },
      opacity: 0,
      duration: 500,
      curve: enums.AnimationCurve.easeIn
    };
    definitions.push(a1);

    let a2: AnimationDefinition = {
      target: this.cardLayout,
      backgroundColor: new Color("#ffc107"),
      duration: 500,
      curve: enums.AnimationCurve.easeIn
    };
    definitions.push(a2);

    let animationSet = new Animation(definitions);

    animationSet.play()
      .then(() => {
        this.showComments = true;
      })
      .catch((e) => {
        console.log(e.message);
      });
  }

  animateDown() {
    let definitions = new Array<AnimationDefinition>();
    let a1: AnimationDefinition = {
      target: this.cardImage,
      scale: { x: 1, y: 1 },
      translate: { x: 0, y: 0 },
      opacity: 1,
      duration: 500,
      curve: enums.AnimationCurve.easeIn
    };
    definitions.push(a1);

    let a2: AnimationDefinition = {
      target: this.cardLayout,
      backgroundColor: new Color("#ffffff"),
      duration: 500,
      curve: enums.AnimationCurve.easeIn
    };
    definitions.push(a2);

    let animationSet = new Animation(definitions);

    animationSet.play()
      .then(() => {
        this.showComments = false;
      })
      .catch((e) => {
        console.log(e.message);
      });
  }

  socialShare() {
    let image: ImageSource;

    fromUrl(this.baseURL + this.dish.image)
      .then((img: ImageSource) => {
        image = img;
        SocialShare.shareImage(image, "How would you like to share this image?");
      })
      .catch(() => console.log('Error loading image ' + this.baseURL + this.dish.image));
  }
}
