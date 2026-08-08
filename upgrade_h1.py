import os
import re

files_to_check = [
    "source/src/pages/Installer.tsx",
    "source/src/pages/Manual.tsx",
    "source/src/pages/Changelog.tsx",
    "source/src/pages/TechnicalReference.tsx",
    "source/src/pages/NotFound.tsx",
    "source/src/pages/Success.tsx"
]

h1_regex = re.compile(r'(<h1 className="[^"]+">)([^<]+)(</h1>)')

for filepath in files_to_check:
    if not os.path.exists(filepath):
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # If it already has NeuralReveal, skip
    if "NeuralReveal" in content:
        continue

    # Find the H1
    match = h1_regex.search(content)
    if not match:
        continue

    h1_class = match.group(1)
    text = match.group(2)
    
    # Extract just the class string
    class_str_match = re.search(r'className="([^"]+)"', h1_class)
    class_str = class_str_match.group(1) if class_str_match else ""

    replacement = f'{h1_class}<NeuralReveal text="{text}" className="{class_str}" /></h1>'
    new_content = h1_regex.sub(replacement, content, count=1)

    # Insert import
    import_stmt = "import NeuralReveal from '../components/NeuralReveal';\n"
    # Find last import
    last_import = new_content.rfind('import ')
    if last_import != -1:
        end_of_line = new_content.find('\n', last_import)
        new_content = new_content[:end_of_line+1] + import_stmt + new_content[end_of_line+1:]
    else:
        new_content = import_stmt + new_content

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

print("Upgraded files!")
