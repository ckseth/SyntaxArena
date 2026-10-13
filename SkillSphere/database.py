"""
database.py - Database for SkillSphere AI
SQLite database with Users, Skills, and Learning_Log tables.
"""

import sqlite3
import hashlib
import os

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "skillsphere.db")


def get_conn():
    """Create database connection."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def hash_password(password):
    """Hash password using SHA-256."""
    return hashlib.sha256(password.encode()).hexdigest()


def init_db():
    """Create all tables."""
    conn = get_conn()
    c = conn.cursor()

    c.execute("""CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        trust_score REAL DEFAULT 0
    )""")

    c.execute("""CREATE TABLE IF NOT EXISTS Skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        skill_name TEXT NOT NULL,
        type TEXT CHECK(type IN ('have','want')),
        time_required INTEGER DEFAULT 30,
        value INTEGER DEFAULT 5
    )""")

    c.execute("""CREATE TABLE IF NOT EXISTS Learning_Log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER, skill TEXT,
        time_spent INTEGER, date DATE DEFAULT (date('now'))
    )""")

    conn.commit()
    conn.close()


def seed_data():
    """Insert dummy users and skills for testing."""
    conn = get_conn()
    c = conn.cursor()

    # Skip if already seeded
    if c.execute("SELECT COUNT(*) FROM Users").fetchone()[0] > 0:
        conn.close()
        return

    # 6 dummy users
    users = [
        ("chhavi",      hash_password("chhavi@123"),      80),
        ("vivek",       hash_password("vivek@123"),       70),
        ("deepak",      hash_password("deepak@123"),      90),
        ("jayprakash",  hash_password("jayprakash@123"),  60),
        ("aashutosh",   hash_password("aashutosh@123"),   75),
        ("riya",        hash_password("riya@123"),        50),
    ]
    for name, pwd, score in users:
        c.execute("INSERT INTO Users(name,password,trust_score) VALUES(?,?,?)", (name, pwd, score))

    # Skills: (user_id, skill_name, type, time_required, value)
    skills = [
        (1, "Python",           "have", 30, 9),
        (1, "Machine Learning", "have", 45, 8),
        (1, "Web Development",  "want", 60, 7),
        (1, "React",            "want", 40, 6),

        (2, "Web Development",  "have", 30, 8),
        (2, "JavaScript",       "have", 25, 7),
        (2, "Python",           "want", 45, 8),
        (2, "Data Science",     "want", 60, 9),

        (3, "Data Science",     "have", 40, 9),
        (3, "SQL",              "have", 20, 6),
        (3, "Machine Learning", "want", 50, 8),
        (3, "Cloud Computing",  "want", 55, 7),

        (4, "React",            "have", 35, 7),
        (4, "CSS",              "have", 20, 5),
        (4, "Python",           "want", 45, 8),
        (4, "SQL",              "want", 30, 6),

        (5, "Cloud Computing",  "have", 40, 8),
        (5, "DevOps",           "have", 50, 7),
        (5, "React",            "want", 35, 6),
        (5, "JavaScript",       "want", 30, 7),

        (6, "JavaScript",       "have", 25, 6),
        (6, "Node.js",          "have", 35, 5),
        (6, "Cloud Computing",  "want", 50, 8),
        (6, "DevOps",           "want", 55, 7),
    ]
    for uid, sname, stype, treq, val in skills:
        c.execute("INSERT INTO Skills(user_id,skill_name,type,time_required,value) VALUES(?,?,?,?,?)",
                  (uid, sname, stype, treq, val))

    conn.commit()
    conn.close()


# ===== Helper Functions =====

def signup(name, password):
    """Register new user. Returns (success, message)."""
    if len(password) < 6:
        return False, "Password must be at least 6 characters."
    conn = get_conn()
    try:
        conn.execute("INSERT INTO Users(name,password) VALUES(?,?)", (name.lower(), hash_password(password)))
        conn.commit()
        conn.close()
        return True, "Account created!"
    except sqlite3.IntegrityError:
        conn.close()
        return False, "Username already exists."


def login(name, password):
    """Login user. Returns (user_row or None)."""
    conn = get_conn()
    user = conn.execute("SELECT * FROM Users WHERE name=? AND password=?",
                        (name.lower(), hash_password(password))).fetchone()
    conn.close()
    return user


def get_all_users():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM Users").fetchall()
    conn.close()
    return rows


def get_skills(user_id, skill_type=None):
    conn = get_conn()
    if skill_type:
        rows = conn.execute("SELECT * FROM Skills WHERE user_id=? AND type=?", (user_id, skill_type)).fetchall()
    else:
        rows = conn.execute("SELECT * FROM Skills WHERE user_id=?", (user_id,)).fetchall()
    conn.close()
    return rows


def add_skill(user_id, name, stype, time_req=30, value=5):
    conn = get_conn()
    conn.execute("INSERT INTO Skills(user_id,skill_name,type,time_required,value) VALUES(?,?,?,?,?)",
                 (user_id, name, stype, time_req, value))
    conn.commit()
    conn.close()


def delete_skill(skill_id):
    conn = get_conn()
    conn.execute("DELETE FROM Skills WHERE id=?", (skill_id,))
    conn.commit()
    conn.close()


def get_all_skills():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM Skills").fetchall()
    conn.close()
    return rows
