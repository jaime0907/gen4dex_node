import sqlite3
import requests as req

conn = sqlite3.connect('gen4dex_db.sqlite3')
conn.row_factory = sqlite3.Row
c = conn.cursor()
c2 = conn.cursor()

sublocs = {
    'Armor Fossil': 'Fósil Coraza',
    'Claw Fossil': 'Fósil Garra',
    'Dome Fossil': 'Fósil Domo',
    'Helix Fossil': 'Fósil Helix',
    'Old Amber': 'Ámbar viejo',
    'Root Fossil': 'Fósil Raíz',
    'Skull Fossil': 'Fósil Cráneo',
    'Moon Stone': 'Piedra Lunar',
    'Fire Stone': 'Piedra Fuego',
    'Thunder Stone': 'Piedratrueno',
    'Water Stone': 'Piedra Agua',
    'Leaf Stone': 'Piedra Hoja',
    'Sun Stone': 'Piedra Solar',
    'Shiny Stone': 'Piedra Día',
    'Dusk Stone': 'Piedra Noche',
    'Dawn Stone': 'Piedra Alba',
    'Mr. Backlot': "Sr. Fortuny"
}

methods = {
    'Grass': 'Hierba',
    'Cave': 'Cueva',
    'Super Rod': 'Supercaña',
    'Surf': 'Surf',
    'Headbutt': 'Golpe Cabeza',
    'Good Rod': 'Caña Buena',
    'Old Rod': 'Caña Vieja',
    'Level': 'Nivel',
    'Hoenn Sound': 'Sonidos Hoenn',
    'Hatching': 'Eclosionar',
    'Sinnoh Sound': 'Sonidos Sinnoh',
    'Poké Radar': 'Poké Radar',
    'Swarm': 'Manada',
    'R': 'R',
    'S': 'Z',
    'Building': 'Interior',
    'Special': 'Especial',
    'E': 'E',
    'Stone': 'Piedra',
    'Mr. Backlot': 'Sr. Fortuny',
    'Gift': 'Regalo',
    'FR': 'RF',
    'LG': 'VH',
    'Rock Smash': 'Golpe Roca',
    'One level': 'Un nivel',
    'Trade': 'Intercambio',
    'Fossil': 'Fósil',
    'Friendship': 'Amistad',
    'In-game trade': 'Intercambio in-game',
    'Event': 'Evento',
    'Starter': 'Inicial',
    'FRLGE': 'RFVHE',
    'Any': 'Cualquiera'
    
}

tabla_methods = {}
for row in c.execute("select * from alldata"):
    id = str(row["id"])
    method = row['method']
    c2.execute('update esp set method_esp = ? where id = ?', (methods[method], id))
    if method in ["Stone", "Mr. Backlot", "Fossil"]:
        c2.execute('update esp set subloc_esp = ? where id = ?', (sublocs[row['subloc']], id))

conn.commit()
conn.close()