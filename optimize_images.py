import os
from PIL import Image

def optimize_image(input_path, output_path, max_width=1920, quality=80):
    """
    Optimizes an image by resizing (if it exceeds max_width) and saving with given compression quality.
    """
    try:
        with Image.open(input_path) as img:
            # Convert to RGB if it's RGBA or P to save as JPEG
            if img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')
            
            # Calculate new size maintaining aspect ratio
            width, height = img.size
            if width > max_width:
                new_width = max_width
                new_height = int((max_width / width) * height)
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            import tempfile
            temp_path = input_path + '.tmp'
            img.save(temp_path, 'JPEG', quality=quality, optimize=True)
            import shutil
            shutil.move(temp_path, output_path)
            return True
    except Exception as e:
        print(f"Error optimizing {input_path}: {e}")
        return False

def main():
    directory = '.'
    
    # Images to optimize with specific settings
    image_settings = {
        'events-bg.jpg': {'max_width': 1920, 'quality': 75},
        'hero.jpg.jpg': {'max_width': 1920, 'quality': 75},
        'hero.jpg': {'max_width': 1920, 'quality': 75},
        'gallery-1.jpg': {'max_width': 1200, 'quality': 75},
        'gallery-2.jpg': {'max_width': 1200, 'quality': 75},
        'gallery-3.jpg': {'max_width': 1200, 'quality': 75},
        'sampath.jpg': {'max_width': 800, 'quality': 80},
        'triveni.jpg': {'max_width': 800, 'quality': 80},
    }

    total_saved = 0
    for filename, settings in image_settings.items():
        input_path = os.path.join(directory, filename)
        if os.path.exists(input_path):
            original_size = os.path.getsize(input_path)
            
            # We will overwrite the existing file
            output_path = input_path
            
            print(f"Optimizing {filename}...")
            if optimize_image(input_path, output_path, max_width=settings['max_width'], quality=settings['quality']):
                new_size = os.path.getsize(output_path)
                saved = original_size - new_size
                total_saved += saved
                print(f"  Done. Reduced by {saved / (1024*1024):.2f} MB")
            else:
                print(f"  Failed.")
        else:
            print(f"File {filename} not found.")

    print(f"\nOptimization complete. Total space saved: {total_saved / (1024*1024):.2f} MB")

if __name__ == "__main__":
    main()
