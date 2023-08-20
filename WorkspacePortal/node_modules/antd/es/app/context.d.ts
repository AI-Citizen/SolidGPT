import React from 'react';
import type { MessageInstance, ConfigOptions as MessageConfig } from '../message/interface';
import type { NotificationInstance, NotificationConfig } from '../notification/interface';
import type { ModalStaticFunctions } from '../modal/confirm';
export type AppConfig = {
    message?: MessageConfig;
    notification?: NotificationConfig;
};
export declare const AppConfigContext: React.Context<AppConfig>;
type ModalType = Omit<ModalStaticFunctions, 'warn'>;
export interface useAppProps {
    message: MessageInstance;
    notification: NotificationInstance;
    modal: ModalType;
}
declare const AppContext: React.Context<useAppProps>;
export default AppContext;
