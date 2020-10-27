import sqlite3

conn = sqlite3.connect('gen4dex_db.sqlite3')
conn.row_factory = sqlite3.Row
c = conn.cursor()
c2 = conn.cursor()

for row in c.execute("select * from alldata where place like '%while holding%' and method = 'Transfer'"):
    print(row['place'].split('holding a ')[1])
    item = row['place'].split('holding a ')[1]
    c2.execute("update alldata set subloc = ? where id = ?", (item, row['id']))
conn.commit()