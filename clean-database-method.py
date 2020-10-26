import sqlite3

conn = sqlite3.connect('gen4dex_db.sqlite3')
conn.row_factory = sqlite3.Row
c = conn.cursor()
c2 = conn.cursor()

for row in c.execute("select * from alldata where method = 1"):
    print(row['name'])
    c2.execute("update alldata set method = ? where id = ?", ("Event", row['id']))
conn.commit()