import { __awaiter } from "tslib";
import { Component, Input, ViewChildren, HostListener, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageType } from "./core/message-type.enum";
import { Window } from "./core/window";
import { ChatParticipantStatus } from "./core/chat-participant-status.enum";
import { ScrollDirection } from "./core/scroll-direction.enum";
import { PagedHistoryChatAdapter } from './core/paged-history-chat-adapter';
import { DefaultFileUploadAdapter } from './core/default-file-upload-adapter';
import { Theme } from './core/theme.enum';
import { Group } from "./core/group";
import { ChatParticipantType } from "./core/chat-participant-type.enum";
import { map } from 'rxjs/operators';
export class NgChat {
    constructor(_httpClient) {
        this._httpClient = _httpClient;
        // Exposes enums for the ng-template
        this.ChatParticipantType = ChatParticipantType;
        this.ChatParticipantStatus = ChatParticipantStatus;
        this.MessageType = MessageType;
        this._isDisabled = false;
        this.isCollapsed = false;
        this.maximizeWindowOnNewMessage = true;
        this.pollFriendsList = false;
        this.pollingInterval = 5000;
        this.historyEnabled = true;
        this.emojisEnabled = true;
        this.linkfyEnabled = true;
        this.audioEnabled = true;
        this.searchEnabled = true;
        this.audioSource = 'https://raw.githubusercontent.com/rpaschoal/ng-chat/master/src/ng-chat/assets/notification.wav';
        this.persistWindowsState = true;
        this.title = "Friends";
        this.messagePlaceholder = "Type a message";
        this.searchPlaceholder = "Search";
        this.browserNotificationsEnabled = true;
        this.browserNotificationIconSource = 'https://raw.githubusercontent.com/rpaschoal/ng-chat/master/src/ng-chat/assets/notification.png';
        this.browserNotificationTitle = "New message from";
        this.historyPageSize = 10;
        this.hideFriendsList = false;
        this.hideFriendsListOnUnsupportedViewport = true;
        this.theme = Theme.Light;
        this.messageDatePipeFormat = "short";
        this.showMessageDate = true;
        this.isViewportOnMobileEnabled = false;
        this.onParticipantClicked = new EventEmitter();
        this.onParticipantChatOpened = new EventEmitter();
        this.onParticipantChatClosed = new EventEmitter();
        this.onMessagesSeen = new EventEmitter();
        this.browserNotificationsBootstrapped = false;
        this.hasPagedHistory = false;
        // Don't want to add this as a setting to simplify usage. Previous placeholder and title settings available to be used, or use full Localization object.
        this.statusDescription = {
            online: 'Online',
            busy: 'Busy',
            away: 'Away',
            offline: 'Offline'
        };
        this.participantsInteractedWith = [];
        // Defines the size of each opened window to calculate how many windows can be opened on the viewport at the same time.
        this.windowSizeFactor = 320;
        // Total width size of the friends list section
        this.friendsListWidth = 262;
        // Set to true if there is no space to display at least one chat window and 'hideFriendsListOnUnsupportedViewport' is true
        this.unsupportedViewport = false;
        this.windows = [];
        this.isBootstrapped = false;
    }
    get isDisabled() {
        return this._isDisabled;
    }
    set isDisabled(value) {
        this._isDisabled = value;
        if (value) {
            // To address issue https://github.com/rpaschoal/ng-chat/issues/120
            window.clearInterval(this.pollingIntervalWindowInstance);
        }
        else {
            this.activateFriendListFetch();
        }
    }
    get localStorageKey() {
        return `ng-chat-users-${this.userId}`; // Appending the user id so the state is unique per user in a computer.
    }
    ;
    ngOnInit() {
        this.bootstrapChat();
    }
    onResize(event) {
        this.viewPortTotalArea = event.target.innerWidth;
        this.NormalizeWindows();
    }
    // Checks if there are more opened windows than the view port can display
    NormalizeWindows() {
        // const maxSupportedOpenedWindows = Math.floor((this.viewPortTotalArea - (!this.hideFriendsList ? this.friendsListWidth : 0)) / this.windowSizeFactor);
        // const difference = this.windows.length - maxSupportedOpenedWindows;
        // if (difference >= 0) {
        //     this.windows.splice(this.windows.length - difference);
        // }
        // this.updateWindowsState(this.windows);
        // // Viewport should have space for at least one chat window but should show in mobile if option is enabled.
        // this.unsupportedViewport = this.isViewportOnMobileEnabled ? false : this.hideFriendsListOnUnsupportedViewport && maxSupportedOpenedWindows < 1;
    }
    // Initializes the chat plugin and the messaging adapter
    bootstrapChat() {
        let initializationException = null;
        if (this.adapter != null && this.userId != null) {
            try {
                this.viewPortTotalArea = window.innerWidth;
                this.initializeTheme();
                this.initializeDefaultText();
                this.initializeBrowserNotifications();
                // Binding event listeners
                this.adapter.messageReceivedHandler = (participant, msg) => this.onMessageReceived(participant, msg);
                this.adapter.friendsListChangedHandler = (participantsResponse) => this.onFriendsListChanged(participantsResponse);
                this.activateFriendListFetch();
                this.bufferAudioFile();
                this.hasPagedHistory = this.adapter instanceof PagedHistoryChatAdapter;
                if (this.fileUploadUrl && this.fileUploadUrl !== "") {
                    this.fileUploadAdapter = new DefaultFileUploadAdapter(this.fileUploadUrl, this._httpClient);
                }
                this.NormalizeWindows();
                this.isBootstrapped = true;
            }
            catch (ex) {
                initializationException = ex;
            }
        }
        if (!this.isBootstrapped) {
            // console.error("ng-chat component couldn't be bootstrapped.");
            // if (this.userId == null) {
            //     console.error("ng-chat can't be initialized without an user id. Please make sure you've provided an userId as a parameter of the ng-chat component.");
            // }
            // if (this.adapter == null) {
            //     console.error("ng-chat can't be bootstrapped without a ChatAdapter. Please make sure you've provided a ChatAdapter implementation as a parameter of the ng-chat component.");
            // }
            // if (initializationException) {
            //     console.error(`An exception has occurred while initializing ng-chat. Details: ${initializationException.message}`);
            //     console.error(initializationException);
            // }
        }
    }
    activateFriendListFetch() {
        if (this.adapter) {
            // Loading current users list
            if (this.pollFriendsList) {
                // Setting a long poll interval to update the friends list
                this.fetchFriendsList(true);
                this.pollingIntervalWindowInstance = window.setInterval(() => this.fetchFriendsList(false), this.pollingInterval);
            }
            else {
                // Since polling was disabled, a friends list update mechanism will have to be implemented in the ChatAdapter.
                this.fetchFriendsList(true);
            }
        }
    }
    // Initializes browser notifications
    initializeBrowserNotifications() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.browserNotificationsEnabled && ("Notification" in window)) {
                if ((yield Notification.requestPermission()) === "granted") {
                    this.browserNotificationsBootstrapped = true;
                }
            }
        });
    }
    // Initializes default text
    initializeDefaultText() {
        if (!this.localization) {
            this.localization = {
                messagePlaceholder: this.messagePlaceholder,
                searchPlaceholder: this.searchPlaceholder,
                title: this.title,
                statusDescription: this.statusDescription,
                browserNotificationTitle: this.browserNotificationTitle,
                loadMessageHistoryPlaceholder: "Load older messages"
            };
        }
    }
    initializeTheme() {
        if (this.customTheme) {
            this.theme = Theme.Custom;
        }
        else if (this.theme != Theme.Light && this.theme != Theme.Dark) {
            // TODO: Use es2017 in future with Object.values(Theme).includes(this.theme) to do this check
            throw new Error(`Invalid theme configuration for ng-chat. "${this.theme}" is not a valid theme value.`);
        }
    }
    // Sends a request to load the friends list
    fetchFriendsList(isBootstrapping) {
        this.adapter.listFriends()
            .pipe(map((participantsResponse) => {
            this.participantsResponse = participantsResponse;
            this.participants = participantsResponse.map((response) => {
                return response.participant;
            });
        })).subscribe(() => {
            if (isBootstrapping) {
                this.restoreWindowsState();
            }
        });
    }
    fetchMessageHistory(window) {
        // Not ideal but will keep this until we decide if we are shipping pagination with the default adapter
        if (this.adapter instanceof PagedHistoryChatAdapter) {
            window.isLoadingHistory = true;
            this.adapter.getMessageHistoryByPage(window.participant.id, this.historyPageSize, ++window.historyPage)
                .pipe(map((result) => {
                result.forEach((message) => this.assertMessageType(message));
                window.messages = result.concat(window.messages);
                window.isLoadingHistory = false;
                const direction = (window.historyPage == 1) ? ScrollDirection.Bottom : ScrollDirection.Top;
                window.hasMoreMessages = result.length == this.historyPageSize;
                setTimeout(() => this.onFetchMessageHistoryLoaded(result, window, direction, true));
            })).subscribe();
        }
        else {
            this.adapter.getMessageHistory(window.participant.id)
                .pipe(map((result) => {
                result.forEach((message) => this.assertMessageType(message));
                window.messages = result.concat(window.messages);
                window.isLoadingHistory = false;
                setTimeout(() => this.onFetchMessageHistoryLoaded(result, window, ScrollDirection.Bottom));
            })).subscribe();
        }
    }
    onFetchMessageHistoryLoaded(messages, window, direction, forceMarkMessagesAsSeen = false) {
        this.scrollChatWindow(window, direction);
        if (window.hasFocus || forceMarkMessagesAsSeen) {
            const unseenMessages = messages.filter(m => !m.dateSeen);
            this.markMessagesAsRead(unseenMessages);
        }
    }
    // Updates the friends list via the event handler
    onFriendsListChanged(participantsResponse) {
        if (participantsResponse) {
            this.participantsResponse = participantsResponse;
            this.participants = participantsResponse.map((response) => {
                return response.participant;
            });
            this.participantsInteractedWith = [];
        }
    }
    // Handles received messages by the adapter
    onMessageReceived(participant, message) {
        if (participant && message) {
            const chatWindow = this.openChatWindow(participant);
            this.assertMessageType(message);
            if (!chatWindow[1] || !this.historyEnabled) {
                chatWindow[0].messages.push(message);
                this.scrollChatWindow(chatWindow[0], ScrollDirection.Bottom);
                if (chatWindow[0].hasFocus) {
                    this.markMessagesAsRead([message]);
                }
            }
            this.emitMessageSound(chatWindow[0]);
            // Github issue #58
            // Do not push browser notifications with message content for privacy purposes if the 'maximizeWindowOnNewMessage' setting is off and this is a new chat window.
            if (this.maximizeWindowOnNewMessage || (!chatWindow[1] && !chatWindow[0].isCollapsed)) {
                // Some messages are not pushed because they are loaded by fetching the history hence why we supply the message here
                this.emitBrowserNotification(chatWindow[0], message);
            }
        }
    }
    onParticipantClickedFromFriendsList(participant) {
        this.openChatWindow(participant, true, true);
    }
    cancelOptionPrompt() {
        if (this.currentActiveOption) {
            this.currentActiveOption.isActive = false;
            this.currentActiveOption = null;
        }
    }
    onOptionPromptCanceled() {
        this.cancelOptionPrompt();
    }
    onOptionPromptConfirmed(event) {
        // For now this is fine as there is only one option available. Introduce option types and type checking if a new option is added.
        this.confirmNewGroup(event);
        // Canceling current state
        this.cancelOptionPrompt();
    }
    confirmNewGroup(users) {
        const newGroup = new Group(users);
        this.openChatWindow(newGroup);
        if (this.groupAdapter) {
            this.groupAdapter.groupCreated(newGroup);
        }
    }
    // Opens a new chat whindow. Takes care of available viewport
    // Works for opening a chat window for an user or for a group
    // Returns => [Window: Window object reference, boolean: Indicates if this window is a new chat window]
    openChatWindow(participant, focusOnNewWindow = false, invokedByUserClick = false) {
        // Is this window opened?
        const openedWindow = this.windows.find(x => x.participant.id == participant.id);
        if (!openedWindow) {
            if (invokedByUserClick) {
                this.onParticipantClicked.emit(participant);
            }
            // Refer to issue #58 on Github
            const collapseWindow = invokedByUserClick ? false : !this.maximizeWindowOnNewMessage;
            const newChatWindow = new Window(participant, this.historyEnabled, collapseWindow);
            // Loads the chat history via an RxJs Observable
            if (this.historyEnabled) {
                this.fetchMessageHistory(newChatWindow);
            }
            this.windows.unshift(newChatWindow);
            // Is there enough space left in the view port ? but should be displayed in mobile if option is enabled
            if (!this.isViewportOnMobileEnabled) {
                if (this.windows.length * this.windowSizeFactor >= this.viewPortTotalArea - (!this.hideFriendsList ? this.friendsListWidth : 0)) {
                    this.windows.pop();
                }
            }
            this.updateWindowsState(this.windows);
            if (focusOnNewWindow && !collapseWindow) {
                this.focusOnWindow(newChatWindow);
            }
            this.participantsInteractedWith.push(participant);
            this.onParticipantChatOpened.emit(participant);
            return [newChatWindow, true];
        }
        else {
            // Returns the existing chat window
            return [openedWindow, false];
        }
    }
    // Focus on the input element of the supplied window
    focusOnWindow(window, callback = () => { }) {
        const windowIndex = this.windows.indexOf(window);
        if (windowIndex >= 0) {
            setTimeout(() => {
                if (this.chatWindows) {
                    const chatWindowToFocus = this.chatWindows.toArray()[windowIndex];
                    chatWindowToFocus.chatWindowInput.nativeElement.focus();
                }
                callback();
            });
        }
    }
    assertMessageType(message) {
        // Always fallback to "Text" messages to avoid rendenring issues
        if (!message.type) {
            message.type = MessageType.Text;
        }
    }
    // Marks all messages provided as read with the current time.
    markMessagesAsRead(messages) {
        const currentDate = new Date();
        messages.forEach((msg) => {
            msg.dateSeen = currentDate;
        });
        this.onMessagesSeen.emit(messages);
    }
    // Buffers audio file (For component's bootstrapping)
    bufferAudioFile() {
        if (this.audioSource && this.audioSource.length > 0) {
            this.audioFile = new Audio();
            this.audioFile.src = this.audioSource;
            this.audioFile.load();
        }
    }
    // Emits a message notification audio if enabled after every message received
    emitMessageSound(window) {
        if (this.audioEnabled && !window.hasFocus && this.audioFile) {
            this.audioFile.play();
        }
    }
    // Emits a browser notification
    emitBrowserNotification(window, message) {
        if (this.browserNotificationsBootstrapped && !window.hasFocus && message) {
            const notification = new Notification(`${this.localization.browserNotificationTitle} ${window.participant.displayName}`, {
                'body': message.message,
                'icon': this.browserNotificationIconSource
            });
            setTimeout(() => {
                notification.close();
            }, message.message.length <= 50 ? 5000 : 7000); // More time to read longer messages
        }
    }
    // Saves current windows state into local storage if persistence is enabled
    updateWindowsState(windows) {
        if (this.persistWindowsState) {
            const participantIds = windows.map((w) => {
                return w.participant.id;
            });
            localStorage.setItem(this.localStorageKey, JSON.stringify(participantIds));
        }
    }
    restoreWindowsState() {
        try {
            if (this.persistWindowsState) {
                const stringfiedParticipantIds = localStorage.getItem(this.localStorageKey);
                if (stringfiedParticipantIds && stringfiedParticipantIds.length > 0) {
                    const participantIds = JSON.parse(stringfiedParticipantIds);
                    const participantsToRestore = this.participants.filter(u => participantIds.indexOf(u.id) >= 0);
                    participantsToRestore.forEach((participant) => {
                        this.openChatWindow(participant);
                    });
                }
            }
        }
        catch (ex) {
            // console.error(`An error occurred while restoring ng-chat windows state. Details: ${ex}`);
        }
    }
    // Gets closest open window if any. Most recent opened has priority (Right)
    getClosestWindow(window) {
        const index = this.windows.indexOf(window);
        if (index > 0) {
            return this.windows[index - 1];
        }
        else if (index == 0 && this.windows.length > 1) {
            return this.windows[index + 1];
        }
    }
    closeWindow(window) {
        const index = this.windows.indexOf(window);
        this.windows.splice(index, 1);
        this.updateWindowsState(this.windows);
        this.onParticipantChatClosed.emit(window.participant);
    }
    getChatWindowComponentInstance(targetWindow) {
        const windowIndex = this.windows.indexOf(targetWindow);
        if (this.chatWindows) {
            let targetWindow = this.chatWindows.toArray()[windowIndex];
            return targetWindow;
        }
        return null;
    }
    // Scrolls a chat window message flow to the bottom
    scrollChatWindow(window, direction) {
        const chatWindow = this.getChatWindowComponentInstance(window);
        if (chatWindow) {
            chatWindow.scrollChatWindow(window, direction);
        }
    }
    onWindowMessagesSeen(messagesSeen) {
        this.markMessagesAsRead(messagesSeen);
    }
    onWindowChatClosed(payload) {
        const { closedWindow, closedViaEscapeKey } = payload;
        if (closedViaEscapeKey) {
            let closestWindow = this.getClosestWindow(closedWindow);
            if (closestWindow) {
                this.focusOnWindow(closestWindow, () => { this.closeWindow(closedWindow); });
            }
            else {
                this.closeWindow(closedWindow);
            }
        }
        else {
            this.closeWindow(closedWindow);
        }
    }
    onWindowTabTriggered(payload) {
        const { triggeringWindow, shiftKeyPressed } = payload;
        const currentWindowIndex = this.windows.indexOf(triggeringWindow);
        let windowToFocus = this.windows[currentWindowIndex + (shiftKeyPressed ? 1 : -1)]; // Goes back on shift + tab
        if (!windowToFocus) {
            // Edge windows, go to start or end
            windowToFocus = this.windows[currentWindowIndex > 0 ? 0 : this.chatWindows.length - 1];
        }
        this.focusOnWindow(windowToFocus);
    }
    onWindowMessageSent(messageSent) {
        this.adapter.sendMessage(messageSent);
    }
    onWindowOptionTriggered(option) {
        this.currentActiveOption = option;
    }
    triggerOpenChatWindow(user) {
        if (user) {
            this.openChatWindow(user);
        }
    }
    triggerCloseChatWindow(userId) {
        const openedWindow = this.windows.find(x => x.participant.id == userId);
        if (openedWindow) {
            this.closeWindow(openedWindow);
        }
    }
    triggerToggleChatWindowVisibility(userId) {
        const openedWindow = this.windows.find(x => x.participant.id == userId);
        if (openedWindow) {
            const chatWindow = this.getChatWindowComponentInstance(openedWindow);
            if (chatWindow) {
                chatWindow.onChatWindowClicked(openedWindow);
            }
        }
    }
}
NgChat.decorators = [
    { type: Component, args: [{
                selector: 'ng-chat',
                template: "<link *ngIf=\"customTheme\" rel=\"stylesheet\" [href]='customTheme | sanitize'>\r\n\r\n<div id=\"ng-chat\" *ngIf=\"!isDisabled && isBootstrapped && !unsupportedViewport\" [ngClass]=\"theme\">\r\n    <ng-chat-friends-list\r\n        [localization]=\"localization\"\r\n        [shouldDisplay]=\"!hideFriendsList\"\r\n        [userId]=\"userId\"\r\n        [isCollapsed]=\"isCollapsed\"\r\n        [searchEnabled]=\"searchEnabled\"\r\n        [participants]=\"participants\"\r\n        [participantsResponse]=\"participantsResponse\"\r\n        [participantsInteractedWith]=\"participantsInteractedWith\"\r\n        [windows]=\"windows\"\r\n        [currentActiveOption]=\"currentActiveOption\"\r\n        (onParticipantClicked)=\"onParticipantClickedFromFriendsList($event)\"\r\n        (onOptionPromptCanceled)=\"onOptionPromptCanceled()\"\r\n        (onOptionPromptConfirmed)=\"onOptionPromptConfirmed($event)\"\r\n    >\r\n    </ng-chat-friends-list>\r\n\r\n    <div *ngFor=\"let window of windows; let i = index\" [ngClass]=\"{'ng-chat-window': true, 'primary-outline-color': true, 'ng-chat-window-collapsed': window.isCollapsed}\" [ngStyle]=\"{'right': (!hideFriendsList ? friendsListWidth : 0) + 20 + windowSizeFactor * i + 'px'}\">\r\n        <ng-chat-window\r\n            #chatWindow\r\n            [fileUploadAdapter]=\"fileUploadAdapter\"\r\n            [localization]=\"localization\"\r\n            [userId]=\"userId\"\r\n            [window]=\"window\"\r\n            [showOptions]=\"groupAdapter\"\r\n            [emojisEnabled]=\"emojisEnabled\"\r\n            [linkfyEnabled]=\"linkfyEnabled\"\r\n            [showMessageDate]=\"showMessageDate\"\r\n            [messageDatePipeFormat]=\"messageDatePipeFormat\"\r\n            [hasPagedHistory]=\"hasPagedHistory\"\r\n            (onMessagesSeen)=\"onWindowMessagesSeen($event)\"\r\n            (onMessageSent)=\"onWindowMessageSent($event)\"\r\n            (onTabTriggered)=\"onWindowTabTriggered($event)\"\r\n            (onChatWindowClosed)=\"onWindowChatClosed($event)\"\r\n            (onOptionTriggered)=\"onWindowOptionTriggered($event)\"\r\n            (onLoadHistoryTriggered)=\"fetchMessageHistory($event)\"\r\n        >\r\n        </ng-chat-window>\r\n    </div>\r\n</div>\r\n",
                encapsulation: ViewEncapsulation.None,
                styles: [".user-icon{box-sizing:border-box;background-color:#fff;border:2px solid;width:32px;height:20px;border-radius:64px 64px 0 0/64px;margin-top:14px;margin-left:-1px;display:inline-block;vertical-align:middle;position:relative;font-style:normal;color:#ddd;text-align:left;text-indent:-9999px}.user-icon:before{border:2px solid;background-color:#fff;width:12px;height:12px;top:-19px;border-radius:50%;position:absolute;left:50%;transform:translateX(-50%)}.user-icon:after,.user-icon:before{content:\"\";pointer-events:none}.upload-icon{position:absolute;margin-left:3px;margin-top:12px;width:13px;height:4px;border:1px solid;border-top:none;border-radius:1px}.upload-icon:before{content:\"\";position:absolute;top:-8px;left:6px;width:1px;height:9px;background-color:currentColor}.upload-icon:after{content:\"\";top:-8px;left:4px;width:4px;height:4px;transform:rotate(-45deg)}.paperclip-icon,.upload-icon:after{position:absolute;border-top:1px solid;border-right:1px solid}.paperclip-icon{margin-left:9px;margin-top:2px;width:6px;height:12px;border-radius:4px 4px 0 0;border-left:1px solid;transform:rotate(45deg)}.paperclip-icon:before{top:11px;left:-1px;width:4px;height:6px;border-radius:0 0 3px 3px;border-bottom:1px solid}.paperclip-icon:after,.paperclip-icon:before{content:\"\";position:absolute;border-left:1px solid;border-right:1px solid}.paperclip-icon:after{left:1px;top:1px;width:2px;height:10px;border-radius:4px 4px 0 0;border-top:1px solid}.check-icon{margin-top:4px;width:14px;height:8px;border-bottom:1px solid;border-left:1px solid;transform:rotate(-45deg)}.check-icon,.remove-icon{color:#000;position:absolute;margin-left:3px}.remove-icon{margin-top:10px}.remove-icon:before{transform:rotate(45deg)}.remove-icon:after,.remove-icon:before{content:\"\";position:absolute;width:15px;height:1px;background-color:currentColor}.remove-icon:after{transform:rotate(-45deg)}", ".loader,.loader:after,.loader:before{background:#e3e3e3;-webkit-animation:load1 1s ease-in-out infinite;animation:load1 1s ease-in-out infinite;width:1em;height:4em}.loader{color:#e3e3e3;text-indent:-9999em;margin:4px auto 0;position:relative;font-size:4px;transform:translateZ(0);-webkit-animation-delay:-.16s;animation-delay:-.16s}.loader:after,.loader:before{position:absolute;top:0;content:\"\"}.loader:before{left:-1.5em;-webkit-animation-delay:-.32s;animation-delay:-.32s}.loader:after{left:1.5em}@-webkit-keyframes load1{0%,80%,to{box-shadow:0 0;height:4em}40%{box-shadow:0 -2em;height:5em}}@keyframes load1{0%,80%,to{box-shadow:0 0;height:4em}40%{box-shadow:0 -2em;height:5em}}", "#ng-chat{position:fixed;z-index:999;right:0;bottom:0;box-sizing:content-box;box-sizing:initial;font-size:11pt;text-align:left}#ng-chat input{outline:none}#ng-chat .shadowed{box-shadow:0 4px 8px rgba(0,0,0,.25)}.ng-chat-loading-wrapper{height:30px;text-align:center;font-size:.9em}.ng-chat-close{text-decoration:none;float:right}.ng-chat-title,.ng-chat-title:hover{position:relative;z-index:2;height:30px;line-height:30px;font-size:.9em;padding:0 10px;display:block;text-decoration:none;color:inherit;font-weight:400;cursor:pointer}.ng-chat-title .ng-chat-title-visibility-toggle-area{display:inline-block;width:85%}.ng-chat-title .ng-chat-title-visibility-toggle-area>strong{font-weight:600;display:block;overflow:hidden;height:30px;text-overflow:ellipsis;white-space:nowrap;max-width:85%;float:left}.ng-chat-title .ng-chat-title-visibility-toggle-area .ng-chat-participant-status{float:left;margin-left:5px}.ng-chat-participant-status{display:inline-block;border-radius:25px;width:8px;height:8px;margin-top:10px}.ng-chat-participant-status.online{background-color:#92a400}.ng-chat-participant-status.busy{background-color:#f91c1e}.ng-chat-participant-status.away{background-color:#f7d21b}.ng-chat-participant-status.offline{background-color:#bababa}.ng-chat-unread-messages-count{margin-left:5px;padding:0 5px;border-radius:25px;font-size:.9em;line-height:30px}.ng-chat-options-container{float:right;margin-right:5px}", "#ng-chat.light-theme,#ng-chat.light-theme .primary-text{color:#5c5c5c;font-family:Arial,Helvetica,sans-serif}#ng-chat.light-theme .primary-background{background-color:#fff}#ng-chat.light-theme .secondary-background{background-color:#fafafa}#ng-chat.light-theme .primary-outline-color{border-color:#a3a3a3}#ng-chat.light-theme .friends-search-bar{background-color:#fff}#ng-chat.light-theme .ng-chat-people-action,#ng-chat.light-theme .ng-chat-people-action>i,#ng-chat.light-theme .unread-messages-counter-container{color:#5c5c5c;background-color:#e3e3e3}#ng-chat.light-theme .load-history-action{background-color:#e3e3e3}#ng-chat.light-theme .chat-window-input{background-color:#fff}#ng-chat.light-theme .file-message-container,#ng-chat.light-theme .sent-chat-message-container{background-color:#e3e3e3;border-color:#e3e3e3}#ng-chat.light-theme .file-message-container.received,#ng-chat.light-theme .received-chat-message-container{background-color:#fff;border-color:#e3e3e3}", "#ng-chat.dark-theme,#ng-chat.dark-theme .primary-text{color:#fff;font-family:Arial,Helvetica,sans-serif}#ng-chat.dark-theme .primary-background{background-color:#565656}#ng-chat.dark-theme .secondary-background{background-color:#444}#ng-chat.dark-theme .primary-outline-color{border-color:#353535}#ng-chat.dark-theme .friends-search-bar{background-color:#444;border:1px solid #444;color:#fff}#ng-chat.dark-theme .ng-chat-people-action,#ng-chat.dark-theme .ng-chat-people-action>i,#ng-chat.dark-theme .unread-messages-counter-container{background-color:#fff;color:#444}#ng-chat.dark-theme .load-history-action{background-color:#444}#ng-chat.dark-theme .chat-window-input{background-color:#444;color:#fff}#ng-chat.dark-theme .file-message-container,#ng-chat.dark-theme .sent-chat-message-container{border-color:#444;background-color:#444}#ng-chat.dark-theme .file-message-container.received,#ng-chat.dark-theme .received-chat-message-container{background-color:#565656;border-color:#444}#ng-chat.dark-theme .ng-chat-footer{background-color:#444}#ng-chat.dark-theme .ng-chat-message a{color:#fff}"]
            },] }
];
NgChat.ctorParameters = () => [
    { type: HttpClient }
];
NgChat.propDecorators = {
    isDisabled: [{ type: Input }],
    adapter: [{ type: Input }],
    groupAdapter: [{ type: Input }],
    userId: [{ type: Input }],
    isCollapsed: [{ type: Input }],
    maximizeWindowOnNewMessage: [{ type: Input }],
    pollFriendsList: [{ type: Input }],
    pollingInterval: [{ type: Input }],
    historyEnabled: [{ type: Input }],
    emojisEnabled: [{ type: Input }],
    linkfyEnabled: [{ type: Input }],
    audioEnabled: [{ type: Input }],
    searchEnabled: [{ type: Input }],
    audioSource: [{ type: Input }],
    persistWindowsState: [{ type: Input }],
    title: [{ type: Input }],
    messagePlaceholder: [{ type: Input }],
    searchPlaceholder: [{ type: Input }],
    browserNotificationsEnabled: [{ type: Input }],
    browserNotificationIconSource: [{ type: Input }],
    browserNotificationTitle: [{ type: Input }],
    historyPageSize: [{ type: Input }],
    localization: [{ type: Input }],
    hideFriendsList: [{ type: Input }],
    hideFriendsListOnUnsupportedViewport: [{ type: Input }],
    fileUploadUrl: [{ type: Input }],
    theme: [{ type: Input }],
    customTheme: [{ type: Input }],
    messageDatePipeFormat: [{ type: Input }],
    showMessageDate: [{ type: Input }],
    isViewportOnMobileEnabled: [{ type: Input }],
    fileUploadAdapter: [{ type: Input }],
    onParticipantClicked: [{ type: Output }],
    onParticipantChatOpened: [{ type: Output }],
    onParticipantChatClosed: [{ type: Output }],
    onMessagesSeen: [{ type: Output }],
    chatWindows: [{ type: ViewChildren, args: ['chatWindow',] }],
    onResize: [{ type: HostListener, args: ['window:resize', ['$event'],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctY2hhdC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9uZy1jaGF0L25nLWNoYXQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBVSxZQUFZLEVBQWEsWUFBWSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekksT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBT2xELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQzVFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUcvRCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUU1RSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUM5RSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFMUMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNyQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUd4RSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFnQnJDLE1BQU0sT0FBTyxNQUFNO0lBQ2YsWUFBb0IsV0FBdUI7UUFBdkIsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFFM0Msb0NBQW9DO1FBQzdCLHdCQUFtQixHQUFHLG1CQUFtQixDQUFDO1FBQzFDLDBCQUFxQixHQUFHLHFCQUFxQixDQUFDO1FBQzlDLGdCQUFXLEdBQUcsV0FBVyxDQUFDO1FBRXpCLGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBK0I5QixnQkFBVyxHQUFZLEtBQUssQ0FBQztRQUc3QiwrQkFBMEIsR0FBWSxJQUFJLENBQUM7UUFHM0Msb0JBQWUsR0FBWSxLQUFLLENBQUM7UUFHakMsb0JBQWUsR0FBVyxJQUFJLENBQUM7UUFHL0IsbUJBQWMsR0FBWSxJQUFJLENBQUM7UUFHL0Isa0JBQWEsR0FBWSxJQUFJLENBQUM7UUFHOUIsa0JBQWEsR0FBWSxJQUFJLENBQUM7UUFHOUIsaUJBQVksR0FBWSxJQUFJLENBQUM7UUFHN0Isa0JBQWEsR0FBWSxJQUFJLENBQUM7UUFHOUIsZ0JBQVcsR0FBVyxnR0FBZ0csQ0FBQztRQUd2SCx3QkFBbUIsR0FBWSxJQUFJLENBQUM7UUFHcEMsVUFBSyxHQUFXLFNBQVMsQ0FBQztRQUcxQix1QkFBa0IsR0FBVyxnQkFBZ0IsQ0FBQztRQUc5QyxzQkFBaUIsR0FBVyxRQUFRLENBQUM7UUFHckMsZ0NBQTJCLEdBQVksSUFBSSxDQUFDO1FBRzVDLGtDQUE2QixHQUFXLGdHQUFnRyxDQUFDO1FBR3pJLDZCQUF3QixHQUFXLGtCQUFrQixDQUFDO1FBR3RELG9CQUFlLEdBQVcsRUFBRSxDQUFDO1FBTTdCLG9CQUFlLEdBQVksS0FBSyxDQUFDO1FBR2pDLHlDQUFvQyxHQUFZLElBQUksQ0FBQztRQU1yRCxVQUFLLEdBQVUsS0FBSyxDQUFDLEtBQUssQ0FBQztRQU0zQiwwQkFBcUIsR0FBVyxPQUFPLENBQUM7UUFHeEMsb0JBQWUsR0FBWSxJQUFJLENBQUM7UUFHaEMsOEJBQXlCLEdBQVksS0FBSyxDQUFDO1FBTTNDLHlCQUFvQixHQUFtQyxJQUFJLFlBQVksRUFBb0IsQ0FBQztRQUc1Riw0QkFBdUIsR0FBbUMsSUFBSSxZQUFZLEVBQW9CLENBQUM7UUFHL0YsNEJBQXVCLEdBQW1DLElBQUksWUFBWSxFQUFvQixDQUFDO1FBRy9GLG1CQUFjLEdBQTRCLElBQUksWUFBWSxFQUFhLENBQUM7UUFFdkUscUNBQWdDLEdBQVksS0FBSyxDQUFDO1FBRW5ELG9CQUFlLEdBQVksS0FBSyxDQUFDO1FBRXhDLHdKQUF3SjtRQUNoSixzQkFBaUIsR0FBc0I7WUFDM0MsTUFBTSxFQUFFLFFBQVE7WUFDaEIsSUFBSSxFQUFFLE1BQU07WUFDWixJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxTQUFTO1NBQ3JCLENBQUM7UUFRSywrQkFBMEIsR0FBdUIsRUFBRSxDQUFDO1FBVzNELHVIQUF1SDtRQUNoSCxxQkFBZ0IsR0FBVyxHQUFHLENBQUM7UUFFdEMsK0NBQStDO1FBQ3hDLHFCQUFnQixHQUFXLEdBQUcsQ0FBQztRQUt0QywwSEFBMEg7UUFDbkgsd0JBQW1CLEdBQVksS0FBSyxDQUFDO1FBRTVDLFlBQU8sR0FBYSxFQUFFLENBQUM7UUFDdkIsbUJBQWMsR0FBWSxLQUFLLENBQUM7SUEvS2UsQ0FBQztJQVNoRCxJQUFJLFVBQVU7UUFDVixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDNUIsQ0FBQztJQUVELElBQ0ksVUFBVSxDQUFDLEtBQWM7UUFDekIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFFekIsSUFBSSxLQUFLLEVBQ1Q7WUFDSSxtRUFBbUU7WUFDbkUsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsQ0FBQTtTQUMzRDthQUVEO1lBQ0ksSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7U0FDbEM7SUFDTCxDQUFDO0lBbUlELElBQVksZUFBZTtRQUV2QixPQUFPLGlCQUFpQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyx1RUFBdUU7SUFDbEgsQ0FBQztJQUFBLENBQUM7SUFtQkYsUUFBUTtRQUNKLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBR0QsUUFBUSxDQUFDLEtBQVU7UUFDaEIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO1FBRWpELElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCx5RUFBeUU7SUFDakUsZ0JBQWdCO1FBRXBCLE1BQU0seUJBQXlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3JKLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLHlCQUF5QixDQUFDO1FBRW5FLElBQUksVUFBVSxJQUFJLENBQUMsRUFDbkI7WUFDSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsQ0FBQztTQUN6RDtRQUVELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFdEMsMEdBQTBHO1FBQzFHLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMseUJBQXlCLENBQUEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLG9DQUFvQyxJQUFJLHlCQUF5QixHQUFHLENBQUMsQ0FBQztJQUNsSixDQUFDO0lBRUQsd0RBQXdEO0lBQ2hELGFBQWE7UUFFakIsSUFBSSx1QkFBdUIsR0FBRyxJQUFJLENBQUM7UUFFbkMsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksRUFDL0M7WUFDSSxJQUNBO2dCQUNJLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO2dCQUUzQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO2dCQUM3QixJQUFJLENBQUMsOEJBQThCLEVBQUUsQ0FBQztnQkFFdEMsMEJBQTBCO2dCQUMxQixJQUFJLENBQUMsT0FBTyxDQUFDLHNCQUFzQixHQUFHLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDckcsSUFBSSxDQUFDLE9BQU8sQ0FBQyx5QkFBeUIsR0FBRyxDQUFDLG9CQUFvQixFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsb0JBQW9CLENBQUMsQ0FBQztnQkFFbkgsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7Z0JBRS9CLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFFdkIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsT0FBTyxZQUFZLHVCQUF1QixDQUFDO2dCQUV2RSxJQUFJLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLGFBQWEsS0FBSyxFQUFFLEVBQ25EO29CQUNJLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLHdCQUF3QixDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2lCQUMvRjtnQkFFRCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQkFFeEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7YUFDOUI7WUFDRCxPQUFNLEVBQUUsRUFDUjtnQkFDSSx1QkFBdUIsR0FBRyxFQUFFLENBQUM7YUFDaEM7U0FDSjtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFDO1lBQ3JCLE9BQU8sQ0FBQyxLQUFLLENBQUMsNkNBQTZDLENBQUMsQ0FBQztZQUU3RCxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxFQUFDO2dCQUNwQixPQUFPLENBQUMsS0FBSyxDQUFDLHNJQUFzSSxDQUFDLENBQUM7YUFDeko7WUFDRCxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxFQUFDO2dCQUNyQixPQUFPLENBQUMsS0FBSyxDQUFDLDZKQUE2SixDQUFDLENBQUM7YUFDaEw7WUFDRCxJQUFJLHVCQUF1QixFQUMzQjtnQkFDSSxPQUFPLENBQUMsS0FBSyxDQUFDLGtFQUFrRSx1QkFBdUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO2dCQUNuSCxPQUFPLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7YUFDMUM7U0FDSjtJQUNMLENBQUM7SUFFTyx1QkFBdUI7UUFDM0IsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUNoQjtZQUNJLDZCQUE2QjtZQUM3QixJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUM7Z0JBQ3JCLDBEQUEwRDtnQkFDMUQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM1QixJQUFJLENBQUMsNkJBQTZCLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2FBQ3JIO2lCQUVEO2dCQUNJLDhHQUE4RztnQkFDOUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO2FBQy9CO1NBQ0o7SUFDTCxDQUFDO0lBRUQsb0NBQW9DO0lBQ3RCLDhCQUE4Qjs7WUFFeEMsSUFBSSxJQUFJLENBQUMsMkJBQTJCLElBQUksQ0FBQyxjQUFjLElBQUksTUFBTSxDQUFDLEVBQ2xFO2dCQUNJLElBQUksQ0FBQSxNQUFNLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxNQUFLLFNBQVMsRUFDeEQ7b0JBQ0ksSUFBSSxDQUFDLGdDQUFnQyxHQUFHLElBQUksQ0FBQztpQkFDaEQ7YUFDSjtRQUNMLENBQUM7S0FBQTtJQUVELDJCQUEyQjtJQUNuQixxQkFBcUI7UUFFekIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQ3RCO1lBQ0ksSUFBSSxDQUFDLFlBQVksR0FBRztnQkFDaEIsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLGtCQUFrQjtnQkFDM0MsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQjtnQkFDekMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUNqQixpQkFBaUIsRUFBRSxJQUFJLENBQUMsaUJBQWlCO2dCQUN6Qyx3QkFBd0IsRUFBRSxJQUFJLENBQUMsd0JBQXdCO2dCQUN2RCw2QkFBNkIsRUFBRSxxQkFBcUI7YUFDdkQsQ0FBQztTQUNMO0lBQ0wsQ0FBQztJQUVPLGVBQWU7UUFFbkIsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUNwQjtZQUNJLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztTQUM3QjthQUNJLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLElBQUksRUFDOUQ7WUFDSSw2RkFBNkY7WUFDN0YsTUFBTSxJQUFJLEtBQUssQ0FBQyw2Q0FBNkMsSUFBSSxDQUFDLEtBQUssK0JBQStCLENBQUMsQ0FBQztTQUMzRztJQUNMLENBQUM7SUFFRCwyQ0FBMkM7SUFDbkMsZ0JBQWdCLENBQUMsZUFBd0I7UUFFN0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUU7YUFDekIsSUFBSSxDQUNELEdBQUcsQ0FBQyxDQUFDLG9CQUEyQyxFQUFFLEVBQUU7WUFDaEQsSUFBSSxDQUFDLG9CQUFvQixHQUFHLG9CQUFvQixDQUFDO1lBRWpELElBQUksQ0FBQyxZQUFZLEdBQUcsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBNkIsRUFBRSxFQUFFO2dCQUMzRSxPQUFPLFFBQVEsQ0FBQyxXQUFXLENBQUM7WUFDaEMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FDTCxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDYixJQUFJLGVBQWUsRUFDbkI7Z0JBQ0ksSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7YUFDOUI7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxtQkFBbUIsQ0FBQyxNQUFjO1FBQzlCLHNHQUFzRztRQUN0RyxJQUFJLElBQUksQ0FBQyxPQUFPLFlBQVksdUJBQXVCLEVBQ25EO1lBQ0ksTUFBTSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztZQUUvQixJQUFJLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDO2lCQUN0RyxJQUFJLENBQ0QsR0FBRyxDQUFDLENBQUMsTUFBaUIsRUFBRSxFQUFFO2dCQUN0QixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFFN0QsTUFBTSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDakQsTUFBTSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztnQkFFaEMsTUFBTSxTQUFTLEdBQW9CLENBQUMsTUFBTSxDQUFDLFdBQVcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQztnQkFDNUcsTUFBTSxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUM7Z0JBRS9ELFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsMkJBQTJCLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN4RixDQUFDLENBQUMsQ0FDTCxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQ2pCO2FBRUQ7WUFDSSxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO2lCQUNwRCxJQUFJLENBQ0QsR0FBRyxDQUFDLENBQUMsTUFBaUIsRUFBRSxFQUFFO2dCQUN0QixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFFN0QsTUFBTSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDakQsTUFBTSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztnQkFFaEMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQy9GLENBQUMsQ0FBQyxDQUNMLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDakI7SUFDTCxDQUFDO0lBRU8sMkJBQTJCLENBQUMsUUFBbUIsRUFBRSxNQUFjLEVBQUUsU0FBMEIsRUFBRSwwQkFBbUMsS0FBSztRQUV6SSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFBO1FBRXhDLElBQUksTUFBTSxDQUFDLFFBQVEsSUFBSSx1QkFBdUIsRUFDOUM7WUFDSSxNQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFekQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1NBQzNDO0lBQ0wsQ0FBQztJQUVELGlEQUFpRDtJQUN6QyxvQkFBb0IsQ0FBQyxvQkFBMkM7UUFFcEUsSUFBSSxvQkFBb0IsRUFDeEI7WUFDSSxJQUFJLENBQUMsb0JBQW9CLEdBQUcsb0JBQW9CLENBQUM7WUFFakQsSUFBSSxDQUFDLFlBQVksR0FBRyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUE2QixFQUFFLEVBQUU7Z0JBQzNFLE9BQU8sUUFBUSxDQUFDLFdBQVcsQ0FBQztZQUNoQyxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQywwQkFBMEIsR0FBRyxFQUFFLENBQUM7U0FDeEM7SUFDTCxDQUFDO0lBRUQsMkNBQTJDO0lBQ25DLGlCQUFpQixDQUFDLFdBQTZCLEVBQUUsT0FBZ0I7UUFFckUsSUFBSSxXQUFXLElBQUksT0FBTyxFQUMxQjtZQUNJLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFcEQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRWhDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFDO2dCQUN2QyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFFckMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBRTdELElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFDMUI7b0JBQ0ksSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztpQkFDdEM7YUFDSjtZQUVELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVyQyxtQkFBbUI7WUFDbkIsZ0tBQWdLO1lBQ2hLLElBQUksSUFBSSxDQUFDLDBCQUEwQixJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQ3JGO2dCQUNJLG9IQUFvSDtnQkFDcEgsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQzthQUN4RDtTQUNKO0lBQ0wsQ0FBQztJQUVELG1DQUFtQyxDQUFDLFdBQTZCO1FBQzdELElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRU8sa0JBQWtCO1FBQ3RCLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUM1QjtZQUNJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQzFDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7U0FDbkM7SUFDTCxDQUFDO0lBRUQsc0JBQXNCO1FBQ2xCLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFFRCx1QkFBdUIsQ0FBQyxLQUFVO1FBQzlCLGlJQUFpSTtRQUNqSSxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTVCLDBCQUEwQjtRQUMxQixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBRU8sZUFBZSxDQUFDLEtBQWE7UUFDakMsTUFBTSxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFbEMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUU5QixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQ3JCO1lBQ0ksSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDNUM7SUFDTCxDQUFDO0lBRUQsNkRBQTZEO0lBQzdELDZEQUE2RDtJQUM3RCx1R0FBdUc7SUFDL0YsY0FBYyxDQUFDLFdBQTZCLEVBQUUsbUJBQTRCLEtBQUssRUFBRSxxQkFBOEIsS0FBSztRQUV4SCx5QkFBeUI7UUFDekIsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsSUFBSSxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFaEYsSUFBSSxDQUFDLFlBQVksRUFDakI7WUFDSSxJQUFJLGtCQUFrQixFQUN0QjtnQkFDSSxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQy9DO1lBRUQsK0JBQStCO1lBQy9CLE1BQU0sY0FBYyxHQUFHLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDO1lBRXJGLE1BQU0sYUFBYSxHQUFXLElBQUksTUFBTSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBRTNGLGdEQUFnRDtZQUNoRCxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQ3ZCO2dCQUNJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsQ0FBQzthQUMzQztZQUVELElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRXBDLHVHQUF1RztZQUN2RyxJQUFJLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFO2dCQUNqQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQzdILElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7aUJBQ3RCO2FBQ0o7WUFFRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRXRDLElBQUksZ0JBQWdCLElBQUksQ0FBQyxjQUFjLEVBQ3ZDO2dCQUNJLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDckM7WUFFRCxJQUFJLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFL0MsT0FBTyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNoQzthQUVEO1lBQ0ksbUNBQW1DO1lBQ25DLE9BQU8sQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDaEM7SUFDTCxDQUFDO0lBRUQsb0RBQW9EO0lBQzVDLGFBQWEsQ0FBQyxNQUFjLEVBQUUsV0FBcUIsR0FBRyxFQUFFLEdBQUUsQ0FBQztRQUUvRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqRCxJQUFJLFdBQVcsSUFBSSxDQUFDLEVBQ3BCO1lBQ0ksVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDWixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQ3BCO29CQUNJLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFFbEUsaUJBQWlCLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztpQkFDM0Q7Z0JBRUQsUUFBUSxFQUFFLENBQUM7WUFDZixDQUFDLENBQUMsQ0FBQztTQUNOO0lBQ0wsQ0FBQztJQUVPLGlCQUFpQixDQUFDLE9BQWdCO1FBQ3RDLGdFQUFnRTtRQUNoRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFDakI7WUFDSSxPQUFPLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUM7U0FDbkM7SUFDTCxDQUFDO0lBRUQsNkRBQTZEO0lBQzdELGtCQUFrQixDQUFDLFFBQW1CO1FBRWxDLE1BQU0sV0FBVyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFFL0IsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBQyxFQUFFO1lBQ3BCLEdBQUcsQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDO1FBQy9CLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELHFEQUFxRDtJQUM3QyxlQUFlO1FBQ25CLElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQ25EO1lBQ0ksSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO1lBQzdCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDdEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUN6QjtJQUNMLENBQUM7SUFFRCw2RUFBNkU7SUFDckUsZ0JBQWdCLENBQUMsTUFBYztRQUVuQyxJQUFJLElBQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDekQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUN6QjtJQUNMLENBQUM7SUFFRCwrQkFBK0I7SUFDdkIsdUJBQXVCLENBQUMsTUFBYyxFQUFFLE9BQWdCO1FBRTVELElBQUksSUFBSSxDQUFDLGdDQUFnQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsSUFBSSxPQUFPLEVBQUU7WUFDdEUsTUFBTSxZQUFZLEdBQUcsSUFBSSxZQUFZLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLHdCQUF3QixJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLEVBQUU7Z0JBQ3JILE1BQU0sRUFBRSxPQUFPLENBQUMsT0FBTztnQkFDdkIsTUFBTSxFQUFFLElBQUksQ0FBQyw2QkFBNkI7YUFDN0MsQ0FBQyxDQUFDO1lBRUgsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDWixZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDekIsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLG9DQUFvQztTQUN2RjtJQUNMLENBQUM7SUFFRCwyRUFBMkU7SUFDbkUsa0JBQWtCLENBQUMsT0FBaUI7UUFFeEMsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQzVCO1lBQ0ksTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUNyQyxPQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO1lBQzVCLENBQUMsQ0FBQyxDQUFDO1lBRUgsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztTQUM5RTtJQUNMLENBQUM7SUFFTyxtQkFBbUI7UUFFdkIsSUFDQTtZQUNJLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUM1QjtnQkFDSSxNQUFNLHdCQUF3QixHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUU1RSxJQUFJLHdCQUF3QixJQUFJLHdCQUF3QixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQ25FO29CQUNJLE1BQU0sY0FBYyxHQUFhLElBQUksQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztvQkFFdEUsTUFBTSxxQkFBcUIsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUUvRixxQkFBcUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRTt3QkFDMUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFDckMsQ0FBQyxDQUFDLENBQUM7aUJBQ047YUFDSjtTQUNKO1FBQ0QsT0FBTyxFQUFFLEVBQ1Q7WUFDSSxPQUFPLENBQUMsS0FBSyxDQUFDLHFFQUFxRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQzVGO0lBQ0wsQ0FBQztJQUVELDJFQUEyRTtJQUNuRSxnQkFBZ0IsQ0FBQyxNQUFjO1FBRW5DLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTNDLElBQUksS0FBSyxHQUFHLENBQUMsRUFDYjtZQUNJLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDbEM7YUFDSSxJQUFJLEtBQUssSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUM5QztZQUNJLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDbEM7SUFDTCxDQUFDO0lBRU8sV0FBVyxDQUFDLE1BQWM7UUFFOUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFM0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRTlCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFdEMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVPLDhCQUE4QixDQUFDLFlBQW9CO1FBQ3ZELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRXZELElBQUksSUFBSSxDQUFDLFdBQVcsRUFBQztZQUNqQixJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRTNELE9BQU8sWUFBWSxDQUFDO1NBQ3ZCO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELG1EQUFtRDtJQUMzQyxnQkFBZ0IsQ0FBQyxNQUFjLEVBQUUsU0FBMEI7UUFFL0QsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLDhCQUE4QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRS9ELElBQUksVUFBVSxFQUFDO1lBQ1gsVUFBVSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztTQUNsRDtJQUNMLENBQUM7SUFFRCxvQkFBb0IsQ0FBQyxZQUF1QjtRQUN4QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELGtCQUFrQixDQUFDLE9BQThEO1FBQzdFLE1BQU0sRUFBRSxZQUFZLEVBQUUsa0JBQWtCLEVBQUUsR0FBRyxPQUFPLENBQUM7UUFFckQsSUFBSSxrQkFBa0IsRUFBRTtZQUNwQixJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFeEQsSUFBSSxhQUFhLEVBQ2pCO2dCQUNJLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNoRjtpQkFFRDtnQkFDSSxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQ2xDO1NBQ0o7YUFDSTtZQUNELElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDbEM7SUFDTCxDQUFDO0lBRUQsb0JBQW9CLENBQUMsT0FBK0Q7UUFDaEYsTUFBTSxFQUFFLGdCQUFnQixFQUFFLGVBQWUsRUFBRSxHQUFHLE9BQU8sQ0FBQztRQUV0RCxNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDbEUsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQywyQkFBMkI7UUFFOUcsSUFBSSxDQUFDLGFBQWEsRUFDbEI7WUFDSSxtQ0FBbUM7WUFDbkMsYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQzFGO1FBRUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsbUJBQW1CLENBQUMsV0FBb0I7UUFDcEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELHVCQUF1QixDQUFDLE1BQW1CO1FBQ3ZDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxNQUFNLENBQUM7SUFDdEMsQ0FBQztJQUVELHFCQUFxQixDQUFDLElBQVU7UUFDNUIsSUFBSSxJQUFJLEVBQ1I7WUFDSSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzdCO0lBQ0wsQ0FBQztJQUVELHNCQUFzQixDQUFDLE1BQVc7UUFDOUIsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsSUFBSSxNQUFNLENBQUMsQ0FBQztRQUV4RSxJQUFJLFlBQVksRUFDaEI7WUFDSSxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQ2xDO0lBQ0wsQ0FBQztJQUVELGlDQUFpQyxDQUFDLE1BQVc7UUFDekMsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsSUFBSSxNQUFNLENBQUMsQ0FBQztRQUV4RSxJQUFJLFlBQVksRUFDaEI7WUFDSSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsOEJBQThCLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFckUsSUFBSSxVQUFVLEVBQUM7Z0JBQ1gsVUFBVSxDQUFDLG1CQUFtQixDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQ2hEO1NBQ0o7SUFDTCxDQUFDOzs7WUF0d0JKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsU0FBUztnQkFDbkIsd3RFQUFxQztnQkFRckMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7O2FBQ3hDOzs7WUFwQ1EsVUFBVTs7O3lCQW9EZCxLQUFLO3NCQWVMLEtBQUs7MkJBR0wsS0FBSztxQkFHTCxLQUFLOzBCQUdMLEtBQUs7eUNBR0wsS0FBSzs4QkFHTCxLQUFLOzhCQUdMLEtBQUs7NkJBR0wsS0FBSzs0QkFHTCxLQUFLOzRCQUdMLEtBQUs7MkJBR0wsS0FBSzs0QkFHTCxLQUFLOzBCQUdMLEtBQUs7a0NBR0wsS0FBSztvQkFHTCxLQUFLO2lDQUdMLEtBQUs7Z0NBR0wsS0FBSzswQ0FHTCxLQUFLOzRDQUdMLEtBQUs7dUNBR0wsS0FBSzs4QkFHTCxLQUFLOzJCQUdMLEtBQUs7OEJBR0wsS0FBSzttREFHTCxLQUFLOzRCQUdMLEtBQUs7b0JBR0wsS0FBSzswQkFHTCxLQUFLO29DQUdMLEtBQUs7OEJBR0wsS0FBSzt3Q0FHTCxLQUFLO2dDQUdMLEtBQUs7bUNBR0wsTUFBTTtzQ0FHTixNQUFNO3NDQUdOLE1BQU07NkJBR04sTUFBTTswQkErQ04sWUFBWSxTQUFDLFlBQVk7dUJBTXpCLFlBQVksU0FBQyxlQUFlLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkluaXQsIFZpZXdDaGlsZHJlbiwgUXVlcnlMaXN0LCBIb3N0TGlzdGVuZXIsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5cclxuaW1wb3J0IHsgQ2hhdEFkYXB0ZXIgfSBmcm9tICcuL2NvcmUvY2hhdC1hZGFwdGVyJztcclxuaW1wb3J0IHsgSUNoYXRHcm91cEFkYXB0ZXIgfSBmcm9tICcuL2NvcmUvY2hhdC1ncm91cC1hZGFwdGVyJztcclxuaW1wb3J0IHsgVXNlciB9IGZyb20gXCIuL2NvcmUvdXNlclwiO1xyXG5pbXBvcnQgeyBQYXJ0aWNpcGFudFJlc3BvbnNlIH0gZnJvbSBcIi4vY29yZS9wYXJ0aWNpcGFudC1yZXNwb25zZVwiO1xyXG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSBcIi4vY29yZS9tZXNzYWdlXCI7XHJcbmltcG9ydCB7IE1lc3NhZ2VUeXBlIH0gZnJvbSBcIi4vY29yZS9tZXNzYWdlLXR5cGUuZW51bVwiO1xyXG5pbXBvcnQgeyBXaW5kb3cgfSBmcm9tIFwiLi9jb3JlL3dpbmRvd1wiO1xyXG5pbXBvcnQgeyBDaGF0UGFydGljaXBhbnRTdGF0dXMgfSBmcm9tIFwiLi9jb3JlL2NoYXQtcGFydGljaXBhbnQtc3RhdHVzLmVudW1cIjtcclxuaW1wb3J0IHsgU2Nyb2xsRGlyZWN0aW9uIH0gZnJvbSBcIi4vY29yZS9zY3JvbGwtZGlyZWN0aW9uLmVudW1cIjtcclxuaW1wb3J0IHsgTG9jYWxpemF0aW9uLCBTdGF0dXNEZXNjcmlwdGlvbiB9IGZyb20gJy4vY29yZS9sb2NhbGl6YXRpb24nO1xyXG5pbXBvcnQgeyBJQ2hhdENvbnRyb2xsZXIgfSBmcm9tICcuL2NvcmUvY2hhdC1jb250cm9sbGVyJztcclxuaW1wb3J0IHsgUGFnZWRIaXN0b3J5Q2hhdEFkYXB0ZXIgfSBmcm9tICcuL2NvcmUvcGFnZWQtaGlzdG9yeS1jaGF0LWFkYXB0ZXInO1xyXG5pbXBvcnQgeyBJRmlsZVVwbG9hZEFkYXB0ZXIgfSBmcm9tICcuL2NvcmUvZmlsZS11cGxvYWQtYWRhcHRlcic7XHJcbmltcG9ydCB7IERlZmF1bHRGaWxlVXBsb2FkQWRhcHRlciB9IGZyb20gJy4vY29yZS9kZWZhdWx0LWZpbGUtdXBsb2FkLWFkYXB0ZXInO1xyXG5pbXBvcnQgeyBUaGVtZSB9IGZyb20gJy4vY29yZS90aGVtZS5lbnVtJztcclxuaW1wb3J0IHsgSUNoYXRPcHRpb24gfSBmcm9tICcuL2NvcmUvY2hhdC1vcHRpb24nO1xyXG5pbXBvcnQgeyBHcm91cCB9IGZyb20gXCIuL2NvcmUvZ3JvdXBcIjtcclxuaW1wb3J0IHsgQ2hhdFBhcnRpY2lwYW50VHlwZSB9IGZyb20gXCIuL2NvcmUvY2hhdC1wYXJ0aWNpcGFudC10eXBlLmVudW1cIjtcclxuaW1wb3J0IHsgSUNoYXRQYXJ0aWNpcGFudCB9IGZyb20gXCIuL2NvcmUvY2hhdC1wYXJ0aWNpcGFudFwiO1xyXG5cclxuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBOZ0NoYXRXaW5kb3dDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvbmctY2hhdC13aW5kb3cvbmctY2hhdC13aW5kb3cuY29tcG9uZW50JztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICduZy1jaGF0JyxcclxuICAgIHRlbXBsYXRlVXJsOiAnbmctY2hhdC5jb21wb25lbnQuaHRtbCcsXHJcbiAgICBzdHlsZVVybHM6IFtcclxuICAgICAgICAnYXNzZXRzL2ljb25zLmNzcycsXHJcbiAgICAgICAgJ2Fzc2V0cy9sb2FkaW5nLXNwaW5uZXIuY3NzJyxcclxuICAgICAgICAnYXNzZXRzL25nLWNoYXQuY29tcG9uZW50LmRlZmF1bHQuY3NzJyxcclxuICAgICAgICAnYXNzZXRzL3RoZW1lcy9uZy1jaGF0LnRoZW1lLmRlZmF1bHQuc2NzcycsXHJcbiAgICAgICAgJ2Fzc2V0cy90aGVtZXMvbmctY2hhdC50aGVtZS5kYXJrLnNjc3MnXHJcbiAgICBdLFxyXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIE5nQ2hhdCBpbXBsZW1lbnRzIE9uSW5pdCwgSUNoYXRDb250cm9sbGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2h0dHBDbGllbnQ6IEh0dHBDbGllbnQpIHsgfVxyXG5cclxuICAgIC8vIEV4cG9zZXMgZW51bXMgZm9yIHRoZSBuZy10ZW1wbGF0ZVxyXG4gICAgcHVibGljIENoYXRQYXJ0aWNpcGFudFR5cGUgPSBDaGF0UGFydGljaXBhbnRUeXBlO1xyXG4gICAgcHVibGljIENoYXRQYXJ0aWNpcGFudFN0YXR1cyA9IENoYXRQYXJ0aWNpcGFudFN0YXR1cztcclxuICAgIHB1YmxpYyBNZXNzYWdlVHlwZSA9IE1lc3NhZ2VUeXBlO1xyXG5cclxuICAgIHByaXZhdGUgX2lzRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBnZXQgaXNEaXNhYmxlZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faXNEaXNhYmxlZDtcclxuICAgIH1cclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgc2V0IGlzRGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl9pc0Rpc2FibGVkID0gdmFsdWU7XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vIFRvIGFkZHJlc3MgaXNzdWUgaHR0cHM6Ly9naXRodWIuY29tL3JwYXNjaG9hbC9uZy1jaGF0L2lzc3Vlcy8xMjBcclxuICAgICAgICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5wb2xsaW5nSW50ZXJ2YWxXaW5kb3dJbnN0YW5jZSlcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmF0ZUZyaWVuZExpc3RGZXRjaCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgcHVibGljIGFkYXB0ZXI6IENoYXRBZGFwdGVyO1xyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBwdWJsaWMgZ3JvdXBBZGFwdGVyOiBJQ2hhdEdyb3VwQWRhcHRlcjtcclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgcHVibGljIHVzZXJJZDogYW55O1xyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBwdWJsaWMgaXNDb2xsYXBzZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgcHVibGljIG1heGltaXplV2luZG93T25OZXdNZXNzYWdlOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgcHVibGljIHBvbGxGcmllbmRzTGlzdDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBwdWJsaWMgcG9sbGluZ0ludGVydmFsOiBudW1iZXIgPSA1MDAwO1xyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBwdWJsaWMgaGlzdG9yeUVuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBwdWJsaWMgZW1vamlzRW5hYmxlZDogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHB1YmxpYyBsaW5rZnlFbmFibGVkOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgcHVibGljIGF1ZGlvRW5hYmxlZDogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHB1YmxpYyBzZWFyY2hFbmFibGVkOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgICBASW5wdXQoKSAvLyBUT0RPOiBUaGlzIG1pZ2h0IG5lZWQgYSBiZXR0ZXIgY29udGVudCBzdHJhdGVneVxyXG4gICAgcHVibGljIGF1ZGlvU291cmNlOiBzdHJpbmcgPSAnaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3JwYXNjaG9hbC9uZy1jaGF0L21hc3Rlci9zcmMvbmctY2hhdC9hc3NldHMvbm90aWZpY2F0aW9uLndhdic7XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHB1YmxpYyBwZXJzaXN0V2luZG93c1N0YXRlOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgcHVibGljIHRpdGxlOiBzdHJpbmcgPSBcIkZyaWVuZHNcIjtcclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgcHVibGljIG1lc3NhZ2VQbGFjZWhvbGRlcjogc3RyaW5nID0gXCJUeXBlIGEgbWVzc2FnZVwiO1xyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBwdWJsaWMgc2VhcmNoUGxhY2Vob2xkZXI6IHN0cmluZyA9IFwiU2VhcmNoXCI7XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHB1YmxpYyBicm93c2VyTm90aWZpY2F0aW9uc0VuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgIEBJbnB1dCgpIC8vIFRPRE86IFRoaXMgbWlnaHQgbmVlZCBhIGJldHRlciBjb250ZW50IHN0cmF0ZWd5XHJcbiAgICBwdWJsaWMgYnJvd3Nlck5vdGlmaWNhdGlvbkljb25Tb3VyY2U6IHN0cmluZyA9ICdodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vcnBhc2Nob2FsL25nLWNoYXQvbWFzdGVyL3NyYy9uZy1jaGF0L2Fzc2V0cy9ub3RpZmljYXRpb24ucG5nJztcclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgcHVibGljIGJyb3dzZXJOb3RpZmljYXRpb25UaXRsZTogc3RyaW5nID0gXCJOZXcgbWVzc2FnZSBmcm9tXCI7XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHB1YmxpYyBoaXN0b3J5UGFnZVNpemU6IG51bWJlciA9IDEwO1xyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBwdWJsaWMgbG9jYWxpemF0aW9uOiBMb2NhbGl6YXRpb247XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHB1YmxpYyBoaWRlRnJpZW5kc0xpc3Q6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgcHVibGljIGhpZGVGcmllbmRzTGlzdE9uVW5zdXBwb3J0ZWRWaWV3cG9ydDogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHB1YmxpYyBmaWxlVXBsb2FkVXJsOiBzdHJpbmc7XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHB1YmxpYyB0aGVtZTogVGhlbWUgPSBUaGVtZS5MaWdodDtcclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgcHVibGljIGN1c3RvbVRoZW1lOiBzdHJpbmc7XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHB1YmxpYyBtZXNzYWdlRGF0ZVBpcGVGb3JtYXQ6IHN0cmluZyA9IFwic2hvcnRcIjtcclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgcHVibGljIHNob3dNZXNzYWdlRGF0ZTogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHB1YmxpYyBpc1ZpZXdwb3J0T25Nb2JpbGVFbmFibGVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHB1YmxpYyBmaWxlVXBsb2FkQWRhcHRlcjogSUZpbGVVcGxvYWRBZGFwdGVyO1xyXG5cclxuICAgIEBPdXRwdXQoKVxyXG4gICAgcHVibGljIG9uUGFydGljaXBhbnRDbGlja2VkOiBFdmVudEVtaXR0ZXI8SUNoYXRQYXJ0aWNpcGFudD4gPSBuZXcgRXZlbnRFbWl0dGVyPElDaGF0UGFydGljaXBhbnQ+KCk7XHJcblxyXG4gICAgQE91dHB1dCgpXHJcbiAgICBwdWJsaWMgb25QYXJ0aWNpcGFudENoYXRPcGVuZWQ6IEV2ZW50RW1pdHRlcjxJQ2hhdFBhcnRpY2lwYW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8SUNoYXRQYXJ0aWNpcGFudD4oKTtcclxuXHJcbiAgICBAT3V0cHV0KClcclxuICAgIHB1YmxpYyBvblBhcnRpY2lwYW50Q2hhdENsb3NlZDogRXZlbnRFbWl0dGVyPElDaGF0UGFydGljaXBhbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxJQ2hhdFBhcnRpY2lwYW50PigpO1xyXG5cclxuICAgIEBPdXRwdXQoKVxyXG4gICAgcHVibGljIG9uTWVzc2FnZXNTZWVuOiBFdmVudEVtaXR0ZXI8TWVzc2FnZVtdPiA9IG5ldyBFdmVudEVtaXR0ZXI8TWVzc2FnZVtdPigpO1xyXG5cclxuICAgIHByaXZhdGUgYnJvd3Nlck5vdGlmaWNhdGlvbnNCb290c3RyYXBwZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBwdWJsaWMgaGFzUGFnZWRIaXN0b3J5OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgLy8gRG9uJ3Qgd2FudCB0byBhZGQgdGhpcyBhcyBhIHNldHRpbmcgdG8gc2ltcGxpZnkgdXNhZ2UuIFByZXZpb3VzIHBsYWNlaG9sZGVyIGFuZCB0aXRsZSBzZXR0aW5ncyBhdmFpbGFibGUgdG8gYmUgdXNlZCwgb3IgdXNlIGZ1bGwgTG9jYWxpemF0aW9uIG9iamVjdC5cclxuICAgIHByaXZhdGUgc3RhdHVzRGVzY3JpcHRpb246IFN0YXR1c0Rlc2NyaXB0aW9uID0ge1xyXG4gICAgICAgIG9ubGluZTogJ09ubGluZScsXHJcbiAgICAgICAgYnVzeTogJ0J1c3knLFxyXG4gICAgICAgIGF3YXk6ICdBd2F5JyxcclxuICAgICAgICBvZmZsaW5lOiAnT2ZmbGluZSdcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBhdWRpb0ZpbGU6IEhUTUxBdWRpb0VsZW1lbnQ7XHJcblxyXG4gICAgcHVibGljIHBhcnRpY2lwYW50czogSUNoYXRQYXJ0aWNpcGFudFtdO1xyXG5cclxuICAgIHB1YmxpYyBwYXJ0aWNpcGFudHNSZXNwb25zZTogUGFydGljaXBhbnRSZXNwb25zZVtdO1xyXG5cclxuICAgIHB1YmxpYyBwYXJ0aWNpcGFudHNJbnRlcmFjdGVkV2l0aDogSUNoYXRQYXJ0aWNpcGFudFtdID0gW107XHJcblxyXG4gICAgcHVibGljIGN1cnJlbnRBY3RpdmVPcHRpb246IElDaGF0T3B0aW9uIHwgbnVsbDtcclxuXHJcbiAgICBwcml2YXRlIHBvbGxpbmdJbnRlcnZhbFdpbmRvd0luc3RhbmNlOiBudW1iZXI7XHJcblxyXG4gICAgcHJpdmF0ZSBnZXQgbG9jYWxTdG9yYWdlS2V5KCk6IHN0cmluZ1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBgbmctY2hhdC11c2Vycy0ke3RoaXMudXNlcklkfWA7IC8vIEFwcGVuZGluZyB0aGUgdXNlciBpZCBzbyB0aGUgc3RhdGUgaXMgdW5pcXVlIHBlciB1c2VyIGluIGEgY29tcHV0ZXIuXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIERlZmluZXMgdGhlIHNpemUgb2YgZWFjaCBvcGVuZWQgd2luZG93IHRvIGNhbGN1bGF0ZSBob3cgbWFueSB3aW5kb3dzIGNhbiBiZSBvcGVuZWQgb24gdGhlIHZpZXdwb3J0IGF0IHRoZSBzYW1lIHRpbWUuXHJcbiAgICBwdWJsaWMgd2luZG93U2l6ZUZhY3RvcjogbnVtYmVyID0gMzIwO1xyXG5cclxuICAgIC8vIFRvdGFsIHdpZHRoIHNpemUgb2YgdGhlIGZyaWVuZHMgbGlzdCBzZWN0aW9uXHJcbiAgICBwdWJsaWMgZnJpZW5kc0xpc3RXaWR0aDogbnVtYmVyID0gMjYyO1xyXG5cclxuICAgIC8vIEF2YWlsYWJsZSBhcmVhIHRvIHJlbmRlciB0aGUgcGx1Z2luXHJcbiAgICBwcml2YXRlIHZpZXdQb3J0VG90YWxBcmVhOiBudW1iZXI7XHJcblxyXG4gICAgLy8gU2V0IHRvIHRydWUgaWYgdGhlcmUgaXMgbm8gc3BhY2UgdG8gZGlzcGxheSBhdCBsZWFzdCBvbmUgY2hhdCB3aW5kb3cgYW5kICdoaWRlRnJpZW5kc0xpc3RPblVuc3VwcG9ydGVkVmlld3BvcnQnIGlzIHRydWVcclxuICAgIHB1YmxpYyB1bnN1cHBvcnRlZFZpZXdwb3J0OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgd2luZG93czogV2luZG93W10gPSBbXTtcclxuICAgIGlzQm9vdHN0cmFwcGVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgQFZpZXdDaGlsZHJlbignY2hhdFdpbmRvdycpIGNoYXRXaW5kb3dzOiBRdWVyeUxpc3Q8TmdDaGF0V2luZG93Q29tcG9uZW50PjtcclxuXHJcbiAgICBuZ09uSW5pdCgpIHtcclxuICAgICAgICB0aGlzLmJvb3RzdHJhcENoYXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBASG9zdExpc3RlbmVyKCd3aW5kb3c6cmVzaXplJywgWyckZXZlbnQnXSlcclxuICAgIG9uUmVzaXplKGV2ZW50OiBhbnkpe1xyXG4gICAgICAgdGhpcy52aWV3UG9ydFRvdGFsQXJlYSA9IGV2ZW50LnRhcmdldC5pbm5lcldpZHRoO1xyXG5cclxuICAgICAgIHRoaXMuTm9ybWFsaXplV2luZG93cygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENoZWNrcyBpZiB0aGVyZSBhcmUgbW9yZSBvcGVuZWQgd2luZG93cyB0aGFuIHRoZSB2aWV3IHBvcnQgY2FuIGRpc3BsYXlcclxuICAgIHByaXZhdGUgTm9ybWFsaXplV2luZG93cygpOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgbWF4U3VwcG9ydGVkT3BlbmVkV2luZG93cyA9IE1hdGguZmxvb3IoKHRoaXMudmlld1BvcnRUb3RhbEFyZWEgLSAoIXRoaXMuaGlkZUZyaWVuZHNMaXN0ID8gdGhpcy5mcmllbmRzTGlzdFdpZHRoIDogMCkpIC8gdGhpcy53aW5kb3dTaXplRmFjdG9yKTtcclxuICAgICAgICBjb25zdCBkaWZmZXJlbmNlID0gdGhpcy53aW5kb3dzLmxlbmd0aCAtIG1heFN1cHBvcnRlZE9wZW5lZFdpbmRvd3M7XHJcblxyXG4gICAgICAgIGlmIChkaWZmZXJlbmNlID49IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLndpbmRvd3Muc3BsaWNlKHRoaXMud2luZG93cy5sZW5ndGggLSBkaWZmZXJlbmNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlV2luZG93c1N0YXRlKHRoaXMud2luZG93cyk7XHJcblxyXG4gICAgICAgIC8vIFZpZXdwb3J0IHNob3VsZCBoYXZlIHNwYWNlIGZvciBhdCBsZWFzdCBvbmUgY2hhdCB3aW5kb3cgYnV0IHNob3VsZCBzaG93IGluIG1vYmlsZSBpZiBvcHRpb24gaXMgZW5hYmxlZC5cclxuICAgICAgICB0aGlzLnVuc3VwcG9ydGVkVmlld3BvcnQgPSB0aGlzLmlzVmlld3BvcnRPbk1vYmlsZUVuYWJsZWQ/IGZhbHNlIDogdGhpcy5oaWRlRnJpZW5kc0xpc3RPblVuc3VwcG9ydGVkVmlld3BvcnQgJiYgbWF4U3VwcG9ydGVkT3BlbmVkV2luZG93cyA8IDE7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSW5pdGlhbGl6ZXMgdGhlIGNoYXQgcGx1Z2luIGFuZCB0aGUgbWVzc2FnaW5nIGFkYXB0ZXJcclxuICAgIHByaXZhdGUgYm9vdHN0cmFwQ2hhdCgpOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGluaXRpYWxpemF0aW9uRXhjZXB0aW9uID0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYWRhcHRlciAhPSBudWxsICYmIHRoaXMudXNlcklkICE9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0cnlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3UG9ydFRvdGFsQXJlYSA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZVRoZW1lKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxpemVEZWZhdWx0VGV4dCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplQnJvd3Nlck5vdGlmaWNhdGlvbnMoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBCaW5kaW5nIGV2ZW50IGxpc3RlbmVyc1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGFwdGVyLm1lc3NhZ2VSZWNlaXZlZEhhbmRsZXIgPSAocGFydGljaXBhbnQsIG1zZykgPT4gdGhpcy5vbk1lc3NhZ2VSZWNlaXZlZChwYXJ0aWNpcGFudCwgbXNnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRhcHRlci5mcmllbmRzTGlzdENoYW5nZWRIYW5kbGVyID0gKHBhcnRpY2lwYW50c1Jlc3BvbnNlKSA9PiB0aGlzLm9uRnJpZW5kc0xpc3RDaGFuZ2VkKHBhcnRpY2lwYW50c1Jlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGl2YXRlRnJpZW5kTGlzdEZldGNoKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5idWZmZXJBdWRpb0ZpbGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmhhc1BhZ2VkSGlzdG9yeSA9IHRoaXMuYWRhcHRlciBpbnN0YW5jZW9mIFBhZ2VkSGlzdG9yeUNoYXRBZGFwdGVyO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZpbGVVcGxvYWRVcmwgJiYgdGhpcy5maWxlVXBsb2FkVXJsICE9PSBcIlwiKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlsZVVwbG9hZEFkYXB0ZXIgPSBuZXcgRGVmYXVsdEZpbGVVcGxvYWRBZGFwdGVyKHRoaXMuZmlsZVVwbG9hZFVybCwgdGhpcy5faHR0cENsaWVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5Ob3JtYWxpemVXaW5kb3dzKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5pc0Jvb3RzdHJhcHBlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2goZXgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGluaXRpYWxpemF0aW9uRXhjZXB0aW9uID0gZXg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5pc0Jvb3RzdHJhcHBlZCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJuZy1jaGF0IGNvbXBvbmVudCBjb3VsZG4ndCBiZSBib290c3RyYXBwZWQuXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIm5nLWNoYXQgY2FuJ3QgYmUgaW5pdGlhbGl6ZWQgd2l0aG91dCBhbiB1c2VyIGlkLiBQbGVhc2UgbWFrZSBzdXJlIHlvdSd2ZSBwcm92aWRlZCBhbiB1c2VySWQgYXMgYSBwYXJhbWV0ZXIgb2YgdGhlIG5nLWNoYXQgY29tcG9uZW50LlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5hZGFwdGVyID09IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIm5nLWNoYXQgY2FuJ3QgYmUgYm9vdHN0cmFwcGVkIHdpdGhvdXQgYSBDaGF0QWRhcHRlci4gUGxlYXNlIG1ha2Ugc3VyZSB5b3UndmUgcHJvdmlkZWQgYSBDaGF0QWRhcHRlciBpbXBsZW1lbnRhdGlvbiBhcyBhIHBhcmFtZXRlciBvZiB0aGUgbmctY2hhdCBjb21wb25lbnQuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpbml0aWFsaXphdGlvbkV4Y2VwdGlvbilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgQW4gZXhjZXB0aW9uIGhhcyBvY2N1cnJlZCB3aGlsZSBpbml0aWFsaXppbmcgbmctY2hhdC4gRGV0YWlsczogJHtpbml0aWFsaXphdGlvbkV4Y2VwdGlvbi5tZXNzYWdlfWApO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihpbml0aWFsaXphdGlvbkV4Y2VwdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhY3RpdmF0ZUZyaWVuZExpc3RGZXRjaCgpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5hZGFwdGVyKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy8gTG9hZGluZyBjdXJyZW50IHVzZXJzIGxpc3RcclxuICAgICAgICAgICAgaWYgKHRoaXMucG9sbEZyaWVuZHNMaXN0KXtcclxuICAgICAgICAgICAgICAgIC8vIFNldHRpbmcgYSBsb25nIHBvbGwgaW50ZXJ2YWwgdG8gdXBkYXRlIHRoZSBmcmllbmRzIGxpc3RcclxuICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2hGcmllbmRzTGlzdCh0cnVlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9sbGluZ0ludGVydmFsV2luZG93SW5zdGFuY2UgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4gdGhpcy5mZXRjaEZyaWVuZHNMaXN0KGZhbHNlKSwgdGhpcy5wb2xsaW5nSW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gU2luY2UgcG9sbGluZyB3YXMgZGlzYWJsZWQsIGEgZnJpZW5kcyBsaXN0IHVwZGF0ZSBtZWNoYW5pc20gd2lsbCBoYXZlIHRvIGJlIGltcGxlbWVudGVkIGluIHRoZSBDaGF0QWRhcHRlci5cclxuICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2hGcmllbmRzTGlzdCh0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBJbml0aWFsaXplcyBicm93c2VyIG5vdGlmaWNhdGlvbnNcclxuICAgIHByaXZhdGUgYXN5bmMgaW5pdGlhbGl6ZUJyb3dzZXJOb3RpZmljYXRpb25zKClcclxuICAgIHtcclxuICAgICAgICBpZiAodGhpcy5icm93c2VyTm90aWZpY2F0aW9uc0VuYWJsZWQgJiYgKFwiTm90aWZpY2F0aW9uXCIgaW4gd2luZG93KSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChhd2FpdCBOb3RpZmljYXRpb24ucmVxdWVzdFBlcm1pc3Npb24oKSA9PT0gXCJncmFudGVkXCIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYnJvd3Nlck5vdGlmaWNhdGlvbnNCb290c3RyYXBwZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEluaXRpYWxpemVzIGRlZmF1bHQgdGV4dFxyXG4gICAgcHJpdmF0ZSBpbml0aWFsaXplRGVmYXVsdFRleHQoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBpZiAoIXRoaXMubG9jYWxpemF0aW9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5sb2NhbGl6YXRpb24gPSB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlUGxhY2Vob2xkZXI6IHRoaXMubWVzc2FnZVBsYWNlaG9sZGVyLFxyXG4gICAgICAgICAgICAgICAgc2VhcmNoUGxhY2Vob2xkZXI6IHRoaXMuc2VhcmNoUGxhY2Vob2xkZXIsXHJcbiAgICAgICAgICAgICAgICB0aXRsZTogdGhpcy50aXRsZSxcclxuICAgICAgICAgICAgICAgIHN0YXR1c0Rlc2NyaXB0aW9uOiB0aGlzLnN0YXR1c0Rlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgICAgICAgYnJvd3Nlck5vdGlmaWNhdGlvblRpdGxlOiB0aGlzLmJyb3dzZXJOb3RpZmljYXRpb25UaXRsZSxcclxuICAgICAgICAgICAgICAgIGxvYWRNZXNzYWdlSGlzdG9yeVBsYWNlaG9sZGVyOiBcIkxvYWQgb2xkZXIgbWVzc2FnZXNcIlxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRpYWxpemVUaGVtZSgpOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VzdG9tVGhlbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnRoZW1lID0gVGhlbWUuQ3VzdG9tO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLnRoZW1lICE9IFRoZW1lLkxpZ2h0ICYmIHRoaXMudGhlbWUgIT0gVGhlbWUuRGFyaylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vIFRPRE86IFVzZSBlczIwMTcgaW4gZnV0dXJlIHdpdGggT2JqZWN0LnZhbHVlcyhUaGVtZSkuaW5jbHVkZXModGhpcy50aGVtZSkgdG8gZG8gdGhpcyBjaGVja1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdGhlbWUgY29uZmlndXJhdGlvbiBmb3IgbmctY2hhdC4gXCIke3RoaXMudGhlbWV9XCIgaXMgbm90IGEgdmFsaWQgdGhlbWUgdmFsdWUuYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFNlbmRzIGEgcmVxdWVzdCB0byBsb2FkIHRoZSBmcmllbmRzIGxpc3RcclxuICAgIHByaXZhdGUgZmV0Y2hGcmllbmRzTGlzdChpc0Jvb3RzdHJhcHBpbmc6IGJvb2xlYW4pOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5hZGFwdGVyLmxpc3RGcmllbmRzKClcclxuICAgICAgICAucGlwZShcclxuICAgICAgICAgICAgbWFwKChwYXJ0aWNpcGFudHNSZXNwb25zZTogUGFydGljaXBhbnRSZXNwb25zZVtdKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnRpY2lwYW50c1Jlc3BvbnNlID0gcGFydGljaXBhbnRzUmVzcG9uc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJ0aWNpcGFudHMgPSBwYXJ0aWNpcGFudHNSZXNwb25zZS5tYXAoKHJlc3BvbnNlOiBQYXJ0aWNpcGFudFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnBhcnRpY2lwYW50O1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXNCb290c3RyYXBwaW5nKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3RvcmVXaW5kb3dzU3RhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZldGNoTWVzc2FnZUhpc3Rvcnkod2luZG93OiBXaW5kb3cpIHtcclxuICAgICAgICAvLyBOb3QgaWRlYWwgYnV0IHdpbGwga2VlcCB0aGlzIHVudGlsIHdlIGRlY2lkZSBpZiB3ZSBhcmUgc2hpcHBpbmcgcGFnaW5hdGlvbiB3aXRoIHRoZSBkZWZhdWx0IGFkYXB0ZXJcclxuICAgICAgICBpZiAodGhpcy5hZGFwdGVyIGluc3RhbmNlb2YgUGFnZWRIaXN0b3J5Q2hhdEFkYXB0ZXIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB3aW5kb3cuaXNMb2FkaW5nSGlzdG9yeSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmFkYXB0ZXIuZ2V0TWVzc2FnZUhpc3RvcnlCeVBhZ2Uod2luZG93LnBhcnRpY2lwYW50LmlkLCB0aGlzLmhpc3RvcnlQYWdlU2l6ZSwgKyt3aW5kb3cuaGlzdG9yeVBhZ2UpXHJcbiAgICAgICAgICAgIC5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKChyZXN1bHQ6IE1lc3NhZ2VbXSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5mb3JFYWNoKChtZXNzYWdlKSA9PiB0aGlzLmFzc2VydE1lc3NhZ2VUeXBlKG1lc3NhZ2UpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93Lm1lc3NhZ2VzID0gcmVzdWx0LmNvbmNhdCh3aW5kb3cubWVzc2FnZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5pc0xvYWRpbmdIaXN0b3J5ID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbjogU2Nyb2xsRGlyZWN0aW9uID0gKHdpbmRvdy5oaXN0b3J5UGFnZSA9PSAxKSA/IFNjcm9sbERpcmVjdGlvbi5Cb3R0b20gOiBTY3JvbGxEaXJlY3Rpb24uVG9wO1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5oYXNNb3JlTWVzc2FnZXMgPSByZXN1bHQubGVuZ3RoID09IHRoaXMuaGlzdG9yeVBhZ2VTaXplO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMub25GZXRjaE1lc3NhZ2VIaXN0b3J5TG9hZGVkKHJlc3VsdCwgd2luZG93LCBkaXJlY3Rpb24sIHRydWUpKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICkuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlci5nZXRNZXNzYWdlSGlzdG9yeSh3aW5kb3cucGFydGljaXBhbnQuaWQpXHJcbiAgICAgICAgICAgIC5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKChyZXN1bHQ6IE1lc3NhZ2VbXSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5mb3JFYWNoKChtZXNzYWdlKSA9PiB0aGlzLmFzc2VydE1lc3NhZ2VUeXBlKG1lc3NhZ2UpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93Lm1lc3NhZ2VzID0gcmVzdWx0LmNvbmNhdCh3aW5kb3cubWVzc2FnZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5pc0xvYWRpbmdIaXN0b3J5ID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5vbkZldGNoTWVzc2FnZUhpc3RvcnlMb2FkZWQocmVzdWx0LCB3aW5kb3csIFNjcm9sbERpcmVjdGlvbi5Cb3R0b20pKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICkuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25GZXRjaE1lc3NhZ2VIaXN0b3J5TG9hZGVkKG1lc3NhZ2VzOiBNZXNzYWdlW10sIHdpbmRvdzogV2luZG93LCBkaXJlY3Rpb246IFNjcm9sbERpcmVjdGlvbiwgZm9yY2VNYXJrTWVzc2FnZXNBc1NlZW46IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLnNjcm9sbENoYXRXaW5kb3cod2luZG93LCBkaXJlY3Rpb24pXHJcblxyXG4gICAgICAgIGlmICh3aW5kb3cuaGFzRm9jdXMgfHwgZm9yY2VNYXJrTWVzc2FnZXNBc1NlZW4pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCB1bnNlZW5NZXNzYWdlcyA9IG1lc3NhZ2VzLmZpbHRlcihtID0+ICFtLmRhdGVTZWVuKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubWFya01lc3NhZ2VzQXNSZWFkKHVuc2Vlbk1lc3NhZ2VzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVXBkYXRlcyB0aGUgZnJpZW5kcyBsaXN0IHZpYSB0aGUgZXZlbnQgaGFuZGxlclxyXG4gICAgcHJpdmF0ZSBvbkZyaWVuZHNMaXN0Q2hhbmdlZChwYXJ0aWNpcGFudHNSZXNwb25zZTogUGFydGljaXBhbnRSZXNwb25zZVtdKTogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIGlmIChwYXJ0aWNpcGFudHNSZXNwb25zZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMucGFydGljaXBhbnRzUmVzcG9uc2UgPSBwYXJ0aWNpcGFudHNSZXNwb25zZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucGFydGljaXBhbnRzID0gcGFydGljaXBhbnRzUmVzcG9uc2UubWFwKChyZXNwb25zZTogUGFydGljaXBhbnRSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnBhcnRpY2lwYW50O1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucGFydGljaXBhbnRzSW50ZXJhY3RlZFdpdGggPSBbXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSGFuZGxlcyByZWNlaXZlZCBtZXNzYWdlcyBieSB0aGUgYWRhcHRlclxyXG4gICAgcHJpdmF0ZSBvbk1lc3NhZ2VSZWNlaXZlZChwYXJ0aWNpcGFudDogSUNoYXRQYXJ0aWNpcGFudCwgbWVzc2FnZTogTWVzc2FnZSlcclxuICAgIHtcclxuICAgICAgICBpZiAocGFydGljaXBhbnQgJiYgbWVzc2FnZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoYXRXaW5kb3cgPSB0aGlzLm9wZW5DaGF0V2luZG93KHBhcnRpY2lwYW50KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYXNzZXJ0TWVzc2FnZVR5cGUobWVzc2FnZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWNoYXRXaW5kb3dbMV0gfHwgIXRoaXMuaGlzdG9yeUVuYWJsZWQpe1xyXG4gICAgICAgICAgICAgICAgY2hhdFdpbmRvd1swXS5tZXNzYWdlcy5wdXNoKG1lc3NhZ2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsQ2hhdFdpbmRvdyhjaGF0V2luZG93WzBdLCBTY3JvbGxEaXJlY3Rpb24uQm90dG9tKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY2hhdFdpbmRvd1swXS5oYXNGb2N1cylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcmtNZXNzYWdlc0FzUmVhZChbbWVzc2FnZV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmVtaXRNZXNzYWdlU291bmQoY2hhdFdpbmRvd1swXSk7XHJcblxyXG4gICAgICAgICAgICAvLyBHaXRodWIgaXNzdWUgIzU4XHJcbiAgICAgICAgICAgIC8vIERvIG5vdCBwdXNoIGJyb3dzZXIgbm90aWZpY2F0aW9ucyB3aXRoIG1lc3NhZ2UgY29udGVudCBmb3IgcHJpdmFjeSBwdXJwb3NlcyBpZiB0aGUgJ21heGltaXplV2luZG93T25OZXdNZXNzYWdlJyBzZXR0aW5nIGlzIG9mZiBhbmQgdGhpcyBpcyBhIG5ldyBjaGF0IHdpbmRvdy5cclxuICAgICAgICAgICAgaWYgKHRoaXMubWF4aW1pemVXaW5kb3dPbk5ld01lc3NhZ2UgfHwgKCFjaGF0V2luZG93WzFdICYmICFjaGF0V2luZG93WzBdLmlzQ29sbGFwc2VkKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gU29tZSBtZXNzYWdlcyBhcmUgbm90IHB1c2hlZCBiZWNhdXNlIHRoZXkgYXJlIGxvYWRlZCBieSBmZXRjaGluZyB0aGUgaGlzdG9yeSBoZW5jZSB3aHkgd2Ugc3VwcGx5IHRoZSBtZXNzYWdlIGhlcmVcclxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdEJyb3dzZXJOb3RpZmljYXRpb24oY2hhdFdpbmRvd1swXSwgbWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25QYXJ0aWNpcGFudENsaWNrZWRGcm9tRnJpZW5kc0xpc3QocGFydGljaXBhbnQ6IElDaGF0UGFydGljaXBhbnQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLm9wZW5DaGF0V2luZG93KHBhcnRpY2lwYW50LCB0cnVlLCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNhbmNlbE9wdGlvblByb21wdCgpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50QWN0aXZlT3B0aW9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50QWN0aXZlT3B0aW9uLmlzQWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEFjdGl2ZU9wdGlvbiA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uT3B0aW9uUHJvbXB0Q2FuY2VsZWQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jYW5jZWxPcHRpb25Qcm9tcHQoKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk9wdGlvblByb21wdENvbmZpcm1lZChldmVudDogYW55KTogdm9pZCB7XHJcbiAgICAgICAgLy8gRm9yIG5vdyB0aGlzIGlzIGZpbmUgYXMgdGhlcmUgaXMgb25seSBvbmUgb3B0aW9uIGF2YWlsYWJsZS4gSW50cm9kdWNlIG9wdGlvbiB0eXBlcyBhbmQgdHlwZSBjaGVja2luZyBpZiBhIG5ldyBvcHRpb24gaXMgYWRkZWQuXHJcbiAgICAgICAgdGhpcy5jb25maXJtTmV3R3JvdXAoZXZlbnQpO1xyXG5cclxuICAgICAgICAvLyBDYW5jZWxpbmcgY3VycmVudCBzdGF0ZVxyXG4gICAgICAgIHRoaXMuY2FuY2VsT3B0aW9uUHJvbXB0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjb25maXJtTmV3R3JvdXAodXNlcnM6IFVzZXJbXSk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IG5ld0dyb3VwID0gbmV3IEdyb3VwKHVzZXJzKTtcclxuXHJcbiAgICAgICAgdGhpcy5vcGVuQ2hhdFdpbmRvdyhuZXdHcm91cCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmdyb3VwQWRhcHRlcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdXBBZGFwdGVyLmdyb3VwQ3JlYXRlZChuZXdHcm91cCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIE9wZW5zIGEgbmV3IGNoYXQgd2hpbmRvdy4gVGFrZXMgY2FyZSBvZiBhdmFpbGFibGUgdmlld3BvcnRcclxuICAgIC8vIFdvcmtzIGZvciBvcGVuaW5nIGEgY2hhdCB3aW5kb3cgZm9yIGFuIHVzZXIgb3IgZm9yIGEgZ3JvdXBcclxuICAgIC8vIFJldHVybnMgPT4gW1dpbmRvdzogV2luZG93IG9iamVjdCByZWZlcmVuY2UsIGJvb2xlYW46IEluZGljYXRlcyBpZiB0aGlzIHdpbmRvdyBpcyBhIG5ldyBjaGF0IHdpbmRvd11cclxuICAgIHByaXZhdGUgb3BlbkNoYXRXaW5kb3cocGFydGljaXBhbnQ6IElDaGF0UGFydGljaXBhbnQsIGZvY3VzT25OZXdXaW5kb3c6IGJvb2xlYW4gPSBmYWxzZSwgaW52b2tlZEJ5VXNlckNsaWNrOiBib29sZWFuID0gZmFsc2UpOiBbV2luZG93LCBib29sZWFuXVxyXG4gICAge1xyXG4gICAgICAgIC8vIElzIHRoaXMgd2luZG93IG9wZW5lZD9cclxuICAgICAgICBjb25zdCBvcGVuZWRXaW5kb3cgPSB0aGlzLndpbmRvd3MuZmluZCh4ID0+IHgucGFydGljaXBhbnQuaWQgPT0gcGFydGljaXBhbnQuaWQpO1xyXG5cclxuICAgICAgICBpZiAoIW9wZW5lZFdpbmRvdylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChpbnZva2VkQnlVc2VyQ2xpY2spXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25QYXJ0aWNpcGFudENsaWNrZWQuZW1pdChwYXJ0aWNpcGFudCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFJlZmVyIHRvIGlzc3VlICM1OCBvbiBHaXRodWJcclxuICAgICAgICAgICAgY29uc3QgY29sbGFwc2VXaW5kb3cgPSBpbnZva2VkQnlVc2VyQ2xpY2sgPyBmYWxzZSA6ICF0aGlzLm1heGltaXplV2luZG93T25OZXdNZXNzYWdlO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbmV3Q2hhdFdpbmRvdzogV2luZG93ID0gbmV3IFdpbmRvdyhwYXJ0aWNpcGFudCwgdGhpcy5oaXN0b3J5RW5hYmxlZCwgY29sbGFwc2VXaW5kb3cpO1xyXG5cclxuICAgICAgICAgICAgLy8gTG9hZHMgdGhlIGNoYXQgaGlzdG9yeSB2aWEgYW4gUnhKcyBPYnNlcnZhYmxlXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhpc3RvcnlFbmFibGVkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZldGNoTWVzc2FnZUhpc3RvcnkobmV3Q2hhdFdpbmRvdyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMud2luZG93cy51bnNoaWZ0KG5ld0NoYXRXaW5kb3cpO1xyXG5cclxuICAgICAgICAgICAgLy8gSXMgdGhlcmUgZW5vdWdoIHNwYWNlIGxlZnQgaW4gdGhlIHZpZXcgcG9ydCA/IGJ1dCBzaG91bGQgYmUgZGlzcGxheWVkIGluIG1vYmlsZSBpZiBvcHRpb24gaXMgZW5hYmxlZFxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNWaWV3cG9ydE9uTW9iaWxlRW5hYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMud2luZG93cy5sZW5ndGggKiB0aGlzLndpbmRvd1NpemVGYWN0b3IgPj0gdGhpcy52aWV3UG9ydFRvdGFsQXJlYSAtICghdGhpcy5oaWRlRnJpZW5kc0xpc3QgPyB0aGlzLmZyaWVuZHNMaXN0V2lkdGggOiAwKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2luZG93cy5wb3AoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy51cGRhdGVXaW5kb3dzU3RhdGUodGhpcy53aW5kb3dzKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChmb2N1c09uTmV3V2luZG93ICYmICFjb2xsYXBzZVdpbmRvdylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb2N1c09uV2luZG93KG5ld0NoYXRXaW5kb3cpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnBhcnRpY2lwYW50c0ludGVyYWN0ZWRXaXRoLnB1c2gocGFydGljaXBhbnQpO1xyXG4gICAgICAgICAgICB0aGlzLm9uUGFydGljaXBhbnRDaGF0T3BlbmVkLmVtaXQocGFydGljaXBhbnQpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFtuZXdDaGF0V2luZG93LCB0cnVlXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy8gUmV0dXJucyB0aGUgZXhpc3RpbmcgY2hhdCB3aW5kb3dcclxuICAgICAgICAgICAgcmV0dXJuIFtvcGVuZWRXaW5kb3csIGZhbHNlXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRm9jdXMgb24gdGhlIGlucHV0IGVsZW1lbnQgb2YgdGhlIHN1cHBsaWVkIHdpbmRvd1xyXG4gICAgcHJpdmF0ZSBmb2N1c09uV2luZG93KHdpbmRvdzogV2luZG93LCBjYWxsYmFjazogRnVuY3Rpb24gPSAoKSA9PiB7fSkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3Qgd2luZG93SW5kZXggPSB0aGlzLndpbmRvd3MuaW5kZXhPZih3aW5kb3cpO1xyXG4gICAgICAgIGlmICh3aW5kb3dJbmRleCA+PSAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGF0V2luZG93cylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGF0V2luZG93VG9Gb2N1cyA9IHRoaXMuY2hhdFdpbmRvd3MudG9BcnJheSgpW3dpbmRvd0luZGV4XTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhdFdpbmRvd1RvRm9jdXMuY2hhdFdpbmRvd0lucHV0Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhc3NlcnRNZXNzYWdlVHlwZShtZXNzYWdlOiBNZXNzYWdlKTogdm9pZCB7XHJcbiAgICAgICAgLy8gQWx3YXlzIGZhbGxiYWNrIHRvIFwiVGV4dFwiIG1lc3NhZ2VzIHRvIGF2b2lkIHJlbmRlbnJpbmcgaXNzdWVzXHJcbiAgICAgICAgaWYgKCFtZXNzYWdlLnR5cGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBtZXNzYWdlLnR5cGUgPSBNZXNzYWdlVHlwZS5UZXh0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBNYXJrcyBhbGwgbWVzc2FnZXMgcHJvdmlkZWQgYXMgcmVhZCB3aXRoIHRoZSBjdXJyZW50IHRpbWUuXHJcbiAgICBtYXJrTWVzc2FnZXNBc1JlYWQobWVzc2FnZXM6IE1lc3NhZ2VbXSk6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBjb25zdCBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKCk7XHJcblxyXG4gICAgICAgIG1lc3NhZ2VzLmZvckVhY2goKG1zZyk9PntcclxuICAgICAgICAgICAgbXNnLmRhdGVTZWVuID0gY3VycmVudERhdGU7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMub25NZXNzYWdlc1NlZW4uZW1pdChtZXNzYWdlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQnVmZmVycyBhdWRpbyBmaWxlIChGb3IgY29tcG9uZW50J3MgYm9vdHN0cmFwcGluZylcclxuICAgIHByaXZhdGUgYnVmZmVyQXVkaW9GaWxlKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmF1ZGlvU291cmNlICYmIHRoaXMuYXVkaW9Tb3VyY2UubGVuZ3RoID4gMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuYXVkaW9GaWxlID0gbmV3IEF1ZGlvKCk7XHJcbiAgICAgICAgICAgIHRoaXMuYXVkaW9GaWxlLnNyYyA9IHRoaXMuYXVkaW9Tb3VyY2U7XHJcbiAgICAgICAgICAgIHRoaXMuYXVkaW9GaWxlLmxvYWQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRW1pdHMgYSBtZXNzYWdlIG5vdGlmaWNhdGlvbiBhdWRpbyBpZiBlbmFibGVkIGFmdGVyIGV2ZXJ5IG1lc3NhZ2UgcmVjZWl2ZWRcclxuICAgIHByaXZhdGUgZW1pdE1lc3NhZ2VTb3VuZCh3aW5kb3c6IFdpbmRvdyk6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBpZiAodGhpcy5hdWRpb0VuYWJsZWQgJiYgIXdpbmRvdy5oYXNGb2N1cyAmJiB0aGlzLmF1ZGlvRmlsZSkge1xyXG4gICAgICAgICAgICB0aGlzLmF1ZGlvRmlsZS5wbGF5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEVtaXRzIGEgYnJvd3NlciBub3RpZmljYXRpb25cclxuICAgIHByaXZhdGUgZW1pdEJyb3dzZXJOb3RpZmljYXRpb24od2luZG93OiBXaW5kb3csIG1lc3NhZ2U6IE1lc3NhZ2UpOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHRoaXMuYnJvd3Nlck5vdGlmaWNhdGlvbnNCb290c3RyYXBwZWQgJiYgIXdpbmRvdy5oYXNGb2N1cyAmJiBtZXNzYWdlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vdGlmaWNhdGlvbiA9IG5ldyBOb3RpZmljYXRpb24oYCR7dGhpcy5sb2NhbGl6YXRpb24uYnJvd3Nlck5vdGlmaWNhdGlvblRpdGxlfSAke3dpbmRvdy5wYXJ0aWNpcGFudC5kaXNwbGF5TmFtZX1gLCB7XHJcbiAgICAgICAgICAgICAgICAnYm9keSc6IG1lc3NhZ2UubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgICdpY29uJzogdGhpcy5icm93c2VyTm90aWZpY2F0aW9uSWNvblNvdXJjZVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbm90aWZpY2F0aW9uLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIH0sIG1lc3NhZ2UubWVzc2FnZS5sZW5ndGggPD0gNTAgPyA1MDAwIDogNzAwMCk7IC8vIE1vcmUgdGltZSB0byByZWFkIGxvbmdlciBtZXNzYWdlc1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBTYXZlcyBjdXJyZW50IHdpbmRvd3Mgc3RhdGUgaW50byBsb2NhbCBzdG9yYWdlIGlmIHBlcnNpc3RlbmNlIGlzIGVuYWJsZWRcclxuICAgIHByaXZhdGUgdXBkYXRlV2luZG93c1N0YXRlKHdpbmRvd3M6IFdpbmRvd1tdKTogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIGlmICh0aGlzLnBlcnNpc3RXaW5kb3dzU3RhdGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCBwYXJ0aWNpcGFudElkcyA9IHdpbmRvd3MubWFwKCh3KSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdy5wYXJ0aWNpcGFudC5pZDtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSwgSlNPTi5zdHJpbmdpZnkocGFydGljaXBhbnRJZHMpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZXN0b3JlV2luZG93c1N0YXRlKCk6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0cnlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBlcnNpc3RXaW5kb3dzU3RhdGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN0cmluZ2ZpZWRQYXJ0aWNpcGFudElkcyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc3RyaW5nZmllZFBhcnRpY2lwYW50SWRzICYmIHN0cmluZ2ZpZWRQYXJ0aWNpcGFudElkcy5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnRpY2lwYW50SWRzID0gPG51bWJlcltdPkpTT04ucGFyc2Uoc3RyaW5nZmllZFBhcnRpY2lwYW50SWRzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFydGljaXBhbnRzVG9SZXN0b3JlID0gdGhpcy5wYXJ0aWNpcGFudHMuZmlsdGVyKHUgPT4gcGFydGljaXBhbnRJZHMuaW5kZXhPZih1LmlkKSA+PSAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcGFydGljaXBhbnRzVG9SZXN0b3JlLmZvckVhY2goKHBhcnRpY2lwYW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3BlbkNoYXRXaW5kb3cocGFydGljaXBhbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChleClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEFuIGVycm9yIG9jY3VycmVkIHdoaWxlIHJlc3RvcmluZyBuZy1jaGF0IHdpbmRvd3Mgc3RhdGUuIERldGFpbHM6ICR7ZXh9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEdldHMgY2xvc2VzdCBvcGVuIHdpbmRvdyBpZiBhbnkuIE1vc3QgcmVjZW50IG9wZW5lZCBoYXMgcHJpb3JpdHkgKFJpZ2h0KVxyXG4gICAgcHJpdmF0ZSBnZXRDbG9zZXN0V2luZG93KHdpbmRvdzogV2luZG93KTogV2luZG93IHwgdW5kZWZpbmVkXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLndpbmRvd3MuaW5kZXhPZih3aW5kb3cpO1xyXG5cclxuICAgICAgICBpZiAoaW5kZXggPiAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMud2luZG93c1tpbmRleCAtIDFdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChpbmRleCA9PSAwICYmIHRoaXMud2luZG93cy5sZW5ndGggPiAxKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMud2luZG93c1tpbmRleCArIDFdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNsb3NlV2luZG93KHdpbmRvdzogV2luZG93KTogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy53aW5kb3dzLmluZGV4T2Yod2luZG93KTtcclxuXHJcbiAgICAgICAgdGhpcy53aW5kb3dzLnNwbGljZShpbmRleCwgMSk7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlV2luZG93c1N0YXRlKHRoaXMud2luZG93cyk7XHJcblxyXG4gICAgICAgIHRoaXMub25QYXJ0aWNpcGFudENoYXRDbG9zZWQuZW1pdCh3aW5kb3cucGFydGljaXBhbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0Q2hhdFdpbmRvd0NvbXBvbmVudEluc3RhbmNlKHRhcmdldFdpbmRvdzogV2luZG93KTogTmdDaGF0V2luZG93Q29tcG9uZW50IHwgbnVsbCB7XHJcbiAgICAgICAgY29uc3Qgd2luZG93SW5kZXggPSB0aGlzLndpbmRvd3MuaW5kZXhPZih0YXJnZXRXaW5kb3cpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jaGF0V2luZG93cyl7XHJcbiAgICAgICAgICAgIGxldCB0YXJnZXRXaW5kb3cgPSB0aGlzLmNoYXRXaW5kb3dzLnRvQXJyYXkoKVt3aW5kb3dJbmRleF07XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0V2luZG93O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU2Nyb2xscyBhIGNoYXQgd2luZG93IG1lc3NhZ2UgZmxvdyB0byB0aGUgYm90dG9tXHJcbiAgICBwcml2YXRlIHNjcm9sbENoYXRXaW5kb3cod2luZG93OiBXaW5kb3csIGRpcmVjdGlvbjogU2Nyb2xsRGlyZWN0aW9uKTogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IGNoYXRXaW5kb3cgPSB0aGlzLmdldENoYXRXaW5kb3dDb21wb25lbnRJbnN0YW5jZSh3aW5kb3cpO1xyXG5cclxuICAgICAgICBpZiAoY2hhdFdpbmRvdyl7XHJcbiAgICAgICAgICAgIGNoYXRXaW5kb3cuc2Nyb2xsQ2hhdFdpbmRvdyh3aW5kb3csIGRpcmVjdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uV2luZG93TWVzc2FnZXNTZWVuKG1lc3NhZ2VzU2VlbjogTWVzc2FnZVtdKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5tYXJrTWVzc2FnZXNBc1JlYWQobWVzc2FnZXNTZWVuKTtcclxuICAgIH1cclxuXHJcbiAgICBvbldpbmRvd0NoYXRDbG9zZWQocGF5bG9hZDogeyBjbG9zZWRXaW5kb3c6IFdpbmRvdywgY2xvc2VkVmlhRXNjYXBlS2V5OiBib29sZWFuIH0pOiB2b2lkIHtcclxuICAgICAgICBjb25zdCB7IGNsb3NlZFdpbmRvdywgY2xvc2VkVmlhRXNjYXBlS2V5IH0gPSBwYXlsb2FkO1xyXG5cclxuICAgICAgICBpZiAoY2xvc2VkVmlhRXNjYXBlS2V5KSB7XHJcbiAgICAgICAgICAgIGxldCBjbG9zZXN0V2luZG93ID0gdGhpcy5nZXRDbG9zZXN0V2luZG93KGNsb3NlZFdpbmRvdyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY2xvc2VzdFdpbmRvdylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb2N1c09uV2luZG93KGNsb3Nlc3RXaW5kb3csICgpID0+IHsgdGhpcy5jbG9zZVdpbmRvdyhjbG9zZWRXaW5kb3cpOyB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VXaW5kb3coY2xvc2VkV2luZG93KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jbG9zZVdpbmRvdyhjbG9zZWRXaW5kb3cpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbldpbmRvd1RhYlRyaWdnZXJlZChwYXlsb2FkOiB7IHRyaWdnZXJpbmdXaW5kb3c6IFdpbmRvdywgc2hpZnRLZXlQcmVzc2VkOiBib29sZWFuIH0pOiB2b2lkIHtcclxuICAgICAgICBjb25zdCB7IHRyaWdnZXJpbmdXaW5kb3csIHNoaWZ0S2V5UHJlc3NlZCB9ID0gcGF5bG9hZDtcclxuXHJcbiAgICAgICAgY29uc3QgY3VycmVudFdpbmRvd0luZGV4ID0gdGhpcy53aW5kb3dzLmluZGV4T2YodHJpZ2dlcmluZ1dpbmRvdyk7XHJcbiAgICAgICAgbGV0IHdpbmRvd1RvRm9jdXMgPSB0aGlzLndpbmRvd3NbY3VycmVudFdpbmRvd0luZGV4ICsgKHNoaWZ0S2V5UHJlc3NlZCA/IDEgOiAtMSldOyAvLyBHb2VzIGJhY2sgb24gc2hpZnQgKyB0YWJcclxuXHJcbiAgICAgICAgaWYgKCF3aW5kb3dUb0ZvY3VzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy8gRWRnZSB3aW5kb3dzLCBnbyB0byBzdGFydCBvciBlbmRcclxuICAgICAgICAgICAgd2luZG93VG9Gb2N1cyA9IHRoaXMud2luZG93c1tjdXJyZW50V2luZG93SW5kZXggPiAwID8gMCA6IHRoaXMuY2hhdFdpbmRvd3MubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmZvY3VzT25XaW5kb3cod2luZG93VG9Gb2N1cyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25XaW5kb3dNZXNzYWdlU2VudChtZXNzYWdlU2VudDogTWVzc2FnZSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYWRhcHRlci5zZW5kTWVzc2FnZShtZXNzYWdlU2VudCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25XaW5kb3dPcHRpb25UcmlnZ2VyZWQob3B0aW9uOiBJQ2hhdE9wdGlvbik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY3VycmVudEFjdGl2ZU9wdGlvbiA9IG9wdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICB0cmlnZ2VyT3BlbkNoYXRXaW5kb3codXNlcjogVXNlcik6IHZvaWQge1xyXG4gICAgICAgIGlmICh1c2VyKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5vcGVuQ2hhdFdpbmRvdyh1c2VyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdHJpZ2dlckNsb3NlQ2hhdFdpbmRvdyh1c2VySWQ6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IG9wZW5lZFdpbmRvdyA9IHRoaXMud2luZG93cy5maW5kKHggPT4geC5wYXJ0aWNpcGFudC5pZCA9PSB1c2VySWQpO1xyXG5cclxuICAgICAgICBpZiAob3BlbmVkV2luZG93KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5jbG9zZVdpbmRvdyhvcGVuZWRXaW5kb3cpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0cmlnZ2VyVG9nZ2xlQ2hhdFdpbmRvd1Zpc2liaWxpdHkodXNlcklkOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBvcGVuZWRXaW5kb3cgPSB0aGlzLndpbmRvd3MuZmluZCh4ID0+IHgucGFydGljaXBhbnQuaWQgPT0gdXNlcklkKTtcclxuXHJcbiAgICAgICAgaWYgKG9wZW5lZFdpbmRvdylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoYXRXaW5kb3cgPSB0aGlzLmdldENoYXRXaW5kb3dDb21wb25lbnRJbnN0YW5jZShvcGVuZWRXaW5kb3cpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNoYXRXaW5kb3cpe1xyXG4gICAgICAgICAgICAgICAgY2hhdFdpbmRvdy5vbkNoYXRXaW5kb3dDbGlja2VkKG9wZW5lZFdpbmRvdyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19