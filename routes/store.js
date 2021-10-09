const item = require('../models/item');
const Item = require('../models/item');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const Upload = require('s3-uploader');
const client = new Upload(process.env.S3_BUCKET, {
  aws: {
    path: 'items/avatar',
    region: process.env.S3_REGION,
    acl: 'public-read',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  cleanup: {
    versions: true,
    original: true
  },
  versions: [{
    maxWidth: 400,
    aspect: '16:10',
    suffix: '-standard'
  },{
    maxWidth: 300,
    aspect: '1:1',
    suffix: '-square'
  }]
});

// ITEM ROUTES
module.exports = (app) => {

//SEARCH FOR A ITEM
app.get('/search',(req,res) => {
    const SearchTerm = new RegExp(req.query.tem,"i");
    const page = req.query.page ||1;
    Item.paginate(
        {
            $or: [{name:SearchTerm},{serialNumber:SearchTerm}]
        },
        {page:page}
    ).then((results) => {
        res.render("items-index",{
            items:results.docs,
            pageCount: results.pages,
            currentPAge:page,
            term:req.query.term
        });
    });
});

// NEW ITEM
app.get('/items/new', (req, res) => {
    res.render('items-new');
  });
//CREATE ITEM
app.get('/items',upload.single('avatar'),(req,res, next) => {
    var item = new Item(req.body);
    item.save(function (err) {
        if (req.file) {
            //Upload the images
            client.upload(req.file.path,{},function (err,versions,meta){
                if (err) {return res.status(400).send({err:err}) };
            versions.forEach(function (image) {
                var urlArray = image.url.split('-');
                urlArray.pop();
                var url = urlArray.join('-');
                item.avatarUrl = url;
                item.save();
            });

            res.send({item:item});
            });
        }else {
            res.send({item:item})
        }
    })
});

//SHOW ITEM
app.get('/items/:id',(req,res) =>{
    Item.findById(req.params.id).exec((err,item) =>{
        res.render('items-show',{item:item});
    });
});

// EDIT ITEM
app.get('/items/:id',(req,res) =>{
    Item.findByIdAndUpdate(req.params.id,req.body)
    .then((item) =>{
        res.redirect(`/items/${item._id}`)
    })
    .catch((err) =>{
        //  error handler
    });
});

app.put('/item/:id', (req, res) => {
    Item.findByIdAndUpdate(req.params.id, req.body)
      .then((item) => {
        res.redirect(`/items/${item._id}`)
      })
      .catch((err) => {
        // Handle Errors
      });
  });

//DELETE ITEM
app.delete('/items/:id',(req,res) =>{
    Item.findByIdAndRemove(req.params.id).exec((err,item) =>{
        return res.redirect('/')
    });
});

}