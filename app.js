var express = require ("express");
const passport=require("passport");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('req-flash');

//page
const getIndex = require('./routers/page/index.route');
const getCategoryDetails = require('./routers/page/categoryDetails.router');
const getCategory = require('./routers/page/category.router');
const adminProduct = require('./routers/admin/index.route');
const getWriter= require('./routers/page/writer.router');
const getEditor= require('./routers/page/editor.router');
const auth = require('./routers/page/auth.router');


//admin
const adminSignin = require('./routers/admin/signin.router');
const adminCategory = require('./routers/admin/category.router');
const adminTag =require('./routers/admin/tag.router');
const adminPosts =require('./routers/admin/posts.router');
const adminUserList =require('./routers/admin/userlist.router');


var app = express();
app.set("view engine","ejs");
app.set("views","./views");

app.use(express.static("public"));
app.use(cookieParser()); // đọc cookie (cần cho xác thực)
app.use(bodyParser.json()); // lấy thông tin từ html forms
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    cookie: {maxAge: (3600 * 1000)},
    secret: 'Anphung',
    resave: true, saveUninitialized: false
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

require('./config/passportlocal')(passport);
require('./routers/page/authlocal.router')(app,passport); // Load routes truyền vào app và passport đã config ở trên
require('./config/passport')(passport);
require('./routers/page/auth.router')(app, passport); // Load routes truyền vào app và passport đã config ở trên

app.use((req, res, next) => { 
        if (req.isAuthenticated()) {
            req.session.login = true;
            req.session.user = req.user;
        }else {
            req.session.login = false;
            req.session.user = {};
        }
        next();
});
app.get('/logout',(req,res)=>{
    req.logOut();
    res.redirect('/');
});

app.use('/auth/facebook',auth);
app.use("/",getIndex);

app.use('/category',getCategory);
app.use('/category-details',getCategoryDetails);
app.use('/writer',getWriter);
app.use('/editor',getEditor);

//admin
app.use('/admin',adminProduct);
app.use('/admin/signin',adminSignin);
app.use('/admin/category',adminCategory);
app.use('/admin/tag',adminTag);
app.use('/admin/posts',adminPosts);
app.use('/admin/userlist',adminUserList);

var server = require("http").Server(app);
server.listen(3000);