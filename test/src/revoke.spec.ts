import * as nock from "nock";

import { expect } from "../helper";

import { Dropbox } from "../..";
import { Const } from "../../src/core/common";
import { IAuthResponse } from "../../src/auth";

describe("Revoke", function() {
  describe(".revoke", function() {
    context("when app-key, app-secret and code are valid", function() {
      it("expects revoke the token", function(done) {
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
            expect(response.body).to.have.property("access_token").and.is.not.empty;

            nock(Const.dropbox.apiBaseUrl)
              .post("/2/auth/token/revoke")
              .reply(200, {}, headers);
            
            const token: string = response.body.access_token;
            
            dropbox.revoke(token, (error, response) => {
              expect(error).to.not.exist;
              expect(response).to.exist;
              expect(response.status).to.equal(200);
              done();
            });
        });
      });
    });
  });
});
