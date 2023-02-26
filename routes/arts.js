var express = require('express');
var router = express.Router();
var articleProvider = require('../articleprovider-memory').ArticleProvider;
const auth = require("../middlewares/auth");

router.get('/', function(req, res, next) {
	articleProvider.findAll( function(error,docs){
		res.render('arts', { title: 'Article List', docs : docs, session:req.session});
		// res.send(docs);
	})
});
router.get('/detail/:id', function(req, res, next) {
	articleProvider.findById(req.params.id, function(error,art){
		res.render('arts/detail', {art: art});
	})
});
router.get('/edit/:id', auth,  function(req, res, next) {
	articleProvider.findById(req.params.id, function(error,art){
		res.render('arts/edit', {art: art});
	})
});
router.get('/new', auth, function(req, res, next) {
	res.render('arts/edit', {art: {_id : 'NEW'}});
});
router.get('/delete/:id', auth, function(req, res, next) {
	articleProvider.delete(req.params.id, function( error, docs) {
        res.redirect('/arts')
    });
});
router.post('/save/:id', auth, function(req, res, next) {
	articleProvider.save({
		id : req.body.id,
        title: req.body.title,
        body: req.body.body
    }, function( error, docs) {
        res.redirect('/arts')
    });
});

module.exports = router;
