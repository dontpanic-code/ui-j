import { PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as ɵngcc0 from '@angular/core';
export declare class SanitizePipe implements PipeTransform {
    protected sanitizer: DomSanitizer;
    constructor(sanitizer: DomSanitizer);
    transform(url: string): SafeResourceUrl;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<SanitizePipe, never>;
    static ɵpipe: ɵngcc0.ɵɵPipeDefWithMeta<SanitizePipe, "sanitize">;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FuaXRpemUucGlwZS5kLnRzIiwic291cmNlcyI6WyJzYW5pdGl6ZS5waXBlLmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IERvbVNhbml0aXplciwgU2FmZVJlc291cmNlVXJsIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XHJcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIFNhbml0aXplUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xyXG4gICAgcHJvdGVjdGVkIHNhbml0aXplcjogRG9tU2FuaXRpemVyO1xyXG4gICAgY29uc3RydWN0b3Ioc2FuaXRpemVyOiBEb21TYW5pdGl6ZXIpO1xyXG4gICAgdHJhbnNmb3JtKHVybDogc3RyaW5nKTogU2FmZVJlc291cmNlVXJsO1xyXG59XHJcbiJdfQ==