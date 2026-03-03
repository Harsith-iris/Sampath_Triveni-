import os
import csscompressor
import jsmin

def main():
    directory = '.'
    
    css_file = os.path.join(directory, 'style.css')
    min_css_file = os.path.join(directory, 'style.min.css')
    if os.path.exists(css_file):
        with open(css_file, 'r', encoding='utf-8') as f:
            css_data = f.read()
            
        min_css = csscompressor.compress(css_data)
        
        with open(min_css_file, 'w', encoding='utf-8') as f:
            f.write(min_css)
        print(f"Created {min_css_file}")

    js_file = os.path.join(directory, 'script.js')
    min_js_file = os.path.join(directory, 'script.min.js')
    if os.path.exists(js_file):
        with open(js_file, 'r', encoding='utf-8') as f:
            js_data = f.read()
            
        min_js = jsmin.jsmin(js_data)
        
        with open(min_js_file, 'w', encoding='utf-8') as f:
            f.write(min_js)
        print(f"Created {min_js_file}")

if __name__ == "__main__":
    main()
