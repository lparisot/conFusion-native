import { Component, ChangeDetectorRef } from '@angular/core';

import { DrawerPage } from '../shared/drawer/drawer.page';

@Component({
  selector: 'app-contact',
  moduleId: module.id,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent extends DrawerPage {
  information: string = "\
121, Clear Water Bay Road\n\
Clear Water Bay, Kowloon\n\
HONG KONG\n\
Tel: +852 1234 5678\n\
Fax: +852 8765 4321\n\
Email: confusion@food.net";

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
  }

}
