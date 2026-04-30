const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("../models/user.model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find googleId in DB
        let user = await userModel.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        let existingUser = await userModel.findOne({
          email: profile.emails[0].value,
        });

        if (existingUser) {
          existingUser.googleId = profile.id;
          existingUser.isEmailVerified = true;
          await existingUser.save();
          return done(null, existingUser);
        }

        // Create new user
        const newUser = await userModel.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          username: profile.emails[0].value.split("@")[0],
          fullname: {
            firstname: profile.name.givenName,
            lastname: profile.name.familyName || "",
          },
          isEmailVerified: true,
          password: null,
          role: "user",
          plan: [
            {
              type: "FREE",
              startDate: new Date(),
              expiry: null,
              payment: null,
              razorpaySubscriptionId: null,
            },
          ],
        });

        return done(null, newUser);
      } catch (error) {
        console.error("GoogleStrategy error:", error);
        done(error, null);
      }
    },
  ),
);

module.exports = passport;
