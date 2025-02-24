import os
import json

# for i in os.listdir():
#     if i.endswith(".json"):
#         if not i in files:
#             files.append(i)
# items = {}

# for i in files:
#     with open(i,'r') as selection:
#         items.update(json.load(selection))

# with open('default.json', 'w', encoding='utf-8') as default:
#     json.dump(items,default,indent=4)

with open('default.json', 'r') as file:
    data = json.load(file)
    arr = []
    for i in data:
        for img in i['imgs']:
            if img in arr:
                print(img)
            else:
                arr.append(img)
