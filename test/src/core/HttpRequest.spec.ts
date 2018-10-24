import * as nock from "nock";

import { expect } from "../../helper";

import HttpRequest from "../../../src/core/HttpRequest";

interface ITodos {
  userId?: number;
  id?: number;
  title?: string;
  completed?: boolean;
}

describe("Core.HttpRequest", function() {
  describe(".get", function() {
    context("when http GET request is successfull", function() {
      it("expects to return the response object", function(done) {
        const todo: ITodos = {
          userId: 1,
          id: 1,
          title: "delectus aut autem",
          completed: false
        };
    
        nock("https://jsonplaceholder.typicode.com")
          .get("/todos/1")
          .reply(200, todo, {"Content-Type": "application/json; charset=utf-8"});

        HttpRequest.get<ITodos>(
          { url: "https://jsonplaceholder.typicode.com/todos/1" },
          (error, response) => {
            expect(error).to.not.exist;
            expect(response).to.exist;
            expect(response.status).to.be.equal(200);
            expect(response.body).to.have.property("userId", 1);
            expect(response.body).to.have.property("id", 1);
            expect(response.body).to.have.property("title", "delectus aut autem");
            expect(response.body).to.have.property("completed", false);
            done();
          }
        );
      });
    });

    context("when http request fails", function() {
      it("expects to return error", function(done) {
        HttpRequest.get<ITodos>(
          { url: "" },
          (error, response) => {
            expect(response).to.exist;
            expect(response).to.have.property("error")
              .includes("Error: connect ECONNREFUSED 127.0.0.1:80");
            expect(response).to.to.have.property("message")
              .includes("Error: connect ECONNREFUSED 127.0.0.1:80");
            expect(error).to.exist;
            expect(error)
              .to.be.an.instanceOf(Error)
              .with.property("message")
              .includes("Error: connect ECONNREFUSED 127.0.0.1:80");
            done();
          }
        );
      });
    });
  });

  describe(".post", function() {
    context("when http POST request is successfull", function() {
      it("expects to return the response object", function(done) {
        const todo: ITodos = {
          id: 2
        };

        const reqheaders = { "Content-Type": "application/json; charset=utf-8" }
    
        nock("https://jsonplaceholder.typicode.com", { reqheaders })
          .post("/todos")
          .reply(201, todo, {"Content-Type": "application/json; charset=utf-8"});

        const headers = new Map<string, string>();
        headers.set("Content-Type", "application/json; charset=utf-8");

        HttpRequest.post<ITodos>(
          {
            url: "https://jsonplaceholder.typicode.com/todos",
            headers,
            requestBody: JSON.stringify({
              userId: 1,
              title: "Somethig new again",
              completed: false
            } as ITodos)
          },
          (error, response) => {
            expect(error).to.not.exist;
            expect(response).to.exist;
            expect(response.status).to.be.equal(201);
            expect(response.body).to.have.property("id", 2);
            done();
          }
        );
      });
    });

    context("when http POST request fails", function() {
      it("expects to return the response object", function(done) {
        const headers = new Map<string, string>();
        headers.set("Content-type", "application/json; charset=UTF-8");

        HttpRequest.post<ITodos>(
          {
            url: "",
            headers,
            requestBody: JSON.stringify({
              userId: 1,
              title: "Somethig new again",
              completed: false
            } as ITodos)
          },
          (error, response) => {
            expect(response).to.exist;
            expect(response).to.have.property("error")
              .includes("Error: connect ECONNREFUSED 127.0.0.1:80");
            expect(response).to.to.have.property("message")
              .includes("Error: connect ECONNREFUSED 127.0.0.1:80");
            expect(error).to.exist;
            expect(error)
              .to.be.an.instanceOf(Error)
              .with.property("message")
              .includes("Error: connect ECONNREFUSED 127.0.0.1:80");
            done();
          }
        );
      });
    });
  });
});