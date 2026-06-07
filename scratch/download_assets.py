import gdown
import os
import urllib.request

# Download AMVero prototype folder
prototype_url = "https://drive.google.com/drive/folders/1MEqGBx96ixjgncrxhQcptVg9NnqMUl9D"
prototype_dir = "/home/korm85/projects/ClaudeCode-portfolio-dev/scratch/prototype"
os.makedirs(prototype_dir, exist_ok=True)
print("Downloading prototype folder...")
gdown.download_folder(prototype_url, output=prototype_dir, quiet=False, use_cookies=False)

# Download selected resume
resume_url = "https://docs.google.com/document/d/1lbPupUpBwSxuhgy3deDYpYZzX8OKtBLz1HrCqE_aZUY/export?format=docx"
resume_path = "/home/korm85/projects/ClaudeCode-portfolio-dev/scratch/resumes/Michael_Korenevsky_Selected_Resume.docx"
print("Downloading selected resume docx...")
try:
    urllib.request.urlretrieve(resume_url, resume_path)
    print("Resume docx downloaded successfully!")
except Exception as e:
    print("Failed to download resume:", e)
