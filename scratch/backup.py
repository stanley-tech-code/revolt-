import os
import shutil

def main():
    base_dir = r'c:\Users\user\OneDrive\Desktop\REVOLT\revolt-site\revolt-site'
    legacy_dir = os.path.join(base_dir, 'legacy-html')
    
    os.makedirs(legacy_dir, exist_ok=True)
    
    # Items to exclude
    exclude = ['legacy-html', 'scratch', '.gemini', '.git']
    
    for item in os.listdir(base_dir):
        if item in exclude:
            continue
            
        src = os.path.join(base_dir, item)
        dst = os.path.join(legacy_dir, item)
        
        try:
            shutil.move(src, dst)
            print(f"Moved {item} to legacy-html")
        except Exception as e:
            print(f"Failed to move {item}: {e}")

if __name__ == "__main__":
    main()
