"""Compatibility entrypoint: export the actual webpage design using Chromium."""
from pathlib import Path
import subprocess

root = Path(__file__).resolve().parent.parent
subprocess.run(['node', str(root / 'scripts/export-web-portfolio.mjs')], cwd=root, check=True)
