import os
from pypdf import PdfReader

source_dir = r"c:\Users\moham\OneDrive\Documents\startup\code aerna"
target_dir = r"c:\Users\moham\OneDrive\Documents\startup\scratch\extracted"

os.makedirs(target_dir, exist_ok=True)

files = os.listdir(source_dir)
print(f"Scanning {len(files)} files in '{source_dir}'...")

for file in files:
    file_path = os.path.join(source_dir, file)
    if not os.path.isfile(file_path):
        continue
    
    file_ext = os.path.splitext(file)[1].lower()
    base_name = os.path.splitext(file)[0]
    output_path = os.path.join(target_dir, f"{base_name}.txt")
    
    if file_ext == '.pdf':
        print(f"Parsing PDF: {file}...")
        try:
            reader = PdfReader(file_path)
            text = ""
            for idx, page in enumerate(reader.pages):
                page_text = page.extract_text()
                if page_text:
                    text += f"--- Page {idx+1} ---\n{page_text}\n\n"
            
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(text)
            print(f"  Successfully extracted to: {output_path}")
        except Exception as e:
            print(f"  Failed to parse {file}: {e}")
            
    elif file_ext in ['.txt', '.js', '.py', '.cpp', '.java', '.go', '.c']:
        print(f"Reading text file: {file}...")
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"  Copied to: {output_path}")
        except Exception as e:
            print(f"  Failed to read {file}: {e}")
            
print("Extraction completed!")
