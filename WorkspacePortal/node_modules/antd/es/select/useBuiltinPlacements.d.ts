import type { AlignType, BuildInPlacements } from '@rc-component/trigger';
import type { PopupOverflow } from '../config-provider/context';
export default function useBuiltinPlacements(buildInPlacements?: BuildInPlacements, popupOverflow?: PopupOverflow): Record<string, AlignType>;
