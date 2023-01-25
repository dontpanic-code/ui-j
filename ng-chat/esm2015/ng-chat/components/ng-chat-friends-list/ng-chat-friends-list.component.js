import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ChatParticipantStatus } from "../../core/chat-participant-status.enum";
import { MessageCounter } from "../../core/message-counter";
import { chatParticipantStatusDescriptor } from '../../core/chat-participant-status-descriptor';
export class NgChatFriendsListComponent {
    constructor() {
        this.participantsInteractedWith = [];
        this.onParticipantClicked = new EventEmitter();
        this.onOptionPromptCanceled = new EventEmitter();
        this.onOptionPromptConfirmed = new EventEmitter();
        this.selectedUsersFromFriendsList = [];
        this.searchInput = '';
        // Exposes enums and functions for the ng-template
        this.ChatParticipantStatus = ChatParticipantStatus;
        this.chatParticipantStatusDescriptor = chatParticipantStatusDescriptor;
        this.cleanUpUserSelection = () => this.selectedUsersFromFriendsList = [];
    }
    ngOnChanges(changes) {
        if (this.currentActiveOption) {
            const currentOptionTriggeredBy = this.currentActiveOption && this.currentActiveOption.chattingTo.participant.id;
            const isActivatedUserInSelectedList = (this.selectedUsersFromFriendsList.filter(item => item.id == currentOptionTriggeredBy)).length > 0;
            if (!isActivatedUserInSelectedList) {
                this.selectedUsersFromFriendsList = this.selectedUsersFromFriendsList.concat(this.currentActiveOption.chattingTo.participant);
            }
        }
    }
    get filteredParticipants() {
        if (this.searchInput.length > 0) {
            // Searches in the friend list by the inputted search string
            return this.participants.filter(x => x.displayName.toUpperCase().includes(this.searchInput.toUpperCase()));
        }
        return this.participants;
    }
    isUserSelectedFromFriendsList(user) {
        return (this.selectedUsersFromFriendsList.filter(item => item.id == user.id)).length > 0;
    }
    unreadMessagesTotalByParticipant(participant) {
        let openedWindow = this.windows.find(x => x.participant.id == participant.id);
        if (openedWindow) {
            return MessageCounter.unreadMessagesTotal(openedWindow, this.userId);
        }
        else {
            let totalUnreadMessages = this.participantsResponse
                .filter(x => x.participant.id == participant.id && !this.participantsInteractedWith.find(u => u.id == participant.id) && x.metadata && x.metadata.totalUnreadMessages > 0)
                .map((participantResponse) => {
                return participantResponse.metadata.totalUnreadMessages;
            })[0];
            return MessageCounter.formatUnreadMessagesTotal(totalUnreadMessages);
        }
    }
    // Toggle friends list visibility
    onChatTitleClicked() {
        this.isCollapsed = !this.isCollapsed;
    }
    onFriendsListCheckboxChange(selectedUser, isChecked) {
        if (isChecked) {
            this.selectedUsersFromFriendsList.push(selectedUser);
        }
        else {
            this.selectedUsersFromFriendsList.splice(this.selectedUsersFromFriendsList.indexOf(selectedUser), 1);
        }
    }
    onUserClick(clickedUser) {
        this.onParticipantClicked.emit(clickedUser);
    }
    onFriendsListActionCancelClicked() {
        this.onOptionPromptCanceled.emit();
        this.cleanUpUserSelection();
    }
    onFriendsListActionConfirmClicked() {
        this.onOptionPromptConfirmed.emit(this.selectedUsersFromFriendsList);
        this.cleanUpUserSelection();
    }
}
NgChatFriendsListComponent.decorators = [
    { type: Component, args: [{
                selector: 'ng-chat-friends-list',
                template: "<div *ngIf=\"shouldDisplay\" id=\"ng-chat-people\" [ngClass]=\"{'primary-outline-color': true, 'primary-background': true, 'ng-chat-people-collapsed': isCollapsed}\">\r\n\t<a href=\"javascript:void(0);\" class=\"ng-chat-title secondary-background shadowed\" (click)=\"onChatTitleClicked()\">\r\n\t\t<span>\r\n\t\t\t{{localization.title}}\r\n\t\t</span>\r\n\t</a>\r\n\t<div *ngIf=\"currentActiveOption\" class=\"ng-chat-people-actions\" (click)=\"onFriendsListActionCancelClicked()\">\r\n\t\t<a href=\"javascript:void(0);\" class=\"ng-chat-people-action\">\r\n\t\t\t<i class=\"remove-icon\"></i>\r\n\t\t</a>\r\n\t\t<a href=\"javascript:void(0);\" class=\"ng-chat-people-action\" (click)=\"onFriendsListActionConfirmClicked()\">\r\n\t\t\t<i class=\"check-icon\"></i>\r\n\t\t</a>\r\n\t</div>\r\n\t<input *ngIf=\"searchEnabled\" id=\"ng-chat-search_friend\" class=\"friends-search-bar\" type=\"search\" [placeholder]=\"localization.searchPlaceholder\" [(ngModel)]=\"searchInput\" />\r\n\t<ul id=\"ng-chat-users\" *ngIf=\"!isCollapsed\" [ngClass]=\"{'offset-search': searchEnabled}\">\r\n\t\t<li *ngFor=\"let user of filteredParticipants\">\r\n\t\t\t<input \r\n\t\t\t\t*ngIf=\"currentActiveOption && currentActiveOption.validateContext(user)\" \r\n\t\t\t\ttype=\"checkbox\" \r\n\t\t\t\tclass=\"ng-chat-users-checkbox\" \r\n\t\t\t\t(change)=\"onFriendsListCheckboxChange(user, $event.target.checked)\" \r\n\t\t\t\t[checked]=\"isUserSelectedFromFriendsList(user)\"/>\r\n\t\t\t<div [ngClass]=\"{'ng-chat-friends-list-selectable-offset': currentActiveOption, 'ng-chat-friends-list-container': true}\" (click)=\"onUserClick(user)\">\r\n\t\t\t\t<div *ngIf=\"!user.avatar\" class=\"icon-wrapper\">\r\n\t\t\t\t\t<i class=\"user-icon\"></i>\r\n\t\t\t\t</div>\r\n\t\t\t\t<img *ngIf=\"user.avatar\" alt=\"\" class=\"avatar\" height=\"30\" width=\"30\"  [src]=\"user.avatar | sanitize\"/>\r\n\t\t\t\t<strong title=\"{{user.displayName}}\">{{user.displayName}}</strong>\r\n\t\t\t\t<span [ngClass]=\"{'ng-chat-participant-status': true, 'online': user.status == ChatParticipantStatus.Online, 'busy': user.status == ChatParticipantStatus.Busy, 'away': user.status == ChatParticipantStatus.Away, 'offline': user.status == ChatParticipantStatus.Offline}\" title=\"{{chatParticipantStatusDescriptor(user.status, localization)}}\"></span>\r\n\t\t\t\t<span *ngIf=\"unreadMessagesTotalByParticipant(user).length > 0\" class=\"ng-chat-unread-messages-count unread-messages-counter-container primary-text\">{{unreadMessagesTotalByParticipant(user)}}</span>\r\n\t\t\t</div>\r\n\t\t</li>\r\n\t</ul>\r\n</div>",
                encapsulation: ViewEncapsulation.None,
                styles: ["#ng-chat-people{position:relative;width:240px;height:360px;border-width:1px;border-style:solid;margin-right:20px;box-shadow:0 4px 8px rgba(0,0,0,.25);border-bottom:0}#ng-chat-people.ng-chat-people-collapsed{height:30px}#ng-chat-search_friend{display:block;padding:7px 10px;width:calc(100% - 20px);margin:10px auto 0;font-size:.9em;-webkit-appearance:searchfield}#ng-chat-users{padding:0 10px;list-style:none;margin:0;overflow:auto;position:absolute;top:42px;bottom:0;width:100%;box-sizing:border-box}#ng-chat-users.offset-search{top:84px}#ng-chat-users .ng-chat-users-checkbox{float:left;margin-right:5px;margin-top:8px}#ng-chat-users li{clear:both;margin-bottom:10px;overflow:hidden;cursor:pointer;max-height:30px}#ng-chat-users li>.ng-chat-friends-list-selectable-offset{margin-left:22px}#ng-chat-users li .ng-chat-friends-list-container{display:inline-block;width:100%}#ng-chat-users li>.ng-chat-friends-list-selectable-offset.ng-chat-friends-list-container{display:block;width:auto}#ng-chat-users li .ng-chat-friends-list-container>.icon-wrapper,#ng-chat-users li .ng-chat-friends-list-container>img.avatar{float:left;margin-right:5px;border-radius:25px}#ng-chat-users li .ng-chat-friends-list-container>.icon-wrapper{background-color:#bababa;overflow:hidden;width:30px;height:30px}#ng-chat-users li .ng-chat-friends-list-container>.icon-wrapper>i{color:#fff;transform:scale(.7)}#ng-chat-users li .ng-chat-friends-list-container>strong{float:left;line-height:30px;font-size:.8em;max-width:57%;max-height:30px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}#ng-chat-users li .ng-chat-friends-list-container>.ng-chat-participant-status{float:right}.ng-chat-people-actions{position:absolute;top:4px;right:5px;margin:0;padding:0;z-index:2}.ng-chat-people-actions>a.ng-chat-people-action{display:inline-block;width:21px;height:21px;margin-right:8px;text-decoration:none;border:none;border-radius:25px;padding:1px}@media only screen and (max-width:581px){#ng-chat-people{width:300px;height:360px;margin-right:0}}"]
            },] }
];
NgChatFriendsListComponent.ctorParameters = () => [];
NgChatFriendsListComponent.propDecorators = {
    participants: [{ type: Input }],
    participantsResponse: [{ type: Input }],
    participantsInteractedWith: [{ type: Input }],
    windows: [{ type: Input }],
    userId: [{ type: Input }],
    localization: [{ type: Input }],
    shouldDisplay: [{ type: Input }],
    isCollapsed: [{ type: Input }],
    searchEnabled: [{ type: Input }],
    currentActiveOption: [{ type: Input }],
    onParticipantClicked: [{ type: Output }],
    onOptionPromptCanceled: [{ type: Output }],
    onOptionPromptConfirmed: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctY2hhdC1mcmllbmRzLWxpc3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbmctY2hhdC9jb21wb25lbnRzL25nLWNoYXQtZnJpZW5kcy1saXN0L25nLWNoYXQtZnJpZW5kcy1saXN0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLGlCQUFpQixFQUE0QixNQUFNLGVBQWUsQ0FBQztBQUlwSCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx5Q0FBeUMsQ0FBQztBQUtoRixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDNUQsT0FBTyxFQUFFLCtCQUErQixFQUFFLE1BQU0sK0NBQStDLENBQUM7QUFRaEcsTUFBTSxPQUFPLDBCQUEwQjtJQUNuQztRQVNPLCtCQUEwQixHQUF1QixFQUFFLENBQUM7UUF3QnBELHlCQUFvQixHQUFtQyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRzFFLDJCQUFzQixHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRy9ELDRCQUF1QixHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRWhFLGlDQUE0QixHQUFXLEVBQUUsQ0FBQztRQUUxQyxnQkFBVyxHQUFXLEVBQUUsQ0FBQztRQUVoQyxrREFBa0Q7UUFDM0MsMEJBQXFCLEdBQUcscUJBQXFCLENBQUM7UUFDOUMsb0NBQStCLEdBQUcsK0JBQStCLENBQUM7UUErQ3pFLHlCQUFvQixHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyw0QkFBNEIsR0FBRyxFQUFFLENBQUM7SUE5RnBELENBQUM7SUFpRGpCLFdBQVcsQ0FBQyxPQUFzQjtRQUM5QixJQUFJLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtZQUMxQixNQUFNLHdCQUF3QixHQUFHLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxJQUFJ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Q0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ3hHO0lBQ0wsQ0FBQztJQUVELFdBQVcsQ0FBQyxXQUFpQjtRQUV6QixJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCxnQ0FBZ0M7UUFFNUIsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksRUFBRSxDQUFDO1FBQ25DLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0lBQ2hDLENBQUM7SUFFRCxpQ0FBaUM7UUFFN0IsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsQ0FBQztRQUNyRSxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztJQUNoQyxDQUFDOzs7WUF2SUosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxzQkFBc0I7Z0JBQ2hDLDhoRkFBb0Q7Z0JBRXBELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJOzthQUN4Qzs7OzsyQkFJSSxLQUFLO21DQUdMLEtBQUs7eUNBR0wsS0FBSztzQkFHTCxLQUFLO3FCQUdMLEtBQUs7MkJBR0wsS0FBSzs0QkFHTCxLQUFLOzBCQUdMLEtBQUs7NEJBR0wsS0FBSztrQ0FHTCxLQUFLO21DQUdMLE1BQU07cUNBR04sTUFBTTtzQ0FHTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIFZpZXdFbmNhcHN1bGF0aW9uLCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7IExvY2FsaXphdGlvbiB9IGZyb20gJy4uLy4uL2NvcmUvbG9jYWxpemF0aW9uJztcclxuaW1wb3J0IHsgSUNoYXRPcHRpb24gfSBmcm9tICcuLi8uLi9jb3JlL2NoYXQtb3B0aW9uJztcclxuaW1wb3J0IHsgQ2hhdFBhcnRpY2lwYW50U3RhdHVzIH0gZnJvbSBcIi4uLy4uL2NvcmUvY2hhdC1wYXJ0aWNpcGFudC1zdGF0dXMuZW51bVwiO1xyXG5pbXBvcnQgeyBJQ2hhdFBhcnRpY2lwYW50IH0gZnJvbSBcIi4uLy4uL2NvcmUvY2hhdC1wYXJ0aWNpcGFudFwiO1xyXG5pbXBvcnQgeyBVc2VyIH0gZnJvbSBcIi4uLy4uL2NvcmUvdXNlclwiO1xyXG5pbXBvcnQgeyBXaW5kb3cgfSBmcm9tIFwiLi4vLi4vY29yZS93aW5kb3dcIjtcclxuaW1wb3J0IHsgUGFydGljaXBhbnRSZXNwb25zZSB9IGZyb20gXCIuLi8uLi9jb3JlL3BhcnRpY2lwYW50LXJlc3BvbnNlXCI7XHJcbmltcG9ydCB7IE1lc3NhZ2VDb3VudGVyIH0gZnJvbSBcIi4uLy4uL2NvcmUvbWVzc2FnZS1jb3VudGVyXCI7XHJcbmltcG9ydCB7IGNoYXRQYXJ0aWNpcGFudFN0YXR1c0Rlc2NyaXB0b3IgfSBmcm9tICcuLi8uLi9jb3JlL2NoYXQtcGFydGljaXBhbnQtc3RhdHVzLWRlc2NyaXB0b3InO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ25nLWNoYXQtZnJpZW5kcy1saXN0JyxcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9uZy1jaGF0LWZyaWVuZHMtbGlzdC5jb21wb25lbnQuaHRtbCcsXHJcbiAgICBzdHlsZVVybHM6IFsnLi9uZy1jaGF0LWZyaWVuZHMtbGlzdC5jb21wb25lbnQuY3NzJ10sXHJcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ0NoYXRGcmllbmRzTGlzdENvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBwdWJsaWMgcGFydGljaXBhbnRzOiBJQ2hhdFBhcnRpY2lwYW50W107XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHB1YmxpYyBwYXJ0aWNpcGFudHNSZXNwb25zZTogUGFydGljaXBhbnRSZXNwb25zZVtdO1xyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBwdWJsaWMgcGFydGljaXBhbnRzSW50ZXJhY3RlZFdpdGg6IElDaGF0UGFydGljaXBhbnRbXSA9IFtdO1xyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBwdWJsaWMgd2luZG93czogV2luZG93W107XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHB1YmxpYyB1c2VySWQ6IGFueTtcclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgcHVibGljIGxvY2FsaXphdGlvbjogTG9jYWxpemF0aW9uO1xyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBwdWJsaWMgc2hvdWxkRGlzcGxheTogYm9vbGVhbjtcclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgcHVibGljIGlzQ29sbGFwc2VkOiBib29sZWFuO1xyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBwdWJsaWMgc2VhcmNoRW5hYmxlZDogYm9vbGVhbjtcclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgcHVibGljIGN1cnJlbnRBY3RpdmVPcHRpb246IElDaGF0T3B0aW9uIHwgbnVsbDtcclxuXHJcbiAgICBAT3V0cHV0KClcclxuICAgIHB1YmxpYyBvblBhcnRpY2lwYW50Q2xpY2tlZDogRXZlbnRFbWl0dGVyPElDaGF0UGFydGljaXBhbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICAgIEBPdXRwdXQoKVxyXG4gICAgcHVibGljIG9uT3B0aW9uUHJvbXB0Q2FuY2VsZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICAgIEBPdXRwdXQoKVxyXG4gICAgcHVibGljIG9uT3B0aW9uUHJvbXB0Q29uZmlybWVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgICBwdWJsaWMgc2VsZWN0ZWRVc2Vyc0Zyb21GcmllbmRzTGlzdDogVXNlcltdID0gW107XHJcblxyXG4gICAgcHVibGljIHNlYXJjaElucHV0OiBzdHJpbmcgPSAnJztcclxuXHJcbiAgICAvLyBFeHBvc2VzIGVudW1zIGFuZCBmdW5jdGlvbnMgZm9yIHRoZSBuZy10ZW1wbGF0ZVxyXG4gICAgcHVibGljIENoYXRQYXJ0aWNpcGFudFN0YXR1cyA9IENoYXRQYXJ0aWNpcGFudFN0YXR1cztcclxuICAgIHB1YmxpYyBjaGF0UGFydGljaXBhbnRTdGF0dXNEZXNjcmlwdG9yID0gY2hhdFBhcnRpY2lwYW50U3RhdHVzRGVzY3JpcHRvcjtcclxuXHJcbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudEFjdGl2ZU9wdGlvbikge1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50T3B0aW9uVHJpZ2dlcmVkQnkgPSB0aGlzLmN1cnJlbnRBY3RpdmVPcHRpb24gJiYgdGhpcy5jdXJyZW50QWN0aXZlT3B0aW9uLmNoYXR0aW5nVG8ucGFydGljaXBhbnQuaWQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGlzQWN0aXZhdGVkVXNlckluU2VsZWN0ZWRMaXN0ID0gKHRoaXMuc2VsZWN0ZWRVc2Vyc0Zyb21GcmllbmRzTGlzdC5maWx0ZXIoaXRlbSA9PiBpdGVtLmlkID09IGN1cnJlbnRPcHRpb25UcmlnZ2VyZWRCeSkpLmxlbmd0aCA+IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWlzQWN0aXZhdGVkVXNlckluU2VsZWN0ZWRMaXN0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkVXNlcnNGcm9tRnJpZW5kc0xpc3QgPSB0aGlzLnNlbGVjdGVkVXNlcnNGcm9tRnJpZW5kc0xpc3QuY29uY2F0KHRoaXMuY3VycmVudEFjdGl2ZU9wdGlvbi5jaGF0dGluZ1RvLnBhcnRpY2lwYW50IGFzIFVzZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldCBmaWx0ZXJlZFBhcnRpY2lwYW50cygpOiBJQ2hhdFBhcnRpY2lwYW50W11cclxuICAgIHtcclxuICAgICAgICBpZiAodGhpcy5zZWFyY2hJbnB1dC5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgLy8gU2VhcmNoZXMgaW4gdGhlIGZyaWVuZCBsaXN0IGJ5IHRoZSBpbnB1dHRlZCBzZWFyY2ggc3RyaW5nXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnRpY2lwYW50cy5maWx0ZXIoeCA9PiB4LmRpc3BsYXlOYW1lLnRvVXBwZXJDYXNlKCkuaW5jbHVkZXModGhpcy5zZWFyY2hJbnB1dC50b1VwcGVyQ2FzZSgpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5wYXJ0aWNpcGFudHM7XHJcbiAgICB9XHJcblxyXG4gICAgaXNVc2VyU2VsZWN0ZWRGcm9tRnJpZW5kc0xpc3QodXNlcjogVXNlcikgOiBib29sZWFuXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLnNlbGVjdGVkVXNlcnNGcm9tRnJpZW5kc0xpc3QuZmlsdGVyKGl0ZW0gPT4gaXRlbS5pZCA9PSB1c2VyLmlkKSkubGVuZ3RoID4gMFxyXG4gICAgfVxyXG5cclxuICAgIHVucmVhZE1lc3NhZ2VzVG90YWxCeVBhcnRpY2lwYW50KHBhcnRpY2lwYW50OiBJQ2hhdFBhcnRpY2lwYW50KTogc3RyaW5nXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IG9wZW5lZFdpbmRvdyA9IHRoaXMud2luZG93cy5maW5kKHggPT4geC5wYXJ0aWNpcGFudC5pZCA9PSBwYXJ0aWNpcGFudC5pZCk7XHJcblxyXG4gICAgICAgIGlmIChvcGVuZWRXaW5kb3cpe1xyXG4gICAgICAgICAgICByZXR1cm4gTWVzc2FnZUNvdW50ZXIudW5yZWFkTWVzc2FnZXNUb3RhbChvcGVuZWRXaW5kb3csIHRoaXMudXNlcklkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IHRvdGFsVW5yZWFkTWVzc2FnZXMgPSB0aGlzLnBhcnRpY2lwYW50c1Jlc3BvbnNlXHJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKHggPT4geC5wYXJ0aWNpcGFudC5pZCA9PSBwYXJ0aWNpcGFudC5pZCAmJiAhdGhpcy5wYXJ0aWNpcGFudHNJbnRlcmFjdGVkV2l0aC5maW5kKHUgPT4gdS5pZCA9PSBwYXJ0aWNpcGFudC5pZCkgJiYgeC5tZXRhZGF0YSAmJiB4Lm1ldGFkYXRhLnRvdGFsVW5yZWFkTWVzc2FnZXMgPiAwKVxyXG4gICAgICAgICAgICAgICAgLm1hcCgocGFydGljaXBhbnRSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJ0aWNpcGFudFJlc3BvbnNlLm1ldGFkYXRhLnRvdGFsVW5yZWFkTWVzc2FnZXNcclxuICAgICAgICAgICAgICAgIH0pWzBdO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIE1lc3NhZ2VDb3VudGVyLmZvcm1hdFVucmVhZE1lc3NhZ2VzVG90YWwodG90YWxVbnJlYWRNZXNzYWdlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNsZWFuVXBVc2VyU2VsZWN0aW9uID0gKCkgPT4gdGhpcy5zZWxlY3RlZFVzZXJzRnJvbUZyaWVuZHNMaXN0ID0gW107XHJcblxyXG4gICAgLy8gVG9nZ2xlIGZyaWVuZHMgbGlzdCB2aXNpYmlsaXR5XHJcbiAgICBvbkNoYXRUaXRsZUNsaWNrZWQoKTogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuaXNDb2xsYXBzZWQgPSAhdGhpcy5pc0NvbGxhcHNlZDtcclxuICAgIH1cclxuXHJcbiAgICBvbkZyaWVuZHNMaXN0Q2hlY2tib3hDaGFuZ2Uoc2VsZWN0ZWRVc2VyOiBVc2VyLCBpc0NoZWNrZWQ6IGJvb2xlYW4pOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgaWYoaXNDaGVja2VkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRVc2Vyc0Zyb21GcmllbmRzTGlzdC5wdXNoKHNlbGVjdGVkVXNlcik7XHJcbiAgICAgICAgfSBcclxuICAgICAgICBlbHNlIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFVzZXJzRnJvbUZyaWVuZHNMaXN0LnNwbGljZSh0aGlzLnNlbGVjdGVkVXNlcnNGcm9tRnJpZW5kc0xpc3QuaW5kZXhPZihzZWxlY3RlZFVzZXIpLCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25Vc2VyQ2xpY2soY2xpY2tlZFVzZXI6IFVzZXIpOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vblBhcnRpY2lwYW50Q2xpY2tlZC5lbWl0KGNsaWNrZWRVc2VyKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkZyaWVuZHNMaXN0QWN0aW9uQ2FuY2VsQ2xpY2tlZCgpOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vbk9wdGlvblByb21wdENhbmNlbGVkLmVtaXQoKTtcclxuICAgICAgICB0aGlzLmNsZWFuVXBVc2VyU2VsZWN0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25GcmllbmRzTGlzdEFjdGlvbkNvbmZpcm1DbGlja2VkKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vbk9wdGlvblByb21wdENvbmZpcm1lZC5lbWl0KHRoaXMuc2VsZWN0ZWRVc2Vyc0Zyb21GcmllbmRzTGlzdCk7XHJcbiAgICAgICAgdGhpcy5jbGVhblVwVXNlclNlbGVjdGlvbigpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==