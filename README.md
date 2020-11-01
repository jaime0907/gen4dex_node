# Gen4Dex
Página web que ofrece una lista de Pokémon interactiva para los juegos de la 4º generación. Está desplegada en Heroku y se puede acceder [pinchando aquí.](https://gen4dex.herokuapp.com)

El backend está basado en Node.js con una base de datos sqlite3 para los datos de Pokémon (de sólo lectura) y otra PostgreSQL para las cuentas de usuario.

Los datos fueron obtenidos de otras páginas mediante web scraping con Python y posteriormente almacenados para su uso en la aplicación en la base de datos sqlite3.

El frontend HTML/CSS fue creado de cero, sin usar ninguna plantilla ya existente. Usa intensivamente Javascript en el lado del cliente para cargar los datos de manera responsiva (y así aligerar la carga de trabajo del servidor).

Este proyecto es una actualización del antiguo [HGSSdex](https://github.com/jaime0907/HGSSdex), que fue hecho sobre Django/Python. Dado que la web vuelca casi toda su carga de trabajo en el navegador del cliente, y el trabajo del servidor se reduce a servir plantillas HTML y una simple API REST para los enviar datos al cliente en formato JSON, decidí cambiar el backend por Node.js y Express, mucho más ligeros y sencillos que Django.

![Página principal](https://i.imgur.com/lVvtMbF.png)
![Página principal 2](https://i.imgur.com/PRdVaJN.png)
