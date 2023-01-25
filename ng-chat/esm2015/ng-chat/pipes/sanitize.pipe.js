import { Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
/*
 * Sanitizes an URL resource
*/
export class SanitizePipe {
    constructor(sanitizer) {
        this.sanitizer = sanitizer;
    }
    transform(url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}
SanitizePipe.decorators = [
    { type: Pipe, args: [{ name: 'sanitize' },] }
];
SanitizePipe.ctorParameters = () => [
    { type: DomSanitizer }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FuaXRpemUucGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL25nLWNoYXQvcGlwZXMvc2FuaXRpemUucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUNwRCxPQUFPLEVBQUUsWUFBWSxFQUFvQixNQUFNLDJCQUEyQixDQUFDO0FBRTNFOztFQUVFO0FBRUYsTUFBTSxPQUFPLFlBQVk7SUFDckIsWUFBc0IsU0FBdUI7UUFBdkIsY0FBUyxHQUFULFNBQVMsQ0FBYztJQUFHLENBQUM7SUFFakQsU0FBUyxDQUFDLEdBQVc7UUFDakIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLDhCQUE4QixDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzlELENBQUM7OztZQU5KLElBQUksU0FBQyxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUM7OztZQUxmLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IERvbVNhbml0aXplciwgU2FmZVJlc291cmNlVXJsICB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xyXG5cclxuLypcclxuICogU2FuaXRpemVzIGFuIFVSTCByZXNvdXJjZVxyXG4qL1xyXG5AUGlwZSh7bmFtZTogJ3Nhbml0aXplJ30pXHJcbmV4cG9ydCBjbGFzcyBTYW5pdGl6ZVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzYW5pdGl6ZXI6IERvbVNhbml0aXplcikge31cclxuXHJcbiAgICB0cmFuc2Zvcm0odXJsOiBzdHJpbmcpOiBTYWZlUmVzb3VyY2VVcmwge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0UmVzb3VyY2VVcmwodXJsKTtcclxuICAgIH1cclxufVxyXG4iXX0=