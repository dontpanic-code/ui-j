import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environment';
import { BehaviorSubject, of } from 'rxjs';

interface IResourceId {
    id: number;
}

export class DataService<T> {
    onCurrentItemChanged$: BehaviorSubject<any>;
    onItemsChanged$: BehaviorSubject<T[]>;

    currentItem: T;
    items: T[];

    routeParams: any;

    apiUrl = `${environment.apiUrl + '/' + this.controllerName}`;

    constructor(private httpClient: HttpClient, private controllerName: string) {
        this.onCurrentItemChanged$ = new BehaviorSubject({});
        this.onItemsChanged$ = new BehaviorSubject([]);
    }

    create(resource: T) {
        return this.httpClient.post<T>(`${this.apiUrl}`, resource);
    }

    update(resource) {
        return this.httpClient.put<T>(`${this.apiUrl}/${resource.id}`, resource);
    }

    delete(id: IResourceId) {
        return this.httpClient.delete(`${this.apiUrl}/${id}`);
    }

    getAll() {
        return this.httpClient.get<T[]>(`${this.apiUrl}`);
    }

    getById(id: IResourceId) {
        return this.httpClient.get<T>(`${this.apiUrl}/${id}`);
    }

    async createItem(resource: T): Promise<any> {
        return await this.create(resource).toPromise();
    }

    async updateItem(resource): Promise<any> {
        return await this.update(resource).toPromise();
    }

    async deleteItem(id): Promise<any> {
        return await this.delete(id).toPromise();
    }

    async addItemByUrl(endPointUrl: string, bodyParam: any): Promise<any> {
        return this.httpClient.post(`${endPointUrl}`, bodyParam).toPromise();
    }

    async deleteItemByUrl(endPointUrl: string, bodyParam: any): Promise<any> {
        const options = this.createOptions();
        options.body = bodyParam;

        return await this.httpClient.delete(`${endPointUrl}`, options).toPromise();
    }

    async getItemByUrl(endPointUrl: string): Promise<any> {
        return await this.httpClient.get(endPointUrl).toPromise();
    }

    async getItemByActionUrl(actionUrl: string): Promise<any> {
        return await this.httpClient.get(`${this.apiUrl}/${actionUrl}`).toPromise();
    }

    async getAllItems(): Promise<any> {
        const response = await this.getAll().toPromise();
        this.items = response;
        this.onItemsChanged$.next(this.items);
        return response;
    }

    async getSelectedItem(): Promise<any> {
        if (this.routeParams.id === 'new') {
            this.onCurrentItemChanged$.next(false);
            return of(false).toPromise();
        } else {
            const response = await this.getById(this.routeParams.id).toPromise();
            this.currentItem = response;
            this.onCurrentItemChanged$.next(this.currentItem);
            return response;
        }
    }

    createOptions() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            body: {}
        };
    }
}
