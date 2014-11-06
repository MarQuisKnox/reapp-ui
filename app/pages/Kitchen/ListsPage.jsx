var React = require('react');
var DrawerView = require('ui/views/DrawerView');
var TitleBar = require('ui/components/TitleBar');
var BackButton = require('ui/components/buttons/BackButton');
var Block = require('ui/components/Block');
var List = require('ui/components/List');
var Icon = require('ui/components/Icon');
var Badge = require('ui/components/Badge');
var ListTitle = require('ui/components/ListTitle');
var ListItem = require('ui/components/ListItem');
var { Link } = require('react-router');

var AnimatableContainer = require('ui/helpers/AnimatableContainer');
var FrostedGlassContainer = require('ui/helpers/FrostedGlassContainer');
var HEADER_HEIGHT = 44;

module.exports = React.createClass({
  getInitialState() {
    return { scrollTop: 0 };
  },

  render() {
    var icon = <Icon type="contact" size="28" />;
    var badge = <Badge value="5" />;
    var title = [<BackButton />, 'Lists'];

    // TODO: we can make this positioning significantly less lame
    // by measuring the DOM but I'm not sure we want to rely on that
    // staying up-to-date, so for now make it explicit.
    var maxHeight = document.body.clientHeight - HEADER_HEIGHT;

    var overlays = {
      header: {
        left: 0,
        top: 0,
        width: '100%',
        height: HEADER_HEIGHT,
        style: {borderBottom: '1px solid rgba(10, 10, 10, 0.1)'},
        children: <TitleBar>Frosted glass overlay</TitleBar>
      }
    };

    var contentBox = {
      left: 0,
      top: HEADER_HEIGHT - 1,
      width: '100%',
      height: maxHeight - HEADER_HEIGHT + 1,
      style: {backgroundColor: '#fcfcfc'}
    };

    var content = (
      <div>
        <Block>
          <p>ListViewPage View</p>
        </Block>

        <ListTitle>List with Icons</ListTitle>
        <List>
          <ListItem before={icon} after="Whatup">Nate Wienert</ListItem>
          <ListItem before={icon} after={badge}>Nate Wienert</ListItem>
          <ListItem before={icon} after={icon}>Nate Wienert</ListItem>
        </List>

        <ListTitle>List with Links</ListTitle>
        <List>
          <Link to="modals">Modals</Link>
          <Link to="popovers">Popovers</Link>
          <Link to="tabs">Tabs</Link>
        </List>

        <ListTitle>Grouped with Sticky Titles</ListTitle>
        <List title="A">
          {['Adam', 'Alex', 'Annabel']}
        </List>
        <List title="B">
          {['Blair', 'Brenda', 'Byron']}
        </List>
        <List title="C">
          {['Clay', 'Cody', 'Crawford']}
        </List>

        <ListTitle>Inset</ListTitle>
        <List type="inset">
          <Link to="modals">Modals</Link>
          <Link to="popovers">Popovers</Link>
          <Link to="tabs">Tabs</Link>
        </List>

        <ListTitle>Media List</ListTitle>
        <List itemType="media">
          <ListItem before={icon} title="Media Item">
            Lorem ipsum dolor sit amet I don't remember any more.
          </ListItem>
        </List>
      </div>
    );

    return (
      <DrawerView id="ListViewPage">
        <FrostedGlassContainer
          className="GlassPage-container"
          style={{height: maxHeight}}
          overlays={overlays}
          content={contentBox}>
          <AnimatableContainer translate={{y: -this.state.scrollTop}} ref="content">
            {content}
          </AnimatableContainer>
        </FrostedGlassContainer>
      </DrawerView>
    );
  }
});