import subprocess, sys, os

filepath = r'D:\hrm2\docs\file\hop dong mua ban.doc'
outpath = r'D:\hrm2\docs\file\hop-dong-mua-ban-extracted.txt'

# Read raw text from binary .doc (UTF-16LE)
with open(filepath, 'rb') as f:
    data = f.read()

text_utf16 = data.decode('utf-16-le', errors='ignore')
lines = text_utf16.split('\r')
result = []
for line in lines:
    cleaned = ''.join(c for c in line if c.isprintable() or c in '\n\t')
    cleaned = cleaned.strip()
    if len(cleaned) > 2:
        result.append(cleaned)

with open(outpath, 'w', encoding='utf-8') as f:
    f.write('\n'.join(result))

print(f"Extracted {len(result)} lines to {outpath}")
