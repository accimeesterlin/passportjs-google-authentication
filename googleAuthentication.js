const GoogleStrategy = require('passport-google-oauth20').Strategy;
const connection = require('./connection');


const clientId = process.env.GOOGLE_CLIENT_ID || 'google_client_id';
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || 'google_client_secret';

module.exports = (passport) => {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    }); // req.session.passport.user.id

    passport.deserializeUser(function(id, done) {
        connection.query('SELECT * FROM User WHERE id = ?', [id], function(err, users) {
            const user = users[0];
            done(err, user)
        });
    });

    passport.use(new GoogleStrategy({
            clientID: clientId,
            clientSecret: clientSecret,
            callbackURL: "http://localhost:8080/auth/google/callback"
        },
        function (accessToken, refreshToken, profile, cb) {
            connection.query('SELECT * FROM User WHERE profileId = ?', [profile.id], function (err, users) {
                if (err) {
                    return cb(err, null);
                }
                const user = users[0];
                if (user) {
                    return cb(null, user);
                }

                let newUser = {
                    profileId: profile.id,
                    email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null
                };

                // Create a new User
                connection.query('INSERT INTO User SET ?', newUser, (err, data) => {
                    if (err) {
                        return cb(null, false, {
                            message: 'Internal Server error'
                        })
                    }
                    newUser.id = data.insertId;
                    return cb(null, newUser);
                });

            });
        }
    ));
}