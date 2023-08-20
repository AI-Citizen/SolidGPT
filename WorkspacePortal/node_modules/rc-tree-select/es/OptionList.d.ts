import * as React from 'react';
import type { RefOptionListProps } from 'rc-select/lib/OptionList';
import type { ScrollTo } from 'rc-tree/lib/interface';
type ReviseRefOptionListProps = Omit<RefOptionListProps, 'scrollTo'> & {
    scrollTo: ScrollTo;
};
declare const RefOptionList: React.ForwardRefExoticComponent<React.RefAttributes<ReviseRefOptionListProps>>;
export default RefOptionList;
