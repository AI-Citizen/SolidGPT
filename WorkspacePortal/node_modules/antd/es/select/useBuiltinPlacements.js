const getBuiltInPlacements = popupOverflow => {
  const htmlRegion = popupOverflow === 'scroll' ? 'scroll' : 'visible';
  const sharedConfig = {
    overflow: {
      adjustX: true,
      adjustY: true,
      shiftY: true
    },
    htmlRegion,
    _experimental: {
      dynamicInset: true
    }
  };
  return {
    bottomLeft: Object.assign(Object.assign({}, sharedConfig), {
      points: ['tl', 'bl'],
      offset: [0, 4]
    }),
    bottomRight: Object.assign(Object.assign({}, sharedConfig), {
      points: ['tr', 'br'],
      offset: [0, 4]
    }),
    topLeft: Object.assign(Object.assign({}, sharedConfig), {
      points: ['bl', 'tl'],
      offset: [0, -4]
    }),
    topRight: Object.assign(Object.assign({}, sharedConfig), {
      points: ['br', 'tr'],
      offset: [0, -4]
    })
  };
};
export default function useBuiltinPlacements(buildInPlacements, popupOverflow) {
  return buildInPlacements || getBuiltInPlacements(popupOverflow);
}