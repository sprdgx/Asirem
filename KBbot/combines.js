const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 5005;

app.use(bodyParser.json());
app.use(cors());

const text = `Avec KBNET, garantissez la continuité des activités de votre entreprise via des solutions réseau simples, intelligentes et sécurisées ...

A propos de nos services :
KBNET pilote votre transformation digitale et vous accompagne dans la réalisation de vos objectifs. Nous mettons à votre service notre expertise en stratégie et création digitales pour vous permettre de développer votre business.

1-/ Reseaux :
KBNET KBNET vous assure l'installation, la configuration et la résolution des problèmes liés aux différents réseaux informatiques.

2-/ Telephonie :
KBNET assure l'installation et la maintenance de la téléphonie analogique et IP.
 
3-/ Developement :
KBNET se spécialise dans le développement de solutions personnalisées, y compris le développement web, le développement mobile, et d'autres solutions informatiques sur mesure.

4-/ Electricité : 
KBNET assure l'alimentation fiable des équipements et met en place des solutions de redondance.

5-/ Genie civil :
KBNET s'occupe de la construction de structures génie civil, tels que les mats, pylônes, panneaux autoroute et shelters.

6-/ Champ metal :
KBNET propose des solutions dans le domaine du métal, notamment la construction de structures adaptées à vos besoins.

7-/ Energie solaire :
KBNET offre des solutions d'énergie solaire, incluant la construction de mats, pylônes, panneaux autoroute et shelters.

Les Contacts de KBNET:
contact@kbnet.com
+213 560 15 26 18
https://www.linkedin.com/company/kbnet/about/
https://www.instagram.com/kbnet_solaire/`;

const nameRegex = /([A-Z][a-z]+(?:-[A-Z][a-z]+)*)\s+([A-Z][a-z]+(?:-[A-Z][a-z]+)*)/;

function extractInformation(inputText) {
  const lines = inputText.split('\n');
  let namesAndTitles = [];

  for (let line of lines) {
    const match = line.match(nameRegex);
    if (match) {
      const nameAndTitle = `${match[0]} - ${line.split(':')[0].trim()}`;
      namesAndTitles.push(nameAndTitle);
    }
  }

  return namesAndTitles;
}

function answerQuestion(question, extractedInfo) {
  if (question.toLowerCase().includes("why") && question.toLowerCase().includes("company")) {
    return "KBNET est dédié à garantir la continuité des activités des entreprises en fournissant des solutions réseau simples, intelligentes et sécurisées.";
  } else if (question.toLowerCase().includes("who works") || question.toLowerCase().includes("employees") || question.toLowerCase().includes("workers")) {
    const employees = text.match(/Les Employés :([\s\S]+)Contacts/)[1].trim();
    return employees;
  } else if (question.toLowerCase().includes("name")) {
    return `Le nom de l'entreprise est KBNET.`;
  } else if (question.toLowerCase().includes("description") || question.toLowerCase().includes("more information")) {
    return text.split("\n\n")[0];
  } else if (question.toLowerCase().includes("services") || question.toLowerCase().includes("they do")) {
    return text.split("A propos de nos services :")[1].split("Les Contacts de KBNET:")[0].trim();
  } else if (question.toLowerCase().includes("contact") || question.toLowerCase().includes("contacts")) {
    return text.split("Les Contacts de KBNET:")[1].trim();
  } else if (question.toLowerCase().includes("titles")) {
    const services = extractedInfo.join('\n');
    return services;
  } else {
    return "Désolé, je ne comprends pas la question.";
  }
}

function extractKeywords(phrase) {
  const stopwords = ['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'from', 'of', 'is', 'are', 'was', 'were', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must', 'have', 'has', 'had', 'do', 'does', 'did', 'give', 'me', 'all', 'similar', 'to'];

  const words = phrase.split(/\W+/);

  const keywords = words.filter(word => {
    return word && word[0] === word[0].toUpperCase() && !stopwords.includes(word.toLowerCase());
  });

  return keywords;
}

async function searchWikipedia(query) {
  try {
    const apiUrl = `https://fr.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=true&explaintext=true&titles=${query}`;
    const response = await axios.get(apiUrl);
    const pages = response.data.query.pages;
    const pageId = Object.keys(pages)[0];
    const extract = pages[pageId].extract;

    if (extract) {
      return extract;
    } else {
      const pageid = Object.keys(pages)[0];
      const pageId = pages[pageid].pageid;
      console.log('pageid:', pageId);
      const data = await getWikipediaData(pageId);
      if (data) {
        const { title, url, extract } = data;
        return { title, url, extract };
      } else {
        return "Désolé, je n'ai trouvé aucune information sur ce sujet.";
      }
    }
  } catch (error) {
    console.error("Erreur lors de la recherche sur Wikipédia :", error);
    return "Désolé, je n'ai trouvé aucune information sur ce sujet.";
  }
}

async function getWikipediaData(pageId) {
  const apiUrl = `https://fr.wikipedia.org/w/api.php?action=query&format=json&prop=info|extracts&inprop=url&explaintext=true&pageids=${pageId}`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data.query.pages[pageId];
    const title = data.title;
    const url = data.fullurl;
    const extract = data.extract;
    return { title, url, extract };
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    return null;
  }
}

function collectFeedback(feedback, context) {
  console.log("Merci pour votre retour ! Cela aidera à améliorer les réponses du bot.");
  const feedbackData = { context, feedback };

  let existingFeedback = [];
  try {
    existingFeedback = JSON.parse(fs.readFileSync('feedback.json'));
  } catch (error) {
    console.error("Erreur lors de la lecture des retours existants :", error);
  }

  existingFeedback.push(feedbackData);

  fs.writeFileSync('feedback.json', JSON.stringify(existingFeedback, null, 2));
}

async function handleInput(req, res, next) {
  const input = req.body && req.body.question;
  console.log('input:', input);

  if (!input) {
    console.log("La question est manquante dans le corps de la requête");
    return res.status(400).json({ error: "La question est manquante dans le corps de la requête" });
  }

  const processedInput = input.trim();
  const keywords = extractKeywords(processedInput);

  const query = keywords.join(' ');

  if (keywords.some(word => ['kbnet', 'entreprise', 'services', 'employés'].includes(word.toLowerCase()))) {
    const extractedInfo = extractInformation(text);
    const answer = answerQuestion(processedInput, extractedInfo);
    res.json({ answer });
  } else if (query.toLowerCase().includes("elon musk")) {
    searchWikipedia("Elon Musk")
      .then(response => {
        collectFeedback(input, response);
        res.json({ answer: response });
      })
      .catch(error => res.status(500).json({ error: "Erreur interne du serveur" }));
  } else {
    next();
  }
}

function searchHandler(req, res) {
  const input = req.body && req.body.question;
  const query = extractKeywords(input).join(' ');
  searchWikipedia(query)
    .then(response => {
      collectFeedback(input, response);
      res.json({ answer: response });
    })
    .catch(error => res.status(500).json({ error: "Erreur interne du serveur" }));
}

app.post('/ask', handleInput, searchHandler);

app.listen(port, () => {
  console.log(`Le serveur fonctionne sur le port ${port}`);
});
