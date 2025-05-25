// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from 'express'
import express, { response } from 'express'
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from 'liquidjs';

console.log 
// database stekjes 
const stekjesResponse = await fetch('https://fdnd-agency.directus.app/items/bib_stekjes')
const stekjesResponseJSON = await stekjesResponse.json()

//afbeeldingen stekjes 
const afbeeldingenResponse = await fetch('https://fdnd-agency.directus.app/items/bib_afbeeldingen?filter={%20%22type%22:%20{%20%22_eq%22:%20%22stekjes%22%20}}')
const afbeeldingenResponseJSON = await afbeeldingenResponse.json()


// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express()

// Maak werken met data uit formulieren iets prettiger
app.use(express.urlencoded({extended: true}))
app.use(express.json())

const dataPath = path.join('./project.json');

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))

// Stel Liquid in als 'view engine'
const engine = new Liquid()
app.engine('liquid', engine.express())

// Stel de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)
app.set('views', './views')

// Home
app.get('/', async function (request, response) {
  response.render('index.liquid')
})

// Stekjes
app.get('/stekjes', async function (request, response) {
  response.render('stekjes.liquid', {
    stekjes: stekjesResponseJSON.data,
    afbeeldingen: afbeeldingenResponseJSON.data
  });
});

// Zaden
app.get('/zaden', async function (request, response) {
  response.render('zaden.liquid')
})

// Geveltuin
app.get('/geveltuin', async function (request, response) {
  response.render('geveltuin.liquid')
})

// Agenda
app.get('/agenda', async function (request, response) {
  response.render('agenda.liquid')
})

// Prikbord (route)
// GET-route
app.get('/project', async function (req, res) {

  try {
    // Lees de inhoud van het JSON-bestand waarin projecten worden opgeslagen
    const file = await readFile(dataPath, 'utf8');
    
    // Parse de JSON-inhoud van het bestand naar een JavaScript-object
    const data = JSON.parse(file);
    
    // Render de 'project.liquid' template en geef de projecten door als data
    res.render('project.liquid', { projects: data.projects });
  } catch (err) {
    // Log een foutmelding als er iets misgaat bij het lezen of parsen van het bestand
    console.error('Er is iets mis gegaan:', err);
    
    // Stuur een serverfout terug naar de client
    res.status(500).send('Server error');
  }
});

// foot
app.get('/foot', async function (request, response) {
  response.render('foot.liquid')
})


// Contact
app.get('/contact', async function (request, response) {
  response.render('contact.liquid')
})

// prikbord post 
  // POST-route om een nieuw project toe te voegen
  app.post('/project', async (req, res) => {
    // Haal de gegevens uit het formulier op
    const { title, description, name, email } = req.body;

    // Controleer of alle vereiste velden zijn ingevuld
    if (!title || !description || !name || !email) {
      // Als een veld ontbreekt, stuur de gebruiker terug met een foutmelding
      return res.redirect('/project?state=error');
    }

    // Maak een nieuw projectobject aan met een unieke ID
    const newProject = {
      id: Date.now(), // Gebruik de huidige tijd als unieke ID
      title,
      description,
      name,
      email
    };

    try {
      // Lees de bestaande projecten uit het JSON-bestand
      const file = await readFile(dataPath, 'utf8');
      const data = JSON.parse(file);

      // Voeg het nieuwe project toe aan de lijst van projecten
      data.projects.push(newProject);

      // Schrijf de bijgewerkte lijst terug naar het JSON-bestand
      await writeFile(dataPath, JSON.stringify(data, null, 2));

      // Stuur de gebruiker terug naar de projectpagina met een succesmelding
      res.redirect('/project?state=success');
    } catch (err) {
      // Log een foutmelding als er iets misgaat
      console.error('Er is iets misgegaan:', err);

      // Stuur een serverfout terug naar de client
      res.status(500).send('Server error');
    }
  });

// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000; als deze applicatie ergens gehost wordt, waarschijnlijk poort 80
app.set('port', process.env.PORT || 8000)

// Start Express op, gebruik daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  console.log(`Project draait via http://localhost:${app.get('port')}/\n\nSucces deze sprint. En maak mooie dingen! 🙂`)
})
