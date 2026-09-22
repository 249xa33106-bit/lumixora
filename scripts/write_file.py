import sys, base64
path = sys.argv[1]
mode = sys.argv[2]
b64 = sys.argv[3]
with open(path, mode, encoding='utf-8') as f:
    f.write(base64.b64decode(b64).decode('utf-8'))
print('Success', path)
