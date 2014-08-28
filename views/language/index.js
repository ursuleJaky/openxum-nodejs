'use strict';

exports.init = function(req, res){
    res.cookie('locale', req.param('lg'));
    res.redirect('back');
};
