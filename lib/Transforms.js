var StyleKeys = require('../lib/StyleKeys');

// TODO: export this, this is no longer used
// was helpful for running transforms outside of react
// now, this is done with props

var Transforms = {};
var WINDOW_WIDTH = window.innerWidth;
var WINDOW_HEIGHT = window.innerHeight;

// This mixin is used with parents
// Collects children that want transformation
// Handles step updates

Transforms.BaseMixin = {
  componentDidMount() {
    this.findTransforms(this.props);
  },

  // componentWillReceiveProps(nextProps) {
  //   this.findTransforms(nextProps);
  // },

  findTransforms(props) {
    var node = this.getDOMNode();
    if (!node) return;

    this._totalTransforms = (
      node.querySelectorAll('[data-transform]').length +
      Number(node.hasAttribute('data-transform'))
    );

    this._getElementsWithTransforms([], node, props.index, nodes => {
      this._transforms = nodes;
      this._doTransforms(0);
    });
  },

  _getElementsWithTransforms(nodes, node, index, cb) {
    if (node.hasAttribute('data-transform')) {
      this._totalTransforms = this._totalTransforms - 1;
      nodeProps = {
        el: node,
        name: node.getAttribute('data-transform')
      };

      var nodeIndex = node.getAttribute('data-transform-index') || index;
      if (typeof nodeIndex !== 'undefined')
        nodeProps.index = +nodeIndex;

      nodes.push(nodeProps);
    }

    if (this._totalTransforms === 0)
      cb(nodes);
    else {
      var children = Array.prototype.slice.call(node.children);
      children.forEach(child => {
        this._getElementsWithTransforms(nodes, child, node.getAttribute('data-transform-index') || index, cb);
      });
    }
  }
};

// This is a simple mixin for transforming an element given a transform event
// Depending on the type of transformer you use can be used by parents
// or children.

Transforms.TransformMixin = {
  _transformElement(transform, step) {
    var transforms = '';
    var { el, index, name } = transform;
    var { scale, rotate, translate, ...styles } = Transforms[name](index, step, el);

    if (defined(scale))
      transforms += `scale(${scale}) `;

    if (defined(rotate))
      transforms += `rotate3d(${rotate.x || 0},${rotate.y || 0},${rotate.z || 0}) `;

    if (defined(translate))
      transforms += `translate3d(${translate.x || 0}px, ${translate.y || 0}px, ${translate.z || 0}px)`;

    if (styles)
      Object.keys(styles).map(key => { el.style[key] = styles[key]; });

    el.style[StyleKeys.TRANSFORM] = transforms;
  }
};

// Transformers combine all the logic into the parent component
// This is good for components where the children don't need to
// react, just be animated, and the parent handles any logic necessary
// as side effects of the animation (sending events, changing state)

Transforms.TransformerMixin = Object.assign({},
  Transforms.BaseMixin,
  Transforms.TransformMixin,
  {
    _doTransforms(step) {
      if (!this._transforms) return;
      this._transforms.forEach(transform => {
        // performance: ensure we are within 1 step before doing animations
        if (transform.index >= step-1 && transform.index <= step+1)
          this._transformElement(transform, step);
      });
    }
  }
);

// The TransformEmitter flips the roles, the parent component just emits
// events with the transform and step, and the child components can run
// the transforms with the TransformReceiver mixin. This is better if you
// want the child components to manage their state.

Transforms.TransformEmitterMixin = Object.assign({},
  Transforms.BaseMixin,
  {
    _doTransforms(step) {
      if (!this._transforms) return;
      this._transforms.forEach(transform => {
        this._emitTransformEvent(transform, step);
      });
    },

    _emitTransformEvent(transform, step) {
      var transformEvent = new CustomEvent('transformed', {
        detail: {
          transform: transform,
          step: step
        }
      });

      transform.el.dispatchEvent(transformEvent);
    }
  }
);


// Mix this in with children of a TransformEmitter parent

Transforms.TransformReceiverMixin = Object.assign({},
  Transforms.TransformMixin,
  {
    componentDidMount() {
      this.getDOMNode().addEventListener('transformed', this._handleTransformed.bind(this));
    },

    componentWillUnmount() {
      this.getDOMNode().removeEventListener('transformed');
    },

    _handleTransformed(e) {
      this._transformElement(e.detail.transform, e.detail.step);

      // If you want to change state, you can add this code in your child:
      // if (this.state.step !== e.step)
      //  this.setState({ step: e.step });

      return false; // stop bubbling
    }
  }
);

function defined(variable) {
  return typeof variable !== 'undefined';
}

// todo: put these functions into Transform.prototype.linearEnter...
// so you can use this.linearEnter()

// Increase strength on enter
//  0 -> 1 (in) -> 1
function linearEnter(step, index) {
  return Math.min(1, step - index + 1);
}

// Decrease strength on exit
//  1 -> 1 (in) -> 0
function linearExit(step, index) {
  return Math.max(0, 1 - (step - index) );
}

// Linear increasing then decreasing strength
//  0 -> 1 (in) -> 0
function symmetrical(step, index) {
  return (step <= index) ?
    linearEnter(step, index) :
    linearExit(step, index);
}

Transforms.VIEW_PARALLAX = function(index, step, el) {
  var width = el.getAttribute('data-width');
  var translateX = (index - step) * width;
  if (index < step) translateX = translateX / 2;

  return {
    translate: { x: translateX },
    'box-shadow': `0 0 15px rgba(0,0,0,${linearEnter(step,index) / 2})`
  };
};

Transforms.VIEW_SIDE_BY_SIDE = function(index, step, el) {
  var width = el.getAttribute('data-width');
  var translateX = (index - step) * width;

  return {
    translate: { x: translateX }
  };
};

Transforms.FADE_LEFT = function(index, step) {
  return {
    translate: { x: - (step - index) * (WINDOW_WIDTH/2.5) },
    opacity: symmetrical(step, index)
  };
};

Transforms.MOVE_TO_RIGHT = function(index, step) {
  return {
    translate: { x: (step - index) * (WINDOW_WIDTH/2.5) }
  };
};

module.exports = Transforms;