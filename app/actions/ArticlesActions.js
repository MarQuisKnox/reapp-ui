var Actions = require('./Actions');
var API = require('./API');
var Reducer = require('./Reducer');
var { Promise } = require('when');
var ArticlesStore = require('stores/ArticlesStore');
var HotArticlesStore = require('stores/HotArticlesStore');
var Immutable = require('immutable');

var page = 0;
var per = 10;

Actions.articlesHotLoad.listen(
  (opts) => API.get('topstories.json', opts)
    .then(res => HotArticlesStore(res) && res)
    .then(getArticles)
    .then(Reducer)
    .then(ArticlesStore, error)
);

Actions.articlesHotRefresh.listen(
  () => Actions.articlesHotLoad({ nocache: true })
);

Actions.articlesHotLoadMore.listen(
  () =>  API.get('topstories.json')
    .then(getNextArticles)
    .then(Reducer)
    .then(nextArticles => {
      ArticlesStore().withMutations(articles => {
        Object.keys(nextArticles).map(key => {
          articles.set(key, Immutable.fromJS(nextArticles[key]));
        });
      });
    })
);

Actions.articleLoad.listen(
  id => API.get(`item/${id}.json`)
    .then(getAllKids)
    .then(
      res => {
        ArticlesStore().withMutations(articles => {
          articles.set(id, Immutable.fromJS(Reducer('LOADED', res)[id]));
        });
      },
      error
    )
);

function cacheArticles(list) {
  articles = list;
}

function getNextArticles(articles) {
  page = page + 1;
  return getArticles(articles);
}

function getArticles(articles) {
  var start = page * per;
  return Promise.all(
    articles.slice(start, start + per).map(article => {
      return typeof article == 'object' ? article : API.get(`item/${article}.json`);
    })
  );
}

function getAllKids(item) {
  item.closed = false;

  if (!item.kids)
    return new Promise(res => res(item));

  return Promise.all(
    item.kids.map(item =>
      API.get(`item/${item}.json`).then(res => getAllKids(res)))
  )
  .then(res => {
    item.kids = res;
    item.kidsLoaded = true;
    return item;
  });
}

function error(err) {
  throw err;
}