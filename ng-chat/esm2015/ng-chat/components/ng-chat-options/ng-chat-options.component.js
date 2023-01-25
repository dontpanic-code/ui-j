import { Component, Input, Output, EventEmitter } from '@angular/core';
export class NgChatOptionsComponent {
    constructor() {
        this.activeOptionTrackerChange = new EventEmitter();
    }
    onOptionClicked(option) {
        option.isActive = true;
        if (option.action) {
            option.action(option.chattingTo);
        }
        this.activeOptionTrackerChange.emit(option);
    }
}
NgChatOptionsComponent.decorators = [
    { type: Component, args: [{
                selector: 'ng-chat-options',
                template: "<div *ngIf=\"options && options.length > 0\" class=\"ng-chat-options\">\r\n\t\t<button class=\"ng-chat-options-activator\">\r\n\t\t\t<span class=\"primary-text\">...</span>\r\n\t\t</button>\r\n\t<div class=\"ng-chat-options-content primary-background shadowed\">\r\n\t\t<a *ngFor=\"let option of options; let i = index\" [ngClass]=\"'primary-text'\" (click)=\"onOptionClicked(option)\">\r\n\t\t\t{{option.displayLabel}}\r\n\t\t</a>\r\n\t</div>      \r\n</div>\r\n",
                styles: [".ng-chat-options-activator{background-color:unset;color:#fff;line-height:28px;border:none;position:relative}.ng-chat-options-activator>span{position:relative;top:-5px;left:0}.ng-chat-options{position:relative;display:inline-block}.ng-chat-options:hover .ng-chat-options-content{display:block}.ng-chat-options:hover .ng-chat-options-activator{background-color:#ddd}.ng-chat-options-content{display:none;position:absolute;min-width:160px;z-index:1}.ng-chat-options-content a:hover{background-color:#ddd}.ng-chat-options-content a{padding:6px 16px;text-decoration:none;display:block}@media only screen and (max-width:581px){.ng-chat-options-content{right:0}}"]
            },] }
];
NgChatOptionsComponent.ctorParameters = () => [];
NgChatOptionsComponent.propDecorators = {
    options: [{ type: Input }],
    activeOptionTracker: [{ type: Input }],
    activeOptionTrackerChange: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctY2hhdC1vcHRpb25zLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL25nLWNoYXQvY29tcG9uZW50cy9uZy1jaGF0LW9wdGlvbnMvbmctY2hhdC1vcHRpb25zLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBUXZFLE1BQU0sT0FBTyxzQkFBc0I7SUFFbEM7UUFTTyw4QkFBeUIsR0FBOEIsSUFBSSxZQUFZLEVBQWUsQ0FBQztJQVQ5RSxDQUFDO0lBV2pCLGVBQWUsQ0FBQyxNQUFtQjtRQUVsQyxNQUFNLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUV2QixJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDbEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDakM7UUFFRCxJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzdDLENBQUM7OztZQTNCRCxTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLGlCQUFpQjtnQkFDM0IsMmRBQStDOzthQUVsRDs7OztzQkFLQyxLQUFLO2tDQUdMLEtBQUs7d0NBR0wsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IElDaGF0T3B0aW9uIH0gZnJvbSAnLi4vLi4vY29yZS9jaGF0LW9wdGlvbic7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnbmctY2hhdC1vcHRpb25zJyxcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9uZy1jaGF0LW9wdGlvbnMuY29tcG9uZW50Lmh0bWwnLFxyXG4gICAgc3R5bGVVcmxzOiBbJy4vbmctY2hhdC1vcHRpb25zLmNvbXBvbmVudC5jc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmdDaGF0T3B0aW9uc0NvbXBvbmVudCB7XHJcblxyXG5cdGNvbnN0cnVjdG9yKCkgeyB9XHJcblxyXG5cdEBJbnB1dCgpXHJcblx0cHVibGljIG9wdGlvbnM6IElDaGF0T3B0aW9uW107XHJcblxyXG5cdEBJbnB1dCgpXHJcblx0cHVibGljIGFjdGl2ZU9wdGlvblRyYWNrZXI6IElDaGF0T3B0aW9uO1xyXG5cclxuXHRAT3V0cHV0KClcclxuXHRwdWJsaWMgYWN0aXZlT3B0aW9uVHJhY2tlckNoYW5nZTogRXZlbnRFbWl0dGVyPElDaGF0T3B0aW9uPiA9IG5ldyBFdmVudEVtaXR0ZXI8SUNoYXRPcHRpb24+KCk7XHJcblxyXG5cdG9uT3B0aW9uQ2xpY2tlZChvcHRpb246IElDaGF0T3B0aW9uKTogdm9pZFxyXG5cdHtcclxuXHRcdG9wdGlvbi5pc0FjdGl2ZSA9IHRydWU7XHJcblxyXG5cdFx0aWYgKG9wdGlvbi5hY3Rpb24pIHsgICAgXHJcblx0XHRcdG9wdGlvbi5hY3Rpb24ob3B0aW9uLmNoYXR0aW5nVG8pOyAgIFxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuYWN0aXZlT3B0aW9uVHJhY2tlckNoYW5nZS5lbWl0KG9wdGlvbik7XHJcblx0fVxyXG59XHJcbiJdfQ==