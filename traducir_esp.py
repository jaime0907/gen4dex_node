import sqlite3
import requests as req

conn = sqlite3.connect('gen4dex_db.sqlite3')
conn.row_factory = sqlite3.Row
c = conn.cursor()
c2 = conn.cursor()


trad = []
regiones = ['Kanto', 'Johto', 'Sinnoh']
conta = -1
regionactiva = False
f = open("traducciones_raw.txt", "r", encoding='utf8')
for x in f:
    if x.startswith('==='):
        regionactiva = x.replace('===', '').replace('\n', '') in regiones
    if regionactiva:
        if x.startswith('| [['):
            eng = x.replace('| ', '').replace('\n', '').replace('[[', '').replace(']]', '')
            conta = 0
        if conta == 4:
            esp = x.replace('| ', '').replace('\n', '').replace('[[', '').replace(']]', '')
            trad.append({'eng': eng, 'esp': esp})
            conta = -1
        if conta >= 0:
            conta += 1

esp = {}
for t in trad:
    esp[t['eng']] = t['esp']

fosiles = {
'Armor Fossil': 'Fósil Coraza',
'Claw Fossil': 'Fósil Garra',
'Dome Fossil': 'Fósil Domo',
'Helix Fossil': 'Fósil Helix',
'Old Amber': 'Ámbar viejo',
'Root Fossil': 'Fósil Raíz',
'Skull Fossil': 'Fósil Cráneo'
}

esp[''] = ''
esp['Victory Road (Sinnoh)'] = 'Calle Victoria (Sinnoh)'
esp['Event exclusive'] = 'Exclusivo de evento'
esp['Roaming Johto'] = 'Pokémon errante, rutas de Johto'
esp['Roaming Kanto'] = 'Pokémon errante, rutas de Kanto'
esp['Roaming Sinnoh'] = 'Pokémon errante, rutas de Sinnoh'
esp['Safari Zone'] = 'Zona Safari'
esp['Event or via Pokémon Ranger'] = 'Evento o vía Pokémon Ranger'
esp['Olivine Gym'] = 'Gimnasio de Ciudad Olivo'
esp['Valor Lakefront'] = 'Orilla Valor'
esp['Trophy Garden (Check Mr. Backlot)'] = 'Jardín Trofeo (Consultar al Sr. Fortuny)'
esp['Solaceon Ruins'] = 'Ruinas Sosiego'
esp['Snowpoint Temple'] = 'Templo Puntaneva'
esp['Rock Peak Ruins'] = 'Ruinas Pico Roca'
esp['Pokémon League (Sinnoh)'] = 'Liga Pokémon (Sinnoh)'
esp['Oreburgh Mine'] = 'Mina Pirita'
esp['Oreburgh Gate'] = 'Puerta Pirita'
esp['Maniac Tunnel'] = 'Túnel Maníaco'
esp['Lost Tower'] = 'Torre Perdida'
esp['Iron Ruins'] = 'Ruinas Hierro'
esp['Iceberg Ruins'] = 'Ruinas Iceberg'
esp['Eterna Condominiums'] = 'Centro Lúdico de Ciudad Vetusta'
esp['Acuity Lakefront'] = 'Orilla Agudeza'
esp['Victory Road'] = 'Calle Victoria'
esp['Team Rocket HQ (Trap floor)'] = 'Escondite Team Rocket (Sótano 1)'
esp['Team Rocket HQ (Transmitter room Poké Balls)'] = 'Escondite Team Rocket (Poké Balls del transmisor)'
esp['Silph Company'] = 'Silph S.A.'
esp['Saffron City Magnet Train station'] = 'Estación del Magnetotrén de Ciudad Azafrán'
esp['Safari Zone Gate'] = 'Entrada Safari'
esp["Professor Oak's Laboratory"] = 'Laboratorio del Profesor Oak'
esp['Lake of Rage (Center of lake, shiny)'] = 'Lago de la Furia (Centro del lago, variocolor)'
esp['Goldenrod Department Store'] = 'Centro Comercial de Ciudad Trigal'
esp['Bell Tower'] = 'Torre Campana'

inciensos = {
    'Sea Incense': 'Incienso Marino',
    'Lax Incense': 'Incienso Suave',
    'Odd Incense': 'Incienso Raro',
    'Rock Incense': 'Incienso Roca',
    'Full Incense': 'Incienso Lento',
    'Wave Incense': 'Incienso Aqua',
    'Rose Incense': 'Incienso Floral',
    'Luck Incense': 'Incienso Duplo',
    'Pure Incense': 'Incienso Puro'
}

itemsevo = {
    "Metal Coat": 'Rev. Metálico',
    "Electirizer": 'Electrizador',
    "Magmarizer": 'Magmatizador',
    "King's Rock": 'Roca del Rey',
    "Dragon Scale": 'Escamadragón',
    "Upgrade": 'Mejora',
    "Deep Sea Tooth": 'Diente Marino',
    "Deep Sea Scale": 'Escama Marina',
    "Protector": 'Protector',
    "Dubious Disc": 'Discoxtraño',
    "Reaper Cloth": 'Telaterrible',
    'Razor Claw': 'Garrafilada',
    'Razor Fang': 'Colmillagudo',
    'Oval Stone': 'Piedra Oval'
}

piedras = {
    'Moon Stone': 'Piedra Lunar',
    'Fire Stone': 'Piedra Fuego',
    'Thunder Stone': 'Piedratrueno',
    'Water Stone': 'Piedra Agua',
    'Leaf Stone': 'Piedra Hoja',
    'Sun Stone': 'Piedra Solar',
    'Shiny Stone': 'Piedra Día',
    'Dusk Stone': 'Piedra Noche',
    'Dawn Stone': 'Piedra Alba'
}

moves = {
    'Mimic': 'Mimético',
    'Double Hit': 'Doble golpe',
    'Rollout': 'Desenrollar',
    'AncientPower': 'Poder pasado'
}

def quitar_paja(p):
    data = p
    paja = ''
    if '(Revive' in p:
        data = p.split(' (Revive ')[0]
        paja = ' (Revivir ' + fosiles[p.split(' (Revive ')[1].replace(')','')] + ')'
    if 'F)' in p:
        data = p.split(' (')[0]
        paja = ' (P' + p.split(' (')[1].replace('F','')
    if '(Gift egg' in p:
        data = p.split(' (Gift')[0]
        if 'Primo' in p:
            paja = ' (Huevo regalo de Cástor)'
        else:
            paja = ' (Huevo regalo)'
    if p.endswith('Incense'):
        data = p.split(' while')[0]
        inc = p.split(' holding ')[1]
        paja = ' con ' + inciensos[inc] + ' equipado'
    return({'data':data, 'paja':paja})

def trad_evo(p):
    t = p
    if p.startswith('Train'):
        t = 'Sube a ' + p.split(' ')[2] + ' al nv.' + p.split('lv.')[1]
        if t.endswith('party)'):
            t = t.split(' (')[0] + ' (teniendo una Poké Ball y un espacio en el equipo)'
        if t.endswith('female)'):
            t = t.split(' (')[0] + ' (sólo hembra)'
    elif p.startswith('Trade'):
        t = 'Intercambia un ' + t.split(' ')[2]
        if 'holding' in p:
            t += ' con ' + itemsevo[p.split('holding a ')[1]] + ' equipado'
    elif p.startswith('Use a'):
        t = 'Usa una ' + piedras[p.split(' on')[0].replace('Use a ', '').split(' (')[0]] + " en un " + p.split(' ')[-1]
        if '(male only' in p:
            t += ' (sólo macho)'
        if '(female only' in p:
            t += ' (sólo hembra)'
    elif p.startswith('Level up'):
        t = 'Sube un nivel a un ' + p.split(' ')[3]
        if 'high friendship' in p:
            t += " con alta amistad"
            if p.endswith('day'):
                t += " de día"
            if p.endswith('night'):
                t += " de noche"
        elif 'knowing' in p:
            if 'Mime Jr.' in p:
                t = 'Sube un nivel a un Mime Jr.'
            t += ' con ' + moves[p.split(' (')[0].split('knowing ')[1]] + ' aprendido (nv.' + p.split('lv.')[1][:-1] + ')'
        elif 'holding' in p:
            t += " equipado con " + itemsevo[p.split('holding ')[1].split(' in')[0]] + " de "
            if p.endswith('night'):
                t += "noche"
            if p.endswith('day'):
                t += "día"
        elif 'Coronet' in p:
            t += ' en el Monte Corona (sólo DPPt)'
        elif 'in the party' in p:
            t += ' con un Remoraid en el equipo'
        elif 'Beauty' in p:
            t += ' con el stat de Belleza alto'
        elif 'Moss' in p:
            t += ' cerca de la Roca Musgo del Bosque Vetusta (sólo DPPt)'
        elif 'Ice Rock' in p:
            t += ' cerca de la Roca Hielo de la Ruta 217 (sólo DPPt)'

    return t

tabla_trad = {}
for row in c.execute("select * from alldata"):
    id = str(row['id'])
    p = row['place']
    dp = quitar_paja(p)
    p = dp['data']
    paja = dp['paja']
    if p in esp:
        tabla_trad[id] = esp[p] + paja
    else:
        if p.startswith('Sinnoh') or p.startswith('Route'):
            tabla_trad[id] = p.replace('Sinnoh ', '').replace('Route', 'Ruta')
        else:
            if p.startswith('Breed'):
                tabla_trad[id] = p.replace('Breed', 'Cría un') + paja
            else:
                tabla_trad[id] = trad_evo(p)

for row in c.execute("select * from alldata"):
    c2.execute('insert into esp (id,place_esp) values (?,?)', (str(row['id']),tabla_trad[str(row['id'])]))
conn.commit()
conn.close()

        