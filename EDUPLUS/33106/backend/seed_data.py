import datetime
from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal
import models

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(models.Institution).first():
            print("Database already contains data. Skipping re-seed.")
            return

        print("Seeding EduPulse database for Apex Academy of Sciences, Kurnool...")

        # 1. Institution
        institution = models.Institution(
            id=1,
            name="Apex Academy of Sciences, Kurnool (AP)",
            tagline="Every test should lead to a better next step.",
            location="Nandyal Road, Near Birla Gate, Kurnool, Andhra Pradesh 518002"
        )
        db.add(institution)
        db.commit()

        # 2. Rule Config
        rule_config = models.RuleConfig(
            institution_id=1,
            flag_threshold_pct=50.0,
            min_tests_required=2,
            consecutive_drop_count=2,
            cohort_alert_ratio=0.40
        )
        db.add(rule_config)

        # 3. Users / Faculty
        users = [
            models.User(
                id=1,
                institution_id=1,
                name="Dr. Sunitha Reddy",
                email="coordinator@edupulse.in",
                role="coordinator",
                subject_specialization="Academic Administration"
            ),
            models.User(
                id=2,
                institution_id=1,
                name="Srikanth Sir",
                email="srikanth.physics@edupulse.in",
                role="teacher",
                subject_specialization="Physics"
            ),
            models.User(
                id=3,
                institution_id=1,
                name="Dr. Madhavi Rao",
                email="madhavi.chem@edupulse.in",
                role="teacher",
                subject_specialization="Chemistry"
            ),
            models.User(
                id=4,
                institution_id=1,
                name="Venkatesh Sir",
                email="venkatesh.math@edupulse.in",
                role="teacher",
                subject_specialization="Mathematics"
            ),
            models.User(
                id=5,
                institution_id=1,
                name="Dr. Padmaja Rani",
                email="padmaja.bio@edupulse.in",
                role="teacher",
                subject_specialization="Biology"
            ),
            models.User(
                id=6,
                institution_id=1,
                name="Dr. K. R. Naidu",
                email="admin@edupulse.in",
                role="admin",
                subject_specialization="Management"
            ),
        ]
        db.add_all(users)
        db.commit()

        # 4. Batches
        batches = [
            models.Batch(id=1, institution_id=1, name="JEE-2026 Alpha", program="IIT-JEE", target_year=2026),
            models.Batch(id=2, institution_id=1, name="NEET-2026 Achievers", program="NEET", target_year=2026),
            models.Batch(id=3, institution_id=1, name="EAPCET-2026 Zenith", program="EAPCET", target_year=2026)
        ]
        db.add_all(batches)
        db.commit()

        # 5. Subjects & Topics
        subjects = [
            models.Subject(id=1, institution_id=1, name="Physics", code="PHY"),
            models.Subject(id=2, institution_id=1, name="Chemistry", code="CHE"),
            models.Subject(id=3, institution_id=1, name="Mathematics", code="MAT"),
            models.Subject(id=4, institution_id=1, name="Biology", code="BIO"),
        ]
        db.add_all(subjects)
        db.commit()

        topics = [
            # Physics (id: 1..5)
            models.Topic(id=1, subject_id=1, name="Kinematics & Laws of Motion", description="1D & 2D motion, friction, Newton's laws"),
            models.Topic(id=2, subject_id=1, name="Rotational Dynamics", description="Moment of inertia, torque, rolling motion"),
            models.Topic(id=3, subject_id=1, name="Thermodynamics & Heat", description="Laws of thermodynamics, heat engines"),
            models.Topic(id=4, subject_id=1, name="Current Electricity", description="Kirchhoff's laws, potentiometer, circuits"),
            models.Topic(id=5, subject_id=1, name="Wave Optics", description="Interference, Young's double slit, diffraction"),
            
            # Chemistry (id: 6..10)
            models.Topic(id=6, subject_id=2, name="Chemical Bonding", description="Molecular orbital theory, hybridisation"),
            models.Topic(id=7, subject_id=2, name="Ionic Equilibrium", description="pH, buffer solutions, solubility product"),
            models.Topic(id=8, subject_id=2, name="Organic Reaction Mechanisms", description="Nucleophilic substitution, elimination"),
            models.Topic(id=9, subject_id=2, name="Coordination Compounds", description="Crystal field theory, nomenclature"),
            models.Topic(id=10, subject_id=2, name="Solutions & Colligative Properties", description="Raoult's law, osmotic pressure"),

            # Mathematics (id: 11..15)
            models.Topic(id=11, subject_id=3, name="Differential Calculus", description="Limits, continuity, applications of derivatives"),
            models.Topic(id=12, subject_id=3, name="Integral Calculus", description="Definite and indefinite integration, area"),
            models.Topic(id=13, subject_id=3, name="Coordinate Geometry", description="Conic sections, parabolas, ellipses"),
            models.Topic(id=14, subject_id=3, name="Vectors & 3D Geometry", description="Dot and cross products, planes"),
            models.Topic(id=15, subject_id=3, name="Matrices & Determinants", description="Matrix algebra, rank, Cramer's rule"),

            # Biology (id: 16..19)
            models.Topic(id=16, subject_id=4, name="Cell Biology & Genetics", description="Mendelian genetics, chromosome structure"),
            models.Topic(id=17, subject_id=4, name="Human Physiology", description="Circulation, neural control, endocrinology"),
            models.Topic(id=18, subject_id=4, name="Plant Anatomy & Physiology", description="Photosynthesis, xylem-phloem transport"),
            models.Topic(id=19, subject_id=4, name="Ecology & Environment", description="Ecosystem dynamics, biodiversity conservation"),
        ]
        db.add_all(topics)
        db.commit()

        # 6. Students (32 Fictional Students across 3 batches)
        student_data = [
            # Batch 1: JEE-2026 Alpha (12 students)
            (1, "STU-1001", "K. Sai Teja", "JEE-A01", 1),
            (2, "STU-1002", "P. Keerthi Reddy", "JEE-A02", 1),
            (3, "STU-1003", "V. Venkat Raman", "JEE-A03", 1),
            (4, "STU-1004", "B. Bhavana Rao", "JEE-A04", 1),
            (5, "STU-1005", "M. Rahul Varma", "JEE-A05", 1),
            (6, "STU-1006", "C. Divya Sree", "JEE-A06", 1),
            (7, "STU-1007", "N. Karthik Naidu", "JEE-A07", 1),
            (8, "STU-1008", "G. Anusha Chowdary", "JEE-A08", 1),
            (9, "STU-1009", "T. Manjunath Swamy", "JEE-A09", 1),
            (10, "STU-1010", "D. Sneha Latha", "JEE-A10", 1),
            (11, "STU-1011", "Y. Tarun Kumar", "JEE-A11", 1),
            (12, "STU-1012", "R. Swathi Priya", "JEE-A12", 1),

            # Batch 2: NEET-2026 Achievers (10 students)
            (13, "STU-2001", "A. Harika Sharma", "NEET-B01", 2),
            (14, "STU-2002", "S. Pradeep Kumar", "NEET-B02", 2),
            (15, "STU-2003", "M. Lavanya Devi", "NEET-B03", 2),
            (16, "STU-2004", "K. Dinesh Reddy", "NEET-B04", 2),
            (17, "STU-2005", "J. Sushmitha Paul", "NEET-B05", 2),
            (18, "STU-2006", "R. Bhanu Prakash", "NEET-B06", 2),
            (19, "STU-2007", "N. Meghana Rao", "NEET-B07", 2),
            (20, "STU-2008", "E. Ajay Krishna", "NEET-B08", 2),
            (21, "STU-2009", "P. Sravani Latha", "NEET-B09", 2),
            (22, "STU-2010", "V. Chaitanya Prasad", "NEET-B10", 2),

            # Batch 3: EAPCET-2026 Zenith (10 students)
            (23, "STU-3001", "G. Mahesh Babu", "EAP-C01", 3),
            (24, "STU-3002", "T. Sandhya Rani", "EAP-C02", 3),
            (25, "STU-3003", "B. Vikram Simha", "EAP-C03", 3),
            (26, "STU-3004", "K. Pavani Kumari", "EAP-C04", 3),
            (27, "STU-3005", "M. Akhil Tej", "EAP-C05", 3),
            (28, "STU-3006", "D. Rohini Sree", "EAP-C06", 3),
            (29, "STU-3007", "N. Uday Kiran", "EAP-C07", 3),
            (30, "STU-3008", "S. Geetha Madhuri", "EAP-C08", 3),
            (31, "STU-3009", "R. Vinay Kumar", "EAP-C09", 3),
            (32, "STU-3010", "A. Lakshmi Prasanna", "EAP-C10", 3),
        ]

        students = [
            models.Student(
                id=s[0],
                student_uid=s[1],
                institution_id=1,
                batch_id=s[4],
                full_name=s[2],
                roll_number=s[3]
            ) for s in student_data
        ]
        db.add_all(students)
        db.commit()

        # 7. Assessments (Baseline, regular, and follow-up tests)
        assessments = [
            # Batch 1 (JEE Alpha) Assessments
            models.Assessment(id=1, institution_id=1, batch_id=1, subject_id=1, topic_id=1, test_code="TEST-PHY-01", title="Kinematics Diagnostic Test", maximum_score=100.0, test_date=datetime.datetime(2026, 8, 10), test_type="baseline"),
            models.Assessment(id=2, institution_id=1, batch_id=1, subject_id=1, topic_id=2, test_code="TEST-PHY-02", title="Rotational Dynamics Assessment 1", maximum_score=100.0, test_date=datetime.datetime(2026, 8, 24), test_type="baseline"),
            models.Assessment(id=3, institution_id=1, batch_id=1, subject_id=1, topic_id=2, test_code="TEST-PHY-03", title="Rotational Dynamics Assessment 2", maximum_score=100.0, test_date=datetime.datetime(2026, 9, 7), test_type="regular"),
            # Follow-up test for Rotational Dynamics after intervention!
            models.Assessment(id=4, institution_id=1, batch_id=1, subject_id=1, topic_id=2, test_code="TEST-PHY-04-F", title="Rotational Dynamics Post-Intervention Reassessment", maximum_score=100.0, test_date=datetime.datetime(2026, 9, 28), test_type="follow_up"),
            models.Assessment(id=5, institution_id=1, batch_id=1, subject_id=2, topic_id=6, test_code="TEST-CHE-01", title="Chemical Bonding Weekly Assessment", maximum_score=100.0, test_date=datetime.datetime(2026, 8, 17), test_type="regular"),
            models.Assessment(id=6, institution_id=1, batch_id=1, subject_id=2, topic_id=7, test_code="TEST-CHE-02", title="Ionic Equilibrium Assessment 1", maximum_score=100.0, test_date=datetime.datetime(2026, 9, 2), test_type="baseline"),
            models.Assessment(id=7, institution_id=1, batch_id=1, subject_id=2, topic_id=7, test_code="TEST-CHE-03", title="Ionic Equilibrium Assessment 2", maximum_score=100.0, test_date=datetime.datetime(2026, 9, 16), test_type="regular"),
            models.Assessment(id=8, institution_id=1, batch_id=1, subject_id=3, topic_id=11, test_code="TEST-MAT-01", title="Differential Calculus Module Test", maximum_score=100.0, test_date=datetime.datetime(2026, 9, 10), test_type="regular"),

            # Batch 2 (NEET Achievers) Assessments
            models.Assessment(id=9, institution_id=1, batch_id=2, subject_id=4, topic_id=16, test_code="TEST-BIO-01", title="Genetics & Heredity Assessment 1", maximum_score=100.0, test_date=datetime.datetime(2026, 8, 20), test_type="baseline"),
            models.Assessment(id=10, institution_id=1, batch_id=2, subject_id=4, topic_id=16, test_code="TEST-BIO-02", title="Genetics & Heredity Assessment 2", maximum_score=100.0, test_date=datetime.datetime(2026, 9, 5), test_type="regular"),
            models.Assessment(id=11, institution_id=1, batch_id=2, subject_id=4, topic_id=17, test_code="TEST-BIO-03", title="Human Physiology Comprehensive Test", maximum_score=100.0, test_date=datetime.datetime(2026, 9, 19), test_type="regular"),
            models.Assessment(id=12, institution_id=1, batch_id=2, subject_id=2, topic_id=8, test_code="TEST-CHE-11", title="Organic Mechanisms Diagnostic", maximum_score=100.0, test_date=datetime.datetime(2026, 9, 12), test_type="baseline"),

            # Batch 3 (EAPCET Zenith) Assessments
            models.Assessment(id=13, institution_id=1, batch_id=3, subject_id=3, topic_id=13, test_code="TEST-MAT-21", title="Coordinate Geometry Sectional Test 1", maximum_score=100.0, test_date=datetime.datetime(2026, 8, 25), test_type="baseline"),
            models.Assessment(id=14, institution_id=1, batch_id=3, subject_id=3, topic_id=13, test_code="TEST-MAT-22", title="Coordinate Geometry Sectional Test 2", maximum_score=100.0, test_date=datetime.datetime(2026, 9, 15), test_type="regular"),
            models.Assessment(id=15, institution_id=1, batch_id=3, subject_id=1, topic_id=4, test_code="TEST-PHY-21", title="Current Electricity Weekly Quiz", maximum_score=100.0, test_date=datetime.datetime(2026, 9, 22), test_type="regular"),
        ]
        db.add_all(assessments)
        db.commit()

        # 8. Test Results (Scores realistic for competitive coaching)
        test_results = []

        # Batch 1 - Test 1: Kinematics (Good scores: 60-88%)
        kinematics_scores = [78, 85, 72, 64, 91, 70, 68, 82, 59, 74, 62, 80]
        for s_idx, score in enumerate(kinematics_scores):
            test_results.append(models.TestResult(
                assessment_id=1, student_id=s_idx+1, score=score, maximum_score=100.0, percentage=score,
                test_date=datetime.datetime(2026, 8, 10), subject_name="Physics", topic_name="Kinematics & Laws of Motion"
            ))

        # Batch 1 - Test 2: Rotational Dynamics 1 (Widespread struggle: 32-55%)
        rot_1_scores = [44, 52, 38, 35, 60, 42, 36, 48, 30, 45, 39, 50]
        for s_idx, score in enumerate(rot_1_scores):
            test_results.append(models.TestResult(
                assessment_id=2, student_id=s_idx+1, score=score, maximum_score=100.0, percentage=score,
                test_date=datetime.datetime(2026, 8, 24), subject_name="Physics", topic_name="Rotational Dynamics"
            ))

        # Batch 1 - Test 3: Rotational Dynamics 2 (Recurring struggle: 34-58%)
        rot_2_scores = [46, 55, 40, 38, 62, 45, 35, 49, 32, 44, 41, 52]
        for s_idx, score in enumerate(rot_2_scores):
            test_results.append(models.TestResult(
                assessment_id=3, student_id=s_idx+1, score=score, maximum_score=100.0, percentage=score,
                test_date=datetime.datetime(2026, 9, 7), subject_name="Physics", topic_name="Rotational Dynamics"
            ))

        # Batch 1 - Test 4 (Follow-up after Srikanth Sir's Doubt Clinic on Rotational Dynamics):
        # Notice measurable improvement: average rises from ~43% to ~65%!
        rot_followup_scores = [68, 76, 58, 54, 78, 64, 52, 70, 49, 65, 59, 72]
        for s_idx, score in enumerate(rot_followup_scores):
            test_results.append(models.TestResult(
                assessment_id=4, student_id=s_idx+1, score=score, maximum_score=100.0, percentage=score,
                test_date=datetime.datetime(2026, 9, 28), subject_name="Physics", topic_name="Rotational Dynamics"
            ))

        # Batch 1 - Test 5: Chemical Bonding
        chem_bonding_scores = [70, 75, 68, 62, 84, 71, 65, 78, 55, 69, 60, 77]
        for s_idx, score in enumerate(chem_bonding_scores):
            test_results.append(models.TestResult(
                assessment_id=5, student_id=s_idx+1, score=score, maximum_score=100.0, percentage=score,
                test_date=datetime.datetime(2026, 8, 17), subject_name="Chemistry", topic_name="Chemical Bonding"
            ))

        # Batch 1 - Test 6: Ionic Equilibrium 1
        ionic_1_scores = [48, 58, 42, 40, 65, 47, 38, 52, 35, 49, 44, 55]
        for s_idx, score in enumerate(ionic_1_scores):
            test_results.append(models.TestResult(
                assessment_id=6, student_id=s_idx+1, score=score, maximum_score=100.0, percentage=score,
                test_date=datetime.datetime(2026, 9, 2), subject_name="Chemistry", topic_name="Ionic Equilibrium"
            ))

        # Batch 1 - Test 7: Ionic Equilibrium 2
        ionic_2_scores = [50, 60, 45, 42, 68, 49, 40, 54, 38, 51, 46, 58]
        for s_idx, score in enumerate(ionic_2_scores):
            test_results.append(models.TestResult(
                assessment_id=7, student_id=s_idx+1, score=score, maximum_score=100.0, percentage=score,
                test_date=datetime.datetime(2026, 9, 16), subject_name="Chemistry", topic_name="Ionic Equilibrium"
            ))

        # Batch 1 - Test 8: Differential Calculus
        calc_scores = [82, 88, 75, 70, 94, 78, 72, 85, 64, 80, 68, 86]
        for s_idx, score in enumerate(calc_scores):
            test_results.append(models.TestResult(
                assessment_id=8, student_id=s_idx+1, score=score, maximum_score=100.0, percentage=score,
                test_date=datetime.datetime(2026, 9, 10), subject_name="Mathematics", topic_name="Differential Calculus"
            ))

        # Batch 2 (NEET Students: 13 to 22)
        # Test 9: Genetics 1
        genetics_1 = [42, 58, 36, 45, 64, 48, 39, 52, 35, 50]
        for idx, score in enumerate(genetics_1):
            test_results.append(models.TestResult(
                assessment_id=9, student_id=13+idx, score=score, maximum_score=100.0, percentage=score,
                test_date=datetime.datetime(2026, 8, 20), subject_name="Biology", topic_name="Cell Biology & Genetics"
            ))

        # Test 10: Genetics 2
        genetics_2 = [45, 60, 38, 48, 66, 50, 42, 55, 38, 52]
        for idx, score in enumerate(genetics_2):
            test_results.append(models.TestResult(
                assessment_id=10, student_id=13+idx, score=score, maximum_score=100.0, percentage=score,
                test_date=datetime.datetime(2026, 9, 5), subject_name="Biology", topic_name="Cell Biology & Genetics"
            ))

        # Test 11: Human Physiology
        physio = [76, 82, 70, 74, 88, 79, 68, 84, 65, 78]
        for idx, score in enumerate(physio):
            test_results.append(models.TestResult(
                assessment_id=11, student_id=13+idx, score=score, maximum_score=100.0, percentage=score,
                test_date=datetime.datetime(2026, 9, 19), subject_name="Biology", topic_name="Human Physiology"
            ))

        # Test 12: Organic Mechanisms
        org_scores = [38, 52, 35, 42, 60, 46, 33, 49, 31, 48]
        for idx, score in enumerate(org_scores):
            test_results.append(models.TestResult(
                assessment_id=12, student_id=13+idx, score=score, maximum_score=100.0, percentage=score,
                test_date=datetime.datetime(2026, 9, 12), subject_name="Chemistry", topic_name="Organic Reaction Mechanisms"
            ))

        # Batch 3 (EAPCET Students: 23 to 32)
        # Test 13: Coordinate Geometry 1
        geom_1 = [40, 54, 38, 44, 62, 47, 35, 51, 33, 48]
        for idx, score in enumerate(geom_1):
            test_results.append(models.TestResult(
                assessment_id=13, student_id=23+idx, score=score, maximum_score=100.0, percentage=score,
                test_date=datetime.datetime(2026, 8, 25), subject_name="Mathematics", topic_name="Coordinate Geometry"
            ))

        # Test 14: Coordinate Geometry 2
        geom_2 = [42, 56, 40, 45, 64, 49, 37, 53, 36, 50]
        for idx, score in enumerate(geom_2):
            test_results.append(models.TestResult(
                assessment_id=14, student_id=23+idx, score=score, maximum_score=100.0, percentage=score,
                test_date=datetime.datetime(2026, 9, 15), subject_name="Mathematics", topic_name="Coordinate Geometry"
            ))

        # Test 15: Current Electricity
        elec_scores = [68, 75, 62, 70, 80, 72, 64, 76, 58, 71]
        for idx, score in enumerate(elec_scores):
            test_results.append(models.TestResult(
                assessment_id=15, student_id=23+idx, score=score, maximum_score=100.0, percentage=score,
                test_date=datetime.datetime(2026, 9, 22), subject_name="Physics", topic_name="Current Electricity"
            ))

        db.add_all(test_results)
        db.commit()

        # 9. Teacher Actions / Interventions (The Heart of EduPulse)
        teacher_actions = [
            # 1: Completed Intervention on Rotational Dynamics (JEE-Alpha)
            models.TeacherAction(
                id=1,
                institution_id=1,
                batch_id=1,
                subject_id=1,
                topic_id=2, # Rotational Dynamics
                teacher_id=2, # Srikanth Sir
                title="Rotational Dynamics - Moment of Inertia & Torque Workshop",
                action_type="doubt_clinic",
                status="completed",
                priority="high",
                evidence_reason="Batch average on Rotational Dynamics was 42.5% across 2 consecutive tests (TEST-PHY-02 & TEST-PHY-03). 10 of 12 students demonstrated persistent difficulty with parallel axis theorem and angular momentum conservation.",
                target_student_ids=[1, 3, 4, 6, 7, 8, 9, 10, 11, 12],
                due_date=datetime.datetime(2026, 9, 20),
                completed_date=datetime.datetime(2026, 9, 22),
                teacher_notes="Conducted a 2-hour interactive session focusing on visual diagrams for torque calculations and rolling without slipping. Students solved 15 guided JEE-level problems."
            ),
            # 2: In Progress Intervention on Ionic Equilibrium (JEE-Alpha)
            models.TeacherAction(
                id=2,
                institution_id=1,
                batch_id=1,
                subject_id=2,
                topic_id=7, # Ionic Equilibrium
                teacher_id=3, # Dr. Madhavi Rao
                title="Ionic Equilibrium - Henderson Equation & Buffer Solutions Drill",
                action_type="targeted_practice",
                status="in_progress",
                priority="high",
                evidence_reason="Batch average was 48.2% across Tests 6 & 7. 8 students had recurring errors calculating common-ion effect and pH during hydrolysis.",
                target_student_ids=[1, 3, 4, 6, 7, 9, 10, 11],
                due_date=datetime.datetime(2026, 10, 18),
                teacher_notes="Distributed step-by-step algorithmic worksheet. 5 students attended the doubt counter."
            ),
            # 3: Assigned Action on Genetics (NEET Achievers)
            models.TeacherAction(
                id=3,
                institution_id=1,
                batch_id=2,
                subject_id=4,
                topic_id=16, # Genetics
                teacher_id=5, # Dr. Padmaja Rani
                title="Genetics Pedigree Analysis & Dihybrid Cross Remedial",
                action_type="1on1_clinic",
                status="assigned",
                priority="medium",
                evidence_reason="Average score 46.5% across TEST-BIO-01 and TEST-BIO-02. 6 students repeatedly mixed up sex-linked inheritance ratios.",
                target_student_ids=[13, 15, 16, 19, 21, 22],
                due_date=datetime.datetime(2026, 10, 22),
                teacher_notes="Scheduled 30-minute small-group clinics during study hours."
            ),
            # 4: Recommended Action on Coordinate Geometry (EAPCET Zenith)
            models.TeacherAction(
                id=4,
                institution_id=1,
                batch_id=3,
                subject_id=3,
                topic_id=13, # Coordinate Geometry
                teacher_id=4, # Venkatesh Sir
                title="Conic Sections Tangent & Normal Formulas Review",
                action_type="targeted_practice",
                status="recommended",
                priority="high",
                evidence_reason="Average score 47.8% across 2 tests; 7 of 10 students scored below 50% benchmark.",
                target_student_ids=[23, 25, 26, 28, 29, 31, 32],
                due_date=datetime.datetime(2026, 10, 25)
            ),
            # 5: Recommended Action on Organic Reactions (NEET Achievers)
            models.TeacherAction(
                id=5,
                institution_id=1,
                batch_id=2,
                subject_id=2,
                topic_id=8, # Organic Reactions
                teacher_id=3, # Dr. Madhavi Rao
                title="Electrophilic Addition & Carbocation Stability Concept Clinic",
                action_type="concept_relecture",
                status="recommended",
                priority="medium",
                evidence_reason="Single test baseline showed 44.4% average across NEET batch. Early intervention recommended before the unit exam.",
                target_student_ids=[13, 15, 16, 19, 21],
                due_date=datetime.datetime(2026, 10, 28)
            ),
        ]
        db.add_all(teacher_actions)
        db.commit()

        # 10. Intervention Evaluations (Measuring Observed Change Post-Intervention)
        # We track how students performed on TEST-PHY-04-F after TeacherAction 1!
        evaluations = []
        # Target students for TeacherAction 1: [1, 3, 4, 6, 7, 8, 9, 10, 11, 12]
        # Baseline = average of rot_1 & rot_2; Followup = rot_followup
        for s_idx in [0, 2, 3, 5, 6, 7, 8, 9, 10, 11]:
            stu_id = s_idx + 1
            baseline = (rot_1_scores[s_idx] + rot_2_scores[s_idx]) / 2.0
            followup = float(rot_followup_scores[s_idx])
            delta = round(followup - baseline, 1)

            if delta >= 15.0:
                outcome = "marked_improvement"
            elif delta >= 5.0:
                outcome = "moderate_improvement"
            elif delta >= -5.0:
                outcome = "stable"
            else:
                outcome = "needs_review"

            evaluations.append(models.InterventionEvaluation(
                intervention_id=1,
                student_id=stu_id,
                baseline_score_pct=round(baseline, 1),
                follow_up_assessment_id=4,
                follow_up_score_pct=followup,
                delta_pct=delta,
                outcome_status=outcome,
                eval_date=datetime.datetime(2026, 9, 29),
                notes=f"Student showed an observed score change of +{delta}% after completing Srikanth Sir's Doubt Clinic."
            ))

        db.add_all(evaluations)
        db.commit()

        # 11. Initial Import Log
        import_log = models.ImportLog(
            institution_id=1,
            filename="apex_kurnool_term1_diagnostics.csv",
            total_records=156,
            valid_records=156,
            invalid_records=0,
            duplicate_records=0,
            status="completed",
            summary="Initial batch diagnostics imported successfully for JEE-Alpha, NEET-Achievers, and EAPCET-Zenith."
        )
        db.add(import_log)
        db.commit()

        print("Successfully seeded Apex Academy of Sciences, Kurnool with 32 students, 15 tests, 5 teacher actions, and verified follow-up evaluations!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
