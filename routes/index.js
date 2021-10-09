const Item = require('../models/item');

module.exports = (app) =>{
    app.get('/',(req,res) => {
        const page = req.query.page || 1
        Item.paginate({},{page:page}).then((results) => {
            res.render('items-index',{items:results.docs, pagesCount:results.pages,currentPage:page});

        });
    });
}