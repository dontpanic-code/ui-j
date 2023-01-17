import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Blog } from '@app/models/blog';
import { Observable } from 'rxjs';
import { TopTags } from '@app/models/topTags';

@Injectable({
    providedIn: 'root',
})
export class BlogService {
    public allPosts;
    public topTags;
    public getOpenPost;
    public getMyPosts;
    public lists;

    constructor(private http: HttpClient) {}

    getAllPosts(): Promise<Blog> {
        return new Promise((resolve, reject) => {
            this.http.get<Blog[]>(`${environment.apiUrl}/Blog/`).subscribe((response: any) => {
                this.allPosts = response;
                // console.log(response);
                // console.log(this.allPosts);
                this.getAllLists()

                resolve(response);
            }, reject);
        });
    }

    getAllLists(): Promise<Blog> {
        return new Promise((resolve, reject) => {
            this.http.get<Blog[]>(`${environment.apiUrl}/Blog/list`).subscribe((response: any) => {
                this.lists = response;
                // console.log(response);
                // console.log(this.lists);

                resolve(response);
            }, reject);
        });
    }

    gatTopTags(): Promise<TopTags> {
        return new Promise((resolve, reject) => {
            this.http.get<Blog[]>(`${environment.apiUrl}/TopTags/`).subscribe((response: any) => {
                this.topTags = response;
                // console.log(response);
                // console.log(this.topTags);

                resolve(response);
            }, reject);
        });
    }

    openPost(id): Promise<Blog> {
        // console.log("openPost", id)

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        let options = { headers: headers };

        return new Promise((resolve, reject) => {
            this.http.post(`${environment.apiUrl}/Blog/openpost`, id, options).subscribe((data) => {
                // console.log("openPost 25", id)
                // console.log(data);
                this.getOpenPost = data;
                resolve();
            }, reject);
        });
    }

    addPost(postDescribe): Observable<any> {
        console.log('postDescribe', postDescribe);

        let post: Blog = {
            author: postDescribe.author,
            comments: 0,
            date: Date.now().toString(),
            idUser: postDescribe.idUser,
            tags: postDescribe.tags,
            text: postDescribe.text,
            title: postDescribe.title,
            type: postDescribe.type,
            listBookmarks: '',
            listLikes: '',
            views: 0,
        };

        console.log('post', post);
        return this.http.post(`${environment.apiUrl}/Blog/`, post);
    }

    GetUserPosts(id): Promise<Blog> {
        console.log('openPost', id);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        let options = { headers: headers };

        return new Promise((resolve, reject) => {
            this.http
                .post(`${environment.apiUrl}/Blog/userposts`, id, options)
                .subscribe((data) => {
                    this.getAllLists()
                    // console.log("openPost 25", id)
                    // console.log(data);
                    this.getMyPosts = data;
                    resolve();
                }, reject);
        });
    }

    deletePost(id) {
        return new Promise((resolve, reject) => {
            this.http.post(`${environment.apiUrl}/Blog/delete`, id).subscribe(() => {
                resolve();
            }, reject);
        });
    }

    isLike(idArticle, idUser) {
        // console.log('tmpList', idArticle, idUser);
        let tmpList = Object.values(this.lists).filter((el: Blog) => {
            return el.id == idArticle;
        })[0];
        // console.log('tmpList', tmpList);

        let user = -1;
        if (tmpList['listLikes']) {
            let tmp = tmpList['listLikes'].split(' ');
            user = tmp.indexOf(idUser.toString());
        }
        if (user >= 0) {
            return true;
        } else {
            return false;
        }
    }

    isBookmark(idArticle, idUser) {
        let tmpList = Object.values(this.lists).filter((el: Blog) => {
            return el.id == idArticle;
        })[0];
        // console.log('tmpList', tmpList);

        let user = -1;
        if (tmpList['listBookmarks']) {
            let tmp = tmpList['listBookmarks'].split(' ');
            user = tmp.indexOf(idUser.toString());
        }
        if (user >= 0) {
            return true;
        } else {
            return false;
        }
    }

    changeBookmarks(idArticle, idUser) {
        let flag = false;
        let tmpList = Object.values(this.lists).filter((el: Blog) => {
            return el.id == idArticle;
        })[0];
        // console.log('tmpList', tmpList);

        let user = -1;
        let tmp = [];
        if (tmpList['listBookmarks']) {
            tmp = tmpList['listBookmarks'].split(' ');

            user = tmp.indexOf(idUser.toString());
        }
        if (user >= 0) {
            tmp = tmp.filter((item) => item !== idUser.toString());
            flag = false;
        } else {
            tmp.push(idUser.toString());
            flag = true;
        }
        console.log('888', tmp);

        const post = {
            id: idArticle,
            listBookmarks: tmp.join(' '),
        };

        new Promise((resolve, reject) => {
            this.http.post(`${environment.apiUrl}/Blog/updateBookmarks`, post).subscribe(() => {
                this.getAllLists();
                resolve();
            }, reject);
        });

        return flag;
    }

    changeLikes(idArticle, idUser) {
        let flag = false;
        let tmpList = Object.values(this.lists).filter((el: Blog) => {
            return el.id == idArticle;
        })[0];
        // console.log('tmpList', tmpList);

        let user = -1;
        let tmp = [];
        if (tmpList['listLikes']) {
            tmp = tmpList['listLikes'].split(' ');

            user = tmp.indexOf(idUser.toString());
        }
        if (user >= 0) {
            tmp = tmp.filter((item) => item !== idUser.toString());
            flag = false;
        } else {
            tmp.push(idUser.toString());
            flag = true;
        }
        console.log('888', tmp);

        const post = {
            id: idArticle,
            listLikes: tmp.join(' '),
        };

        new Promise((resolve, reject) => {
            this.http.post(`${environment.apiUrl}/Blog/updateLikes`, post).subscribe(() => {
                this.getAllLists();
                
                resolve();
            }, reject);
        });

        return flag;
    }

    countLikes(idArticle){
        let tmpList = Object.values(this.lists).filter((el: Blog) => {
            return el.id == idArticle;
        })[0];
        let tmp = [];
        if (tmpList['listLikes']) {
            tmp = tmpList['listLikes'].split(' ');
        }
        return tmp.length
    }

    // deleteJob(id){
    //     return new Promise((resolve, reject) => {
    //         this.http.post(`${environment.apiUrl}/Job/deletejob`, id).subscribe(() => {
    //             resolve();
    //         }, reject);
    //     });
    // }

    // changeApproved(job){
    //     console.log(job);
    //     return new Promise((resolve, reject) => {
    //         this.http.post(`${environment.apiUrl}/Job/updatejobmod`, job).subscribe(() => {
    //             resolve();
    //         }, reject);
    //     });
    // }

    // sendToTelegramBot(job){
    //     console.log(job);
    //     let headers = new HttpHeaders({
    //         'Content-Type': 'application/json',
    //         'Access-Control-Allow-Origin': '*',
    //         'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    //         'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
    //     })
    //     let options = { headers: headers };

    //     return new Promise((resolve, reject) => {
    //         this.http.post(`${environment.telegramBot}/send`, job, options).subscribe(() => {
    //             resolve();
    //         }, reject);
    //     });
    // }
}
