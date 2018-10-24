import { expect } from "./helper";
import { Dropbox } from "..";

describe("Dropbox constructor", function() {
  context(".constructor", function() {
    it("expect to assing token and secret", function() {
      const dropbox = new Dropbox("app-key", "app-secret");
      
      expect(dropbox.appKey).to.be.equal("app-key");
      expect(dropbox.appSecret).to.be.equal("app-secret");
    });
  })
});