var React = require('react/addons');
var cx = React.addons.classSet;

module.exports = function(name) {
  return {
    className: name,

    componentWillMount() {
      this.classes = {};
      this.setClasses(this.props);
    },

    componentWillReceiveProps(nextProps) {
      this.setClasses(nextProps);
    },

    setClasses() {
      this.classes[name] = {};
      this.classes[name][this.className] = true;

      if (this.props.className)
        this.classes[name][this.props.className] = true;
    },

    getClasses(key) {
      var classSet = this.classes[key || name];

      if (key) {
        classSet = classSet || {};
        classSet[`${this.className}--${key}`] = true;
      }

      return cx(classSet);
    },

    addClass(key, val) {
      // allow shorthand
      if (!val) {
        val = key;
        key = name;
      }

      this.classes[val] = true;
    }
  };
};