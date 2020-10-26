import os
print(os.getcwd())

for file in os.listdir(os.path.join(os.getcwd(), "public", "egg")):
    if(file[-1] == 'g'):
        a = file.split('-')[0]
        b = file.split('-')[1]

        newa = a[0].upper() + a[1:]
        newb = b[0].upper() + b[1:]
        newfile = newa + " " + newb
        print(newfile)
        os.rename(os.path.join(os.getcwd(), "public", "egg", file), os.path.join(os.getcwd(), "public", "egg", newfile))