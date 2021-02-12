var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', 
  { 
    title: 'Data Collection System',
    content: 'Welcome to this system',
  });
});

router.post('/', function (req, res, next) {

  var thing = req.body['thing'];
  var Q2 = req.body['Q2']
  var data = {
    title: thing,
    content: Q2 + 'が選択された',

  }
  res.render('index', data);
});
// router.post('/hello/select', function(req, res, next){  //url
//   var data={
//     title : 'Research Results',
//   }
//   res.render('select',data);  //file name
// })

module.exports = router;
