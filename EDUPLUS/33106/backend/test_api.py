import asyncio
import httpx
from main import app

async def run_tests():
    print("Testing EduPulse FastAPI endpoints via AsyncClient...")
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        # 1. Health check
        res = await client.get("/api/health")
        assert res.status_code == 200, f"Health check failed: {res.text}"
        print("[PASS] Health Check: OK")

        # 2. Institution Profile
        res = await client.get("/api/institution/profile")
        assert res.status_code == 200, f"Institution profile failed: {res.text}"
        assert "Kurnool" in res.json()["name"]
        print(f"[PASS] Institution: {res.json()['name']}")

        # 3. Batches
        res = await client.get("/api/institution/batches")
        assert res.status_code == 200
        batches = res.json()
        assert len(batches) == 3, f"Expected 3 batches, got {len(batches)}"
        print(f"[PASS] Batches: {[b['name'] for b in batches]}")

        # 4. Students
        res = await client.get("/api/students")
        assert res.status_code == 200
        students = res.json()
        assert len(students) >= 30, f"Expected at least 30 students, got {len(students)}"
        print(f"[PASS] Students count: {len(students)}")

        # 5. Topic Gaps
        res = await client.get("/api/topics/gaps")
        assert res.status_code == 200
        gaps = res.json()
        assert len(gaps) > 0, "Expected detected topic gaps"
        print(f"[PASS] Topic Gaps detected: {len(gaps)} (Top: {gaps[0]['topic_name']}, recurring: {gaps[0]['is_recurring']})")

        # 6. Teacher Actions
        res = await client.get("/api/actions")
        assert res.status_code == 200
        actions = res.json()
        assert len(actions) >= 4, f"Expected at least 4 actions, got {len(actions)}"
        print(f"[PASS] Teacher Actions count: {len(actions)}")

        # 7. Interventions summary
        res = await client.get("/api/interventions/summary")
        assert res.status_code == 200
        data = res.json()
        assert data["total_evaluations"] > 0
        print(f"[PASS] Intervention evaluations: {data['total_evaluations']}, Avg Delta: +{data['average_delta_pct']}%")

        # 8. Dashboard summary
        res = await client.get("/api/analytics/dashboard")
        assert res.status_code == 200
        dash = res.json()
        print(f"[PASS] Dashboard KPIs: {dash['total_students']} students, {dash['total_tests_conducted']} tests, {dash['overall_avg_score']}% avg score")

        # 9. PDF generation test
        res = await client.get("/api/reports/student/1/pdf")
        assert res.status_code == 200
        assert res.headers["content-type"] == "application/pdf"
        assert len(res.content) > 1000
        print(f"[PASS] Student PDF Report generation: OK ({len(res.content)} bytes)")

        # 10. Batch Audit PDF test
        res = await client.get("/api/reports/batch/1/pdf")
        assert res.status_code == 200
        assert res.headers["content-type"] == "application/pdf"
        print(f"[PASS] Batch Audit PDF Report generation: OK ({len(res.content)} bytes)")

        # 11. Sample CSV test
        res = await client.get("/api/imports/sample-csv")
        assert res.status_code == 200
        print("[PASS] Downloadable sample CSV endpoint: OK")

        print("\nALL BACKEND ENDPOINTS AND RULES TESTED AND PASSED SUCCESSFULLY! [100%]")

if __name__ == "__main__":
    asyncio.run(run_tests())
