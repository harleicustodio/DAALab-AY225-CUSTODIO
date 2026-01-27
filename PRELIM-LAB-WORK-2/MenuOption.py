import time
import random
import os

def bubble_sort(arr):
    """Bubble Sort algorithm"""
    n = len(arr)
    arr_copy = arr.copy()
    
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr_copy[j] > arr_copy[j + 1]:
                arr_copy[j], arr_copy[j + 1] = arr_copy[j + 1], arr_copy[j]
    
    return arr_copy

def insertion_sort(arr):
    """Insertion Sort algorithm"""
    arr_copy = arr.copy()
    
    for i in range(1, len(arr_copy)):
        key = arr_copy[i]
        j = i - 1
        while j >= 0 and arr_copy[j] > key:
            arr_copy[j + 1] = arr_copy[j]
            j -= 1
        arr_copy[j + 1] = key
    
    return arr_copy

def merge_sort(arr):
    """Merge Sort algorithm"""
    arr_copy = arr.copy()
    
    def merge(left, right):
        result = []
        i = j = 0
        
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1
        
        result.extend(left[i:])
        result.extend(right[j:])
        return result
    
    def merge_sort_recursive(arr):
        if len(arr) <= 1:
            return arr
        
        mid = len(arr) // 2
        left = merge_sort_recursive(arr[:mid])
        right = merge_sort_recursive(arr[mid:])
        
        return merge(left, right)
    
    return merge_sort_recursive(arr_copy)

def find_file_recursive(directory, filename):
    """
    Recursively search for a file in directory and subdirectories.
    Skips hidden folders (starting with .) like .git, .vscode
    """
    # Check if file exists in current directory
    target_path = os.path.join(directory, filename)
    if os.path.isfile(target_path):
        return target_path
    
    # Search in subdirectories
    try:
        for item in os.listdir(directory):
            # Skip hidden folders (starting with .)
            if item.startswith('.'):
                continue
            
            item_path = os.path.join(directory, item)
            
            # If it's a directory, search recursively
            if os.path.isdir(item_path):
                found = find_file_recursive(item_path, filename)
                if found:
                    return found
    except (PermissionError, OSError):
        # Skip directories we don't have permission to access
        pass
    
    return None

def load_data_from_file(filename):
    """
    Smart file loader - searches for file recursively if not found in current directory.
    """
    # 1. First try the basic location (current folder)
    filepath = filename
    
    # 2. If not found, search recursively in current directory and subdirectories
    if not os.path.isfile(filepath):
        print(f"⚠ Searching for '{filename}' in project folders...")
        current_dir = os.getcwd()
        filepath = find_file_recursive(current_dir, filename)
    
    # 3. If still not found, return None
    if filepath is None or not os.path.isfile(filepath):
        print(f"❌ Error: File '{filename}' not found.")
        print(f"   Scanned directory: {os.getcwd()}")
        print(f"   Please ensure the file exists in your project folders.")
        return None
    
    # File found! Load the data
    try:
        with open(filepath, 'r') as file:
            data = file.read().strip()
            found_garbage = False
            
            # Try to parse as numbers (comma or space separated)
            numbers = []
            if ',' in data:
                for x in data.split(','):
                    x = x.strip()
                    if x.lstrip('-').isdigit():
                        numbers.append(int(x))
                    elif x:  # Non-empty garbage
                        found_garbage = True
            else:
                for x in data.split():
                    if x.lstrip('-').isdigit():
                        numbers.append(int(x))
                    else:
                        found_garbage = True
            
            if found_garbage:
                print(f"⚠ Cleanup complete. Proceeding with valid numbers only...")
            
            if numbers:
                return numbers
            else:
                print(f"❌ Error: File found but no valid numbers in file")
                return None
                
    except Exception as e:
        print(f"❌ Error: Could not read file: {e}")
        return None

def generate_sample_data(size=100):
    """Generate random sample data"""
    return [random.randint(1, 1000) for _ in range(size)]

def display_array(arr, limit=20):
    """Display array with optional limit"""
    if len(arr) <= limit:
        print(arr)
    else:
        print(f"[{', '.join(map(str, arr[:10]))} ... {', '.join(map(str, arr[-10:]))}]")
        print(f"(Showing first 10 and last 10 of {len(arr)} elements)")

def main():
    data = None
    
    while True:
        print("\n" + "="*50)
        print("SORTING ALGORITHM MENU")
        print("="*50)
        print("1. Load data from dataset.txt")
        print("2. Generate random sample data")
        print("3. Bubble Sort")
        print("4. Insertion Sort")
        print("5. Merge Sort")
        print("6. Display current data")
        print("7. Exit")
        print("="*50)
        
        choice = input("Enter your choice (1-7): ").strip()
        
        if choice == '1':
            loaded_data = load_data_from_file('dataset.txt')
            if loaded_data:
                data = loaded_data
                print(f"✓ Successfully loaded {len(data)} numbers from dataset.txt")
                display_array(data)
        
        elif choice == '2':
            size = input("Enter size of sample data (default 100): ").strip()
            size = int(size) if size.isdigit() else 100
            data = generate_sample_data(size)
            print(f"✓ Generated {len(data)} random numbers")
            display_array(data)
        
        elif choice == '3':
            if data is None:
                print("⚠ Please load or generate data first!")
            else:
                print(f"\nRunning Bubble Sort on {len(data)} elements...")
                start_time = time.time()
                sorted_data = bubble_sort(data)
                end_time = time.time()
                
                print("✓ Bubble Sort completed!")
                print(f"⏱ Time taken: {end_time - start_time:.6f} seconds")
                print("\nSorted data:")
                display_array(sorted_data)
        
        elif choice == '4':
            if data is None:
                print("⚠ Please load or generate data first!")
            else:
                print(f"\nRunning Insertion Sort on {len(data)} elements...")
                start_time = time.time()
                sorted_data = insertion_sort(data)
                end_time = time.time()
                
                print("✓ Insertion Sort completed!")
                print(f"⏱ Time taken: {end_time - start_time:.6f} seconds")
                print("\nSorted data:")
                display_array(sorted_data)
        
        elif choice == '5':
            if data is None:
                print("⚠ Please load or generate data first!")
            else:
                print(f"\nRunning Merge Sort on {len(data)} elements...")
                start_time = time.time()
                sorted_data = merge_sort(data)
                end_time = time.time()
                
                print("✓ Merge Sort completed!")
                print(f"⏱ Time taken: {end_time - start_time:.6f} seconds")
                print("\nSorted data:")
                display_array(sorted_data)
        
        elif choice == '6':
            if data is None:
                print("⚠ No data loaded!")
            else:
                print(f"\nCurrent data ({len(data)} elements):")
                display_array(data)
        
        elif choice == '7':
            print("\nThank you for using the Sorting Algorithm Program!")
            break
        
        else:
            print("⚠ Invalid choice! Please enter a number between 1-7.")

if __name__ == "__main__":
    main()