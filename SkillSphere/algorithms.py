"""
algorithms.py - BFS & 0/1 Knapsack for SkillSphere AI (Simplified)
Contains both core algorithm implementations.
"""

from collections import defaultdict, deque
from database import get_all_users, get_all_skills


# ============================================================
#  BREADTH-FIRST SEARCH (BFS) - Shortest Learning Path
# ============================================================

class SkillGraph:
    """
    Skill Network Graph using Adjacency List.
    - Node = User
    - Edge = User A has a skill that User B wants
    """

    def __init__(self):
        self.adj_list = defaultdict(set)   # {user_id: set of neighbor ids}
        self.user_names = {}                # {user_id: username}

    def build_graph(self):
        """Build adjacency list from skill matches in database."""
        self.adj_list.clear()
        self.user_names.clear()

        users = get_all_users()
        skills = get_all_skills()

        # Map user IDs to names
        for u in users:
            self.user_names[u["id"]] = u["name"]
            self.adj_list[u["id"]] = set()

        # Group skills by user
        have = defaultdict(list)  # user_id -> [skill_names they have]
        want = defaultdict(list)  # user_id -> [skill_names they want]
        for s in skills:
            if s["type"] == "have":
                have[s["user_id"]].append(s["skill_name"])
            else:
                want[s["user_id"]].append(s["skill_name"])

        # Create edge if User A has what User B wants
        for a in self.user_names:
            for b in self.user_names:
                if a != b:
                    # Check if A's "have" skills overlap with B's "want" skills
                    if set(have.get(a, [])) & set(want.get(b, [])):
                        self.adj_list[a].add(b)
                        self.adj_list[b].add(a)

    def bfs_shortest_path(self, start, end):
        """
        BFS Algorithm: Find shortest path between two users.

        How it works:
        1. Start from source node, add to queue
        2. Visit all neighbors (FIFO order)
        3. Track visited nodes to avoid cycles
        4. First time we reach target = shortest path

        Time Complexity:  O(V + E)
        Space Complexity: O(V)
        """
        if start == end:
            return [start]

        queue = deque()              # BFS uses a FIFO queue
        queue.append((start, [start]))  # (current_node, path_so_far)
        visited = {start}            # Track visited to avoid cycles

        while queue:
            current, path = queue.popleft()  # FIFO: remove from front

            for neighbor in self.adj_list[current]:
                if neighbor == end:
                    return path + [end]      # Found! Return path

                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append((neighbor, path + [neighbor]))

        return []  # No path exists

    def bfs_top3_paths(self, start, end):
        """
        Enhanced BFS: Find top 3 shortest paths.
        Unlike standard BFS, we allow revisiting nodes across different paths.
        """
        if start == end:
            return [[start]]

        queue = deque([(start, [start])])
        found = []

        while queue and len(found) < 3:
            current, path = queue.popleft()

            if len(path) > 8:  # Limit path length
                continue

            for neighbor in self.adj_list[current]:
                if neighbor in path:  # Avoid cycles within same path
                    continue

                new_path = path + [neighbor]
                if neighbor == end:
                    found.append(new_path)
                else:
                    queue.append((neighbor, new_path))

        found.sort(key=len)  # Shortest first
        return found[:3]

    def dfs_path(self, start, end, visited=None, path=None):
        """
        DFS Algorithm: Find any path between two users (Depth-First).
        
        How it works:
        1. Explore as far as possible along each branch before backtracking.
        2. Uses recursion (implicit stack).
        
        Time Complexity:  O(V + E)
        Space Complexity: O(V)
        """
        if visited is None:
            visited = set()
        if path is None:
            path = [start]
            
        visited.add(start)
        
        if start == end:
            return path
            
        for neighbor in self.adj_list[start]:
            if neighbor not in visited:
                result = self.dfs_path(neighbor, end, visited, path + [neighbor])
                if result:
                    return result
        return []


# ============================================================
#  0/1 KNAPSACK - Daily Learning Plan Optimizer
# ============================================================

def knapsack_optimize(skills_list, available_time):
    """
    0/1 Knapsack using Dynamic Programming.

    Problem: Given limited time, which skills to learn
             to maximize total value?

    Each skill has:
      - time_required (weight)
      - value (profit)

    DP Table:
      dp[i][w] = max value using first i items with capacity w

    Recurrence:
      dp[i][w] = max(
          dp[i-1][w],                         # Skip item i
          dp[i-1][w - weight[i]] + value[i]   # Take item i
      )

    Time Complexity:  O(n * W)
    Space Complexity: O(n * W)
    """
    n = len(skills_list)
    W = int(available_time)

    if n == 0 or W <= 0:
        return [], 0, 0

    # Step 1: Build DP table (n+1 rows, W+1 columns)
    dp = [[0] * (W + 1) for _ in range(n + 1)]

    # Step 2: Fill table bottom-up
    for i in range(1, n + 1):
        wt = skills_list[i-1]["time"]     # Weight of item i
        val = skills_list[i-1]["value"]   # Value of item i

        for w in range(W + 1):
            dp[i][w] = dp[i-1][w]         # Don't take item i

            if wt <= w:                   # Can we fit item i?
                take = dp[i-1][w - wt] + val
                dp[i][w] = max(dp[i][w], take)  # Take if better

    # Step 3: Backtrack to find selected items
    selected = []
    w = W
    for i in range(n, 0, -1):
        if dp[i][w] != dp[i-1][w]:        # Item i was taken
            selected.append(skills_list[i-1])
            w -= skills_list[i-1]["time"]

    selected.reverse()
    total_value = sum(s["value"] for s in selected)
    total_time = sum(s["time"] for s in selected)

    return selected, total_value, total_time


# ============================================================
#  MERGE SORT - Sort Skills by Value or Time
# ============================================================

def merge_sort_skills(skills, key='value', reverse=True):
    """
    Merge Sort Algorithm (Divide and Conquer).
    Used to sort the skills list efficiently.
    
    Time Complexity:  O(n log n)
    Space Complexity: O(n)
    """
    if len(skills) <= 1:
        return skills
        
    mid = len(skills) // 2
    left = merge_sort_skills(skills[:mid], key, reverse)
    right = merge_sort_skills(skills[mid:], key, reverse)
    
    return _merge(left, right, key, reverse)

def _merge(left, right, key, reverse):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if reverse:
            condition = left[i][key] >= right[j][key]
        else:
            condition = left[i][key] <= right[j][key]
            
        if condition:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
            
    result.extend(left[i:])
    result.extend(right[j:])
    return result
