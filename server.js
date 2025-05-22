// Importeer het npm package Express
import express from 'express'

// Importeer de Liquid package
import { Liquid } from 'liquidjs'

// Maak een nieuwe Express applicatie aan
const app = express()

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
  try {
    // Haal stekjes-data op
    const stekjesResponse = await fetch('https://fdnd-agency.directus.app/items/bib_stekjes')
    const stekjesResponseJSON = await stekjesResponse.json()

    // Haal afbeeldingen-data op
    const afbeeldingenResponse = await fetch('https://fdnd-agency.directus.app/items/bib_afbeeldingen?filter={%20%22type%22:%20{%20%22_eq%22:%20%22stekjes%22%20}}')
    const afbeeldingenResponseJSON = await afbeeldingenResponse.json()

    // agenda
    const contentagendaResponse = await fetch(content + '?filter[id][_eq]=5')
    const contentagendaResponseJSON = await contentagendaResponse.json()

    const workshopsResponse = await fetch('https://fdnd-agency.directus.app/items/bib_workshops')
    const workshopsResponseJSON = await workshopsResponse.json()


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
  response.render('agenda.liquid' {
    contentagenda: contentagendaResponseJSON.data,
    workshops: workshopsResponseJSON.data
  });
})

// Partners
app.get('/partners', async function (request, response) {
  response.render('partners.liquid')
})

// Foot
app.get('/foot', async function (request, response) {
  response.render('foot.liquid')
})

// Contact
app.get('/contact', async function (request, response) {
  response.render('contact.liquid')
})

// Stel het poortnummer in waar Express op moet luisteren
app.set('port', process.env.PORT || 8000)

// Start de server
app.listen(app.get('port'), function () {
  console.log(`Project draait via http://localhost:${app.get('port')}/\n\nSucces deze sprint. En maak mooie dingen! 🙂`)
})
