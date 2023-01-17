import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { OpenJobComponent } from './pages/job-list/open-job/open-job.component';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('@app/pages/main-page/main-page.module').then(m => m.MainPageModule)
    }, {
        path: 'list-with-full-info',
        data: {showFullInfo: true},
        loadChildren: () => import('@app/pages/hire-list/hire-list.module').then(m => m.HireListModule)
    },
    {
        path: 'hire-list',
        loadChildren: () => import('@app/pages/hire-list/hire-list.module').then(m => m.HireListModule)
    },
    {
        path: 'my-account',
        loadChildren: () => import('@app/pages/my-account/my-account.module').then(m => m.MyAccountModule)
    },
    {
        path: 'afterlogin',
        redirectTo: 'my-account',
    },
    {
        path: 'about',
        loadChildren: () => import('@app/pages/contacts/contacts.module').then(m => m.ContactsModule)
    },
    {
        path: 'privacy',
        loadChildren: () => import('@app/pages/info/info.module').then(m => m.InfoModule)
    },
    
    {
        path: 'jobs',
        loadChildren: () => import('@app/pages/job-list/job-list.module').then(m => m.JobListModule)
    },
    {
        path: 'job',
        loadChildren: () => import('@app/pages/new-job/new-job.module').then(m => m.NewJobModule)
    },
    {
        path: 'job/new',
        loadChildren: () => import('@app/pages/new-job/new-job.module').then(m => m.NewJobModule)
    },
    {
        path: 'job/edit',
        loadChildren: () => import('@app/pages/new-job/new-job.module').then(m => m.NewJobModule)
    },
    {
        path: 'ukraine',
        loadChildren: () => import('@app/pages/help-list/help-list.module').then(m => m.HelpListModule)
    },
    {
        path: 'myjobs',
        loadChildren: () => import('@app/pages/myjobs/myjobs.module').then(m => m.MyjobsModule)
    },
    {
        path: 'jobs/g/:id',
        // component:  OpenJobComponent
        loadChildren: () => import('@app/pages/job-list/job-list.module').then(m => m.JobListModule),
    },
    {
        path: 'moderator',
        loadChildren: () => import('@app/pages/moderator/moderator.module').then(m => m.ModeratorModule)
    },
    {
        path: 'moderator/approval-jobs',
        loadChildren: () => import('@app/pages/moderator/moderator.module').then(m => m.ModeratorModule)
    },
    {
        path: 'welcome',
        loadChildren: () => import('@app/pages/welcome/welcome.module').then(m => m.WelcomeModule)
    },
    {
        path: 'forum',
        loadChildren: () => import('@app/pages/blog/blog.module').then(m => m.BlogModule)
    },
    {
        path: 'forum/my',
        loadChildren: () => import('@app/pages/blog/blog.module').then(m => m.BlogModule)
    },
    {
        path: 'forum/s/:id',
        loadChildren: () => import('@app/pages/blog/blog.module').then(m => m.BlogModule)
    },
    // otherwise redirect to home
    {path: '**', redirectTo: 'my-account'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
