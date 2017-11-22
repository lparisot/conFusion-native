import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { Page } from 'ui/page';
import { Slider } from 'ui/slider';
import { TextField } from 'ui/text-field';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { Comment } from '../shared/comment';

@Component({
  moduleId: module.id,
  templateUrl: './comment.component.html'
})
export class CommentModalComponent implements OnInit {
  comment: FormGroup;

  constructor(
    private params: ModalDialogParams,
    private formBuilder: FormBuilder,
    private page: Page
  ) {
    this.comment = this.formBuilder.group({
      rating: 3,
      author: ['', Validators.required],
      comment: ['', Validators.required]
    });
  }

  ngOnInit() { }

  onRatingValueChange(args) {
    let slider = <Slider>args.object;

    slider.value = Math.round(slider.value);
    this.comment.patchValue({ rating: slider.value });
  }

  onAuthorChange(args) {
    let textField = <TextField>args.object;

    this.comment.patchValue({ author: textField.text });
  }

  onCommentChange(args) {
    let textField = <TextField>args.object;

    this.comment.patchValue({ comment: textField.text });
  }

  onSubmit() {
    let newComment: Comment = this.comment.value;
    newComment.date = new Date().toISOString();

    this.params.closeCallback(newComment);
  }
}
