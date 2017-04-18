var articleCounter = 1;

function ArticleProvider(){};
ArticleProvider.prototype = {
  dummyData : [],
  findAll : function(callback) {
    callback( null, this.dummyData )
  },
  findById : function(id, callback) {
    var result = null;
    for(var i =0;i<this.dummyData.length;i++) {
      if( this.dummyData[i]._id == id ) {
        result = this.dummyData[i];
        break;
      }
    }
    callback(null, result);
  },
  delete : function(id, callback) {
     var result = null;
    for(var i =0;i<this.dummyData.length;i++) {
      if( this.dummyData[i]._id == id ) {
        this.dummyData.splice(i, 1);
        break;
      }
    }
    callback(null);
  },
  save : function(articles, callback) {
    var article = null;
    console.log(articles);
    if( typeof(articles.length)=="undefined") {
        if(articles.id != "NEW") {
          this.findById(articles.id, function(err, oldArt) {
            if(oldArt) {
                 oldArt.title = articles.title;
                 oldArt.body = articles.body;
            }
            callback(null, oldArt);
          });
          return;
        }
        articles._id = null;
        articles = [articles];
    }

    for( var i =0;i< articles.length;i++ ) {
      article = articles[i];
      article._id = articleCounter++;
      article.created_at = new Date();

      if( article.comments === undefined )
        article.comments = [];

      for(var j =0;j< article.comments.length; j++) {
        article.comments[j].created_at = new Date();
      }
      this.dummyData[this.dummyData.length]= article;
    }
    callback(null, articles);
  }
}

/* Lets bootstrap with dummy data */

// ap.save([
//    { title: 'Post one', body: 'Body one', comments:[{author:'Bob', comment:'I love it'}, {author:'Dave', comment:'This is rubbish!'}]},
//   { title: 'Post two', body: 'Body two'},
//   { title: 'Post three', body: 'Body three'}
// ], function(error, articles){});

exports.ArticleProvider = new ArticleProvider();