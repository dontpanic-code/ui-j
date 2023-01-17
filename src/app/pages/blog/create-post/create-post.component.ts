import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
// import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatSnackBarService } from '@app/services';
import { AuthenticationService } from '@app/services/authentication.service';
import { MdEditorOption, UploadResult } from 'ngx-markdown-editor';
import { timer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BlogService } from '../blog.service';

import { ENTER, SPACE, TAB } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';

import Quill from 'quill';
import ImageResize from 'quill-image-resize-module';
import { PostType } from '@app/models/enum/posttype';
import { HireServiceService } from '@app/pages/hire-list/hire-service.service';
import { MatDialogRef } from '@angular/material/dialog';
Quill.register('modules/imageResize', ImageResize);

@Component({
    selector: 'app-create-post',
    templateUrl: './create-post.component.html',
    styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent implements OnInit {
    form: FormGroup;
    currentUser;
    // currentUser = {
    //     Id: 489,
    //     Email: 'mychannel.helloworld@gmail.com',
    //     FullName: 'IMAOTAG HUB',
    //     FirstName: 'IMAOTAG',
    //     LastName: 'IMAOTAG',
    //     TypeUser: 'recruiter',
    // };

    editorModel = [
        {
            attributes: {
                font: 'roboto',
            },
            insert: 'test',
        },
    ];

    separatorKeysCodes = [ENTER, SPACE, TAB];
    chips = [];
    formControl = new FormControl(['tagChips']);
    selectable = true;
    removable = true;

    isRecruiter;
    // private unsubscribeAll: Subject<any>;
    public postType = PostType;

    modules = {};
    constructor(
        private formBuilder: FormBuilder,
        public authenticationService: AuthenticationService,
        public blogService: BlogService,
        private matSnackBarService: MatSnackBarService,
        private _router: Router,
        public hireService: HireServiceService,
        public dialogRef: MatDialogRef<CreatePostComponent>,
    ) {
        this.modules = {
            imageResize: {},
            syntax: true,
        };

        this.currentUser = this.authenticationService.currentUserValue
        this.currentUser = this.currentUser.Result
        console.log("blog-create", this.currentUser);
        
        //   this.unsubscribeAll = new Subject();
        //   this.authenticationService.isRecruiter.pipe(takeUntil(this.unsubscribeAll)).subscribe(val => {
        //     this.isRecruiter = val;
        //   });

        //   if(!this.isRecruiter){
        //     this._router.navigate(['/my-account']);
        //   }
    }

    ngOnInit(): void {
        this.buildForm();

        // this.currentUser = this.authenticationService.currentUserValue;
        // this.currentUser = this.currentUser.Result;
        console.log(
            'this.authenticationService.currentUserValue',
            this.authenticationService.currentUserValue
        );
        console.log('this.currentUser', this.currentUser);
    }

    add(event: MatChipInputEvent) {
        const value = (event.value || '').trim();
        if (value) {
            this.chips.push('#' + value.toLowerCase());
            this.chips = [...new Set(this.chips)]
        }
        if (event.input) {
            event.input.value = '';
        }
    }

    removeKeyword(keyword: string) {
        const index = this.chips.indexOf(keyword);
        if (index >= 0) {
            this.chips.splice(index, 1);
        }
    }

    async buildForm() {
        this.form = this.formBuilder.group({
            title: [],
            tags: [require],
            text: [],
            idUser: [],
            author: [],
            type: [],
        });

        // this.currentUser = this.authenticationService.currentUserValue;
        // this.currentUser = this.currentUser.Result;
        console.log(
            'this.authenticationService.currentUserValue',
            this.authenticationService.currentUserValue
        );
        console.log('this.currentUser', this.currentUser);
    }

    save() {        
        this.title();
        console.log('this.currentUser', this.currentUser);


        this.chips = this.chips.map(element => {
            return element.toLowerCase();
        })

        this.form.controls['tags'].setValue(this.chips.join(' '));
        
        this.form.controls['author'].setValue(this.currentUser.FullName);
        this.form.controls['idUser'].setValue(this.currentUser.Id);
        console.log(this.form.value);

        if (this.chips.length > 0) {
            this.blogService.addPost(this.form.value).subscribe(
                () => {
                    this.form.disable();
                    // this.visibleBtnJobList = true;
                    this.matSnackBarService.showMessage(`Ваш допис опубліковано у блозі!`);
                    this.dialogRef.close();
                },
                (err) => {
                    this.matSnackBarService.showMessage(err);
                    // this.visibleBtnJobList = false;
                }
            );
        }
        else{
          this.matSnackBarService.showMessage("Хештеги - це обов'язкове поле 🤝");
        }
    }

    title() {
        const br = this.form.controls['text'].value.indexOf('</');
        const dot = this.form.controls['text'].value.indexOf('.');

        console.log(br, dot);

        if (br < dot || dot == -1) {
            this.form.controls['title'].setValue(
                this.form.controls['text'].value.split('</')[0].replace(/(<([^>]+)>)/gi, '')
            );
        } else if (br > dot || br == -1) {
            this.form.controls['title'].setValue(
                this.form.controls['text'].value.split('.')[0].replace(/(<([^>]+)>)/gi, '')
            );
        }
    }

    omit_number(event) {
        var key;
        key = event.charCode;
        return (
            (key > 47 && key < 58) || key == 45 || (key > 64 && key < 91) || (key > 96 && key < 123)
        );
    }

    onNoClick(): void {
      this.dialogRef.close();
    }
}
