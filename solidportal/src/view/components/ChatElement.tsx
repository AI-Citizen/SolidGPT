import { ReactNode } from "react";
import React from 'react';

function ChatElement(props: React.PropsWithChildren<{
    isUser: boolean, 
    avatar: boolean,
    children: ReactNode
}>) {
  const { isUser, avatar, children } = props;
  let classList: string[] = ['chat'];

  if (isUser){
    classList.push('user');
  }
    

  if (!avatar){
    classList.push('no-avatar');
  }
    

  return (
    <div className={classList.join(' ')}>
        {children}
    </div>
  );
}

export default ChatElement;
