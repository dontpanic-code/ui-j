import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HireServiceService } from '@app/pages/hire-list/hire-service.service';
import { TranslateService } from '@ngx-translate/core';
import { distinctUntilChanged } from 'rxjs/operators';
import { BlogService } from '../blog.service';

@Component({
    selector: 'app-top-tags',
    templateUrl: './top-tags.component.html',
    styleUrls: ['./top-tags.component.scss'],
})
export class TopTagsComponent implements OnInit {
    tags = [];
    isEmpty;
    form: FormGroup;
    selectedItem;
    idPost;
    currentFilter;

    constructor(
        private blogService: BlogService,
        private formBuilder: FormBuilder,
        public hireService: HireServiceService,
        private route: ActivatedRoute,
        private _router: Router,
        private translate: TranslateService
    ) {}

    ngOnInit(): void {
        this.hireService.currentForumFilter.subscribe((filter) => {
            this.currentFilter = filter;
            console.log('this.currentFilter @@@@@', this.currentFilter);
        });

        this.blogService.gatTopTags().finally(() => {
            this.tags = this.blogService.topTags;

            if (this.tags.length > 0) {
                this.isEmpty = false;
            } else {
                this.isEmpty = true;
            }
        });
        this.idPost = this.route.snapshot.paramMap.get('id');
        this.buildForm();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            tag: [''],
        });
        this.onChanges();
    }
    onChanges(): void {
        this.form.valueChanges.pipe(distinctUntilChanged()).subscribe((val) => {
            var r = {
                postType: this.currentFilter?.postType ? this.currentFilter.postType : '',
                tag: this.form.controls['tag'].value,
            };

            this.hireService.updateForumFilter(r);
        });
    }

    postType(_type) {
        if (this.selectedItem != _type) {
            this.selectedItem = _type;
        } else {
            this.selectedItem = '';
        }
        this.form.controls['tag'].setValue(this.selectedItem);

        if (this.idPost > 0 || this.route.snapshot.routeConfig.path == 'my') {
            window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth',
            });
            this._router.navigate(['/forum']);
        }
    }
}
