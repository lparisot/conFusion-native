import { Component, OnInit, ChangeDetectorRef, Inject, ViewContainerRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Page } from "ui/page";
import { View } from "ui/core/view";
import { TextField } from 'ui/text-field';
import { Switch } from 'ui/switch';
import * as enums from "ui/enums";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { Couchbase } from 'nativescript-couchbase';

import { DrawerPage } from '../shared/drawer/drawer.page';
import { ReservationModalComponent } from "../reservationmodal/reservationmodal.component";
import { CouchbaseService } from "../services/couchbase.service";

@Component({
  selector: 'app-reservation',
  moduleId: module.id,
  templateUrl: './reservation.component.html'
})
export class ReservationComponent extends DrawerPage implements OnInit {
  reservation: FormGroup;
  form: boolean = true;
  view: View;
  docId: string = "reservations";

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private modalService: ModalDialogService,
    private page: Page,
    private couchbaseService: CouchbaseService,
    private vcRef: ViewContainerRef
  ) {
    super(changeDetectorRef);

    this.reservation = this.formBuilder.group({
      guests: 3,
      smoking: false,
      dateTime: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.form = true;
  }

  createModalView(args) {
    const options: ModalDialogOptions = {
      viewContainerRef: this.vcRef,
      context: args,
      fullscreen: false
    };

    this.modalService
      .showModal(ReservationModalComponent, options)
      .then((result: any) => {
        if (args === "guest") {
          this.reservation.patchValue({ guests: result });
        }
        else if (args === "date-time") {
          this.reservation.patchValue({ dateTime: result });
        }
      });
    }

  onSmokingChecked(args) {
    let smokingSwitch = <Switch>args.object;
    if (smokingSwitch.checked) {
      this.reservation.patchValue({ smoking: true });
    }
    else {
      this.reservation.patchValue({ smoking: false });
    }
  }

  onGuestChange(args) {
    let textField = <TextField>args.object;

    this.reservation.patchValue({ guests: textField.text });
  }

  onDateTimeChange(args) {
    let textField = <TextField>args.object;

    this.reservation.patchValue({ dateTime: textField.text });
  }

  onSubmit() {
    const view = <View>this.page.getViewById<View>("view");
    const duration = 500;

    view.animate({
      scale: { x: 0, y: 0 },
      opacity: 0,
      curve: enums.AnimationCurve.easeIn,
      duration: duration
    }).then(() => {
      this.form = false;
      view.animate({
        scale: { x: 1, y: 1 },
        opacity: 1,
        curve: enums.AnimationCurve.easeOut,
        duration: duration
      }).then(() => this.save(this.reservation.value));
    });
  }

  save(newReservation) {
    //this.database.deleteDocument(this.docId);
    console.log("new reservation:" + JSON.stringify(newReservation));

    let reservations: Array<any> = [];
    let document = this.couchbaseService.getDocument(this.docId);
    console.log("old document:" + JSON.stringify(document));

    if( document == null) {
      console.log("This is the first reservation");
      reservations.push(newReservation);
      this.couchbaseService.createDocument({ "reservations": reservations }, this.docId);
    }
    else {
      reservations = document.reservations;
      reservations.push(newReservation);
      this.couchbaseService.updateDocument(this.docId,  { "reservations": reservations });
    }
    document = this.couchbaseService.getDocument(this.docId);
    console.log("new document:" + JSON.stringify(document));
  }
}
