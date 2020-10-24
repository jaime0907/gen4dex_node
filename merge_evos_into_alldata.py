import sqlite3

conn = sqlite3.connect('gen4dex_db.sqlite3')

c = conn.cursor()
c2 = conn.cursor()
locations = []
for row in c.execute("select * from evos"):
    anword = ""
    if row[1][0] in ['A', 'E', 'I', 'O', 'U', 'H']:
        anword = "n"

    evotext = row[3] + " " + row[4]
    if row[3] == "Level":
        evotext = "Train a" + anword + " " + row[1] + " to lv." + row[4]
    if row[3] == "One level":
        evotext = "Level up a" + anword + " " + row[1] + " " + row[4]
    if row[3] == "Stone":
        evotext = "Use a " + row[4] + " on a" + anword + " " + row[1]
    if row[3] == "Friendship":
        evotext = "Level up a" + anword + " " + row[1] + " with high friendship " + row[4]
    if row[3] == "Transfer":
        if row[4] != "":
            evotext = "Trade a" + anword + " " + row[1] + " while holding a " + row[4]
        else:
            evotext = "Trade a" + anword + " " + row[1]
    locations.append((evotext, row[6], row[2], 0, 0, 0, 0, 0, 1, row[3], '', '', -1, -1, -1, '', ''))
    print((evotext, row[6], row[2], 0, 0, 0, 0, 0, 1, row[3], '', '', -1, -1, -1, '', ''))
    c.execute("insert into alldata (place, dex, name, hg, ss, d, pe, pt, evo, method, levelmin, levelmax, probdawn, probday, probnight, specialprob, subloc) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", (evotext, row[6], row[2], 0, 0, 0, 0, 0, 1, row[3], '', '', -1, -1, -1, '', ''))

conn.commit()
print(c.execute("select count(*) from alldata").fetchone())