export class DefaultFileUploadAdapter {
    /**
     * @summary Basic file upload adapter implementation for HTTP request form file consumption
     * @param _serverEndpointUrl The API endpoint full qualified address that will receive a form file to process and return the metadata.
     */
    constructor(_serverEndpointUrl, _http) {
        this._serverEndpointUrl = _serverEndpointUrl;
        this._http = _http;
    }
    uploadFile(file, participantId) {
        const formData = new FormData();
        //formData.append('ng-chat-sender-userid', currentUserId);
        formData.append('ng-chat-participant-id', participantId);
        formData.append('file', file, file.name);
        return this._http.post(this._serverEndpointUrl, formData);
        // TODO: Leaving this if we want to track upload progress in detail in the future. Might need a different Subject generic type wrapper
        // const fileRequest = new HttpRequest('POST', this._serverEndpointUrl, formData, {
        //     reportProgress: true
        // });
        // const uploadProgress = new Subject<number>();
        // const uploadStatus = uploadProgress.asObservable();
        //const responsePromise = new Subject<Message>();
        // this._http
        //     .request(fileRequest)
        //     .subscribe(event => {
        //         // if (event.type == HttpEventType.UploadProgress)
        //         // {
        //         //     const percentDone = Math.round(100 * event.loaded / event.total);
        //         //     uploadProgress.next(percentDone);
        //         // }
        //         // else if (event instanceof HttpResponse)
        //         // {
        //         //     uploadProgress.complete();
        //         // }
        //     });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1maWxlLXVwbG9hZC1hZGFwdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbmctY2hhdC9jb3JlL2RlZmF1bHQtZmlsZS11cGxvYWQtYWRhcHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFNQSxNQUFNLE9BQU8sd0JBQXdCO0lBRWpDOzs7T0FHRztJQUNILFlBQW9CLGtCQUEwQixFQUFVLEtBQWlCO1FBQXJELHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBUTtRQUFVLFVBQUssR0FBTCxLQUFLLENBQVk7SUFDekUsQ0FBQztJQUVELFVBQVUsQ0FBQyxJQUFVLEVBQUUsYUFBa0I7UUFDckMsTUFBTSxRQUFRLEdBQWEsSUFBSSxRQUFRLEVBQUUsQ0FBQztRQUUxQywwREFBMEQ7UUFDMUQsUUFBUSxDQUFDLE1BQU0sQ0FBQyx3QkFBd0IsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUN6RCxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXpDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQVUsSUFBSSxDQUFDLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRW5FLHNJQUFzSTtRQUN0SSxtRkFBbUY7UUFDbkYsMkJBQTJCO1FBQzNCLE1BQU07UUFFTixnREFBZ0Q7UUFDaEQsc0RBQXNEO1FBRXRELGlEQUFpRDtRQUVqRCxhQUFhO1FBQ2IsNEJBQTRCO1FBQzVCLDRCQUE0QjtRQUM1Qiw2REFBNkQ7UUFDN0QsZUFBZTtRQUNmLG1GQUFtRjtRQUVuRixtREFBbUQ7UUFDbkQsZUFBZTtRQUNmLHFEQUFxRDtRQUNyRCxlQUFlO1FBRWYsNENBQTRDO1FBQzVDLGVBQWU7UUFDZixVQUFVO0lBQ2QsQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUZpbGVVcGxvYWRBZGFwdGVyIH0gZnJvbSAnLi9maWxlLXVwbG9hZC1hZGFwdGVyJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cFJlcXVlc3QsIEh0dHBFdmVudFR5cGUsIEh0dHBSZXNwb25zZSwgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgVXNlciB9IGZyb20gJy4vdXNlcic7XHJcbmltcG9ydCB7IE1lc3NhZ2UgfSBmcm9tICcuL21lc3NhZ2UnO1xyXG5cclxuZXhwb3J0IGNsYXNzIERlZmF1bHRGaWxlVXBsb2FkQWRhcHRlciBpbXBsZW1lbnRzIElGaWxlVXBsb2FkQWRhcHRlclxyXG57XHJcbiAgICAvKipcclxuICAgICAqIEBzdW1tYXJ5IEJhc2ljIGZpbGUgdXBsb2FkIGFkYXB0ZXIgaW1wbGVtZW50YXRpb24gZm9yIEhUVFAgcmVxdWVzdCBmb3JtIGZpbGUgY29uc3VtcHRpb25cclxuICAgICAqIEBwYXJhbSBfc2VydmVyRW5kcG9pbnRVcmwgVGhlIEFQSSBlbmRwb2ludCBmdWxsIHF1YWxpZmllZCBhZGRyZXNzIHRoYXQgd2lsbCByZWNlaXZlIGEgZm9ybSBmaWxlIHRvIHByb2Nlc3MgYW5kIHJldHVybiB0aGUgbWV0YWRhdGEuXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX3NlcnZlckVuZHBvaW50VXJsOiBzdHJpbmcsIHByaXZhdGUgX2h0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIH1cclxuXHJcbiAgICB1cGxvYWRGaWxlKGZpbGU6IEZpbGUsIHBhcnRpY2lwYW50SWQ6IGFueSk6IE9ic2VydmFibGU8TWVzc2FnZT4ge1xyXG4gICAgICAgIGNvbnN0IGZvcm1EYXRhOiBGb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG5cclxuICAgICAgICAvL2Zvcm1EYXRhLmFwcGVuZCgnbmctY2hhdC1zZW5kZXItdXNlcmlkJywgY3VycmVudFVzZXJJZCk7XHJcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKCduZy1jaGF0LXBhcnRpY2lwYW50LWlkJywgcGFydGljaXBhbnRJZCk7XHJcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSwgZmlsZS5uYW1lKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2h0dHAucG9zdDxNZXNzYWdlPih0aGlzLl9zZXJ2ZXJFbmRwb2ludFVybCwgZm9ybURhdGEpO1xyXG5cclxuICAgICAgICAvLyBUT0RPOiBMZWF2aW5nIHRoaXMgaWYgd2Ugd2FudCB0byB0cmFjayB1cGxvYWQgcHJvZ3Jlc3MgaW4gZGV0YWlsIGluIHRoZSBmdXR1cmUuIE1pZ2h0IG5lZWQgYSBkaWZmZXJlbnQgU3ViamVjdCBnZW5lcmljIHR5cGUgd3JhcHBlclxyXG4gICAgICAgIC8vIGNvbnN0IGZpbGVSZXF1ZXN0ID0gbmV3IEh0dHBSZXF1ZXN0KCdQT1NUJywgdGhpcy5fc2VydmVyRW5kcG9pbnRVcmwsIGZvcm1EYXRhLCB7XHJcbiAgICAgICAgLy8gICAgIHJlcG9ydFByb2dyZXNzOiB0cnVlXHJcbiAgICAgICAgLy8gfSk7XHJcblxyXG4gICAgICAgIC8vIGNvbnN0IHVwbG9hZFByb2dyZXNzID0gbmV3IFN1YmplY3Q8bnVtYmVyPigpO1xyXG4gICAgICAgIC8vIGNvbnN0IHVwbG9hZFN0YXR1cyA9IHVwbG9hZFByb2dyZXNzLmFzT2JzZXJ2YWJsZSgpO1xyXG5cclxuICAgICAgICAvL2NvbnN0IHJlc3BvbnNlUHJvbWlzZSA9IG5ldyBTdWJqZWN0PE1lc3NhZ2U+KCk7XHJcblxyXG4gICAgICAgIC8vIHRoaXMuX2h0dHBcclxuICAgICAgICAvLyAgICAgLnJlcXVlc3QoZmlsZVJlcXVlc3QpXHJcbiAgICAgICAgLy8gICAgIC5zdWJzY3JpYmUoZXZlbnQgPT4ge1xyXG4gICAgICAgIC8vICAgICAgICAgLy8gaWYgKGV2ZW50LnR5cGUgPT0gSHR0cEV2ZW50VHlwZS5VcGxvYWRQcm9ncmVzcylcclxuICAgICAgICAvLyAgICAgICAgIC8vIHtcclxuICAgICAgICAvLyAgICAgICAgIC8vICAgICBjb25zdCBwZXJjZW50RG9uZSA9IE1hdGgucm91bmQoMTAwICogZXZlbnQubG9hZGVkIC8gZXZlbnQudG90YWwpO1xyXG5cclxuICAgICAgICAvLyAgICAgICAgIC8vICAgICB1cGxvYWRQcm9ncmVzcy5uZXh0KHBlcmNlbnREb25lKTtcclxuICAgICAgICAvLyAgICAgICAgIC8vIH1cclxuICAgICAgICAvLyAgICAgICAgIC8vIGVsc2UgaWYgKGV2ZW50IGluc3RhbmNlb2YgSHR0cFJlc3BvbnNlKVxyXG4gICAgICAgIC8vICAgICAgICAgLy8ge1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIC8vICAgICAgICAgLy8gICAgIHVwbG9hZFByb2dyZXNzLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgLy8gICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8gICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==