import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BlogService } from '../blog.service';

@Component({
    selector: 'app-list-articles',
    templateUrl: './list-articles.component.html',
    styleUrls: ['./list-articles.component.scss'],
})
export class ListArticlesComponent implements OnInit {
    toppingList;
    isEmpty;
    isTop = false;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(
        private blogService: BlogService,
        public router: Router,
        private route: ActivatedRoute,
        private translate: TranslateService
    ) {}

    ngOnInit(): void {
        this.blogService.getAllPosts().finally(() => {
            this.toppingList = this.blogService.allPosts
                .sort((a, b) => b.likes - a.likes)
                .slice(0, 3);
            if (this.toppingList.length > 0) {
                this.isEmpty = false;
            } else {
                this.isEmpty = true;
            }
        });

        if (this.route.snapshot.routeConfig.path == 'top') {
            this.isTop = true;
        }
    }

    open(id) {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });

        this.router.navigate(['/forum/s/' + id]);
    }
    sort() {
        if (this.isTop) {
            this.router.navigate(['/forum']);
        } else {
            this.router.navigate(['/forum/top']);
        }
    }
}
