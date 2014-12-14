module.exports = (c) => ({
  self: {
    height: c.scrollBarHeight,
    background: '#c9c9ce',
    padding: '0 8px',
    margin: `0 -${c.viewPad}`,
    borderBottom: '1px solid #b4b4b4',
    alignItems: 'center'
  },

  inner: {
    width: '100%',
    height: 28,
    flexShink: 1,
    margin: '7px 0'
  },

  input: {
    border: 'none',
    width: '100%',
    height: '100%',
    display: 'block',
    appearance: 'none',
    borderRadius: 5,
    fontSize: '14px',
    fontWeight: 400,
    padding: '0 28px'
  }
});