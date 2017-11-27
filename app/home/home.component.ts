import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
import { Page } from "ui/page";
import { View } from "ui/core/view";
import { SwipeGestureEventData, SwipeDirection } from "ui/gestures";
import * as enums from "ui/enums";

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { DrawerPage } from '../shared/drawer/drawer.page';

@Component({
  selector: 'app-home',
  moduleId: module.id,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends DrawerPage implements OnInit {
  dish: Dish;
  promotion: Promotion;
  leader: Leader;
  dishErrMess: string;
  promoErrMess: string;
  leaderErrMess: string;

  showCard = 0;
  numberOfCards = 3;
  cards: View[] = [];
  translation: number = 2000;
  duration: number = 500;

  constructor(
    private dishservice: DishService,
    private promotionservice: PromotionService,
    private leaderservice: LeaderService,
    private changeDetectorRef: ChangeDetectorRef,
    private page: Page,
    private fonticon: TNSFontIconService,
    @Inject('BaseURL') private baseURL
  ) {
      super(changeDetectorRef);
  }

  ngOnInit() {
    this.dishservice
      .getFeaturedDish()
      .subscribe(
        dish => this.dish = dish,
        errmess => this.dishErrMess = <any>errmess
      );

    this.promotionservice
      .getFeaturedPromotion()
      .subscribe(
        promotion => this.promotion = promotion,
        errmess => this.promoErrMess = <any>errmess
      );

    this.leaderservice
      .getFeaturedLeader()
      .subscribe(
        leader => this.leader = leader,
        errmess => this.leaderErrMess = <any>errmess
      );
  }

  onSwipe(args: SwipeGestureEventData) {
    console.log("Swipe Direction: " + args.direction);

    if (args.direction === SwipeDirection.left) {
      this.animate(1);
    }
    else if (args.direction === SwipeDirection.right) {
      this.animate(-1);
    }
  }

  animate(inversion: number) {
    if (this.dish && this.promotion && this.leader) {
      this.cards[0] = this.page.getViewById<View>('leftCard');
      this.cards[1] = this.page.getViewById<View>('middleCard');
      this.cards[2] = this.page.getViewById<View>('rightCard');

      const leftCard = (this.showCard - inversion + this.numberOfCards) % this.numberOfCards;
      const currentCard = this.showCard;
      const rightCard = (this.showCard + inversion + this.numberOfCards) % this.numberOfCards;

      //console.log('leftCard :' + leftCard + ' currentCard: ' + currentCard + ' rightCard: ' + rightCard);
      //console.log(this.cards[leftCard], this.cards[currentCard], this.cards[rightCard]);

      this.cards[leftCard].animate({
        translate: { x: inversion * this.translation, y: 0 }
      })
      .then(() => {
        this.cards[currentCard].animate({
          translate: { x: inversion * -this.translation, y: 0 },
          duration: this.duration,
          curve: enums.AnimationCurve.easeInOut
        })
        .then(() => {
          this.showCard = rightCard;
          this.cards[rightCard].animate({
            translate: { x: 0, y: 0 },
            duration: this.duration,
            curve: enums.AnimationCurve.easeInOut
          });
        });
      });
    }
  }
}
