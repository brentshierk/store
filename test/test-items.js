const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
const Item = require('../models/item');

const fido = {
  "name": "Rex",
  "serialNumber": 12,
  "stock": 3,
  "picUrl": "http://www.dogbreedslist.info/uploads/allimg/dog-pictures/Rottweiler-3.jpg",
  "cost": 9.99,
  "picUrlSq": "http://www.dogbreedplus.com/dog_breeds/images/cute-rottweiler-puppy.jpg",
  "description": "Rex is a dog and he's a good dog who loves to play and hang out with his owners. He also likes to nap and enjoys eating dog food"
}

chai.use(chaiHttp);

describe('Items', ()  => {

  after(() => { 
    Item.deleteMany({$or: [{name: 'Norman'}, {name: 'Spider'}] }).exec((err, items) => {
      console.log(items, `Deleted ${items.n} documents`)
    }) 
  });

  // TEST INDEX
  it('should index ALL items on / GET', (done) => {
    chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.html;
          done();
        });
  });

  // TEST NEW
  it('should display new form on /items/new GET', (done) => {
    chai.request(server)
      .get(`/items/new`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.html
          done();
        });
  });
  
  // TEST CREATE 
  it('should create a SINGLE item on /items POST', (done) => {
    chai.request(server)
        .post('/items')
        .send(fido)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.html
          done();
        });
  });

  // TEST SHOW
  it('should show a SINGLE item on /items/<id> GET', (done) => {
    var item = new Item(fido);
     item.save((err, data) => {
       chai.request(server)
         .get(`/items/${data._id}`)
         .end((err, res) => {
           res.should.have.status(200);
           res.should.be.html
           done();
         });
     });

  });

  // TEST EDIT
  it('should edit a SINGLE item on /items/<id>/edit GET', (done) => {
    var item = new Item(fido);
     item.save((err, data) => {
       chai.request(server)
         .get(`/items/${data._id}/edit`)
         .end((err, res) => {
           res.should.have.status(200);
           res.should.be.html
           done();
         });
     });
  });


  // TEST UPDATE
  it('should update a SINGLE item on /items/<id> PUT', (done) => {
    var item = new Item(fido);
    item.save((err, data)  => {
     chai.request(server)
      .put(`/items/${data._id}?_method=PUT`)
      .send({'name': 'Spider'})
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.html
        done();
      });
    });
  });

  // TEST DELETE
  it('should delete a SINGLE item on /items/<id> DELETE', (done) => {
    var item = new Item(fido);
    item.save((err, data)  => {
     chai.request(server)
      .delete(`/items/${data._id}?_method=DELETE`)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.html
        done();
      });
    });
  });

  it('should search ALL items by name on /search GET', (done) => {
    chai.request(server)
        .get('/search?term=norman')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.html;
          done();
        });
  });
});