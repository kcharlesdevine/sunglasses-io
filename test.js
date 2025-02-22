let { expect } = require('chai');
let http = require('http');
let chaiHttp = require('chai-http');
let chai = require('chai');
chai.use(chaiHttp);

let server = require('./app/server')
const { send } = require('process');
let should = chai.should();


const token = "123456789ABCDEF";

  describe('/api/brands', () => {
    it('should return an array', (done) => {
      chai 
        .request(server)
        .get('/api/brands')
        .end((err, res) => {
          if(err) throw err;
          res.should.have.status(200);
          res.body.should.be.an('array');
          done();
        })
    });
  });

  describe('/api/brands/:id/products', () => {
    it('should return an array of products by brand name', (done) => {
      let id = '1';
      chai
        .request(server)
        .get(`/api/brands/${id}/products`)
        .end((err, res) => {
          if(err) throw err;
          res.should.have.status(200);
          res.body.should.be.an('object');
          done();
        })  
    });

    it('should return error if requested product is not found', (done) => {
      let id = "100";
      chai
      .request(server)
      .get(`/api/brands/${id}/products`)
      .end((err, res) => {
        if(err) throw err;
        res.should.have.status(404)
        done();
      })
    })
  });

  describe('/api/products', () => {
    it('should return an array', (done) => {
      chai 
        .request(server)
        .get('/api/products')
        .end((err, res) => {
          if(err) throw err;
          res.should.have.status(200);
          res.body.should.be.an('array');
          done();
        })
        
    });
  });

  describe('/api/login', () => {
    it('should return an access token string', (done) => {
      chai
      .request(server)
      .post('/api/login')
      .send({username: 'yellowleopard753'})
      .send({password: 'jonjon'})
      .end((err, res) => {
        if (err) throw err;
        res.should.have.status(200);
        res.body.should.be.a('string');        
      })
      done();
    })

    it('should return log in error if username or password are incorrect', (done) => {
      chai
      .request(server)
      .post('/api/login')
      .send({ username: 'badUser', password: 'badPwd'
        })
      .end((err, res) => {
        if(err) throw err
        res.should.have.status(401);
        done();  
      })
    })

    it('should return error if username or password are missing', (done) => {
      chai
      .request(server)
      .post('/api/login')
      .send({username: undefined, password: 'jonjon'})
      .end((err, res) => {
        if(err) throw err;
        res.should.have.status(400);
        done();
      })
    })
  })
  describe('/api/me/getcart', () => {
    it('should return stringified array of products in the cart', (done) => {
      chai
      .request(server)
      .get('/api/me/getcart')
      .send({ accessToken : token })
      .end((err, res) => {
        if(err) throw err;
        res.should.have.status(200);
        res.body.should.be.an('object');
        done();  
      }) 
    })

    it('should return authrization error if no token is provided', (done) => {
      chai
      .request(server)
      .get('/api/me/getcart')
      .end((err, res) => {
        if(err) throw err;
        res.should.have.status(401);
        done();
      })
    })
  })
  
  describe('/api/me/cart', () => {
    it('should add product to the cart', (done) => {
      let productId = "1";
      chai
      .request(server)
      .post('/api/me/cart')
      .send({ accessToken : token, productId })
      .end((err, res) => {
        if(err) throw err;
        res.should.have.status(201);
        res.body.should.be.an('object');
        done();
      })
    })
    it('should return authorization error if no token is provided/incorrect token', (done) => {
      let productId = "1";
      chai
      .request(server)
      .post('/api/me/cart')
      .send({ accessToken: "badtoken", productId })
      .end((err, res) => {
        if(err) throw err;
        res.should.have.status(401);
        done();
      })
    })
  })

  describe('/api/me/cart/:productId/delete', () => {
    it('should return authorization error if no token is provided', (done) => {
      let productId = "2";
      chai
      .request(server)
      .delete(`/api/me/cart/${productId}/delete`)
      .end((err, res) => {
        if(err) throw err;
        res.should.have.status(401);
        done();
      })
    })
    it('should delete item from the cart', (done) => {
      let productId = "1";
      chai
      .request(server)
      .delete(`/api/me/cart/${productId}/delete`)
      .send({ accessToken : token })
      .end((err, res) => {
        if(err) throw err;
        res.should.have.status(200);
        done();
      })
    })
    it('should return error if user requests to delete product not in cart', (done) => {
      let productId = "666";
      chai
      .request(server)
      .delete(`/api/me/cart/${productId}/delete`)
      .send({ accessToken : token })
      .end((err, res) => {
        if(err) throw err;
        res.should.have.status(404);
        done();
      })
    })
  })

  describe
   describe('/api/me/cart/:productId', () => {
    it('should update product quantity in user`s cart ', (done) => {
      let productId = "2";
      let newCount = "10";
      chai
      .request(server)
      .post(`/api/me/cart/${productId}`)
      .send({ accessToken : token, newCount})
      .end((err, res) => {
        if(err) throw err;
        res.should.have.status(404);
        res.body.should.be.an('object');
        done();
      })
    })

   it('should return authorization error if no token is provided', (done) => {
    let productId = "2";
    let newCount = "10";
    chai
      .request(server)
      .post(`/api/me/cart/${productId}`)
      .send({newCount})
      .end((err, res) => {
        if(err) throw err;
        res.should.have.status(401);
        done();
      })
   })

   it('should return error if user requests to update quantity of product not present in the cart', (done) => {
    let productId = "666";
    let newCount = "666";
    chai
    .request(server)
    .post(`/api/me/cart/${productId}`)
    .send({ accessToken : token, newCount})
    .end((err, res) => {
      if(err) throw err;
      res.should.have.status(404);
      done();
    })
   })
   })