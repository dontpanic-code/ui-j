import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostType } from '@app/models/enum/posttype';
import { HireServiceService } from '@app/pages/hire-list/hire-service.service';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'app-blog-filter',
    templateUrl: './blog-filter.component.html',
    styleUrls: ['./blog-filter.component.scss'],
})
export class BlogFilterComponent implements OnInit {
    form: FormGroup;
    selectedItem;
    public postTypes = PostType;
    idPost;
    currentFilter;

    constructor(
        private formBuilder: FormBuilder,
        public hireService: HireServiceService,
        private _router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.hireService.currentForumFilter.subscribe((filter) => {
            this.currentFilter = filter;
            console.log('this.currentFilter', this.currentFilter);
        });

        this.idPost = this.route.snapshot.paramMap.get('id');
        this.buildForm();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            postType: [''],
        });
        this.onChanges();
    }

    onChanges(): void {
        this.form.valueChanges.pipe(distinctUntilChanged()).subscribe((val) => {
            var r = {
                postType: this.form.controls['postType'].value,
                tag: this.currentFilter?.tag ? this.currentFilter.tag : '',
            };

            this.hireService.updateForumFilter(r);
        });

        // this.form.valueChanges.pipe(distinctUntilChanged()).subscribe((val) => {
        //     this.hireService.updateForumFilter({ ...val });
        // });
    }
    postType(_type) {
        if (this.selectedItem != _type) {
            this.selectedItem = _type;
        } else {
            this.selectedItem = '';
        }
        this.form.controls['postType'].setValue(this.selectedItem);

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
