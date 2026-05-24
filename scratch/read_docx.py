import zipfile
import xml.etree.ElementTree as ET

def get_docx_text(path):
    WORD_NAMESPACE = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
    TEXT = WORD_NAMESPACE + 't'
    PARAGRAPH = WORD_NAMESPACE + 'p'
    
    with zipfile.ZipFile(path) as docx:
        tree = ET.fromstring(docx.read('word/document.xml'))
        paragraphs = []
        for paragraph in tree.iter(PARAGRAPH):
            texts = [node.text for node in paragraph.iter(TEXT) if node.text]
            if texts:
                paragraphs.append(''.join(texts))
        return '\n'.join(paragraphs)

print("--- SELECTED RESUME TEXT ---")
try:
    print(get_docx_text('/home/michaek/portfolio-proj-antigravity/scratch/resumes/Michael_Korenevsky_Selected_Resume.docx'))
except Exception as e:
    print("Failed to parse:", e)
