import { Pipe } from '@angular/core';
/*
 * Transforms text containing URLs or E-mails to valid links/mailtos
*/
export class LinkfyPipe {
    transform(message, pipeEnabled) {
        if (pipeEnabled && message && message.length > 1) {
            let replacedText;
            let replacePatternProtocol;
            let replacePatternWWW;
            let replacePatternMailTo;
            // URLs starting with http://, https://, or ftp://
            replacePatternProtocol = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
            replacedText = message.replace(replacePatternProtocol, '<a href="$1" target="_blank">$1</a>');
            // URLs starting with "www." (ignoring // before it).
            replacePatternWWW = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
            replacedText = replacedText.replace(replacePatternWWW, '$1<a href="http://$2" target="_blank">$2</a>');
            // Change email addresses to mailto:: links.
            replacePatternMailTo = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
            replacedText = replacedText.replace(replacePatternMailTo, '<a href="mailto:$1">$1</a>');
            return replacedText;
        }
        else
            return message;
    }
}
LinkfyPipe.decorators = [
    { type: Pipe, args: [{ name: 'linkfy' },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlua2Z5LnBpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9uZy1jaGF0L3BpcGVzL2xpbmtmeS5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBRXBEOztFQUVFO0FBRUYsTUFBTSxPQUFPLFVBQVU7SUFDbkIsU0FBUyxDQUFDLE9BQWUsRUFBRSxXQUFvQjtRQUMzQyxJQUFJLFdBQVcsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQ2hEO1lBQ0ksSUFBSSxZQUFZLENBQUM7WUFDakIsSUFBSSxzQkFBc0IsQ0FBQztZQUMzQixJQUFJLGlCQUFpQixDQUFDO1lBQ3RCLElBQUksb0JBQW9CLENBQUM7WUFFekIsa0RBQWtEO1lBQ2xELHNCQUFzQixHQUFHLHlFQUF5RSxDQUFDO1lBQ25HLFlBQVksR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLHNCQUFzQixFQUFFLHFDQUFxQyxDQUFDLENBQUM7WUFFOUYscURBQXFEO1lBQ3JELGlCQUFpQixHQUFHLGdDQUFnQyxDQUFDO1lBQ3JELFlBQVksR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLDhDQUE4QyxDQUFDLENBQUM7WUFFdkcsNENBQTRDO1lBQzVDLG9CQUFvQixHQUFHLDBEQUEwRCxDQUFDO1lBQ2xGLFlBQVksR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLG9CQUFvQixFQUFFLDRCQUE0QixDQUFDLENBQUM7WUFFeEYsT0FBTyxZQUFZLENBQUM7U0FDdkI7O1lBRUcsT0FBTyxPQUFPLENBQUM7SUFDdkIsQ0FBQzs7O1lBMUJKLElBQUksU0FBQyxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG4vKlxyXG4gKiBUcmFuc2Zvcm1zIHRleHQgY29udGFpbmluZyBVUkxzIG9yIEUtbWFpbHMgdG8gdmFsaWQgbGlua3MvbWFpbHRvc1xyXG4qL1xyXG5AUGlwZSh7bmFtZTogJ2xpbmtmeSd9KVxyXG5leHBvcnQgY2xhc3MgTGlua2Z5UGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xyXG4gICAgdHJhbnNmb3JtKG1lc3NhZ2U6IHN0cmluZywgcGlwZUVuYWJsZWQ6IGJvb2xlYW4pOiBzdHJpbmcge1xyXG4gICAgICAgIGlmIChwaXBlRW5hYmxlZCAmJiBtZXNzYWdlICYmIG1lc3NhZ2UubGVuZ3RoID4gMSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCByZXBsYWNlZFRleHQ7XHJcbiAgICAgICAgICAgIGxldCByZXBsYWNlUGF0dGVyblByb3RvY29sO1xyXG4gICAgICAgICAgICBsZXQgcmVwbGFjZVBhdHRlcm5XV1c7XHJcbiAgICAgICAgICAgIGxldCByZXBsYWNlUGF0dGVybk1haWxUbztcclxuXHJcbiAgICAgICAgICAgIC8vIFVSTHMgc3RhcnRpbmcgd2l0aCBodHRwOi8vLCBodHRwczovLywgb3IgZnRwOi8vXHJcbiAgICAgICAgICAgIHJlcGxhY2VQYXR0ZXJuUHJvdG9jb2wgPSAvKFxcYihodHRwcz98ZnRwKTpcXC9cXC9bLUEtWjAtOSsmQCNcXC8lPz1+X3whOiwuO10qWy1BLVowLTkrJkAjXFwvJT1+X3xdKS9naW07XHJcbiAgICAgICAgICAgIHJlcGxhY2VkVGV4dCA9IG1lc3NhZ2UucmVwbGFjZShyZXBsYWNlUGF0dGVyblByb3RvY29sLCAnPGEgaHJlZj1cIiQxXCIgdGFyZ2V0PVwiX2JsYW5rXCI+JDE8L2E+Jyk7XHJcblxyXG4gICAgICAgICAgICAvLyBVUkxzIHN0YXJ0aW5nIHdpdGggXCJ3d3cuXCIgKGlnbm9yaW5nIC8vIGJlZm9yZSBpdCkuXHJcbiAgICAgICAgICAgIHJlcGxhY2VQYXR0ZXJuV1dXID0gLyhefFteXFwvXSkod3d3XFwuW1xcU10rKFxcYnwkKSkvZ2ltO1xyXG4gICAgICAgICAgICByZXBsYWNlZFRleHQgPSByZXBsYWNlZFRleHQucmVwbGFjZShyZXBsYWNlUGF0dGVybldXVywgJyQxPGEgaHJlZj1cImh0dHA6Ly8kMlwiIHRhcmdldD1cIl9ibGFua1wiPiQyPC9hPicpO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hhbmdlIGVtYWlsIGFkZHJlc3NlcyB0byBtYWlsdG86OiBsaW5rcy5cclxuICAgICAgICAgICAgcmVwbGFjZVBhdHRlcm5NYWlsVG8gPSAvKChbYS16QS1aMC05XFwtXFxfXFwuXSkrQFthLXpBLVpcXF9dKz8oXFwuW2EtekEtWl17Miw2fSkrKS9naW07XHJcbiAgICAgICAgICAgIHJlcGxhY2VkVGV4dCA9IHJlcGxhY2VkVGV4dC5yZXBsYWNlKHJlcGxhY2VQYXR0ZXJuTWFpbFRvLCAnPGEgaHJlZj1cIm1haWx0bzokMVwiPiQxPC9hPicpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlcGxhY2VkVGV4dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gbWVzc2FnZTtcclxuICAgIH0gXHJcbn1cclxuIl19