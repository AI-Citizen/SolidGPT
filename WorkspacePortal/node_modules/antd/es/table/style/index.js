import { TinyColor } from '@ctrl/tinycolor';
import { clearFix, resetComponent } from '../../style';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import genBorderedStyle from './bordered';
import genEllipsisStyle from './ellipsis';
import genEmptyStyle from './empty';
import genExpandStyle from './expand';
import genFilterStyle from './filter';
import genFixedStyle from './fixed';
import genPaginationStyle from './pagination';
import genRadiusStyle from './radius';
import genRtlStyle from './rtl';
import genSelectionStyle from './selection';
import genSizeStyle from './size';
import genSorterStyle from './sorter';
import genStickyStyle from './sticky';
import genSummaryStyle from './summary';
const genTableStyle = token => {
  const {
    componentCls,
    fontWeightStrong,
    tablePaddingVertical,
    tablePaddingHorizontal,
    lineWidth,
    lineType,
    tableBorderColor,
    tableFontSize,
    tableBg,
    tableRadius,
    tableHeaderTextColor,
    motionDurationMid,
    tableHeaderBg,
    tableHeaderCellSplitColor,
    tableRowHoverBg,
    tableSelectedRowBg,
    tableSelectedRowHoverBg,
    tableFooterTextColor,
    tableFooterBg,
    paddingContentVerticalLG
  } = token;
  const tableBorder = `${lineWidth}px ${lineType} ${tableBorderColor}`;
  return {
    [`${componentCls}-wrapper`]: Object.assign(Object.assign({
      clear: 'both',
      maxWidth: '100%'
    }, clearFix()), {
      [componentCls]: Object.assign(Object.assign({}, resetComponent(token)), {
        fontSize: tableFontSize,
        background: tableBg,
        borderRadius: `${tableRadius}px ${tableRadius}px 0 0`
      }),
      // https://github.com/ant-design/ant-design/issues/17611
      table: {
        width: '100%',
        textAlign: 'start',
        borderRadius: `${tableRadius}px ${tableRadius}px 0 0`,
        borderCollapse: 'separate',
        borderSpacing: 0
      },
      // ============================= Cell =============================
      [`
          ${componentCls}-thead > tr > th,
          ${componentCls}-tbody > tr > th,
          ${componentCls}-tbody > tr > td,
          tfoot > tr > th,
          tfoot > tr > td
        `]: {
        position: 'relative',
        padding: `${paddingContentVerticalLG}px ${tablePaddingHorizontal}px`,
        overflowWrap: 'break-word'
      },
      // ============================ Title =============================
      [`${componentCls}-title`]: {
        padding: `${tablePaddingVertical}px ${tablePaddingHorizontal}px`
      },
      // ============================ Header ============================
      [`${componentCls}-thead`]: {
        [`
          > tr > th,
          > tr > td
        `]: {
          position: 'relative',
          color: tableHeaderTextColor,
          fontWeight: fontWeightStrong,
          textAlign: 'start',
          background: tableHeaderBg,
          borderBottom: tableBorder,
          transition: `background ${motionDurationMid} ease`,
          "&[colspan]:not([colspan='1'])": {
            textAlign: 'center'
          },
          [`&:not(:last-child):not(${componentCls}-selection-column):not(${componentCls}-row-expand-icon-cell):not([colspan])::before`]: {
            position: 'absolute',
            top: '50%',
            insetInlineEnd: 0,
            width: 1,
            height: '1.6em',
            backgroundColor: tableHeaderCellSplitColor,
            transform: 'translateY(-50%)',
            transition: `background-color ${motionDurationMid}`,
            content: '""'
          }
        },
        '> tr:not(:last-child) > th[colspan]': {
          borderBottom: 0
        }
      },
      // ============================ Body ============================
      [`${componentCls}-tbody`]: {
        '> tr': {
          [`> th, > td`]: {
            transition: `background ${motionDurationMid}, border-color ${motionDurationMid}`,
            borderBottom: tableBorder,
            // ========================= Nest Table ===========================
            [`
              > ${componentCls}-wrapper:only-child,
              > ${componentCls}-expanded-row-fixed > ${componentCls}-wrapper:only-child
            `]: {
              [componentCls]: {
                marginBlock: `-${tablePaddingVertical}px`,
                marginInline: `${token.tableExpandColumnWidth - tablePaddingHorizontal}px -${tablePaddingHorizontal}px`,
                [`${componentCls}-tbody > tr:last-child > td`]: {
                  borderBottom: 0,
                  '&:first-child, &:last-child': {
                    borderRadius: 0
                  }
                }
              }
            }
          },
          '> th': {
            position: 'relative',
            color: tableHeaderTextColor,
            fontWeight: fontWeightStrong,
            textAlign: 'start',
            background: tableHeaderBg,
            borderBottom: tableBorder,
            transition: `background ${motionDurationMid} ease`
          },
          [`
            &${componentCls}-row:hover > th,
            &${componentCls}-row:hover > td,
            > th${componentCls}-cell-row-hover,
            > td${componentCls}-cell-row-hover
          `]: {
            background: tableRowHoverBg
          },
          [`&${componentCls}-row-selected`]: {
            [`> th, > td`]: {
              background: tableSelectedRowBg
            },
            [`&:hover > th, &:hover > td`]: {
              background: tableSelectedRowHoverBg
            }
          }
        }
      },
      // ============================ Footer ============================
      [`${componentCls}-footer`]: {
        padding: `${tablePaddingVertical}px ${tablePaddingHorizontal}px`,
        color: tableFooterTextColor,
        background: tableFooterBg
      }
    })
  };
};
// ============================== Export ==============================
export default genComponentStyleHook('Table', token => {
  const {
    controlItemBgActive,
    controlItemBgActiveHover,
    colorTextPlaceholder,
    colorTextHeading,
    colorSplit,
    colorBorderSecondary,
    fontSize,
    padding,
    paddingXS,
    paddingSM,
    controlHeight,
    colorFillAlter,
    colorIcon,
    colorIconHover,
    opacityLoading,
    colorBgContainer,
    borderRadiusLG,
    colorFillContent,
    colorFillSecondary,
    controlInteractiveSize: checkboxSize
  } = token;
  const baseColorAction = new TinyColor(colorIcon);
  const baseColorActionHover = new TinyColor(colorIconHover);
  const tableSelectedRowBg = controlItemBgActive;
  const zIndexTableFixed = 2;
  const colorFillSecondarySolid = new TinyColor(colorFillSecondary).onBackground(colorBgContainer).toHexShortString();
  const colorFillContentSolid = new TinyColor(colorFillContent).onBackground(colorBgContainer).toHexShortString();
  const colorFillAlterSolid = new TinyColor(colorFillAlter).onBackground(colorBgContainer).toHexShortString();
  const tableToken = mergeToken(token, {
    tableFontSize: fontSize,
    tableBg: colorBgContainer,
    tableRadius: borderRadiusLG,
    tablePaddingVertical: padding,
    tablePaddingHorizontal: padding,
    tablePaddingVerticalMiddle: paddingSM,
    tablePaddingHorizontalMiddle: paddingXS,
    tablePaddingVerticalSmall: paddingXS,
    tablePaddingHorizontalSmall: paddingXS,
    tableBorderColor: colorBorderSecondary,
    tableHeaderTextColor: colorTextHeading,
    tableHeaderBg: colorFillAlterSolid,
    tableFooterTextColor: colorTextHeading,
    tableFooterBg: colorFillAlterSolid,
    tableHeaderCellSplitColor: colorBorderSecondary,
    tableHeaderSortBg: colorFillSecondarySolid,
    tableHeaderSortHoverBg: colorFillContentSolid,
    tableHeaderIconColor: baseColorAction.clone().setAlpha(baseColorAction.getAlpha() * opacityLoading).toRgbString(),
    tableHeaderIconColorHover: baseColorActionHover.clone().setAlpha(baseColorActionHover.getAlpha() * opacityLoading).toRgbString(),
    tableBodySortBg: colorFillAlterSolid,
    tableFixedHeaderSortActiveBg: colorFillSecondarySolid,
    tableHeaderFilterActiveBg: colorFillContent,
    tableFilterDropdownBg: colorBgContainer,
    tableRowHoverBg: colorFillAlterSolid,
    tableSelectedRowBg,
    tableSelectedRowHoverBg: controlItemBgActiveHover,
    zIndexTableFixed,
    zIndexTableSticky: zIndexTableFixed + 1,
    tableFontSizeMiddle: fontSize,
    tableFontSizeSmall: fontSize,
    tableSelectionColumnWidth: controlHeight,
    tableExpandIconBg: colorBgContainer,
    tableExpandColumnWidth: checkboxSize + 2 * token.padding,
    tableExpandedRowBg: colorFillAlter,
    // Dropdown
    tableFilterDropdownWidth: 120,
    tableFilterDropdownHeight: 264,
    tableFilterDropdownSearchWidth: 140,
    // Virtual Scroll Bar
    tableScrollThumbSize: 8,
    tableScrollThumbBg: colorTextPlaceholder,
    tableScrollThumbBgHover: colorTextHeading,
    tableScrollBg: colorSplit
  });
  return [genTableStyle(tableToken), genPaginationStyle(tableToken), genSummaryStyle(tableToken), genSorterStyle(tableToken), genFilterStyle(tableToken), genBorderedStyle(tableToken), genRadiusStyle(tableToken), genExpandStyle(tableToken), genSummaryStyle(tableToken), genEmptyStyle(tableToken), genSelectionStyle(tableToken), genFixedStyle(tableToken), genStickyStyle(tableToken), genEllipsisStyle(tableToken), genSizeStyle(tableToken), genRtlStyle(tableToken)];
});