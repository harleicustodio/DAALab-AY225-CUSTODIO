import csv
import time
import sys
import os
import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import threading

# Increase recursion depth for Merge Sort on massive datasets
sys.setrecursionlimit(200000)

class SmoothSortingApp:
    def __init__(self, root):
        self.root = root
        self.root.title("✨ Sweet Sort Studio ✨")
        self.root.geometry("8000x950")
        self.root.configure(bg="#FFE5F1")  # Soft pink background
        
        self.file_path = ""
        self.sorted_results = []
        self.headers = []
        self.is_running = False
        
        self.setup_ui()

    def setup_ui(self):
        style = ttk.Style()
        style.theme_use('clam')
        
        bg_color = "#FFE5F1"  # Soft pink
        accent_pink = "#FF69B4"  # Hot pink
        pastel_pink = "#FFB6C1"  # Light pink
        rose = "#FFC0CB"  # Pink
        
        style.configure("TFrame", background=bg_color)
        style.configure("TLabel", background=bg_color, foreground="#8B4789", font=("Comic Sans MS", 10))
        style.configure("Header.TLabel", font=("Comic Sans MS", 20, "bold"), foreground=accent_pink)
        
        style.configure("CuteProgress.Horizontal.TProgressbar", 
                        troughcolor="#FFD1DC", 
                        background=accent_pink, 
                        thickness=25)

        header = ttk.Label(self.root, text="✿ SWEET SORT STUDIO ✿", style="Header.TLabel")
        header.pack(pady=20)

        # 1. Data Source Section
        file_frame = tk.LabelFrame(self.root, text=" ♡ Select Your Data ♡ ", 
                                   bg=bg_color, fg=accent_pink, 
                                   font=("Comic Sans MS", 11, "bold"),
                                   padx=15, pady=15)
        file_frame.pack(fill="x", padx=40, pady=10)
        
        self.btn_browse = tk.Button(file_frame, text="🌸 CHOOSE CSV FILE 🌸", 
                                    command=self.load_file, 
                                    bg=pastel_pink, fg="#8B4789", 
                                    font=("Comic Sans MS", 9, "bold"),
                                    relief="flat", padx=15, pady=8,
                                    cursor="heart")
        self.btn_browse.pack(side="left")
        
        self.lbl_file = ttk.Label(file_frame, text="Waiting for your lovely data...", 
                                 font=("Comic Sans MS", 9, "italic"),
                                 foreground="#C71585")
        self.lbl_file.pack(side="left", padx=20)

        # 2. Parameters Section
        config_frame = tk.LabelFrame(self.root, text=" ♡ Customize Settings ♡ ", 
                                     bg=bg_color, fg=accent_pink,
                                     font=("Comic Sans MS", 11, "bold"),
                                     padx=15, pady=15)
        config_frame.pack(fill="x", padx=40, pady=10)

        # Rows Input
        ttk.Label(config_frame, text="🎀 Rows (N):").grid(row=0, column=0, sticky="w", pady=5)
        self.ent_n = tk.Entry(config_frame, bg="#FFF0F5", fg=accent_pink, 
                             insertbackground="#FF69B4", borderwidth=2, 
                             relief="solid",
                             font=("Comic Sans MS", 11, "bold"))
        self.ent_n.insert(0, "100000")
        self.ent_n.grid(row=0, column=1, sticky="ew", padx=10, pady=5)

        # Algorithm Selection
        ttk.Label(config_frame, text="💖 Algorithm:").grid(row=1, column=0, sticky="w", pady=5)
        self.var_alg = tk.StringVar(value="Merge Sort")
        self.alg_menu = ttk.OptionMenu(config_frame, self.var_alg, "Merge Sort", 
                                       "Merge Sort", "Bubble Sort", "Insertion Sort")
        self.alg_menu.grid(row=1, column=1, sticky="ew", padx=10, pady=5)

        # Column Selection (Dynamic)
        ttk.Label(config_frame, text="🌷 Sort By:").grid(row=2, column=0, sticky="w", pady=5)
        self.var_col = tk.StringVar(value="Select Column")
        self.col_dropdown = ttk.OptionMenu(config_frame, self.var_col, "Load CSV first...")
        self.col_dropdown.grid(row=2, column=1, sticky="ew", padx=10, pady=5)
        
        config_frame.columnconfigure(1, weight=1)

        # 3. Action Buttons
        btn_frame = ttk.Frame(self.root)
        btn_frame.pack(fill="x", padx=40, pady=10)

        self.btn_run = tk.Button(btn_frame, text="✨ START SORTING ✨", 
                                bg=accent_pink, fg="white", 
                                font=("Comic Sans MS", 11, "bold"), 
                                command=self.run_benchmark_threaded,
                                relief="raised", borderwidth=3,
                                cursor="heart", pady=10)
        self.btn_run.pack(side="left", expand=True, fill="x", padx=5)

        self.btn_stop = tk.Button(btn_frame, text="⛔ STOP", 
                                 bg="#FF1493", fg="white", 
                                 font=("Comic Sans MS", 10, "bold"),
                                 state="disabled", command=self.stop, 
                                 width=10, relief="raised", borderwidth=3)
        self.btn_stop.pack(side="left", padx=5)

        self.btn_export = tk.Button(btn_frame, text="💾 SAVE CSV", 
                                   bg="#FF85C1", fg="white", 
                                   font=("Comic Sans MS", 10, "bold"),
                                   state="disabled", command=self.export_csv, 
                                   width=15, relief="raised", borderwidth=3)
        self.btn_export.pack(side="left", padx=5)

        # 4. Progress Visualization
        self.progress_var = tk.DoubleVar()
        self.progress = ttk.Progressbar(self.root, variable=self.progress_var, 
                                       maximum=100, 
                                       style="CuteProgress.Horizontal.TProgressbar")
        self.progress.pack(fill="x", padx=40, pady=(20, 5))

        self.lbl_progress = tk.Label(self.root, text="💕 READY TO SORT 💕", 
                                    font=("Comic Sans MS", 12, "bold"), 
                                    bg=bg_color, fg=accent_pink)
        self.lbl_progress.pack(pady=5)

        # 5. Result Preview Terminal
        preview_header = tk.Label(self.root, text="✿ RESULTS & PREVIEW ✿", 
                                 bg=bg_color, fg="#C71585", 
                                 font=("Comic Sans MS", 10, "bold"))
        preview_header.pack(padx=40, anchor="w", pady=(10, 0))
        
        self.txt_output = tk.Text(self.root, bg="#FFF0F5", fg="#8B4789", 
                                 font=("Courier New", 10), height=15, 
                                 borderwidth=3, relief="solid",
                                 padx=15, pady=15)
        self.txt_output.pack(padx=40, pady=(5, 20), fill="both", expand=True)

    def load_file(self):
        path = filedialog.askopenfilename(filetypes=[("CSV Files", "*.csv")])
        if path:
            self.file_path = path
            self.lbl_file.config(text=f"✓ {os.path.basename(path)}", foreground="#FF1493")
            
            with open(path, 'r', encoding='utf-8') as f:
                reader = csv.reader(f)
                headers = next(reader)
                self.headers = headers
                
                # Update Column Dropdown dynamically
                menu = self.col_dropdown["menu"]
                menu.delete(0, "end")
                for col in headers:
                    menu.add_command(label=col, command=lambda c=col: self.var_col.set(c))
                self.var_col.set(headers[0])

    def stop(self):
        self.is_running = False
        self.lbl_progress.config(text="🛑 STOPPING...", fg="#FF1493")

    def run_benchmark_threaded(self):
        if not self.file_path: return messagebox.showerror("Oops!", "Please select a CSV file first! 🌸")
        try:
            n = int(self.ent_n.get())
        except ValueError: return messagebox.showerror("Oops!", "Rows must be a valid number! 💕")

        alg = self.var_alg.get()
        col = self.var_col.get()
        
        if n > 25000 and alg in ["Bubble Sort", "Insertion Sort"]:
            if not messagebox.askyesno("💭 Heads Up!", 
                                      f"{alg} on {n} rows might take a while! Continue? 🌷"):
                return

        self.is_running = True
        self.btn_run.config(state="disabled", text="✨ WORKING... ✨")
        self.btn_stop.config(state="normal")
        self.btn_export.config(state="disabled")
        self.txt_output.delete("1.0", tk.END)
        self.progress_var.set(0)
        
        threading.Thread(target=self.logic, daemon=True).start()

    def get_val(self, row, col):
        """Intelligent comparison: ID as float/int, Names as string."""
        v = row.get(col, "")
        if col.lower() == "id":
            try: return float(v)
            except: return 0.0
        return str(v).lower()

    def logic(self):
        try:
            n = int(self.ent_n.get())
            alg = self.var_alg.get()
            col = self.var_col.get()

            self.update_status("📖 Reading CSV File...")
            t_start_load = time.perf_counter()
            data = []
            with open(self.file_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for i, row in enumerate(reader):
                    if not self.is_running or i >= n: break
                    data.append(row)
            
            load_time = time.perf_counter() - t_start_load

            self.update_status(f"🌸 Sorting by {col}...")
            t_start_sort = time.perf_counter()
            
            if alg == "Merge Sort":
                sorted_data = self.merge_sort(data, col)
            elif alg == "Bubble Sort":
                sorted_data = self.bubble_sort_smooth(data, col)
            else:
                sorted_data = self.insertion_sort_smooth(data, col)
            
            sort_time = time.perf_counter() - t_start_sort

            if self.is_running:
                self.sorted_results = sorted_data
                self.root.after(0, lambda: self.finalize(load_time, sort_time, alg, col))
        except Exception as e:
            self.root.after(0, lambda: messagebox.showerror("Error", str(e)))
        finally:
            self.root.after(0, self.reset_ui)

    def bubble_sort_smooth(self, data, col):
        n = len(data)
        last_ui_update = time.time()
        for i in range(n):
            if not self.is_running: return []
            swapped = False
            
            # Throttle UI updates to once every 200ms
            if time.time() - last_ui_update > 0.2:
                percent = (i / n) * 100
                self.root.after(0, lambda p=percent, r=i: self.update_progress(p, f"🫧 Bubble Pass: {r}/{n}"))
                last_ui_update = time.time()

            for j in range(0, n - i - 1):
                if self.get_val(data[j], col) > self.get_val(data[j+1], col):
                    data[j], data[j+1] = data[j+1], data[j]
                    swapped = True
            if not swapped: break
        return data

    def insertion_sort_smooth(self, data, col):
        n = len(data)
        last_ui_update = time.time()
        for i in range(1, n):
            if not self.is_running: return []
            
            if time.time() - last_ui_update > 0.2:
                percent = (i / n) * 100
                self.root.after(0, lambda p=percent, r=i: self.update_progress(p, f"🌷 Insertion Row: {r}/{n}"))
                last_ui_update = time.time()

            key = data[i]
            v_key = self.get_val(key, col)
            j = i - 1
            while j >= 0 and self.get_val(data[j], col) > v_key:
                data[j+1] = data[j]
                j -= 1
            data[j+1] = key
        return data

    def merge_sort(self, data, col):
        if not self.is_running or len(data) <= 1: return data
        mid = len(data) // 2
        return self.merge(self.merge_sort(data[:mid], col), self.merge_sort(data[mid:], col), col)

    def merge(self, left, right, col):
        res, i, j = [], 0, 0
        while i < len(left) and j < len(right):
            if self.get_val(left[i], col) <= self.get_val(right[j], col):
                res.append(left[i]); i += 1
            else: res.append(right[j]); j += 1
        res.extend(left[i:]); res.extend(right[j:])
        return res

    def update_status(self, msg):
        self.root.after(0, lambda: self.lbl_progress.config(text=msg.upper(), fg="#FF69B4"))

    def update_progress(self, val, msg):
        self.progress_var.set(val)
        self.lbl_progress.config(text=msg.upper())

    def finalize(self, t_load, t_sort, algo_name, col_name):
        self.update_progress(100, "✨ COMPLETE! ✨")
        self.btn_export.config(state="normal")
        
        row_count = len(self.sorted_results)
        throughput = row_count / t_sort if t_sort > 0 else 0
        
        out = f"╔══════════════════════════════════════════════╗\n"
        out += f"║         ✿ SORTING COMPLETE! ✿               ║\n"
        out += f"╚══════════════════════════════════════════════╝\n\n"
        out += f"🌸 Sorted By      : {col_name}\n"
        out += f"⏱️  File I/O Time  : {t_load:.4f}s\n"
        out += f"💫 Sorting Time   : {t_sort:.4f}s\n"
        out += f"⚡ Throughput     : {throughput:.2f} rows/sec\n"
        out += f"{'─'*50}\n"
        out += f"✨ PREVIEW (TOP 10 RECORDS):\n"
        
        preview_cols = self.headers[:3]
        out += " 💕 ".join(preview_cols) + "\n"
        out += f"{'─'*50}\n"
        
        for row in self.sorted_results[:10]:
            vals = [str(row.get(h, "")) for h in preview_cols]
            out += " | ".join(vals) + "\n"
            
        self.txt_output.insert(tk.END, out)

    def export_csv(self):
        path = filedialog.asksaveasfilename(defaultextension=".csv", 
                                           filetypes=[("CSV Files", "*.csv")])
        if path:
            with open(path, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=self.headers)
                writer.writeheader()
                writer.writerows(self.sorted_results)
            messagebox.showinfo("Success! 💖", "Your data has been saved! 🌸")

    def reset_ui(self):
        self.is_running = False
        self.btn_run.config(state="normal", text="✨ START SORTING ✨")
        self.btn_stop.config(state="disabled")

if __name__ == "__main__":
    root = tk.Tk()
    app = SmoothSortingApp(root)
    root.mainloop()