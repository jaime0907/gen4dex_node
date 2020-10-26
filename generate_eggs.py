import sqlite3

conn = sqlite3.connect('gen4dex_db.sqlite3')

c = conn.cursor()
c2 = conn.cursor()
pokes_ya_evolucionados = []
huevos = []
print(c.execute("select count(*) from alldata").fetchone())
for row in c.execute("select * from evos"):
    pokes_ya_evolucionados.append(row[2])

for row in c.execute("select * from evos group by poke2 order by dex1"):
    if row[1] not in pokes_ya_evolucionados:
        isAlready = False
        for h in huevos:
            if row[1] == h['egg']:
                h['parents'].append(row[2])
                isAlready = True
                
        if not isAlready:
            huevos.append({'egg': row[1], 'eggdex': row[5], 'parents': [row[2]]})
    else:
        for h in huevos:
            if row[1] in h['parents']:
                h['parents'].append(row[2])

locations = []
for h in huevos:
    breedtext = "Breed "
    for p in h['parents']:
        breedtext += p + "/"
    breedtext = breedtext[:-1]
    l = (breedtext, h['eggdex'], h['egg'], 0, 0, 0, 0, 0, 0, 1, 0, "Egg", "", "", -2, -2, -2, "", "")
    locations.append(l)
    print(h['egg'] + ": " + str(h['parents']))
c.executemany("insert into alldata (place, dex, name, hg, ss, d, pe, pt, evo, egg, event, method, levelmin, levelmax, probdawn, probday, probnight, specialprob, subloc) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", locations)

conn.commit()
print(c.execute("select count(*) from alldata").fetchone())