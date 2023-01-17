import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogTableComponent, DialogDataExampleDialog } from './blog-table/blog-table.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@app/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';
import {MatCardModule} from '@angular/material/card';
import { BlogSingleComponent } from './blog-single/blog-single.component';
import {MatSelectModule} from '@angular/material/select';
import { BlogContainerComponent } from './blog-container/blog-container.component';
import { BlogFilterComponent } from './blog-filter/blog-filter.component';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { FormsModule } from '@angular/forms';
import { DialogDataExampleDialog1, MyBlogComponent } from './my-blog/my-blog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CreatePostComponent } from './create-post/create-post.component';
import { QuillModule } from 'ngx-quill'
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TopTagsComponent } from './top-tags/top-tags.component';
import { ListArticlesComponent } from './list-articles/list-articles.component';
import { UserLinksComponent } from './user-links/user-links.component';
import { MatListModule } from '@angular/material/list';

const routes = [
  {
      path: '',
      component: BlogContainerComponent
  },
  {
    path: 's/:id',
    component: BlogContainerComponent
  },
  {
    path: 'my',
    component: BlogContainerComponent
  },
  {
    path: 'top',
    component: BlogContainerComponent
  },
  {
    path: 'bookmarks',
    component: BlogContainerComponent
  },
];


@NgModule({
  declarations: [BlogTableComponent, BlogSingleComponent, BlogContainerComponent, BlogFilterComponent, MyBlogComponent, DialogDataExampleDialog, CreatePostComponent, TopTagsComponent, ListArticlesComponent, UserLinksComponent, DialogDataExampleDialog1],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FuseSharedModule,
    MatExpansionModule,
    TranslateModule,
    MatCardModule,
    MatSelectModule,
    FormsModule,
    LMarkdownEditorModule,
    MatDialogModule,
    QuillModule.forRoot(),
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule
  ],
  entryComponents: [
    DialogDataExampleDialog, CreatePostComponent, DialogDataExampleDialog1
  ]
})
export class BlogModule { }
