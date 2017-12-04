import { Component } from "@angular/core";
import { TNSFontIconModule } from "nativescript-ngx-fonticon";

@Component({
  selector: 'drawer-content',
  templateUrl: './shared/drawer/drawer.component.html',
})
export class DrawerComponent {
  constructor(private fonticon: TNSFontIconModule) { }
}
