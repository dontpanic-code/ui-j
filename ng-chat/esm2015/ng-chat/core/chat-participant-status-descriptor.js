import { ChatParticipantStatus } from './chat-participant-status.enum';
export function chatParticipantStatusDescriptor(status, localization) {
    const currentStatus = ChatParticipantStatus[status].toString().toLowerCase();
    return localization.statusDescription[currentStatus];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC1wYXJ0aWNpcGFudC1zdGF0dXMtZGVzY3JpcHRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL25nLWNoYXQvY29yZS9jaGF0LXBhcnRpY2lwYW50LXN0YXR1cy1kZXNjcmlwdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBR3ZFLE1BQU0sVUFBVSwrQkFBK0IsQ0FBQyxNQUE2QixFQUFFLFlBQTBCO0lBQ3JHLE1BQU0sYUFBYSxHQUFHLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBRTdFLE9BQU8sWUFBWSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3pELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGF0UGFydGljaXBhbnRTdGF0dXMgfSBmcm9tICcuL2NoYXQtcGFydGljaXBhbnQtc3RhdHVzLmVudW0nO1xyXG5pbXBvcnQgeyBMb2NhbGl6YXRpb24gfSBmcm9tICcuL2xvY2FsaXphdGlvbidcclxuIFxyXG5leHBvcnQgZnVuY3Rpb24gY2hhdFBhcnRpY2lwYW50U3RhdHVzRGVzY3JpcHRvcihzdGF0dXM6IENoYXRQYXJ0aWNpcGFudFN0YXR1cywgbG9jYWxpemF0aW9uOiBMb2NhbGl6YXRpb24pIHtcclxuICAgIGNvbnN0IGN1cnJlbnRTdGF0dXMgPSBDaGF0UGFydGljaXBhbnRTdGF0dXNbc3RhdHVzXS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICBcclxuICAgIHJldHVybiBsb2NhbGl6YXRpb24uc3RhdHVzRGVzY3JpcHRpb25bY3VycmVudFN0YXR1c107XHJcbn0iXX0=