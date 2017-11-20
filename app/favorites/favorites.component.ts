import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ListViewEventData, RadListView } from 'nativescript-telerik-ui/listview';
import { RadListViewComponent } from 'nativescript-telerik-ui/listview/angular';
import { View } from 'ui/core/View';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { layout } from 'tns-core-modules/utils/utils';

import { FavoriteService } from '../services/favorite.service';
import { Dish } from '../shared/dish';
import { DrawerPage } from '../shared/drawer/drawer.page';

@Component({
  selector: 'app-favorites',
  moduleId: module.id,
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent extends DrawerPage implements OnInit {
  favorites: ObservableArray<Dish>;
  errMess: string;

  @ViewChild('myListView') listViewComponent: RadListViewComponent;

  constructor(
    private favoriteservice: FavoriteService,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject('BaseURL') private baseURL) { super(changeDetectorRef); }

  ngOnInit() {
    this.getFavorites();
  }

  deleteFavorite(id: number) {
    this.favoriteservice
      .deleteFavorite(id)
      .subscribe(
        favorites => this.favorites = new ObservableArray(favorites),
        errmess => this.errMess = errmess
      );
  }

  getFavorites() {
    this.favoriteservice
      .getFavorites()
      .subscribe(
        favorites => this.favorites = new ObservableArray(favorites),
        errmess => this.errMess = errmess
      );
  }

  public onPullToRefreshInitiated(args: ListViewEventData) {
    console.log("Pull to refresh");
    setTimeout(() => {
      let listView = args.object;
      this.favoriteservice
        .getFavorites()
        .subscribe(
          favorites => {
            this.favorites = new ObservableArray(favorites);
            listView.notifyPullToRefreshFinished();
          },
          errmess => {
            this.errMess = errmess;
            listView.notifyPullToRefreshFinished();
          }
        );
    }, 1000);
  }

  public onCellSwiping(args: ListViewEventData) {
    var swipeLimits = args.data.swipeLimits;
    var currentItemView = args.object;
    var currentView;

    if(args.data.x > 200) {

    }
    else if (args.data.x < -200) {

    }
  }

  public onSwipeCellStarted(args: ListViewEventData) {
    var swipeLimits = args.data.swipeLimits;

    swipeLimits.left = 80 * layout.getDisplayDensity();
    swipeLimits.right = 80 * layout.getDisplayDensity();
    swipeLimits.threshold = 60 * layout.getDisplayDensity();

    /*
    var swipeView = args['object'];
    var leftItem = swipeView.getViewById<View>('mark-view');
    var rightItem = swipeView.getViewById<View>('delete-view');
    swipeLimits.left = leftItem.getMeasuredWidth();
    swipeLimits.right = rightItem.getMeasuredWidth();
    swipeLimits.threshold = leftItem.getMeasuredWidth()/2;
    */
  }

  public onSwipeCellFinished(args: ListViewEventData) {

  }

  public onLeftSwipeClick(args: ListViewEventData) {
    console.log('Left swipe click');
    this.listViewComponent.listView.notifySwipeToExecuteFinished();
  }

  public onRightSwipeClick(args: ListViewEventData) {
    console.log('Right swipe click');
    this.deleteFavorite(args.object.bindingContext.id);
    this.listViewComponent.listView.notifySwipeToExecuteFinished();
  }
}
