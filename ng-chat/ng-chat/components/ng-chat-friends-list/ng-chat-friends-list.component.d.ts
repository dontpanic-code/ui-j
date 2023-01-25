import { EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Localization } from '../../core/localization';
import { IChatOption } from '../../core/chat-option';
import { ChatParticipantStatus } from "../../core/chat-participant-status.enum";
import { IChatParticipant } from "../../core/chat-participant";
import { User } from "../../core/user";
import { Window } from "../../core/window";
import { ParticipantResponse } from "../../core/participant-response";
import { chatParticipantStatusDescriptor } from '../../core/chat-participant-status-descriptor';
import * as ɵngcc0 from '@angular/core';
export declare class NgChatFriendsListComponent implements OnChanges {
    constructor();
    participants: IChatParticipant[];
    participantsResponse: ParticipantResponse[];
    participantsInteractedWith: IChatParticipant[];
    windows: Window[];
    userId: any;
    localization: Localization;
    shouldDisplay: boolean;
    isCollapsed: boolean;
    searchEnabled: boolean;
    currentActiveOption: IChatOption | null;
    onParticipantClicked: EventEmitter<IChatParticipant>;
    onOptionPromptCanceled: EventEmitter<any>;
    onOptionPromptConfirmed: EventEmitter<any>;
    selectedUsersFromFriendsList: User[];
    searchInput: string;
    ChatParticipantStatus: typeof ChatParticipantStatus;
    chatParticipantStatusDescriptor: typeof chatParticipantStatusDescriptor;
    ngOnChanges(changes: SimpleChanges): void;
    get filteredParticipants(): IChatParticipant[];
    isUserSelectedFromFriendsList(user: User): boolean;
    unreadMessagesTotalByParticipant(participant: IChatParticipant): string;
    cleanUpUserSelection: () => any[];
    onChatTitleClicked(): void;
    onFriendsListCheckboxChange(selectedUser: User, isChecked: boolean): void;
    onUserClick(clickedUser: User): void;
    onFriendsListActionCancelClicked(): void;
    onFriendsListActionConfirmClicked(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NgChatFriendsListComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<NgChatFriendsListComponent, "ng-chat-friends-list", never, { "participantsInteractedWith": "participantsInteractedWith"; "isCollapsed": "isCollapsed"; "participants": "participants"; "participantsResponse": "participantsResponse"; "windows": "windows"; "userId": "userId"; "localization": "localization"; "shouldDisplay": "shouldDisplay"; "searchEnabled": "searchEnabled"; "currentActiveOption": "currentActiveOption"; }, { "onParticipantClicked": "onParticipantClicked"; "onOptionPromptCanceled": "onOptionPromptCanceled"; "onOptionPromptConfirmed": "onOptionPromptConfirmed"; }, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctY2hhdC1mcmllbmRzLWxpc3QuY29tcG9uZW50LmQudHMiLCJzb3VyY2VzIjpbIm5nLWNoYXQtZnJpZW5kcy1saXN0LmNvbXBvbmVudC5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IExvY2FsaXphdGlvbiB9IGZyb20gJy4uLy4uL2NvcmUvbG9jYWxpemF0aW9uJztcclxuaW1wb3J0IHsgSUNoYXRPcHRpb24gfSBmcm9tICcuLi8uLi9jb3JlL2NoYXQtb3B0aW9uJztcclxuaW1wb3J0IHsgQ2hhdFBhcnRpY2lwYW50U3RhdHVzIH0gZnJvbSBcIi4uLy4uL2NvcmUvY2hhdC1wYXJ0aWNpcGFudC1zdGF0dXMuZW51bVwiO1xyXG5pbXBvcnQgeyBJQ2hhdFBhcnRpY2lwYW50IH0gZnJvbSBcIi4uLy4uL2NvcmUvY2hhdC1wYXJ0aWNpcGFudFwiO1xyXG5pbXBvcnQgeyBVc2VyIH0gZnJvbSBcIi4uLy4uL2NvcmUvdXNlclwiO1xyXG5pbXBvcnQgeyBXaW5kb3cgfSBmcm9tIFwiLi4vLi4vY29yZS93aW5kb3dcIjtcclxuaW1wb3J0IHsgUGFydGljaXBhbnRSZXNwb25zZSB9IGZyb20gXCIuLi8uLi9jb3JlL3BhcnRpY2lwYW50LXJlc3BvbnNlXCI7XHJcbmltcG9ydCB7IGNoYXRQYXJ0aWNpcGFudFN0YXR1c0Rlc2NyaXB0b3IgfSBmcm9tICcuLi8uLi9jb3JlL2NoYXQtcGFydGljaXBhbnQtc3RhdHVzLWRlc2NyaXB0b3InO1xyXG5leHBvcnQgZGVjbGFyZSBjbGFzcyBOZ0NoYXRGcmllbmRzTGlzdENvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpO1xyXG4gICAgcGFydGljaXBhbnRzOiBJQ2hhdFBhcnRpY2lwYW50W107XHJcbiAgICBwYXJ0aWNpcGFudHNSZXNwb25zZTogUGFydGljaXBhbnRSZXNwb25zZVtdO1xyXG4gICAgcGFydGljaXBhbnRzSW50ZXJhY3RlZFdpdGg6IElDaGF0UGFydGljaXBhbnRbXTtcclxuICAgIHdpbmRvd3M6IFdpbmRvd1tdO1xyXG4gICAgdXNlcklkOiBhbnk7XHJcbiAgICBsb2NhbGl6YXRpb246IExvY2FsaXphdGlvbjtcclxuICAgIHNob3VsZERpc3BsYXk6IGJvb2xlYW47XHJcbiAgICBpc0NvbGxhcHNlZDogYm9vbGVhbjtcclxuICAgIHNlYXJjaEVuYWJsZWQ6IGJvb2xlYW47XHJcbiAgICBjdXJyZW50QWN0aXZlT3B0aW9uOiBJQ2hhdE9wdGlvbiB8IG51bGw7XHJcbiAgICBvblBhcnRpY2lwYW50Q2xpY2tlZDogRXZlbnRFbWl0dGVyPElDaGF0UGFydGljaXBhbnQ+O1xyXG4gICAgb25PcHRpb25Qcm9tcHRDYW5jZWxlZDogRXZlbnRFbWl0dGVyPGFueT47XHJcbiAgICBvbk9wdGlvblByb21wdENvbmZpcm1lZDogRXZlbnRFbWl0dGVyPGFueT47XHJcbiAgICBzZWxlY3RlZFVzZXJzRnJvbUZyaWVuZHNMaXN0OiBVc2VyW107XHJcbiAgICBzZWFyY2hJbnB1dDogc3RyaW5nO1xyXG4gICAgQ2hhdFBhcnRpY2lwYW50U3RhdHVzOiB0eXBlb2YgQ2hhdFBhcnRpY2lwYW50U3RhdHVzO1xyXG4gICAgY2hhdFBhcnRpY2lwYW50U3RhdHVzRGVzY3JpcHRvcjogdHlwZW9mIGNoYXRQYXJ0aWNpcGFudFN0YXR1c0Rlc2NyaXB0b3I7XHJcbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZDtcclxuICAgIGdldCBmaWx0ZXJlZFBhcnRpY2lwYW50cygpOiBJQ2hhdFBhcnRpY2lwYW50W107XHJcbiAgICBpc1VzZXJTZWxlY3RlZEZyb21GcmllbmRzTGlzdCh1c2VyOiBVc2VyKTogYm9vbGVhbjtcclxuICAgIHVucmVhZE1lc3NhZ2VzVG90YWxCeVBhcnRpY2lwYW50KHBhcnRpY2lwYW50OiBJQ2hhdFBhcnRpY2lwYW50KTogc3RyaW5nO1xyXG4gICAgY2xlYW5VcFVzZXJTZWxlY3Rpb246ICgpID0+IGFueVtdO1xyXG4gICAgb25DaGF0VGl0bGVDbGlja2VkKCk6IHZvaWQ7XHJcbiAgICBvbkZyaWVuZHNMaXN0Q2hlY2tib3hDaGFuZ2Uoc2VsZWN0ZWRVc2VyOiBVc2VyLCBpc0NoZWNrZWQ6IGJvb2xlYW4pOiB2b2lkO1xyXG4gICAgb25Vc2VyQ2xpY2soY2xpY2tlZFVzZXI6IFVzZXIpOiB2b2lkO1xyXG4gICAgb25GcmllbmRzTGlzdEFjdGlvbkNhbmNlbENsaWNrZWQoKTogdm9pZDtcclxuICAgIG9uRnJpZW5kc0xpc3RBY3Rpb25Db25maXJtQ2xpY2tlZCgpOiB2b2lkO1xyXG59XHJcbiJdfQ==