import sqlite3

def update_entities():
    conn = sqlite3.connect('EDUPLUS/33106/backend/edupulse.db')
    cur = conn.cursor()

    # Update subjects
    cur.execute("UPDATE subjects SET name = 'Computer Science & Engineering', code = 'CSE' WHERE id = 1")
    cur.execute("UPDATE subjects SET name = 'Artificial Intelligence & Machine Learning', code = 'AIML' WHERE id = 2")
    cur.execute("UPDATE subjects SET name = 'Electronics & Communication Engineering', code = 'ECE' WHERE id = 3")
    cur.execute("UPDATE subjects SET name = 'Software & Cloud Engineering', code = 'SWE' WHERE id = 4")

    # Update faculty / users
    faculty = [
        (1, "Dr. K. Govardhan Reddy", "govardhan.reddy@gprec.ac.in", "coordinator", "Computer Science & Engineering"),
        (2, "Prof. S. Ramesh Sir", "ramesh.s@gprec.ac.in", "teacher", "Data Structures & Algorithms"),
        (3, "Dr. M. Lakshmi Devi", "lakshmidevi.m@gprec.ac.in", "teacher", "DBMS & Cloud Engineering"),
        (4, "Prof. V. Suresh Sir", "suresh.v@gprec.ac.in", "teacher", "Artificial Intelligence & ML"),
        (5, "Dr. P. Sreedhar Sir", "sreedhar.p@gprec.ac.in", "teacher", "Signals & Embedded Systems"),
        (6, "Prof. B. Veera Reddy", "veerareddy.b@gprec.ac.in", "teacher", "Computer Networks & Security")
    ]

    for f_id, name, email, role, subj in faculty:
        cur.execute("""
            UPDATE users SET name = ?, email = ?, role = ?, subject_specialization = ?
            WHERE id = ?
        """, (name, email, role, subj, f_id))

    # Update teacher_actions teacher_id references
    cur.execute("UPDATE teacher_actions SET teacher_id = 2 WHERE id IN (1, 2)")
    cur.execute("UPDATE teacher_actions SET teacher_id = 3 WHERE id = 3")
    cur.execute("UPDATE teacher_actions SET teacher_id = 4 WHERE id = 4")
    cur.execute("UPDATE teacher_actions SET teacher_id = 5 WHERE id = 5")

    # Update batches student counts
    # Batch 1: CSE = 195, Batch 2: AI&ML = 204, Batch 3: ECE = 17
    conn.commit()
    print("Database entities updated successfully to official GPREC Faculty & Engineering subjects.")

    # Re-export realEduPulseData.json with updated subjects and faculty
    import export_to_frontend
    export_to_frontend.export_all()

if __name__ == '__main__':
    update_entities()
