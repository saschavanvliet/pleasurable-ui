
// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express, { response } from 'express'
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

// Importeer het npm package Express


const afbeeldingen =  'https://fdnd-agency.directus.app/items/bib_afbeeldingen'

// afbeeldingen stekjes 
const afbeeldingenstekjesResponse = await fetch(afbeeldingen + '?filter={%20%22type%22:%20{%20%22_eq%22:%20%22stekjes%22%20}}')
const afbeeldingenstekjesResponseJSON = await afbeeldingenstekjesResponse.json()

const content = 'https://fdnd-agency.directus.app/items/bib_content'

// geveltuin
const afbeeldingengeveltuinResponse = await fetch(afbeeldingen + '?filter[type][_eq]=geveltuin')
const afbeeldingengeveltuinResponseJSON = await afbeeldingengeveltuinResponse.json()

const contentgeveltuinResponse = await fetch(content + '?filter[id][_eq]=3')
const contentgeveltuinResponseJSON = await contentgeveltuinResponse.json()

// Maak een nieuwe Express applicatie aan, waarin we de server configureren

// Importeer de Liquid package
import { Liquid } from 'liquidjs'

// Maak een nieuwe Express applicatie aan

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
app.set('views', './views')

// Gebruik de map 'public' voor statische bestanden (zoals CSS en afbeeldingen)
app.use(express.static('public'))

// Maak werken met data uit formulieren iets prettiger
app.use(express.urlencoded({ extended: true }))

// Home
app.get('/', async function (request, response) {
  response.render('index.liquid')
})

// Stekjes
app.get('/stekjes', async function (request, response) {
  response.render('stekjes.liquid', {
    stekjes: stekjesResponseJSON.data,
    afbeeldingenstekjes: afbeeldingenstekjesResponseJSON.data
  });
});

  try {
    // Haal stekjes-data op
    const stekjesResponse = await fetch('https://fdnd-agency.directus.app/items/bib_stekjes')
    const stekjesResponseJSON = await stekjesResponse.json()

    // Haal afbeeldingen-data op
    const afbeeldingenResponse = await fetch('https://fdnd-agency.directus.app/items/bib_afbeeldingen?filter={%20%22type%22:%20{%20%22_eq%22:%20%22stekjes%22%20}}')
    const afbeeldingenResponseJSON = await afbeeldingenResponse.json()

    // Render de stekjespagina met data
    response.render('stekjes.liquid', {
      stekjes: stekjesResponseJSON.data,
      afbeeldingen: afbeeldingenResponseJSON.data
    })
  } catch (error) {
    console.error('Fout bij ophalen stekjes of afbeeldingen:', error)
    response.status(500).send('Er ging iets mis bij het ophalen van de stekjes 😢')
  }
})
// dynamische route detalpagina 
app.get('/stekjes/:id', async function (request, response) {
  const stekjeId = request.params.id;
  const stekjeResponse = await fetch(`https://fdnd-agency.directus.app/items/bib_stekjes/${stekjeId}`);
  const stekjeData = await stekjeResponse.json();
 
 
  response.render('detail.liquid', { stekje: stekjeData.data });
 });
   

// Zaden
app.get('/zaden', async function (request, response) {
  response.render('zaden.liquid')
})

// Geveltuin
app.get('/geveltuin', async function (request, response) {
  response.render('geveltuin.liquid', {
    afbeeldingengeveltuin: afbeeldingengeveltuinResponseJSON.data,
    contentgeveltuin: contentgeveltuinResponseJSON.data
  });
})


// Agenda
app.get('/agenda', async function (request, response) {

  response.render('agenda.liquid', {

      // agenda
      const content = 'https://fdnd-agency.directus.app/items/bib_content'

      const contentagendaResponse = await fetch(content + '?filter[id][_eq]=5')
      const contentagendaResponseJSON = await contentagendaResponse.json()
  
      const workshopsResponse = await fetch('https://fdnd-agency.directus.app/items/bib_workshops')
      const workshopsResponseJSON = await workshopsResponse.json()
  response.render('agenda.liquid', {
    contentagenda: contentagendaResponseJSON.data,
  });
})

// Prikbord (route)
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

// Foot
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

  // POST-route om een project te verwijderen
  app.post('/delete-project', async (req, res) => {
    // Haal de ID van het te verwijderen project op uit het formulier
    const { id } = req.body;

    try {
      // Lees de bestaande projecten uit het JSON-bestand
      const file = await readFile(dataPath, 'utf8');
      const data = JSON.parse(file);

      // Filter de projectenlijst om het project met de opgegeven ID te verwijderen
      data.projects = data.projects.filter(project => project.id !== parseInt(id));

      // Schrijf de bijgewerkte lijst terug naar het JSON-bestand
      await writeFile(dataPath, JSON.stringify(data, null, 2));

      // Stuur de gebruiker terug naar de projectpagina met een verwijdermelding
      res.redirect('/project?state=deleted');
    } catch (err) {
      // Log een foutmelding als er iets misgaat
      console.error('Fout bij verwijderen:', err);

      // Stuur een serverfout terug naar de client
      res.status(500).send('Server error');
    }
  });

// expiriment
app.get('/expiriment', async function (request, response) {
  response.render('expiriment.liquid')
})

// expiriment
app.get('/404', async function (request, response) {
  response.render('404.liquid')
})

// Stel het poortnummer in waar Express op moet luisteren
app.set('port', process.env.PORT || 8000)

// Start de server
app.listen(app.get('port'), function () {
  console.log(`Project draait via http://localhost:${app.get('port')}/\n\nSucces deze sprint. En maak mooie dingen! 🙂`)
})
