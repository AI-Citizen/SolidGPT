import type { Direction, StickyOffsets } from '../interface';
/**
 * Get sticky column offset width
 */
declare function useStickyOffsets(colWidths: number[], columnCount: number, direction: Direction): StickyOffsets;
export default useStickyOffsets;
