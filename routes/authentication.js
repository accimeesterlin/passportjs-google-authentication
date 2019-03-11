

module.exports = (app, passport) => {

    function isUserAuthenticated(req, res, next) {
        const isAuthenticated = req.isAuthenticated();
        if (isAuthenticated) return next();
        res.status(401).json({
            message: 'Not authorized'
        });
    }

    app.get('/', function (req, res) {
        res.render('home');
    });

    app.get('/login', function (req, res) {
        res.render('login');
    });

    app.get('/signup', function (req, res) {
        res.render('signup');
    });


    app.get('/profile', isUserAuthenticated, function (req, res) {
        const user = req.user;
        res.render('profile', {
            user: user
        });
    });


    app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

    app.get('/auth/google/callback', function(req, res, next) {
        passport.authenticate('google', function(err, user, info) {
            if (err || !user) {
                return res.redirect('/login');
            }

            req.logIn(user, function(err) {
                if (err){
                    return res.redirect('/login');
                }
                return res.redirect('/profile');
            });
        })(req, res, next);
    });
}