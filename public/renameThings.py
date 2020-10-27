import os
print(os.getcwd())

for file in os.listdir(os.path.join(os.getcwd())):
    if(file[-1] == 'g'):
        newfile = file.replace('_OD', '').replace('_DPPt', '').replace('_IV', '').replace('_HGSS', '').replace('_', ' ')
        print(newfile)
        os.rename(os.path.join(os.getcwd(), file), os.path.join(os.getcwd(), newfile))