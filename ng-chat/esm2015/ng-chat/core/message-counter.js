export class MessageCounter {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS1jb3VudGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbmctY2hhdC9jb3JlL21lc3NhZ2UtY291bnRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxNQUFNLE9BQU8sY0FBYztJQUVoQixNQUFNLENBQUMseUJBQXlCLENBQUMsbUJBQTJCO1FBRS9ELElBQUksbUJBQW1CLEdBQUcsQ0FBQyxFQUFDO1lBRXhCLElBQUksbUJBQW1CLEdBQUcsRUFBRTtnQkFDeEIsT0FBUSxLQUFLLENBQUM7O2dCQUVkLE9BQU8sTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUM7U0FDMUM7UUFFRCxrQkFBa0I7UUFDbEIsT0FBTyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxNQUFjLEVBQUUsYUFBa0I7UUFFaEUsSUFBSSxtQkFBbUIsR0FBRyxDQUFDLENBQUM7UUFFNUIsSUFBSSxNQUFNLEVBQUM7WUFDUCxtQkFBbUIsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksYUFBYSxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQztTQUN0RztRQUVELE9BQU8sY0FBYyxDQUFDLHlCQUF5QixDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDekUsQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgV2luZG93IH0gZnJvbSAnLi93aW5kb3cnO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VDb3VudGVyXHJcbntcclxuICAgIHB1YmxpYyBzdGF0aWMgZm9ybWF0VW5yZWFkTWVzc2FnZXNUb3RhbCh0b3RhbFVucmVhZE1lc3NhZ2VzOiBudW1iZXIpOiBzdHJpbmdcclxuICAgIHtcclxuICAgICAgICBpZiAodG90YWxVbnJlYWRNZXNzYWdlcyA+IDApe1xyXG5cclxuICAgICAgICAgICAgaWYgKHRvdGFsVW5yZWFkTWVzc2FnZXMgPiA5OSkgXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gIFwiOTkrXCI7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcodG90YWxVbnJlYWRNZXNzYWdlcyk7IFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRW1wdHkgZmFsbGJhY2suXHJcbiAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgZm9ybWF0dGVkIHN0cmluZyBjb250YWluaW5nIHRoZSB0b3RhbCB1bnJlYWQgbWVzc2FnZXMgb2YgYSBjaGF0IHdpbmRvdy5cclxuICAgICAqIEBwYXJhbSB3aW5kb3cgVGhlIHdpbmRvdyBpbnN0YW5jZSB0byBjb3VudCB0aGUgdW5yZWFkIHRvdGFsIG1lc3NhZ2VzLlxyXG4gICAgICogQHBhcmFtIGN1cnJlbnRVc2VySWQgVGhlIGN1cnJlbnQgY2hhdCBpbnN0YW5jZSB1c2VyIGlkLiBJbiB0aGlzIGNvbnRleHQgaXQgd291bGQgYmUgdGhlIHNlbmRlci5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB1bnJlYWRNZXNzYWdlc1RvdGFsKHdpbmRvdzogV2luZG93LCBjdXJyZW50VXNlcklkOiBhbnkpOiBzdHJpbmdcclxuICAgIHtcclxuICAgICAgICBsZXQgdG90YWxVbnJlYWRNZXNzYWdlcyA9IDA7XHJcblxyXG4gICAgICAgIGlmICh3aW5kb3cpe1xyXG4gICAgICAgICAgICB0b3RhbFVucmVhZE1lc3NhZ2VzID0gd2luZG93Lm1lc3NhZ2VzLmZpbHRlcih4ID0+IHguZnJvbUlkICE9IGN1cnJlbnRVc2VySWQgJiYgIXguZGF0ZVNlZW4pLmxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIHJldHVybiBNZXNzYWdlQ291bnRlci5mb3JtYXRVbnJlYWRNZXNzYWdlc1RvdGFsKHRvdGFsVW5yZWFkTWVzc2FnZXMpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==