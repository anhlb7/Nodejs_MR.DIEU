const db = require('../../model/model');
module.exports.getEditor=(req,res)=>{
    var errLogin=req.flash();
    var idEditor= req.session.user.id;
    var category;
    db.query("SELECT * FROM category",(err,result)=>{
        if(err) throw err;
        category = result;
    });
    var tag;
    db.query("SELECT * FROM tag",(err,result)=>{
        if(err) throw err;
        tag = result;
    });
    var posts;
        db.query("SELECT p.idTag AS idTag, p.idCategory AS idCategory,p.id AS idPost, p.content AS Content ,p.title AS title, s.name AS writerName, c.name AS categoryName, p.articleStatus AS articleStatus FROM posts p, editor e, category c, subscriber s  WHERE p.idCategory = e.idCategory && e.id='"+idEditor+"' &&c.id= e.idCategory && p.idWriter=s.id ORDER BY p.id ASC",function(err,result){
            if(err) throw err;
            posts = result;
            res.render('page/editor',{category,posts,tag,login:req.session.login, user:req.session.user,errLogin});
    }); 
};
module.exports.Reject=(req,res)=>{
    var idPost = req.params.id;
    var Reject = req.body.reject;
    var sql = "UPDATE posts SET articleStatus = -1, Reject = '"+Reject+"' WHERE id = '"+idPost+"'";
    db.query(sql,(err,result)=>{
        if (err) throw err;
        res.redirect('/editor');
    });
};
module.exports.View=(req,res)=>{
    var idPost = req.params.id;
    var sql = "SELECT * FROM posts WHERE id = '"+idPost+"'";
    db.query(sql,(err,post)=>{
        if (err) throw err;
        res.render('page/postView',{post,login:req.session.login, user:req.session.user});
    });
};
module.exports.addPost=(req,res)=>{
    var idPost = req.params.id;
    var idCategory = req.body.idCategory;
    var idTag = req.body.idTag;
    var date = req.body.year+"-"+req.body.month+"-"+req.body.day;
    var sql = "UPDATE posts SET idCategory = '"+idCategory+"', idTag = '"+idTag+"', date = '"+date+"',articleStatus=1 WHERE id = '"+idPost+"'";
    db.query(sql,(err,post)=>{
        if (err) throw err;
        res.redirect('/editor');
    });
};