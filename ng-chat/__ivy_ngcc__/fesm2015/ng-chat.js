import { CommonModule } from '@angular/common';
import { EventEmitter, Component, ViewEncapsulation, Input, Output, ViewChildren, HostListener, Pipe, ViewChild, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { __awaiter } from 'tslib';
import { map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';

class ChatAdapter {
    constructor() {
        // ### Abstract adapter methods ###
        // Event handlers
        /** @internal */
        this.friendsListChangedHandler = (participantsResponse) => { };
        /** @internal */
        this.messageReceivedHandler = (participant, message) => { };
    }
    // ### Adapter/Chat income/ingress events ###
    onFriendsListChanged(participantsResponse) {
        this.friendsListChangedHandler(participantsResponse);
    }
    onMessageReceived(participant, message) {
        this.messageReceivedHandler(participant, message);
    }
}

var MessageType;
(function (MessageType) {
    MessageType[MessageType["Text"] = 1] = "Text";
    MessageType[MessageType["File"] = 2] = "File";
    MessageType[MessageType["Image"] = 3] = "Image";
})(MessageType || (MessageType = {}));

class Message {
    constructor() {
        this.type = MessageType.Text;
    }
}

var ChatParticipantStatus;
(function (ChatParticipantStatus) {
    ChatParticipantStatus[ChatParticipantStatus["Online"] = 0] = "Online";
    ChatParticipantStatus[ChatParticipantStatus["Busy"] = 1] = "Busy";
    ChatParticipantStatus[ChatParticipantStatus["Away"] = 2] = "Away";
    ChatParticipantStatus[ChatParticipantStatus["Offline"] = 3] = "Offline";
})(ChatParticipantStatus || (ChatParticipantStatus = {}));

var ChatParticipantType;
(function (ChatParticipantType) {
    ChatParticipantType[ChatParticipantType["User"] = 0] = "User";
    ChatParticipantType[ChatParticipantType["Group"] = 1] = "Group";
})(ChatParticipantType || (ChatParticipantType = {}));

class User {
    constructor() {
        this.participantType = ChatParticipantType.User;
    }
}

class ParticipantResponse {
}

class ParticipantMetadata {
    constructor() {
        this.totalUnreadMessages = 0;
    }
}

class Window {
    constructor(participant, isLoadingHistory, isCollapsed) {
        this.messages = [];
        this.newMessage = "";
        // UI Behavior properties
        this.isCollapsed = false;
        this.isLoadingHistory = false;
        this.hasFocus = false;
        this.hasMoreMessages = true;
        this.historyPage = 0;
        this.participant = participant;
        this.messages = [];
        this.isLoadingHistory = isLoadingHistory;
        this.hasFocus = false; // This will be triggered when the 'newMessage' input gets the current focus
        this.isCollapsed = isCollapsed;
        this.hasMoreMessages = false;
        this.historyPage = 0;
    }
}

/**
 * @description Chat Adapter decorator class that adds pagination to load the history of messagesr.
 * You will need an existing @see ChatAdapter implementation
 */
class PagedHistoryChatAdapter extends ChatAdapter {
}

var Theme;
(function (Theme) {
    Theme["Custom"] = "custom-theme";
    Theme["Light"] = "light-theme";
    Theme["Dark"] = "dark-theme";
})(Theme || (Theme = {}));

// Poached from: https://github.com/Steve-Fenton/TypeScriptUtilities
// @dynamic
class Guid {
    static newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

class Group {
    constructor(participants) {
        this.id = Guid.newGuid();
        this.participantType = ChatParticipantType.Group;
        this.chattingTo = participants;
        this.status = ChatParticipantStatus.Online;
        // TODO: Add some customization for this in future releases
        this.displayName = participants.map((p) => p.displayName).sort((first, second) => second > first ? -1 : 1).join(", ");
    }
}

var ScrollDirection;
(function (ScrollDirection) {
    ScrollDirection[ScrollDirection["Top"] = 0] = "Top";
    ScrollDirection[ScrollDirection["Bottom"] = 1] = "Bottom";
})(ScrollDirection || (ScrollDirection = {}));

class DefaultFileUploadAdapter {
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

class NgChat {
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

let emojiDictionary = [
    { patterns: [':)', ':-)', '=)'], unicode: '😃' },
    { patterns: [':D', ':-D', '=D'], unicode: '😀' },
    { patterns: [':(', ':-(', '=('], unicode: '🙁' },
    { patterns: [':|', ':-|', '=|'], unicode: '😐' },
    { patterns: [':*', ':-*', '=*'], unicode: '😙' },
    { patterns: ['T_T', 'T.T'], unicode: '😭' },
    { patterns: [':O', ':-O', '=O', ':o', ':-o', '=o'], unicode: '😮' },
    { patterns: [':P', ':-P', '=P', ':p', ':-p', '=p'], unicode: '😋' },
    { patterns: ['>.<'], unicode: '😣' },
    { patterns: ['@.@'], unicode: '😵' },
    { patterns: ['*.*'], unicode: '😍' },
    { patterns: ['<3'], unicode: '❤️' },
    { patterns: ['^.^'], unicode: '😊' },
    { patterns: [':+1'], unicode: '👍' },
    { patterns: [':-1'], unicode: '👎' }
];
/*
 * Transforms common emoji text to UTF encoded emojis
*/
class EmojifyPipe {
    transform(message, pipeEnabled) {
        if (pipeEnabled && message && message.length > 1) {
            emojiDictionary.forEach(emoji => {
                emoji.patterns.forEach(pattern => {
                    message = message.replace(pattern, emoji.unicode);
                });
            });
        }
        return message;
    }
}
EmojifyPipe.decorators = [
    { type: Pipe, args: [{ name: 'emojify' },] }
];

/*
 * Transforms text containing URLs or E-mails to valid links/mailtos
*/
class LinkfyPipe {
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

/*
 * Sanitizes an URL resource
*/
class SanitizePipe {
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

/*
 * Renders the display name of a participant in a group based on who's sent the message
*/
class GroupMessageDisplayNamePipe {
    transform(participant, message) {
        if (participant && participant.participantType == ChatParticipantType.Group) {
            let group = participant;
            let userIndex = group.chattingTo.findIndex(x => x.id == message.fromId);
            return group.chattingTo[userIndex >= 0 ? userIndex : 0].displayName;
        }
        else
            return "";
    }
}
GroupMessageDisplayNamePipe.decorators = [
    { type: Pipe, args: [{ name: 'groupMessageDisplayName' },] }
];

class NgChatOptionsComponent {
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

class MessageCounter {
    static formatUnreadMessagesTotal(totalUnreadMessages) {
        if (totalUnreadMessages > 0) {
            if (totalUnreadMessages > 99)
                return "99+";
            else
                return String(totalUnreadMessages);
        }
        // Empty fallback.
        return "";
    }
    /**
     * Returns a formatted string containing the total unread messages of a chat window.
     * @param window The window instance to count the unread total messages.
     * @param currentUserId The current chat instance user id. In this context it would be the sender.
     */
    static unreadMessagesTotal(window, currentUserId) {
        let totalUnreadMessages = 0;
        if (window) {
            totalUnreadMessages = window.messages.filter(x => x.fromId != currentUserId && !x.dateSeen).length;
        }
        return MessageCounter.formatUnreadMessagesTotal(totalUnreadMessages);
    }
}

function chatParticipantStatusDescriptor(status, localization) {
    const currentStatus = ChatParticipantStatus[status].toString().toLowerCase();
    return localization.statusDescription[currentStatus];
}

class NgChatFriendsListComponent {
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

class NgChatWindowComponent {
    constructor() {
        this.emojisEnabled = true;
        this.linkfyEnabled = true;
        this.showMessageDate = true;
        this.messageDatePipeFormat = "short";
        this.hasPagedHistory = true;
        this.onChatWindowClosed = new EventEmitter();
        this.onMessagesSeen = new EventEmitter();
        this.onMessageSent = new EventEmitter();
        this.onTabTriggered = new EventEmitter();
        this.onOptionTriggered = new EventEmitter();
        this.onLoadHistoryTriggered = new EventEmitter();
        // File upload state
        this.fileUploadersInUse = []; // Id bucket of uploaders in use
        // Exposes enums and functions for the ng-template
        this.ChatParticipantType = ChatParticipantType;
        this.ChatParticipantStatus = ChatParticipantStatus;
        this.MessageType = MessageType;
        this.chatParticipantStatusDescriptor = chatParticipantStatusDescriptor;
    }
    defaultWindowOptions(currentWindow) {
        if (this.showOptions && currentWindow.participant.participantType == ChatParticipantType.User) {
            return [{
                    isActive: false,
                    chattingTo: currentWindow,
                    validateContext: (participant) => {
                        return participant.participantType == ChatParticipantType.User;
                    },
                    displayLabel: 'Add People' // TODO: Localize this
                }];
        }
        return [];
    }
    // Asserts if a user avatar is visible in a chat cluster
    isAvatarVisible(window, message, index) {
        if (message.fromId != this.userId) {
            if (index == 0) {
                return true; // First message, good to show the thumbnail
            }
            else {
                // Check if the previous message belongs to the same user, if it belongs there is no need to show the avatar again to form the message cluster
                if (window.messages[index - 1].fromId != message.fromId) {
                    return true;
                }
            }
        }
        return false;
    }
    getChatWindowAvatar(participant, message) {
        if (participant.participantType == ChatParticipantType.User) {
            return participant.avatar;
        }
        else if (participant.participantType == ChatParticipantType.Group) {
            let group = participant;
            let userIndex = group.chattingTo.findIndex(x => x.id == message.fromId);
            return group.chattingTo[userIndex >= 0 ? userIndex : 0].avatar;
        }
        return null;
    }
    isUploadingFile(window) {
        const fileUploadInstanceId = this.getUniqueFileUploadInstanceId(window);
        return this.fileUploadersInUse.indexOf(fileUploadInstanceId) > -1;
    }
    // Generates a unique file uploader id for each participant
    getUniqueFileUploadInstanceId(window) {
        if (window && window.participant) {
            return `ng-chat-file-upload-${window.participant.id}`;
        }
        return 'ng-chat-file-upload';
    }
    unreadMessagesTotal(window) {
        return MessageCounter.unreadMessagesTotal(window, this.userId);
    }
    // Scrolls a chat window message flow to the bottom
    scrollChatWindow(window, direction) {
        if (!window.isCollapsed) {
            setTimeout(() => {
                if (this.chatMessages) {
                    let element = this.chatMessages.nativeElement;
                    let position = (direction === ScrollDirection.Top) ? 0 : element.scrollHeight;
                    element.scrollTop = position;
                }
            });
        }
    }
    activeOptionTrackerChange(option) {
        this.onOptionTriggered.emit(option);
    }
    // Triggers native file upload for file selection from the user
    triggerNativeFileUpload(window) {
        if (window) {
            if (this.nativeFileInput)
                this.nativeFileInput.nativeElement.click();
        }
    }
    // Toggles a window focus on the focus/blur of a 'newMessage' input
    toggleWindowFocus(window) {
        window.hasFocus = !window.hasFocus;
        if (window.hasFocus) {
            const unreadMessages = window.messages
                .filter(message => message.dateSeen == null
                && (message.toId == this.userId || window.participant.participantType === ChatParticipantType.Group));
            if (unreadMessages && unreadMessages.length > 0) {
                this.onMessagesSeen.emit(unreadMessages);
            }
        }
    }
    markMessagesAsRead(messages) {
        this.onMessagesSeen.emit(messages);
    }
    fetchMessageHistory(window) {
        this.onLoadHistoryTriggered.emit(window);
    }
    // Closes a chat window via the close 'X' button
    onCloseChatWindow() {
        this.onChatWindowClosed.emit({ closedWindow: this.window, closedViaEscapeKey: false });
    }
    /*  Monitors pressed keys on a chat window
        - Dispatches a message when the ENTER key is pressed
        - Tabs between windows on TAB or SHIFT + TAB
        - Closes the current focused window on ESC
    */
    onChatInputTyped(event, window) {
        switch (event.keyCode) {
            case 13:
                if (window.newMessage && window.newMessage.trim() != "") {
                    let message = new Message();
                    message.fromId = this.userId;
                    message.toId = window.participant.id;
                    message.message = window.newMessage;
                    message.dateSent = new Date();
                    window.messages.push(message);
                    this.onMessageSent.emit(message);
                    window.newMessage = ""; // Resets the new message input
                    this.scrollChatWindow(window, ScrollDirection.Bottom);
                }
                break;
            case 9:
                event.preventDefault();
                this.onTabTriggered.emit({ triggeringWindow: window, shiftKeyPressed: event.shiftKey });
                break;
            case 27:
                this.onChatWindowClosed.emit({ closedWindow: window, closedViaEscapeKey: true });
                break;
        }
    }
    // Toggles a chat window visibility between maximized/minimized
    onChatWindowClicked(window) {
        window.isCollapsed = !window.isCollapsed;
        this.scrollChatWindow(window, ScrollDirection.Bottom);
    }
    clearInUseFileUploader(fileUploadInstanceId) {
        const uploaderInstanceIdIndex = this.fileUploadersInUse.indexOf(fileUploadInstanceId);
        if (uploaderInstanceIdIndex > -1) {
            this.fileUploadersInUse.splice(uploaderInstanceIdIndex, 1);
        }
    }
    // Handles file selection and uploads the selected file using the file upload adapter
    onFileChosen(window) {
        const fileUploadInstanceId = this.getUniqueFileUploadInstanceId(window);
        const uploadElementRef = this.nativeFileInput;
        if (uploadElementRef) {
            const file = uploadElementRef.nativeElement.files[0];
            this.fileUploadersInUse.push(fileUploadInstanceId);
            this.fileUploadAdapter.uploadFile(file, window.participant.id)
                .subscribe(fileMessage => {
                this.clearInUseFileUploader(fileUploadInstanceId);
                fileMessage.fromId = this.userId;
                // Push file message to current user window   
                window.messages.push(fileMessage);
                this.onMessageSent.emit(fileMessage);
                this.scrollChatWindow(window, ScrollDirection.Bottom);
                // Resets the file upload element
                uploadElementRef.nativeElement.value = '';
            }, (error) => {
                this.clearInUseFileUploader(fileUploadInstanceId);
                // Resets the file upload element
                uploadElementRef.nativeElement.value = '';
                // TODO: Invoke a file upload adapter error here
            });
        }
    }
}
NgChatWindowComponent.decorators = [
    { type: Component, args: [{
                selector: 'ng-chat-window',
                template: "<ng-container *ngIf=\"window && window.isCollapsed\">\r\n\t<div class=\"ng-chat-title secondary-background\">\r\n\t\t<div class=\"ng-chat-title-visibility-toggle-area\" (click)=\"onChatWindowClicked(window)\">\r\n\t\t\t<strong title=\"{{window.participant.displayName}}\">\r\n\t\t\t\t{{window.participant.displayName}}\r\n\t\t\t</strong>\r\n\t\t\t<span [ngClass]=\"{'ng-chat-participant-status': true, 'online': window.participant.status == ChatParticipantStatus.Online, 'busy': window.participant.status == ChatParticipantStatus.Busy, 'away': window.participant.status == ChatParticipantStatus.Away, 'offline': window.participant.status == ChatParticipantStatus.Offline}\" title=\"{{chatParticipantStatusDescriptor(window.participant.status, localization)}}\"></span>\r\n\t\t\t<span *ngIf=\"unreadMessagesTotal(window).length > 0\" class=\"ng-chat-unread-messages-count unread-messages-counter-container primary-text\">{{unreadMessagesTotal(window)}}</span>\r\n\t\t</div>\r\n\t\t<a href=\"javascript:void(0);\" class=\"ng-chat-close primary-text\" (click)=\"onCloseChatWindow()\">X</a>\r\n\t</div>\r\n</ng-container>\r\n<ng-container *ngIf=\"window && !window.isCollapsed\">\r\n\t<div class=\"ng-chat-title secondary-background\">\r\n\t\t<div class=\"ng-chat-title-visibility-toggle-area\" (click)=\"onChatWindowClicked(window)\">\r\n\t\t\t<strong title=\"{{window.participant.displayName}}\">\r\n\t\t\t\t{{window.participant.displayName}}\r\n\t\t\t</strong>\r\n\t\t\t<span [ngClass]=\"{'ng-chat-participant-status': true, 'online': window.participant.status == ChatParticipantStatus.Online, 'busy': window.participant.status == ChatParticipantStatus.Busy, 'away': window.participant.status == ChatParticipantStatus.Away, 'offline': window.participant.status == ChatParticipantStatus.Offline}\" title=\"{{chatParticipantStatusDescriptor(window.participant.status, localization)}}\"></span>\r\n\t\t\t<span *ngIf=\"unreadMessagesTotal(window).length > 0\" class=\"ng-chat-unread-messages-count unread-messages-counter-container primary-text\">{{unreadMessagesTotal(window)}}</span>\r\n\t\t</div>\r\n\t\t<a href=\"javascript:void(0);\" class=\"ng-chat-close primary-text\" (click)=\"onCloseChatWindow()\">X</a>\r\n\t\t<ng-chat-options [ngClass]=\"'ng-chat-options-container'\" [options]=\"defaultWindowOptions(window)\" (activeOptionTrackerChange)=\"activeOptionTrackerChange($event)\"></ng-chat-options>\r\n\t</div>\r\n\t<div #chatMessages class=\"ng-chat-messages primary-background\">\r\n\t\t<div *ngIf=\"window.isLoadingHistory\" class=\"ng-chat-loading-wrapper\">\r\n\t\t\t<div class=\"loader\">Loading history...</div>\r\n\t\t</div>\r\n\t\t<div *ngIf=\"hasPagedHistory && window.hasMoreMessages && !window.isLoadingHistory\" class=\"ng-chat-load-history\">\r\n\t\t\t<a class=\"load-history-action\" (click)=\"fetchMessageHistory(window)\">{{localization.loadMessageHistoryPlaceholder}}</a>\r\n\t\t</div>\r\n\r\n\t\t<div *ngFor=\"let message of window.messages; let i = index\" [ngClass]=\"{'ng-chat-message': true, 'ng-chat-message-received': message.fromId != userId}\">\r\n\t\t\t<ng-container *ngIf=\"isAvatarVisible(window, message, i)\">\r\n\t\t\t\t<div *ngIf=\"!getChatWindowAvatar(window.participant, message)\" class=\"icon-wrapper\">\r\n\t\t\t\t\t<i class=\"user-icon\"></i>\r\n\t\t\t\t</div>\r\n\t\t\t\t<img *ngIf=\"getChatWindowAvatar(window.participant, message)\" alt=\"\" class=\"avatar\" height=\"30\" width=\"30\" [src]=\"getChatWindowAvatar(window.participant, message) | sanitize\" />\r\n\t\t\t\t<span *ngIf=\"window.participant.participantType == ChatParticipantType.Group\" class=\"ng-chat-participant-name\">{{window.participant | groupMessageDisplayName:message}}</span>\r\n\t\t\t</ng-container>\r\n\t\t\t<ng-container [ngSwitch]=\"message.type\">\r\n\t\t\t\t<div *ngSwitchCase=\"MessageType.Text\" [ngClass]=\"{'sent-chat-message-container': message.fromId == userId, 'received-chat-message-container': message.fromId != userId}\">\r\n          <span [innerHtml]=\"message.message | emojify:emojisEnabled | linkfy:linkfyEnabled\"></span>\r\n\t\t\t\t\t<span *ngIf=\"showMessageDate && message.dateSent\" class=\"message-sent-date\">{{message.dateSent | date:messageDatePipeFormat}}</span>\r\n\t\t\t\t</div>\r\n        <div *ngSwitchCase=\"MessageType.Image\" [ngClass]=\"{'sent-chat-message-container': message.fromId == userId, 'received-chat-message-container': message.fromId != userId}\">\r\n\r\n          <img src=\"{{message.message}}\" class=\"image-message\" />\r\n\r\n\t\t\t\t\t<span *ngIf=\"showMessageDate && message.dateSent\" class=\"message-sent-date\">{{message.dateSent | date:messageDatePipeFormat}}</span>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div *ngSwitchCase=\"MessageType.File\" [ngClass]=\"{'file-message-container': true, 'received': message.fromId != userId}\">\r\n\t\t\t\t\t<div class=\"file-message-icon-container\">\r\n\t\t\t\t\t\t<i class=\"paperclip-icon\"></i>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<a class=\"file-details\" [attr.href]=\"message.downloadUrl\" target=\"_blank\" rel=\"noopener noreferrer\" (click)=\"this.markMessagesAsRead([message])\" download>\r\n\t\t\t\t\t\t<span class=\"file-message-title\" [attr.title]=\"message.message\">{{message.message}}</span>\r\n\t\t\t\t\t\t<span *ngIf=\"message.fileSizeInBytes\"  class=\"file-message-size\">{{message.fileSizeInBytes}} Bytes</span>\r\n\t\t\t\t\t</a>\r\n\t\t\t\t</div>\r\n\t\t\t</ng-container>\r\n\t\t</div>\r\n\t</div>\r\n\r\n\t<div class=\"ng-chat-footer primary-outline-color primary-background\">\r\n\t\t<input #chatWindowInput\r\n\t\t\ttype=\"text\"\r\n\t\t\t[ngModel]=\"window.newMessage | emojify:emojisEnabled\"\r\n\t\t\t(ngModelChange)=\"window.newMessage=$event\"\r\n\t\t\t[placeholder]=\"localization.messagePlaceholder\"\r\n\t\t\t[ngClass]=\"{'chat-window-input': true, 'has-side-action': fileUploadAdapter}\"\r\n\t\t\t(keydown)=\"onChatInputTyped($event, window)\"\r\n\t\t\t(blur)=\"toggleWindowFocus(window)\"\r\n\t\t\t(focus)=\"toggleWindowFocus(window)\"/>\r\n\r\n\t\t<!-- File Upload -->\r\n\t\t<ng-container *ngIf=\"fileUploadAdapter\">\r\n\t\t\t<a *ngIf=\"!isUploadingFile(window)\" class=\"btn-add-file\" (click)=\"triggerNativeFileUpload(window)\">\r\n\t\t\t\t<i class=\"upload-icon\"></i>\r\n\t\t\t</a>\r\n\t\t\t<input\r\n\t\t\t\ttype=\"file\"\r\n\t\t\t\t#nativeFileInput\r\n\t\t\t\tstyle=\"display: none;\"\r\n\t\t\t\t[attr.id]=\"getUniqueFileUploadInstanceId(window)\"\r\n\t\t\t\t(change)=\"onFileChosen(window)\" />\r\n\t\t\t<div *ngIf=\"isUploadingFile(window)\" class=\"loader\"></div>\r\n\t\t</ng-container>\r\n\t</div>\r\n</ng-container>\r\n",
                encapsulation: ViewEncapsulation.None,
                styles: [".ng-chat-window{right:260px;height:360px;z-index:999;bottom:0;width:300px;position:fixed;border-width:1px;border-style:solid;border-bottom:0;box-shadow:0 4px 8px rgba(0,0,0,.25)}.ng-chat-window-collapsed{height:30px!important}.ng-chat-window .ng-chat-footer{box-sizing:border-box;padding:0;display:block;height:calc(10%);width:100%;border:none;border-top:1px solid transparent;border-color:inherit}.ng-chat-window .ng-chat-footer>input{font-size:.8em;box-sizing:border-box;padding:0 5px;display:block;height:100%;width:100%;border:none}.ng-chat-window .ng-chat-footer>input.has-side-action{width:calc(100% - 30px)}.ng-chat-window .ng-chat-footer .btn-add-file{position:absolute;right:5px;bottom:7px;height:20px;width:20px;cursor:pointer}.ng-chat-window .ng-chat-footer .loader{position:absolute;right:14px;bottom:8px}.ng-chat-window .ng-chat-load-history{height:30px;text-align:center;font-size:.8em}.ng-chat-window .ng-chat-load-history>a{border-radius:15px;cursor:pointer;padding:5px 10px}.ng-chat-window .ng-chat-messages{padding:10px;width:100%;height:calc(90% - 30px);box-sizing:border-box;position:relative;overflow:auto}.ng-chat-window .ng-chat-messages .ng-chat-message{clear:both}.ng-chat-window .ng-chat-messages .ng-chat-message>.icon-wrapper,.ng-chat-window .ng-chat-messages .ng-chat-message>img.avatar{position:absolute;left:10px;border-radius:25px}.ng-chat-window .ng-chat-messages .ng-chat-message .ng-chat-participant-name{display:inline-block;margin-left:40px;padding-bottom:5px;font-weight:700;font-size:.8em;text-overflow:ellipsis;max-width:180px}.ng-chat-window .ng-chat-messages .ng-chat-message>.icon-wrapper{background-color:#bababa;overflow:hidden;width:30px;height:30px;padding:0}.ng-chat-window .ng-chat-messages .ng-chat-message>.icon-wrapper>i{color:#fff;transform:scale(.7)}.ng-chat-window .ng-chat-messages .ng-chat-message .message-sent-date{font-size:.8em;display:block;text-align:right;margin-top:5px}.ng-chat-window .ng-chat-messages .ng-chat-message>div{float:right;width:182px;border-radius:5px;padding:10px;margin-top:0;margin-bottom:5px;font-size:.9em;word-wrap:break-word}.ng-chat-window .ng-chat-messages .ng-chat-message.ng-chat-message-received>div.received-chat-message-container{float:left;margin-left:40px;padding-top:7px;padding-bottom:7px;border-style:solid;border-width:3px;margin-top:0;margin-bottom:5px}.ng-chat-window .ng-chat-messages .ng-chat-message .file-message-container{float:right;width:202px;border-style:solid;border-width:3px;border-radius:5px;overflow:hidden;margin-bottom:5px;display:block;text-decoration:none;font-size:.9em;padding:0;box-sizing:border-box}.ng-chat-window .ng-chat-messages .ng-chat-message .file-message-container.received{float:left;margin-left:40px;width:208px}.ng-chat-window .ng-chat-messages .ng-chat-message .file-message-container>.file-message-icon-container{width:20px;height:35px;padding:10px 5px;float:left}.ng-chat-window .ng-chat-messages .ng-chat-message .file-message-container>.file-message-icon-container i{margin-top:8px}.ng-chat-window .ng-chat-messages .ng-chat-message .file-message-container>.file-details{float:left;padding:10px;width:calc(100% - 60px);color:currentColor;text-decoration:none}.ng-chat-window .ng-chat-messages .ng-chat-message .file-message-container>.file-details:hover{text-decoration:underline}.ng-chat-window .ng-chat-messages .ng-chat-message .file-message-container>.file-details span{display:block;width:100%;text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.ng-chat-window .ng-chat-messages .ng-chat-message .file-message-container>.file-details .file-message-title{font-weight:700}.ng-chat-window .ng-chat-messages .ng-chat-message .file-message-container>.file-details .file-message-size{font-size:.8em;margin-top:5px}.ng-chat-window .image-message{width:100%;height:auto}@media only screen and (max-width:581px){.ng-chat-window{position:static}}"]
            },] }
];
NgChatWindowComponent.ctorParameters = () => [];
NgChatWindowComponent.propDecorators = {
    fileUploadAdapter: [{ type: Input }],
    window: [{ type: Input }],
    userId: [{ type: Input }],
    localization: [{ type: Input }],
    showOptions: [{ type: Input }],
    emojisEnabled: [{ type: Input }],
    linkfyEnabled: [{ type: Input }],
    showMessageDate: [{ type: Input }],
    messageDatePipeFormat: [{ type: Input }],
    hasPagedHistory: [{ type: Input }],
    onChatWindowClosed: [{ type: Output }],
    onMessagesSeen: [{ type: Output }],
    onMessageSent: [{ type: Output }],
    onTabTriggered: [{ type: Output }],
    onOptionTriggered: [{ type: Output }],
    onLoadHistoryTriggered: [{ type: Output }],
    chatMessages: [{ type: ViewChild, args: ['chatMessages',] }],
    nativeFileInput: [{ type: ViewChild, args: ['nativeFileInput',] }],
    chatWindowInput: [{ type: ViewChild, args: ['chatWindowInput',] }]
};

class NgChatModule {
}
NgChatModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, FormsModule, HttpClientModule],
                declarations: [
                    NgChat,
                    EmojifyPipe,
                    LinkfyPipe,
                    SanitizePipe,
                    GroupMessageDisplayNamePipe,
                    NgChatOptionsComponent,
                    NgChatFriendsListComponent,
                    NgChatWindowComponent
                ],
                exports: [NgChat]
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { ChatAdapter, ChatParticipantStatus, ChatParticipantType, Group, Message, MessageType, NgChatModule, PagedHistoryChatAdapter, ParticipantMetadata, ParticipantResponse, Theme, User, Window, NgChat as ɵa, EmojifyPipe as ɵb, LinkfyPipe as ɵc, SanitizePipe as ɵd, GroupMessageDisplayNamePipe as ɵe, NgChatOptionsComponent as ɵf, NgChatFriendsListComponent as ɵg, NgChatWindowComponent as ɵh };
//# sourceMappingURL=ng-chat.js.map
