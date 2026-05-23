import os
import shutil

def main():
    base_dir = r'c:\Users\user\OneDrive\Desktop\REVOLT\revolt-site\revolt-site'
    temp_dir = os.path.join(base_dir, 'temp-react-app')
    
    for item in os.listdir(temp_dir):
        src = os.path.join(temp_dir, item)
        dst = os.path.join(base_dir, item)
        if os.path.exists(dst):
            if os.path.isdir(dst):
                shutil.rmtree(dst)
            else:
                os.remove(dst)
        shutil.move(src, dst)
        
    os.rmdir(temp_dir)
    print("Moved React app to root.")

if __name__ == "__main__":
    main()
