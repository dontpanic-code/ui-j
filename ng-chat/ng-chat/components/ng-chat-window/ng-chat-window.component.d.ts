import { EventEmitter, ElementRef } from '@angular/core';
import { Message } from "../../core/message";
import { MessageType } from "../../core/message-type.enum";
import { Window } from "../../core/window";
import { ChatParticipantStatus } from "../../core/chat-participant-status.enum";
import { ScrollDirection } from "../../core/scroll-direction.enum";
import { Localization } from '../../core/localization';
import { IFileUploadAdapter } from '../../core/file-upload-adapter';
import { IChatOption } from '../../core/chat-option';
import { ChatParticipantType } from "../../core/chat-participant-type.enum";
import { IChatParticipant } from "../../core/chat-participant";
import { chatParticipantStatusDescriptor } from '../../core/chat-participant-status-descriptor';
import * as ɵngcc0 from '@angular/core';
export declare class NgChatWindowComponent {
    constructor();
    fileUploadAdapter: IFileUploadAdapter;
    window: Window;
    userId: any;
    localization: Localization;
    showOptions: boolean;
    emojisEnabled: boolean;
    linkfyEnabled: boolean;
    showMessageDate: boolean;
    messageDatePipeFormat: string;
    hasPagedHistory: boolean;
    onChatWindowClosed: EventEmitter<{
        closedWindow: Window;
        closedViaEscapeKey: boolean;
    }>;
    onMessagesSeen: EventEmitter<Message[]>;
    onMessageSent: EventEmitter<Message>;
    onTabTriggered: EventEmitter<{
        triggeringWindow: Window;
        shiftKeyPressed: boolean;
    }>;
    onOptionTriggered: EventEmitter<IChatOption>;
    onLoadHistoryTriggered: EventEmitter<Window>;
    chatMessages: any;
    nativeFileInput: ElementRef;
    chatWindowInput: any;
    fileUploadersInUse: string[];
    ChatParticipantType: typeof ChatParticipantType;
    ChatParticipantStatus: typeof ChatParticipantStatus;
    MessageType: typeof MessageType;
    chatParticipantStatusDescriptor: typeof chatParticipantStatusDescriptor;
    defaultWindowOptions(currentWindow: Window): IChatOption[];
    isAvatarVisible(window: Window, message: Message, index: number): boolean;
    getChatWindowAvatar(participant: IChatParticipant, message: Message): string | null;
    isUploadingFile(window: Window): boolean;
    getUniqueFileUploadInstanceId(window: Window): string;
    unreadMessagesTotal(window: Window): string;
    scrollChatWindow(window: Window, direction: ScrollDirection): void;
    activeOptionTrackerChange(option: IChatOption): void;
    triggerNativeFileUpload(window: Window): void;
    toggleWindowFocus(window: Window): void;
    markMessagesAsRead(messages: Message[]): void;
    fetchMessageHistory(window: Window): void;
    onCloseChatWindow(): void;
    onChatInputTyped(event: any, window: Window): void;
    onChatWindowClicked(window: Window): void;
    private clearInUseFileUploader;
    onFileChosen(window: Window): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NgChatWindowComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<NgChatWindowComponent, "ng-chat-window", never, { "emojisEnabled": "emojisEnabled"; "linkfyEnabled": "linkfyEnabled"; "showMessageDate": "showMessageDate"; "messageDatePipeFormat": "messageDatePipeFormat"; "hasPagedHistory": "hasPagedHistory"; "fileUploadAdapter": "fileUploadAdapter"; "window": "window"; "userId": "userId"; "localization": "localization"; "showOptions": "showOptions"; }, { "onChatWindowClosed": "onChatWindowClosed"; "onMessagesSeen": "onMessagesSeen"; "onMessageSent": "onMessageSent"; "onTabTriggered": "onTabTriggered"; "onOptionTriggered": "onOptionTriggered"; "onLoadHistoryTriggered": "onLoadHistoryTriggered"; }, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctY2hhdC13aW5kb3cuY29tcG9uZW50LmQudHMiLCJzb3VyY2VzIjpbIm5nLWNoYXQtd2luZG93LmNvbXBvbmVudC5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIsIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gXCIuLi8uLi9jb3JlL21lc3NhZ2VcIjtcclxuaW1wb3J0IHsgTWVzc2FnZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29yZS9tZXNzYWdlLXR5cGUuZW51bVwiO1xyXG5pbXBvcnQgeyBXaW5kb3cgfSBmcm9tIFwiLi4vLi4vY29yZS93aW5kb3dcIjtcclxuaW1wb3J0IHsgQ2hhdFBhcnRpY2lwYW50U3RhdHVzIH0gZnJvbSBcIi4uLy4uL2NvcmUvY2hhdC1wYXJ0aWNpcGFudC1zdGF0dXMuZW51bVwiO1xyXG5pbXBvcnQgeyBTY3JvbGxEaXJlY3Rpb24gfSBmcm9tIFwiLi4vLi4vY29yZS9zY3JvbGwtZGlyZWN0aW9uLmVudW1cIjtcclxuaW1wb3J0IHsgTG9jYWxpemF0aW9uIH0gZnJvbSAnLi4vLi4vY29yZS9sb2NhbGl6YXRpb24nO1xyXG5pbXBvcnQgeyBJRmlsZVVwbG9hZEFkYXB0ZXIgfSBmcm9tICcuLi8uLi9jb3JlL2ZpbGUtdXBsb2FkLWFkYXB0ZXInO1xyXG5pbXBvcnQgeyBJQ2hhdE9wdGlvbiB9IGZyb20gJy4uLy4uL2NvcmUvY2hhdC1vcHRpb24nO1xyXG5pbXBvcnQgeyBDaGF0UGFydGljaXBhbnRUeXBlIH0gZnJvbSBcIi4uLy4uL2NvcmUvY2hhdC1wYXJ0aWNpcGFudC10eXBlLmVudW1cIjtcclxuaW1wb3J0IHsgSUNoYXRQYXJ0aWNpcGFudCB9IGZyb20gXCIuLi8uLi9jb3JlL2NoYXQtcGFydGljaXBhbnRcIjtcclxuaW1wb3J0IHsgY2hhdFBhcnRpY2lwYW50U3RhdHVzRGVzY3JpcHRvciB9IGZyb20gJy4uLy4uL2NvcmUvY2hhdC1wYXJ0aWNpcGFudC1zdGF0dXMtZGVzY3JpcHRvcic7XHJcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIE5nQ2hhdFdpbmRvd0NvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpO1xyXG4gICAgZmlsZVVwbG9hZEFkYXB0ZXI6IElGaWxlVXBsb2FkQWRhcHRlcjtcclxuICAgIHdpbmRvdzogV2luZG93O1xyXG4gICAgdXNlcklkOiBhbnk7XHJcbiAgICBsb2NhbGl6YXRpb246IExvY2FsaXphdGlvbjtcclxuICAgIHNob3dPcHRpb25zOiBib29sZWFuO1xyXG4gICAgZW1vamlzRW5hYmxlZDogYm9vbGVhbjtcclxuICAgIGxpbmtmeUVuYWJsZWQ6IGJvb2xlYW47XHJcbiAgICBzaG93TWVzc2FnZURhdGU6IGJvb2xlYW47XHJcbiAgICBtZXNzYWdlRGF0ZVBpcGVGb3JtYXQ6IHN0cmluZztcclxuICAgIGhhc1BhZ2VkSGlzdG9yeTogYm9vbGVhbjtcclxuICAgIG9uQ2hhdFdpbmRvd0Nsb3NlZDogRXZlbnRFbWl0dGVyPHtcclxuICAgICAgICBjbG9zZWRXaW5kb3c6IFdpbmRvdztcclxuICAgICAgICBjbG9zZWRWaWFFc2NhcGVLZXk6IGJvb2xlYW47XHJcbiAgICB9PjtcclxuICAgIG9uTWVzc2FnZXNTZWVuOiBFdmVudEVtaXR0ZXI8TWVzc2FnZVtdPjtcclxuICAgIG9uTWVzc2FnZVNlbnQ6IEV2ZW50RW1pdHRlcjxNZXNzYWdlPjtcclxuICAgIG9uVGFiVHJpZ2dlcmVkOiBFdmVudEVtaXR0ZXI8e1xyXG4gICAgICAgIHRyaWdnZXJpbmdXaW5kb3c6IFdpbmRvdztcclxuICAgICAgICBzaGlmdEtleVByZXNzZWQ6IGJvb2xlYW47XHJcbiAgICB9PjtcclxuICAgIG9uT3B0aW9uVHJpZ2dlcmVkOiBFdmVudEVtaXR0ZXI8SUNoYXRPcHRpb24+O1xyXG4gICAgb25Mb2FkSGlzdG9yeVRyaWdnZXJlZDogRXZlbnRFbWl0dGVyPFdpbmRvdz47XHJcbiAgICBjaGF0TWVzc2FnZXM6IGFueTtcclxuICAgIG5hdGl2ZUZpbGVJbnB1dDogRWxlbWVudFJlZjtcclxuICAgIGNoYXRXaW5kb3dJbnB1dDogYW55O1xyXG4gICAgZmlsZVVwbG9hZGVyc0luVXNlOiBzdHJpbmdbXTtcclxuICAgIENoYXRQYXJ0aWNpcGFudFR5cGU6IHR5cGVvZiBDaGF0UGFydGljaXBhbnRUeXBlO1xyXG4gICAgQ2hhdFBhcnRpY2lwYW50U3RhdHVzOiB0eXBlb2YgQ2hhdFBhcnRpY2lwYW50U3RhdHVzO1xyXG4gICAgTWVzc2FnZVR5cGU6IHR5cGVvZiBNZXNzYWdlVHlwZTtcclxuICAgIGNoYXRQYXJ0aWNpcGFudFN0YXR1c0Rlc2NyaXB0b3I6IHR5cGVvZiBjaGF0UGFydGljaXBhbnRTdGF0dXNEZXNjcmlwdG9yO1xyXG4gICAgZGVmYXVsdFdpbmRvd09wdGlvbnMoY3VycmVudFdpbmRvdzogV2luZG93KTogSUNoYXRPcHRpb25bXTtcclxuICAgIGlzQXZhdGFyVmlzaWJsZSh3aW5kb3c6IFdpbmRvdywgbWVzc2FnZTogTWVzc2FnZSwgaW5kZXg6IG51bWJlcik6IGJvb2xlYW47XHJcbiAgICBnZXRDaGF0V2luZG93QXZhdGFyKHBhcnRpY2lwYW50OiBJQ2hhdFBhcnRpY2lwYW50LCBtZXNzYWdlOiBNZXNzYWdlKTogc3RyaW5nIHwgbnVsbDtcclxuICAgIGlzVXBsb2FkaW5nRmlsZSh3aW5kb3c6IFdpbmRvdyk6IGJvb2xlYW47XHJcbiAgICBnZXRVbmlxdWVGaWxlVXBsb2FkSW5zdGFuY2VJZCh3aW5kb3c6IFdpbmRvdyk6IHN0cmluZztcclxuICAgIHVucmVhZE1lc3NhZ2VzVG90YWwod2luZG93OiBXaW5kb3cpOiBzdHJpbmc7XHJcbiAgICBzY3JvbGxDaGF0V2luZG93KHdpbmRvdzogV2luZG93LCBkaXJlY3Rpb246IFNjcm9sbERpcmVjdGlvbik6IHZvaWQ7XHJcbiAgICBhY3RpdmVPcHRpb25UcmFja2VyQ2hhbmdlKG9wdGlvbjogSUNoYXRPcHRpb24pOiB2b2lkO1xyXG4gICAgdHJpZ2dlck5hdGl2ZUZpbGVVcGxvYWQod2luZG93OiBXaW5kb3cpOiB2b2lkO1xyXG4gICAgdG9nZ2xlV2luZG93Rm9jdXMod2luZG93OiBXaW5kb3cpOiB2b2lkO1xyXG4gICAgbWFya01lc3NhZ2VzQXNSZWFkKG1lc3NhZ2VzOiBNZXNzYWdlW10pOiB2b2lkO1xyXG4gICAgZmV0Y2hNZXNzYWdlSGlzdG9yeSh3aW5kb3c6IFdpbmRvdyk6IHZvaWQ7XHJcbiAgICBvbkNsb3NlQ2hhdFdpbmRvdygpOiB2b2lkO1xyXG4gICAgb25DaGF0SW5wdXRUeXBlZChldmVudDogYW55LCB3aW5kb3c6IFdpbmRvdyk6IHZvaWQ7XHJcbiAgICBvbkNoYXRXaW5kb3dDbGlja2VkKHdpbmRvdzogV2luZG93KTogdm9pZDtcclxuICAgIHByaXZhdGUgY2xlYXJJblVzZUZpbGVVcGxvYWRlcjtcclxuICAgIG9uRmlsZUNob3Nlbih3aW5kb3c6IFdpbmRvdyk6IHZvaWQ7XHJcbn1cclxuIl19