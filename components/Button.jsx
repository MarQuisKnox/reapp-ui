var React = require('react/addons');
var Component = require('../component');
var Icon = require('./Icon');
var clone = require('../lib/niceClone');
var Tappable = require('../mixins/Tappable');

module.exports = Component({
  name: 'Button',

  mixins: [
    React.addons.PureRenderMixin,
    Tappable
  ],

  propTypes: {
    iconProps: React.PropTypes.object,
    icon: React.PropTypes.element,
    chromeless: React.PropTypes.bool,
    rounded: React.PropTypes.bool,
    active: React.PropTypes.bool
  },

  render() {
    var {
      iconProps,
      icon,
      children,
      chromeless,
      rounded,
      active,
      isInTitleBar,
      animationState,
      ...props } = this.props;

    var cloneProps = Object.assign({}, iconProps || {}, {
      isInTitleBar,
      animationState
    });

    if (icon)
      icon = clone(icon, cloneProps, true);

    if (isInTitleBar)
      this.addStyles('isInTitleBar');

    if (chromeless)
      this.addStyles('chromeless');

    if (rounded)
      this.addStyles('rounded');

    if (active)
      this.addStyles('active');

    return (
      <button {...this.componentProps()} {...this.tappableProps()} {...props}>
        {icon || !!iconProps && <Icon {...cloneProps} />}
        {children && (
          <span {...this.componentProps('inner')}>
            {children}
          </span>
        )}
      </button>
    );
  }
});