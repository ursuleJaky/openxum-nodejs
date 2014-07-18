'use strict';

exports.init = function(req, res){
	console.log(req.user.username);
	req.app.db.models.User.findOne({ username: req.user.username }, 'username email',  function (err, user) {
		req.app.db.models.Account.findById(req.user.roles.account.id, 'name',  function (err, account) {
			res.render('account/index', {email: user.email, account: account})
      });
	});
};
