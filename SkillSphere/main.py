"""
main.py - SkillSphere AI (Simplified)
Smart Skill Network & Learning Optimizer

4 Screens: Dashboard, Profile, Skill Network (BFS), Optimizer (Knapsack)
Run: python main.py
"""

import tkinter as tk
from tkinter import ttk, messagebox
import math
import sys, os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import (init_db, seed_data, login, signup, get_all_users,
                       get_skills, add_skill, delete_skill)
from algorithms import SkillGraph, knapsack_optimize, merge_sort_skills

# ============================================================
#  THEME COLORS (Dark Mode)
# ============================================================
BG       = "#0f0f1a"
CARD     = "#1a1a2e"
SIDEBAR  = "#141425"
INPUT    = "#252540"
HOVER    = "#2a2a4a"
PURPLE   = "#7c3aed"
CYAN     = "#06b6d4"
GREEN    = "#10b981"
RED      = "#ef4444"
YELLOW   = "#f59e0b"
PINK     = "#ec4899"
WHITE    = "#e2e8f0"
GRAY     = "#94a3b8"
MUTED    = "#64748b"
BORDER   = "#2d2d50"

FONT = "Segoe UI"


# ============================================================
#  MAIN APPLICATION
# ============================================================

class SkillSphereApp:
    def __init__(self):
        init_db()
        seed_data()

        self.root = tk.Tk()
        self.root.title("SkillSphere AI - Smart Skill Network & Learning Optimizer")
        self.root.geometry("1200x700")
        self.root.configure(bg=BG)
        self.root.minsize(1000, 600)

        self.user = None
        self.current_page = None
        self.nav_buttons = {}

        self.show_login()

    # ========================================================
    #  LOGIN / SIGNUP PAGE
    # ========================================================
    def show_login(self):
        self._clear()

        frame = tk.Frame(self.root, bg=BG)
        frame.pack(fill="both", expand=True)

        # Center card
        card = tk.Frame(frame, bg=CARD, highlightbackground=BORDER, highlightthickness=2)
        card.place(relx=0.5, rely=0.5, anchor="center", width=440, height=520)

        # Branding
        tk.Label(card, text="SkillSphere AI",
                 font=(FONT, 26, "bold"), bg=CARD, fg=WHITE).pack(pady=(40, 5))
        tk.Label(card, text="Smart Skill Network & Learning Optimizer",
                 font=(FONT, 11), bg=CARD, fg=GRAY).pack()

        # Purple divider
        tk.Frame(card, bg=PURPLE, height=3).pack(fill="x", padx=50, pady=20)

        self._login_mode = "login"
        self._mode_label = tk.Label(card, text="Welcome Back",
                                     font=(FONT, 16, "bold"), bg=CARD, fg=WHITE)
        self._mode_label.pack()

        # Username field
        tk.Label(card, text="Username", font=(FONT, 12),
                 bg=CARD, fg=GRAY, anchor="w").pack(fill="x", padx=50, pady=(18, 4))
        self._user_entry = tk.Entry(card, font=(FONT, 13), bg=INPUT, fg=WHITE,
                                     insertbackground=WHITE, relief="flat")
        self._user_entry.pack(fill="x", padx=50, ipady=8)

        # Password field
        tk.Label(card, text="Password", font=(FONT, 12),
                 bg=CARD, fg=GRAY, anchor="w").pack(fill="x", padx=50, pady=(12, 4))
        self._pass_entry = tk.Entry(card, font=(FONT, 13), bg=INPUT, fg=WHITE,
                                     insertbackground=WHITE, relief="flat", show="*")
        self._pass_entry.pack(fill="x", padx=50, ipady=8)

        # Error message
        self._err_label = tk.Label(card, text="", font=(FONT, 11), bg=CARD, fg=RED)
        self._err_label.pack(pady=8)

        # Login button
        self._action_btn = tk.Button(card, text="LOGIN", font=(FONT, 13, "bold"),
                                      bg=PURPLE, fg="white", relief="flat", cursor="hand2",
                                      activebackground="#6d28d9", command=self._do_auth)
        self._action_btn.pack(fill="x", padx=50, ipady=10)

        # Toggle signup/login
        toggle = tk.Frame(card, bg=CARD)
        toggle.pack(pady=10)
        self._toggle_txt = tk.Label(toggle, text="No account?",
                                     font=(FONT, 11), bg=CARD, fg=GRAY)
        self._toggle_txt.pack(side="left")
        self._toggle_link = tk.Label(toggle, text="  Sign Up",
                                      font=(FONT, 11, "bold"), bg=CARD, fg=CYAN, cursor="hand2")
        self._toggle_link.pack(side="left")
        self._toggle_link.bind("<Button-1>", lambda e: self._toggle_mode())

        # Demo hint
        tk.Label(card, text="Demo:  chhavi / chhavi@123",
                 font=(FONT, 10), bg=CARD, fg=MUTED).pack(pady=(5, 15))

        # Enter key binding
        self._pass_entry.bind("<Return>", lambda e: self._do_auth())
        self._user_entry.bind("<Return>", lambda e: self._pass_entry.focus())

    def _toggle_mode(self):
        if self._login_mode == "login":
            self._login_mode = "signup"
            self._mode_label.config(text="Create Account")
            self._action_btn.config(text="SIGN UP")
            self._toggle_txt.config(text="Have an account?")
            self._toggle_link.config(text="  Log In")
        else:
            self._login_mode = "login"
            self._mode_label.config(text="Welcome Back")
            self._action_btn.config(text="LOGIN")
            self._toggle_txt.config(text="No account?")
            self._toggle_link.config(text="  Sign Up")
        self._err_label.config(text="")

    def _do_auth(self):
        name = self._user_entry.get().strip()
        pwd = self._pass_entry.get().strip()
        if not name or not pwd:
            self._err_label.config(text="Please enter both fields.")
            return

        if self._login_mode == "signup":
            ok, msg = signup(name, pwd)
            self._err_label.config(text=msg, fg=GREEN if ok else RED)
            if ok:
                self._toggle_mode()
        else:
            user = login(name, pwd)
            if user:
                self.user = dict(user)
                self._show_main()
            else:
                self._err_label.config(text="Invalid username or password.", fg=RED)

    # ========================================================
    #  MAIN LAYOUT (Sidebar + Content Area)
    # ========================================================
    def _show_main(self):
        self._clear()

        # --- SIDEBAR ---
        sidebar = tk.Frame(self.root, bg=SIDEBAR, width=230)
        sidebar.pack(side="left", fill="y")
        sidebar.pack_propagate(False)

        # Brand
        tk.Label(sidebar, text="SkillSphere AI",
                 font=(FONT, 15, "bold"), bg=SIDEBAR, fg=WHITE).pack(pady=(25, 3))
        tk.Label(sidebar, text=f"Hi, {self.user['name'].capitalize()}!",
                 font=(FONT, 12), bg=SIDEBAR, fg=CYAN).pack(pady=(0, 20))

        tk.Frame(sidebar, bg=BORDER, height=1).pack(fill="x", padx=15)
        tk.Frame(sidebar, bg=SIDEBAR, height=10).pack()

        # Navigation buttons (4 pages, no chat)
        nav = [
            ("  Dashboard",     "dashboard"),
            ("  Profile",       "profile"),
            ("  Skill Network", "graph"),
            ("  Optimizer",     "optimizer"),
        ]

        self.nav_buttons = {}
        for label, page in nav:
            btn = tk.Button(sidebar, text=label, font=(FONT, 13),
                            bg=SIDEBAR, fg=GRAY, relief="flat", anchor="w",
                            cursor="hand2", activebackground=HOVER,
                            command=lambda p=page: self._go(p))
            btn.pack(fill="x", padx=10, pady=3, ipady=8)
            self.nav_buttons[page] = btn

        # Spacer pushes logout to bottom
        tk.Frame(sidebar, bg=SIDEBAR).pack(fill="both", expand=True)

        # Logout
        tk.Frame(sidebar, bg=BORDER, height=1).pack(fill="x", padx=15)
        tk.Button(sidebar, text="  Logout", font=(FONT, 12),
                  bg=SIDEBAR, fg=RED, relief="flat", anchor="w",
                  cursor="hand2", command=self._logout
                  ).pack(fill="x", padx=10, pady=15, ipady=6)

        # --- CONTENT AREA ---
        self.content = tk.Frame(self.root, bg=BG)
        self.content.pack(side="left", fill="both", expand=True)

        self._go("dashboard")

    def _go(self, page):
        """Navigate to a page."""
        for w in self.content.winfo_children():
            w.destroy()
        self.current_page = page

        # Highlight active nav button
        for name, btn in self.nav_buttons.items():
            if name == page:
                btn.config(bg=PURPLE, fg="white")
            else:
                btn.config(bg=SIDEBAR, fg=GRAY)

        # Render the page
        if page == "dashboard":    self._page_dashboard()
        elif page == "profile":    self._page_profile()
        elif page == "graph":      self._page_graph()
        elif page == "optimizer":  self._page_optimizer()

    def _logout(self):
        self.user = None
        self.show_login()

    def _clear(self):
        for w in self.root.winfo_children():
            w.destroy()

    # ========================================================
    #  PAGE 1: DASHBOARD
    # ========================================================
    def _page_dashboard(self):
        f = tk.Frame(self.content, bg=BG)
        f.pack(fill="both", expand=True, padx=30, pady=25)

        # Welcome header
        tk.Label(f, text=f"Welcome, {self.user['name'].capitalize()}!",
                 font=(FONT, 24, "bold"), bg=BG, fg=WHITE, anchor="w").pack(fill="x")
        tk.Label(f, text="Your Learning Dashboard",
                 font=(FONT, 13), bg=BG, fg=GRAY, anchor="w").pack(fill="x", pady=(2, 20))

        # --- Stat Cards Row ---
        cards = tk.Frame(f, bg=BG)
        cards.pack(fill="x")

        have = get_skills(self.user["id"], "have")
        want = get_skills(self.user["id"], "want")

        total_val = sum(s['value'] for s in have)

        stats = [
            ("Skills I Have",  str(len(have)),  PURPLE),
            ("Skills I Want",  str(len(want)),  CYAN),
            ("My Total Value", str(total_val),  YELLOW),
            ("Total Users",    str(len(get_all_users())), GREEN),
        ]

        for i, (title, val, color) in enumerate(stats):
            cards.columnconfigure(i, weight=1)
            c = tk.Frame(cards, bg=CARD, highlightbackground=BORDER, highlightthickness=1)
            c.grid(row=0, column=i, padx=8, sticky="nsew")

            tk.Label(c, text=val, font=(FONT, 34, "bold"),
                     bg=CARD, fg=color).pack(padx=20, pady=(20, 4))
            tk.Label(c, text=title, font=(FONT, 12),
                     bg=CARD, fg=GRAY).pack(padx=20, pady=(0, 20))

        # --- Skills Summary ---
        tk.Label(f, text="My Skills Overview",
                 font=(FONT, 16, "bold"), bg=BG, fg=WHITE, anchor="w").pack(fill="x", pady=(25, 10))

        card = tk.Frame(f, bg=CARD, highlightbackground=BORDER, highlightthickness=1)
        card.pack(fill="x")

        for s in have:
            row = tk.Frame(card, bg=CARD)
            row.pack(fill="x", padx=20, pady=5)
            tk.Label(row, text="HAVE", font=(FONT, 10, "bold"),
                     bg=GREEN, fg="white", width=6).pack(side="left", padx=(0, 12))
            tk.Label(row, text=s['skill_name'], font=(FONT, 13),
                     bg=CARD, fg=WHITE, anchor="w").pack(side="left")
            tk.Label(row, text=f"{s['time_required']} min  |  value = {s['value']}",
                     font=(FONT, 11), bg=CARD, fg=MUTED).pack(side="right")

        for s in want:
            row = tk.Frame(card, bg=CARD)
            row.pack(fill="x", padx=20, pady=5)
            tk.Label(row, text="WANT", font=(FONT, 10, "bold"),
                     bg=PINK, fg="white", width=6).pack(side="left", padx=(0, 12))
            tk.Label(row, text=s['skill_name'], font=(FONT, 13),
                     bg=CARD, fg=WHITE, anchor="w").pack(side="left")
            tk.Label(row, text=f"{s['time_required']} min  |  value = {s['value']}",
                     font=(FONT, 11), bg=CARD, fg=MUTED).pack(side="right")

        if not have and not want:
            tk.Label(card, text="No skills yet. Go to Profile to add some!",
                     font=(FONT, 13), bg=CARD, fg=MUTED).pack(padx=20, pady=20)

        tk.Frame(card, bg=CARD, height=12).pack()

    # ========================================================
    #  PAGE 2: PROFILE (Add/Delete Skills)
    # ========================================================
    def _page_profile(self):
        f = tk.Frame(self.content, bg=BG)
        f.pack(fill="both", expand=True, padx=30, pady=25)

        tk.Label(f, text="My Profile",
                 font=(FONT, 24, "bold"), bg=BG, fg=WHITE, anchor="w").pack(fill="x")

        # --- User Info Card ---
        info = tk.Frame(f, bg=CARD, highlightbackground=BORDER, highlightthickness=1)
        info.pack(fill="x", pady=(15, 10))
        inner = tk.Frame(info, bg=CARD)
        inner.pack(padx=25, pady=18, fill="x")

        tk.Label(inner, text=f"User:  {self.user['name'].capitalize()}",
                 font=(FONT, 16, "bold"), bg=CARD, fg=WHITE).pack(side="left")

        # --- Add Skill Section ---
        add_card = tk.Frame(f, bg=CARD, highlightbackground=PURPLE, highlightthickness=1)
        add_card.pack(fill="x", pady=8)

        tk.Label(add_card, text="Add New Skill",
                 font=(FONT, 14, "bold"), bg=CARD, fg=PURPLE).pack(padx=20, pady=(15, 8), anchor="w")

        add_row = tk.Frame(add_card, bg=CARD)
        add_row.pack(padx=20, pady=(0, 15), fill="x")

        tk.Label(add_row, text="Name:", font=(FONT, 12), bg=CARD, fg=GRAY).pack(side="left")
        name_e = tk.Entry(add_row, font=(FONT, 12), bg=INPUT, fg=WHITE,
                          insertbackground=WHITE, relief="flat", width=16)
        name_e.pack(side="left", padx=8, ipady=5)

        tk.Label(add_row, text="Type:", font=(FONT, 12), bg=CARD, fg=GRAY).pack(side="left", padx=(10, 0))
        type_var = tk.StringVar(value="have")
        ttk.Combobox(add_row, textvariable=type_var, values=["have", "want"],
                     width=7, state="readonly", font=(FONT, 11)).pack(side="left", padx=8)

        tk.Label(add_row, text="Time:", font=(FONT, 12), bg=CARD, fg=GRAY).pack(side="left", padx=(10, 0))
        time_e = tk.Entry(add_row, font=(FONT, 12), bg=INPUT, fg=WHITE,
                          insertbackground=WHITE, relief="flat", width=5)
        time_e.insert(0, "30")
        time_e.pack(side="left", padx=4, ipady=5)
        tk.Label(add_row, text="min", font=(FONT, 10), bg=CARD, fg=MUTED).pack(side="left")

        tk.Label(add_row, text="Value:", font=(FONT, 12), bg=CARD, fg=GRAY).pack(side="left", padx=(10, 0))
        val_e = tk.Entry(add_row, font=(FONT, 12), bg=INPUT, fg=WHITE,
                         insertbackground=WHITE, relief="flat", width=4)
        val_e.insert(0, "5")
        val_e.pack(side="left", padx=4, ipady=5)

        def do_add():
            n = name_e.get().strip()
            if not n:
                messagebox.showwarning("Warning", "Enter a skill name.")
                return
            try:
                t, v = int(time_e.get()), int(val_e.get())
            except ValueError:
                messagebox.showerror("Error", "Time and Value must be numbers.")
                return
            add_skill(self.user["id"], n, type_var.get(), t, v)
            self._go("profile")

        tk.Button(add_row, text="  + Add Skill  ", font=(FONT, 12, "bold"),
                  bg=GREEN, fg="white", relief="flat", cursor="hand2",
                  command=do_add).pack(side="left", padx=15)

        # --- Skills Lists ---
        for stype, title, color in [("have", "Skills I Have", GREEN), ("want", "Skills I Want to Learn", PINK)]:
            tk.Label(f, text=title, font=(FONT, 15, "bold"),
                     bg=BG, fg=color, anchor="w").pack(fill="x", pady=(18, 6))

            skills = get_skills(self.user["id"], stype)
            card = tk.Frame(f, bg=CARD, highlightbackground=BORDER, highlightthickness=1)
            card.pack(fill="x")

            if not skills:
                tk.Label(card, text="  No skills added yet.",
                         font=(FONT, 12), bg=CARD, fg=MUTED).pack(padx=20, pady=12)
            else:
                for s in skills:
                    row = tk.Frame(card, bg=CARD)
                    row.pack(fill="x", padx=15, pady=5)

                    tk.Label(row, text=s['skill_name'], font=(FONT, 13),
                             bg=CARD, fg=WHITE, anchor="w").pack(side="left")
                    tk.Label(row, text=f"  {s['time_required']} min, value = {s['value']}",
                             font=(FONT, 11), bg=CARD, fg=MUTED).pack(side="left", padx=10)

                    del_btn = tk.Button(row, text=" Delete ", font=(FONT, 10),
                                        bg="#3b1a1a", fg=RED, relief="flat", cursor="hand2",
                                        command=lambda sid=s["id"]: [delete_skill(sid), self._go("profile")])
                    del_btn.pack(side="right", padx=5)

            tk.Frame(card, bg=CARD, height=8).pack()

    # ========================================================
    #  PAGE 3: SKILL NETWORK GRAPH + BFS
    # ========================================================
    def _page_graph(self):
        f = tk.Frame(self.content, bg=BG)
        f.pack(fill="both", expand=True, padx=30, pady=25)

        tk.Label(f, text="Skill Network Graph (BFS)",
                 font=(FONT, 24, "bold"), bg=BG, fg=WHITE, anchor="w").pack(fill="x")
        tk.Label(f, text="Each user = node.  Edge = one user has a skill another wants.",
                 font=(FONT, 12), bg=BG, fg=GRAY, anchor="w").pack(fill="x", pady=(3, 12))

        # Build graph
        graph = SkillGraph()
        graph.build_graph()

        # --- BFS Controls ---
        ctrl = tk.Frame(f, bg=CARD, highlightbackground=BORDER, highlightthickness=1)
        ctrl.pack(fill="x", pady=(0, 10))
        ctrl_in = tk.Frame(ctrl, bg=CARD)
        ctrl_in.pack(padx=20, pady=14, fill="x")

        tk.Label(ctrl_in, text="Find Learning Path:", font=(FONT, 13, "bold"),
                 bg=CARD, fg=WHITE).pack(side="left")

        users = get_all_users()
        user_opts = [f"{u['id']}: {u['name'].capitalize()}" for u in users]

        tk.Label(ctrl_in, text="  From:", font=(FONT, 12), bg=CARD, fg=GRAY).pack(side="left")
        from_var = tk.StringVar()
        ttk.Combobox(ctrl_in, textvariable=from_var, values=user_opts,
                     width=16, state="readonly", font=(FONT, 11)).pack(side="left", padx=6)

        # Set current user as default
        for opt in user_opts:
            if opt.startswith(f"{self.user['id']}:"):
                from_var.set(opt)

        tk.Label(ctrl_in, text="  To:", font=(FONT, 12), bg=CARD, fg=GRAY).pack(side="left")
        to_var = tk.StringVar()
        ttk.Combobox(ctrl_in, textvariable=to_var, values=user_opts,
                     width=16, state="readonly", font=(FONT, 11)).pack(side="left", padx=6)
                     
        tk.Label(ctrl_in, text="  Alg:", font=(FONT, 12), bg=CARD, fg=GRAY).pack(side="left")
        algo_var = tk.StringVar(value="BFS (Shortest)")
        ttk.Combobox(ctrl_in, textvariable=algo_var, values=["BFS (Shortest)", "DFS (Any Path)"],
                     width=15, state="readonly", font=(FONT, 11)).pack(side="left", padx=6)

        # Results text
        result_label = tk.Label(f, text="", font=(FONT, 12), bg=BG, fg=WHITE,
                                justify="left", anchor="w", wraplength=800)
        result_label.pack(fill="x", pady=(0, 5))

        # --- Graph Canvas ---
        canvas = tk.Canvas(f, bg="#0d0d1a", highlightthickness=0)
        canvas.pack(fill="both", expand=True, pady=5)

        # Draw after layout updates
        f.update_idletasks()
        cw = max(canvas.winfo_width(), 700)
        ch = max(canvas.winfo_height(), 350)
        cx, cy = cw // 2, ch // 2
        rad = min(cw, ch) * 0.35
        n = len(users)
        positions = {}

        # Calculate circular positions
        for i, u in enumerate(users):
            angle = (2 * math.pi * i) / max(n, 1) - math.pi / 2
            positions[u["id"]] = (cx + rad * math.cos(angle), cy + rad * math.sin(angle))

        # Draw edges
        drawn = set()
        for uid in graph.adj_list:
            for nid in graph.adj_list[uid]:
                key = (min(uid, nid), max(uid, nid))
                if key not in drawn and uid in positions and nid in positions:
                    drawn.add(key)
                    x1, y1 = positions[uid]
                    x2, y2 = positions[nid]
                    canvas.create_line(x1, y1, x2, y2, fill="#2a2a5a", width=2)

        # Draw nodes
        nr = 40  # increased circle size
        for u in users:
            x, y = positions[u["id"]]
            color = PURPLE if u["id"] == self.user["id"] else CYAN
            canvas.create_oval(x-nr, y-nr, x+nr, y+nr, fill=color, outline="#67e8f9", width=2)
            canvas.create_text(x, y, text=u["name"][:4].upper(),
                              fill="white", font=(FONT, 9, "bold"))
            canvas.create_text(x, y + nr + 14, text=u["name"].capitalize(),
                              fill=GRAY, font=(FONT, 10))

        # Store references for animation
        self._gcanvas = canvas
        self._gpos = positions
        self._gobj = graph
        self._ghighlights = []

        def find_path():
            fs, ts = from_var.get(), to_var.get()
            if not fs or not ts:
                messagebox.showinfo("Info", "Please select both users.")
                return
            fid, tid = int(fs.split(":")[0]), int(ts.split(":")[0])
            if fid == tid:
                messagebox.showinfo("Info", "Same user selected.")
                return

            # Clear old highlights
            for item in self._ghighlights:
                canvas.delete(item)
            self._ghighlights.clear()

            is_dfs = "DFS" in algo_var.get()
            
            if is_dfs:
                path = graph.dfs_path(fid, tid)
                if not path:
                    result_label.config(text="No path found using DFS.", fg=RED)
                    return
                path_names = lambda p: " -> ".join([graph.user_names[x].capitalize() for x in p])
                result_label.config(text=f"DFS Path (length {len(path)-1}): {path_names(path)}", fg=GREEN)
                self._animate_bfs(path, 0)
                return

            shortest = graph.bfs_shortest_path(fid, tid)
            top3 = graph.bfs_top3_paths(fid, tid)

            if not shortest:
                result_label.config(text="No path found between these users.", fg=RED)
                return

            path_names = lambda p: " -> ".join([graph.user_names[x].capitalize() for x in p])
            txt = f"Shortest Path (length {len(shortest)-1}):  {path_names(shortest)}"
            if len(top3) > 1:
                for i, p in enumerate(top3[1:], 2):
                    txt += f"\nPath {i} (length {len(p)-1}):  {path_names(p)}"
            result_label.config(text=txt, fg=GREEN)

            # Animate path
            self._animate_bfs(shortest, 0)

        tk.Button(ctrl_in, text="  Find Path  ", font=(FONT, 12, "bold"),
                  bg=PURPLE, fg="white", relief="flat", cursor="hand2",
                  activebackground="#6d28d9", command=find_path).pack(side="left", padx=12)

    def _animate_bfs(self, path, step):
        """Step-by-step BFS path animation."""
        if step >= len(path) - 1:
            return
        c = self._gcanvas
        pos = self._gpos
        u1, u2 = path[step], path[step + 1]

        if u1 in pos and u2 in pos:
            x1, y1 = pos[u1]
            x2, y2 = pos[u2]
            glow = c.create_line(x1, y1, x2, y2, fill=GREEN, width=6)
            self._ghighlights.append(glow)
            x, y = pos[u2]
            ring = c.create_oval(x-32, y-32, x+32, y+32, outline=GREEN, width=3)
            self._ghighlights.append(ring)

        self.root.after(600, lambda: self._animate_bfs(path, step + 1))

    # ========================================================
    #  PAGE 4: LEARNING OPTIMIZER (0/1 KNAPSACK)
    # ========================================================
    def _page_optimizer(self):
        f = tk.Frame(self.content, bg=BG)
        f.pack(fill="both", expand=True, padx=30, pady=25)

        tk.Label(f, text="Learning Optimizer (0/1 Knapsack)",
                 font=(FONT, 24, "bold"), bg=BG, fg=WHITE, anchor="w").pack(fill="x")
        tk.Label(f, text="Find the best skills to learn within your available time using Dynamic Programming.",
                 font=(FONT, 12), bg=BG, fg=GRAY, anchor="w").pack(fill="x", pady=(3, 15))

        # --- Input Card ---
        inp = tk.Frame(f, bg=CARD, highlightbackground=BORDER, highlightthickness=1)
        inp.pack(fill="x")
        inp_in = tk.Frame(inp, bg=CARD)
        inp_in.pack(padx=25, pady=16, fill="x")

        tk.Label(inp_in, text="Available Time (minutes):",
                 font=(FONT, 14, "bold"), bg=CARD, fg=WHITE).pack(side="left")
        time_entry = tk.Entry(inp_in, font=(FONT, 14), bg=INPUT, fg=WHITE,
                              insertbackground=WHITE, relief="flat", width=8)
        time_entry.insert(0, "120")
        time_entry.pack(side="left", padx=15, ipady=6)

        results_frame = tk.Frame(f, bg=BG)
        results_frame.pack(fill="both", expand=True, pady=12)

        def optimize():
            try:
                avail = int(time_entry.get())
            except ValueError:
                messagebox.showerror("Error", "Enter a valid number.")
                return

            want_skills = get_skills(self.user["id"], "want")
            items = [{"name": s["skill_name"], "time": s["time_required"], "value": s["value"]}
                     for s in want_skills]

            if not items:
                messagebox.showinfo("Info", "No 'want' skills found.\nGo to Profile and add skills you want to learn!")
                return

            selected, total_val, total_time = knapsack_optimize(items, avail)

            # Clear old results
            for w in results_frame.winfo_children():
                w.destroy()

            # Show all available skills
            tk.Label(results_frame, text="All Available Skills (Want to Learn):",
                     font=(FONT, 14, "bold"), bg=BG, fg=GRAY, anchor="w").pack(fill="x", pady=(5, 6))

            for item in items:
                tk.Label(results_frame,
                         text=f"    {item['name']}   |   Time: {item['time']} min   |   Value: {item['value']}",
                         font=(FONT, 12), bg=BG, fg=MUTED, anchor="w").pack(fill="x", pady=1)

            # --- Optimal Result Card ---
            res_card = tk.Frame(results_frame, bg=CARD, highlightbackground=GREEN, highlightthickness=2)
            res_card.pack(fill="x", pady=(15, 8))

            tk.Label(res_card,
                     text=f"Optimal Plan (Knapsack DP)   |   Total Value: {total_val}   |   Time Used: {total_time}/{avail} min",
                     font=(FONT, 14, "bold"), bg=CARD, fg=GREEN).pack(padx=20, pady=(15, 10), anchor="w")

            for s in selected:
                row = tk.Frame(res_card, bg=CARD)
                row.pack(fill="x", padx=20, pady=4)

                tk.Label(row, text=f"  {s['name']}", font=(FONT, 13, "bold"),
                         bg=CARD, fg=WHITE, width=22, anchor="w").pack(side="left")

                # Progress bar showing time proportion
                bar_bg = tk.Frame(row, bg=INPUT, height=22)
                bar_bg.pack(side="left", fill="x", expand=True, padx=10)
                bar_bg.pack_propagate(False)
                pct = s["time"] / max(avail, 1)
                bar = tk.Frame(bar_bg, bg=GREEN)
                bar.place(relx=0, rely=0, relwidth=min(pct, 1.0), relheight=1.0)
                tk.Label(bar_bg, text=f" {s['time']} min", font=(FONT, 9, "bold"),
                         bg=GREEN, fg="white").place(relx=0.02, rely=0.1)

                tk.Label(row, text=f"value = {s['value']}", font=(FONT, 12),
                         bg=CARD, fg=YELLOW).pack(side="right", padx=8)

            # Time utilization bar
            util = (total_time / avail * 100) if avail > 0 else 0
            tk.Label(res_card, text=f"Time Utilization: {util:.0f}%",
                     font=(FONT, 13, "bold"), bg=CARD, fg=CYAN).pack(padx=20, pady=(10, 15), anchor="w")

        tk.Button(inp_in, text="  Optimize!  ", font=(FONT, 13, "bold"),
                  bg=GREEN, fg="white", relief="flat", cursor="hand2",
                  activebackground="#059669", command=optimize).pack(side="left", padx=10, ipady=4)

        # Algorithm explanation
        tk.Label(f, text="How it works:  dp[i][w] = max( skip item,  take item if it fits ).   Complexity: O(n x W)",
                 font=(FONT, 11), bg=BG, fg=MUTED, anchor="w").pack(fill="x", pady=(8, 0))

    # ========================================================
    #  RUN
    # ========================================================
    def run(self):
        self.root.mainloop()


if __name__ == "__main__":
    print("=" * 50)
    print("  SkillSphere AI - Starting...")
    print("  Demo:  chhavi / chhavi@123")
    print("=" * 50)
    app = SkillSphereApp()
    app.run()
