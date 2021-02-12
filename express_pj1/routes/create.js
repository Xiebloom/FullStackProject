var express = require('express');
var router = express.Router();


router.post('/ques', function (req, res, next) {

    var id = req.body['iddata'];
    console.log('Page create post id = ' + id);

    var data = {
      title: 'アンケート',
      content: 'ご回答ください',
      id : id,        
    }
    res.render('ques', data);
  });

module.exports = router;
