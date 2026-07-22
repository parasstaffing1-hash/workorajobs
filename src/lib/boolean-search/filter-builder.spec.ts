import { FilterBuilder } from "./filter-builder";
import { SynonymEngine } from "./synonym-engine";

jest.setTimeout(30000);

describe("FilterBuilder", () => {
  let builder: FilterBuilder;

  beforeEach(() => {
    builder = new FilterBuilder();
  });

  it("should compile empty filters to an empty string", async () => {
    const query = await builder.buildQuery({});
    expect(query).toBe("");
  });

  it("should compile designations with synonym expansion", async () => {
    const query = await builder.buildQuery({
      currentDesignation: "Software Engineer",
      previousDesignation: "Associate"
    });
    // Should contain current_title and previous_title clauses
    expect(query).toContain("current_title:");
    expect(query).toContain("previous_title:");
  });

  it("should compile workplace models and company parameters", async () => {
    const query = await builder.buildQuery({
      workplaceModel: "remote",
      currentCompany: "Google"
    });
    expect(query).toContain("workplace:REMOTE");
    expect(query).toContain("current_company:");
  });

  it("should compile location and radius bounds", async () => {
    const query = await builder.buildQuery({
      location: "San Francisco",
      radiusMiles: 50
    });
    expect(query).toContain("location:\"San Francisco\" WITHIN 50miles");
  });

  it("should compile experience range query clauses", async () => {
    const query = await builder.buildQuery({
      experienceYearsMin: 3,
      experienceYearsMax: 8
    });
    expect(query).toContain("experience_years:[3 TO 8]");
  });

  it("should compile mustHave, niceToHave, and exclude sets correctly", async () => {
    const query = await builder.buildQuery({
      mustHave: ["React", "TypeScript"],
      niceToHave: ["AWS"],
      exclude: ["Angular"]
    });
    // Check correct Boolean logic operators are injected
    expect(query).toContain("AND");
    expect(query).toContain("OR");
    expect(query).toContain("NOT");
  });
});
