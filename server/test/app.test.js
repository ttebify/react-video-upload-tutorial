const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");

chai.use(chaiHttp);
const expect = chai.expect;

describe("Server API", () => {
  it("should return authentication parameters on /auth GET", (done) => {
    chai
      .request(app)
      .get("/auth")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("token");
        expect(res.body).to.have.property("expire");
        expect(res.body).to.have.property("signature");
        done();
      });
  });
});
