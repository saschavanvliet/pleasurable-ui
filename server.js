// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from 'express'

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

// Prikbord
app.get('/prikbord', async function (request, response) {
  response.render('prikbord.liquid')
})
app.get('/project', async function (req, res) {
    res.render('project.liquid', { projects: data.projects, uiState });

// foot
app.get('/foot', async function (request, response) {
  response.render('foot.liquid')
})


// Contact
app.get('/contact', async function (request, response) {
  response.render('contact.liquid')
})


// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000; als deze applicatie ergens gehost wordt, waarschijnlijk poort 80
app.set('port', process.env.PORT || 8000)

// Start Express op, gebruik daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  console.log(`Project draait via http://localhost:${app.get('port')}/\n\nSucces deze sprint. En maak mooie dingen! 🙂`)
})
