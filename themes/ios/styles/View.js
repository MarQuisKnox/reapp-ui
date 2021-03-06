module.exports = (c) => ({
  self: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    WebkitOverflowScrolling: 'touch',
    WebkitBackfaceVisibility: 'hidden',
    WebkitTransform: 'translateZ(0)',
    zIndex: 2
  },

  inactive: {
    pointerEvents: 'none'
  },

  inner: {
    background: c.viewBG,
    padding: `0 ${c.viewPad}`,
    zIndex: 1,
    position: 'absolute',
    overflowX: 'hidden',
    overflowY: 'scroll',
    WebkitOverflowScrolling: 'touch',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    WebkitBackfaceVisibility: 'hidden'
  },

  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    background: '#000',
    pointerEvents: 'none'
  }
});