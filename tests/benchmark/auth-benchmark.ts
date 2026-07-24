/**
 * ============================================================================
 * AUTH PERFORMANCE BENCHMARK SCRIPT
 * Benchmarks every authentication endpoint before/after optimizations
 * Run: npx tsx tests/benchmark/auth-benchmark.ts
 * ============================================================================
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const ITERATIONS = 10;

interface BenchmarkResult {
  endpoint: string;
  method: string;
  avgMs: number;
  minMs: number;
  maxMs: number;
  p50Ms: number;
  p99Ms: number;
  successRate: number;
}

async function benchmark(
  label: string,
  method: string,
  path: string,
  body?: object
): Promise<BenchmarkResult> {
  const latencies: number[] = [];
  let successes = 0;

  for (let i = 0; i < ITERATIONS; i++) {
    const start = performance.now();
    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: { "Content-Type": "application/json" },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      if (res.status === 200) successes++;
    } catch (_) {}
    latencies.push(performance.now() - start);
  }

  const sorted = [...latencies].sort((a, b) => a - b);
  const avg = latencies.reduce((s, v) => s + v, 0) / latencies.length;

  return {
    endpoint: `${method} ${path}`,
    method,
    avgMs: Math.round(avg),
    minMs: Math.round(sorted[0]),
    maxMs: Math.round(sorted[sorted.length - 1]),
    p50Ms: Math.round(sorted[Math.floor(sorted.length * 0.5)]),
    p99Ms: Math.round(sorted[Math.floor(sorted.length * 0.99)]),
    successRate: Math.round((successes / ITERATIONS) * 100),
  };
}

async function main() {
  console.log(`\n🔬 WorkoraJobs Authentication Performance Benchmark`);
  console.log(`   Base URL: ${BASE_URL}`);
  console.log(`   Iterations per endpoint: ${ITERATIONS}`);
  console.log(`   Timestamp: ${new Date().toISOString()}\n`);
  console.log("─".repeat(100));

  const results: BenchmarkResult[] = [];

  // 1. Session lookup (hottest path)
  results.push(await benchmark("Auth Me", "GET", "/api/v1/auth/me"));

  // 2. Login
  results.push(
    await benchmark("Login", "POST", "/api/v1/auth/login", {
      email: "bench@example.com",
      password: "SecureP@ss123!",
    })
  );

  // 3. Signup
  results.push(
    await benchmark("Signup", "POST", "/api/v1/auth/signup", {
      email: `bench.${Date.now()}@example.com`,
      password: "SecureP@ss123!",
      role: "JOB_SEEKER",
    })
  );

  // 4. Forgot Password
  results.push(
    await benchmark("Forgot Password", "POST", "/api/v1/auth/forgot-password", {
      email: "bench@example.com",
    })
  );

  // 5. Reset Password
  results.push(
    await benchmark("Reset Password", "POST", "/api/v1/auth/reset-password", {
      token: "bench-token",
      password: "NewSecureP@ss!",
    })
  );

  // 6. Email Verification
  results.push(
    await benchmark("Verify Email", "POST", "/api/v1/auth/verify-email", {
      token: "bench-verify-token",
    })
  );

  // 7. Refresh Token
  results.push(
    await benchmark("Refresh", "POST", "/api/v1/auth/refresh", {
      refreshToken: "bench-refresh",
    })
  );

  // 8. Logout
  results.push(await benchmark("Logout", "POST", "/api/v1/auth/logout"));

  // 9. Sessions List
  results.push(await benchmark("List Sessions", "GET", "/api/v1/auth/sessions"));

  // 10. MFA Setup
  results.push(await benchmark("MFA Setup", "POST", "/api/v1/auth/mfa/setup"));

  // 11. MFA Verify
  results.push(
    await benchmark("MFA Verify", "POST", "/api/v1/auth/mfa/verify", { code: "123456" })
  );

  // 12. Passkey Register Options
  results.push(
    await benchmark("Passkey RegOpts", "POST", "/api/v1/auth/passkeys/register-options")
  );

  // 13. Passkey Login
  results.push(
    await benchmark("Passkey Login", "POST", "/api/v1/auth/passkeys/login-verify", {
      credentialId: "bench-cred",
    })
  );

  // 14. Change Password
  results.push(
    await benchmark("Change Password", "POST", "/api/v1/auth/change-password", {
      currentPassword: "Old!",
      newPassword: "New!",
    })
  );

  // 15. Admin Console
  results.push(await benchmark("Admin Console", "GET", "/api/v1/admin/auth"));

  // Print results table
  console.log(
    "\n" +
      "Endpoint".padEnd(45) +
      "Avg(ms)".padStart(10) +
      "Min(ms)".padStart(10) +
      "P50(ms)".padStart(10) +
      "P99(ms)".padStart(10) +
      "Max(ms)".padStart(10) +
      "Success%".padStart(10)
  );
  console.log("─".repeat(105));

  for (const r of results) {
    console.log(
      r.endpoint.padEnd(45) +
        String(r.avgMs).padStart(10) +
        String(r.minMs).padStart(10) +
        String(r.p50Ms).padStart(10) +
        String(r.p99Ms).padStart(10) +
        String(r.maxMs).padStart(10) +
        `${r.successRate}%`.padStart(10)
    );
  }

  const overallAvg = Math.round(results.reduce((s, r) => s + r.avgMs, 0) / results.length);
  const overallP99 = Math.max(...results.map((r) => r.p99Ms));
  console.log("─".repeat(105));
  console.log(`Overall Average: ${overallAvg}ms | Overall P99: ${overallP99}ms`);
  console.log(`\n✅ Benchmark complete.\n`);
}

main().catch(console.error);
