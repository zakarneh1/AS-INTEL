import subprocess
import os
os.chdir('.')
result = subprocess.run(['npx', 'react-scripts', 'build'], capture_output=True, text=True)
print("STDOUT:")
print(result.stdout)
print("STDERR:")
print(result.stderr)
print("Return code:", result.returncode)