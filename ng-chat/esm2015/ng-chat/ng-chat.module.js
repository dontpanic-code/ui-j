import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgChat } from './ng-chat.component';
import { EmojifyPipe } from './pipes/emojify.pipe';
import { LinkfyPipe } from './pipes/linkfy.pipe';
import { SanitizePipe } from './pipes/sanitize.pipe';
import { GroupMessageDisplayNamePipe } from './pipes/group-message-display-name.pipe';
import { NgChatOptionsComponent } from './components/ng-chat-options/ng-chat-options.component';
import { NgChatFriendsListComponent } from './components/ng-chat-friends-list/ng-chat-friends-list.component';
import { NgChatWindowComponent } from './components/ng-chat-window/ng-chat-window.component';
export class NgChatModule {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctY2hhdC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9uZy1jaGF0L25nLWNoYXQubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUV4RCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDN0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNqRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDckQsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFDdEYsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sd0RBQXdELENBQUM7QUFDaEcsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sa0VBQWtFLENBQUM7QUFDOUcsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFnQjdGLE1BQU0sT0FBTyxZQUFZOzs7WUFkeEIsUUFBUSxTQUFDO2dCQUNSLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLENBQUM7Z0JBQ3RELFlBQVksRUFBRTtvQkFDWixNQUFNO29CQUNOLFdBQVc7b0JBQ1gsVUFBVTtvQkFDVixZQUFZO29CQUNaLDJCQUEyQjtvQkFDM0Isc0JBQXNCO29CQUN0QiwwQkFBMEI7b0JBQzFCLHFCQUFxQjtpQkFDdEI7Z0JBQ0QsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDO2FBQ2xCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcblxyXG5pbXBvcnQgeyBOZ0NoYXQgfSBmcm9tICcuL25nLWNoYXQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgRW1vamlmeVBpcGUgfSBmcm9tICcuL3BpcGVzL2Vtb2ppZnkucGlwZSc7XHJcbmltcG9ydCB7IExpbmtmeVBpcGUgfSBmcm9tICcuL3BpcGVzL2xpbmtmeS5waXBlJztcclxuaW1wb3J0IHsgU2FuaXRpemVQaXBlIH0gZnJvbSAnLi9waXBlcy9zYW5pdGl6ZS5waXBlJztcclxuaW1wb3J0IHsgR3JvdXBNZXNzYWdlRGlzcGxheU5hbWVQaXBlIH0gZnJvbSAnLi9waXBlcy9ncm91cC1tZXNzYWdlLWRpc3BsYXktbmFtZS5waXBlJztcclxuaW1wb3J0IHsgTmdDaGF0T3B0aW9uc0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9uZy1jaGF0LW9wdGlvbnMvbmctY2hhdC1vcHRpb25zLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IE5nQ2hhdEZyaWVuZHNMaXN0Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL25nLWNoYXQtZnJpZW5kcy1saXN0L25nLWNoYXQtZnJpZW5kcy1saXN0LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IE5nQ2hhdFdpbmRvd0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9uZy1jaGF0LXdpbmRvdy9uZy1jaGF0LXdpbmRvdy5jb21wb25lbnQnO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBGb3Jtc01vZHVsZSwgSHR0cENsaWVudE1vZHVsZV0sXHJcbiAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICBOZ0NoYXQsIFxyXG4gICAgRW1vamlmeVBpcGUsIFxyXG4gICAgTGlua2Z5UGlwZSwgXHJcbiAgICBTYW5pdGl6ZVBpcGUsIFxyXG4gICAgR3JvdXBNZXNzYWdlRGlzcGxheU5hbWVQaXBlLCBcclxuICAgIE5nQ2hhdE9wdGlvbnNDb21wb25lbnQsIFxyXG4gICAgTmdDaGF0RnJpZW5kc0xpc3RDb21wb25lbnQsIFxyXG4gICAgTmdDaGF0V2luZG93Q29tcG9uZW50XHJcbiAgXSxcclxuICBleHBvcnRzOiBbTmdDaGF0XVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmdDaGF0TW9kdWxlIHtcclxufVxyXG4iXX0=