import gdown
import os

url = "https://drive.google.com/drive/folders/1s7_SZNU8dINhZAGHgAfHKbkY0K2XTExA"
output_dir = "/home/michaek/portfolio-proj-antigravity/scratch/resumes"

os.makedirs(output_dir, exist_ok=True)
gdown.download_folder(url, output=output_dir, quiet=False, use_cookies=False)
print("Download finished!")
