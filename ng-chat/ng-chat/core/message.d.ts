import { MessageType } from './message-type.enum';
export declare class Message {
    type?: MessageType;
    fromId: any;
    fromUserId: any;
    toId: any;
    message: string;
    dateSent?: Date;
    dateSeen?: Date;
}
