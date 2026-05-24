import gdown
import os

url = "https://drive.google.com/file/d/1rP3LCConPL7ruGlyzQSfeEeYnY42HJxd/view?usp=sharing"
output_path = "/home/michaek/portfolio-proj-antigravity/scratch/new_portfolio_asset"

# Extract file ID from URL
# https://drive.google.com/file/d/1rP3LCConPL7ruGlyzQSfeEeYnY42HJxd/view?usp=sharing
file_id = "1rP3LCConPL7ruGlyzQSfeEeYnY42HJxd"
download_url = f"https://drive.google.com/uc?id={file_id}"

print(f"Downloading from: {download_url}")
gdown.download(download_url, output_path, quiet=False)
print("Download finished!")
