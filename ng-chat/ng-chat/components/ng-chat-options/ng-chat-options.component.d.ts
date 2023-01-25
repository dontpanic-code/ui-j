import { EventEmitter } from '@angular/core';
import { IChatOption } from '../../core/chat-option';
import * as ɵngcc0 from '@angular/core';
export declare class NgChatOptionsComponent {
    constructor();
    options: IChatOption[];
    activeOptionTracker: IChatOption;
    activeOptionTrackerChange: EventEmitter<IChatOption>;
    onOptionClicked(option: IChatOption): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NgChatOptionsComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<NgChatOptionsComponent, "ng-chat-options", never, { "options": "options"; "activeOptionTracker": "activeOptionTracker"; }, { "activeOptionTrackerChange": "activeOptionTrackerChange"; }, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctY2hhdC1vcHRpb25zLmNvbXBvbmVudC5kLnRzIiwic291cmNlcyI6WyJuZy1jaGF0LW9wdGlvbnMuY29tcG9uZW50LmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IElDaGF0T3B0aW9uIH0gZnJvbSAnLi4vLi4vY29yZS9jaGF0LW9wdGlvbic7XHJcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIE5nQ2hhdE9wdGlvbnNDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IoKTtcclxuICAgIG9wdGlvbnM6IElDaGF0T3B0aW9uW107XHJcbiAgICBhY3RpdmVPcHRpb25UcmFja2VyOiBJQ2hhdE9wdGlvbjtcclxuICAgIGFjdGl2ZU9wdGlvblRyYWNrZXJDaGFuZ2U6IEV2ZW50RW1pdHRlcjxJQ2hhdE9wdGlvbj47XHJcbiAgICBvbk9wdGlvbkNsaWNrZWQob3B0aW9uOiBJQ2hhdE9wdGlvbik6IHZvaWQ7XHJcbn1cclxuIl19