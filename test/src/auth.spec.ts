import * as nock from "nock";

import { expect } from "../helper";

import { Dropbox } from "../..";
import { Const } from "../../src/core/common";
import { IAuthResponse } from "../../src/auth";
import { IErrorResponse } from "../../src/core/HttpRequest";

describe("Authenticate", function() {
  describe(".authenticate", function() {
    context("when app-key, app-secret and code are valid", function() {
      it("expects to authenticate and recieve oauth2 token", function(done) {
        const headers: nock.HttpHeaders = {
          "Content-Type": "text/javascript"
        };
        
        const authResponse: IAuthResponse = {
          access_token: "my-own-access-token",
          token_type: "bearer",
          uid: 1234567890,
          account_id: "abcdefg-123456"
        };

        nock(Const.dropbox.apiBaseUrl)
          .post("/oauth2/token?code=mock-code&grant_type=authorization_code")
          .reply(200, JSON.stringify(authResponse), headers);

        const dropbox = new Dropbox("mock-key", "mock-secret");

        dropbox.authenticate(
          "mock-code",
          (error, response) => {
            expect(error).to.not.exist;
            expect(response).to.exist;
            expect(response.status).to.equal(200);
            expect(response.body).to.exist;
            expect(response.body.access_token).to.be.equal("my-own-access-token")
            expect(response.body).to.have.property("access_token").equal("my-own-access-token");
            expect(response.body).to.have.property("token_type").equal("bearer");
            expect(response.body).to.have.property("uid").equal(1234567890);
            expect(response.body).to.have.property("account_id").equal("abcdefg-123456");
            done();
        });
      });

      context("when app-key or app-secret are not valid", function() {
        it("expects to send error message and 400 status", function(done) {
          const errorResponse: IErrorResponse = {
            error: "invalid_client: Invalid client_id or client_secret",
            status: 400
          };

          nock(Const.dropbox.apiBaseUrl)
            .post("/oauth2/token?code=mock-code&grant_type=authorization_code")
            .reply(400, errorResponse);

          const dropbox = new Dropbox("mock-key", "mock-secret");

          dropbox.authenticate(
            "mock-code",
            (error, response) => {
              expect(error).to.exist;
              expect(error).to.be.an.instanceOf(Error)
                .with.property("message", "invalid_client: Invalid client_id or client_secret")
              expect(response).to.exist;
              expect(response).to.have.property("status", 400);
              expect(response).to.have.property("error", "invalid_client: Invalid client_id or client_secret");
              done();
            }
          );
        });
      });

      context("when code is not valid", function() {
        it("expects to send error message and 400 status", function(done) {
          const errorResponse: IErrorResponse = {
            error: "invalid_grant",
            status: 400
          };

          nock(Const.dropbox.apiBaseUrl)
            .post("/oauth2/token?code=mock-code&grant_type=authorization_code")
            .reply(400, errorResponse);

          const dropbox = new Dropbox("mock-key", "mock-secret");

          dropbox.authenticate(
            "mock-code",
            (error, response) => {
              expect(error).to.exist;
              expect(error).to.be.an.instanceOf(Error)
                .with.property("message", "invalid_grant");
              expect(response).to.exist;
              expect(response).to.have.property("status", 400);
              expect(response).to.have.property("error", "invalid_grant");
              done();
            }
          )
        });
      });
    });
  });
});
