import { NextRequest, NextResponse } from "next/server";
import { CreateConceptSchema, BooleanSearchQuerySchema } from "../../../lib/boolean-search/validation";
import { ConceptRepository } from "../../../lib/boolean-search/repositories/concept.repository";
import { BooleanSearchEngine } from "../../../lib/boolean-search/engine";
import { BooleanEngine } from "../../../lib/boolean-search/boolean-engine";
import { BooleanPlatformTranslator, TargetPlatform } from "../../../lib/boolean-search/platform-translator";

const repository = new ConceptRepository();
const engine = new BooleanSearchEngine();
const baseEngine = new BooleanEngine();
const translator = new BooleanPlatformTranslator();

/**
 * GET /api/boolean-search
 * Parameters:
 *   - query: string (Boolean query to expand)
 *   - expandSynonyms: boolean (Default: true)
 *   - platform: string (Target platform code, e.g. LINKEDIN_RECRUITER)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = searchParams.get("query");
    const expandSynonyms = searchParams.get("expandSynonyms") !== "false";
    const targetPlatform = searchParams.get("platform")?.toUpperCase() as TargetPlatform | undefined;

    if (!queryParam) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    // Validate inputs
    const validatedInput = BooleanSearchQuerySchema.parse({
      query: queryParam,
      expandSynonyms,
    });

    const tokens = engine.tokenize(validatedInput.query);
    const expandedQuery = await engine.expandQuery(validatedInput.query);

    let translatedQuery = expandedQuery;
    let warnings: string[] = [];
    let charCount = expandedQuery.length;
    let limitExceeded = false;

    if (targetPlatform) {
      try {
        const tokensObjects = baseEngine.tokenize(expandedQuery);
        const ast = baseEngine.parse(tokensObjects);
        const optimized = baseEngine.optimize(ast);
        const translation = translator.translate(optimized, targetPlatform);
        translatedQuery = translation.query;
        warnings = translation.warnings;
        charCount = translation.charCount;
        limitExceeded = translation.limitExceeded;
      } catch (err: any) {
        warnings.push(`Platform translation parser error: ${err.message}`);
      }
    }

    return NextResponse.json({
      originalQuery: validatedInput.query,
      expandedQuery,
      translatedQuery,
      tokens,
      platform: targetPlatform || null,
      warnings,
      charCount,
      limitExceeded,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/boolean-search
 * Payload: CreateConceptInput
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request schema
    const validatedInput = CreateConceptSchema.parse(body);
    
    // Create new concept
    const concept = await repository.createConcept(validatedInput);

    return NextResponse.json({
      success: true,
      data: concept,
    }, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation Error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
