const { addition } = require("../src/math.js");
const expect = require("chai").expect;

describe("Addition", () => {
  it("check addition of two numbers", () => {
    const result = addition(5, 2);
    const expectedResult = 7;
    expect(result).to.be.a("number");
    expect(result).to.be.equal(expectedResult);
  });
});
