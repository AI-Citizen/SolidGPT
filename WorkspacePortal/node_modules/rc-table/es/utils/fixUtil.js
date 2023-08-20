export function getCellFixedInfo(colStart, colEnd, columns, stickyOffsets, direction, curColumns) {
  var startColumn = columns[colStart] || {};
  var endColumn = columns[colEnd] || {};
  var fixLeft;
  var fixRight;
  if (startColumn.fixed === 'left') {
    fixLeft = stickyOffsets.left[direction === 'rtl' ? colEnd : colStart];
  } else if (endColumn.fixed === 'right') {
    fixRight = stickyOffsets.right[direction === 'rtl' ? colStart : colEnd];
  }
  var lastFixLeft = false;
  var firstFixRight = false;
  var lastFixRight = false;
  var firstFixLeft = false;
  var nextColumn = columns[colEnd + 1];
  var prevColumn = columns[colStart - 1];

  // no children only
  var canLastFix = !(curColumns !== null && curColumns !== void 0 && curColumns.children);
  if (direction === 'rtl') {
    if (fixLeft !== undefined) {
      var prevFixLeft = prevColumn && prevColumn.fixed === 'left';
      firstFixLeft = !prevFixLeft && canLastFix;
    } else if (fixRight !== undefined) {
      var nextFixRight = nextColumn && nextColumn.fixed === 'right';
      lastFixRight = !nextFixRight && canLastFix;
    }
  } else if (fixLeft !== undefined) {
    var nextFixLeft = nextColumn && nextColumn.fixed === 'left';
    lastFixLeft = !nextFixLeft && canLastFix;
  } else if (fixRight !== undefined) {
    var prevFixRight = prevColumn && prevColumn.fixed === 'right';
    firstFixRight = !prevFixRight && canLastFix;
  }
  return {
    fixLeft: fixLeft,
    fixRight: fixRight,
    lastFixLeft: lastFixLeft,
    firstFixRight: firstFixRight,
    lastFixRight: lastFixRight,
    firstFixLeft: firstFixLeft,
    isSticky: stickyOffsets.isSticky
  };
}