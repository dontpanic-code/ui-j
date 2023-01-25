import { Pipe } from '@angular/core';
import { ChatParticipantType } from "../core/chat-participant-type.enum";
/*
 * Renders the display name of a participant in a group based on who's sent the message
*/
export class GroupMessageDisplayNamePipe {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXAtbWVzc2FnZS1kaXNwbGF5LW5hbWUucGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL25nLWNoYXQvcGlwZXMvZ3JvdXAtbWVzc2FnZS1kaXNwbGF5LW5hbWUucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUVwRCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUl6RTs7RUFFRTtBQUVGLE1BQU0sT0FBTywyQkFBMkI7SUFDcEMsU0FBUyxDQUFDLFdBQTZCLEVBQUUsT0FBZ0I7UUFDckQsSUFBSSxXQUFXLElBQUksV0FBVyxDQUFDLGVBQWUsSUFBSSxtQkFBbUIsQ0FBQyxLQUFLLEVBQzNFO1lBQ0ksSUFBSSxLQUFLLEdBQUcsV0FBb0IsQ0FBQztZQUNqQyxJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRXhFLE9BQU8sS0FBSyxDQUFDLFVBQVUsQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQztTQUN2RTs7WUFFRyxPQUFPLEVBQUUsQ0FBQztJQUNsQixDQUFDOzs7WUFaSixJQUFJLFNBQUMsRUFBQyxJQUFJLEVBQUUseUJBQXlCLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEdyb3VwIH0gZnJvbSBcIi4uL2NvcmUvZ3JvdXBcIjtcclxuaW1wb3J0IHsgQ2hhdFBhcnRpY2lwYW50VHlwZSB9IGZyb20gXCIuLi9jb3JlL2NoYXQtcGFydGljaXBhbnQtdHlwZS5lbnVtXCI7XHJcbmltcG9ydCB7IElDaGF0UGFydGljaXBhbnQgfSBmcm9tIFwiLi4vY29yZS9jaGF0LXBhcnRpY2lwYW50XCI7XHJcbmltcG9ydCB7IE1lc3NhZ2UgfSBmcm9tIFwiLi4vY29yZS9tZXNzYWdlXCI7XHJcblxyXG4vKlxyXG4gKiBSZW5kZXJzIHRoZSBkaXNwbGF5IG5hbWUgb2YgYSBwYXJ0aWNpcGFudCBpbiBhIGdyb3VwIGJhc2VkIG9uIHdobydzIHNlbnQgdGhlIG1lc3NhZ2VcclxuKi9cclxuQFBpcGUoe25hbWU6ICdncm91cE1lc3NhZ2VEaXNwbGF5TmFtZSd9KVxyXG5leHBvcnQgY2xhc3MgR3JvdXBNZXNzYWdlRGlzcGxheU5hbWVQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XHJcbiAgICB0cmFuc2Zvcm0ocGFydGljaXBhbnQ6IElDaGF0UGFydGljaXBhbnQsIG1lc3NhZ2U6IE1lc3NhZ2UpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmIChwYXJ0aWNpcGFudCAmJiBwYXJ0aWNpcGFudC5wYXJ0aWNpcGFudFR5cGUgPT0gQ2hhdFBhcnRpY2lwYW50VHlwZS5Hcm91cClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBncm91cCA9IHBhcnRpY2lwYW50IGFzIEdyb3VwO1xyXG4gICAgICAgICAgICBsZXQgdXNlckluZGV4ID0gZ3JvdXAuY2hhdHRpbmdUby5maW5kSW5kZXgoeCA9PiB4LmlkID09IG1lc3NhZ2UuZnJvbUlkKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBncm91cC5jaGF0dGluZ1RvW3VzZXJJbmRleCA+PSAwID8gdXNlckluZGV4IDogMF0uZGlzcGxheU5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICB9IFxyXG59XHJcbiJdfQ==