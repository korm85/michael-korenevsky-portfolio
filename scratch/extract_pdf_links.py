import re

with open('portfolio.pdf', 'rb') as f:
    content = f.read()

# Look for URI actions in PDF
# Typically: /Type /Annot /Subtype /Link ... /A << /S /URI /URI (url) >>
urls = re.findall(b'/URI\\s*\\((.*?)\\)', content)
print("Found raw URLs:")
for u in urls:
    try:
        print(u.decode('utf-8'))
    except Exception as e:
        print(u, e)

# Also let's print any text that looks like a URL
text_urls = re.findall(b'https?://[a-zA-Z0-9./?=&_-]+', content)
print("\nFound text URLs:")
for tu in set(text_urls):
    print(tu.decode('utf-8'))
