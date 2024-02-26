const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const cors = require('cors'); // Import cors module


const app = express();
const port = 3000;

// Parse JSON bodies
app.use(bodyParser.json());
app.use(cors());


const text = `ASIREM is your dynamic development team dedicated to turning visions into reality. We blend innovation with skill, crafting digital solutions that exceed expectations. With us, your project isn't just a task; it's the future we build together.

Services of Asirem are :

1-/ Website Design and Development:
Creating captivating websites is our specialty. We tailor each site to reflect your brand and goals, incorporating e-commerce, interactivity, and mobile-friendly design for a seamless user experience.

2-/ Search Engine Optimization (SEO):
 Boost your website's visibility and attract more visitors with our SEO services. We optimize your site to rank higher on search engines, using keywords, link building, and ongoing monitoring to keep you ahead of the competition.
 
3-/ Website Maintenance and Support:
 Ensure your website's security and reliability with our maintenance services. We handle updates, security monitoring, troubleshooting, and regular backups, allowing you to focus on your business while keeping your site running smoothly and user-friendly.

The Employees: 
IT Manager and builder of Me Boujelouah Massinissa. 
&
The Assistant Younes Who Massinissa is really grateful to have him.

Contacts for Asirem:
Asiremdev@gmail.com`;

const nameRegex = /([A-Z][a-z]+(?:-[A-Z][a-z]+)*)\s+([A-Z][a-z]+(?:-[A-Z][a-z]+)*)/; // Improved name regex

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
    return "ASIREM is dedicated to turning visions into reality, blending innovation with skill to craft digital solutions that exceed expectations.";
  } else if (question.toLowerCase().includes("who works") || question.toLowerCase().includes("employees") || question.toLowerCase().includes("workers")) {
    const employees = text.match(/The Employees :([\s\S]+)Contacts/)[1].trim();
    return employees;
  } else if (question.toLowerCase().includes("name")) {
    return `The name of the company is ASIREM.`;
  } else if (question.toLowerCase().includes("description") || question.toLowerCase().includes("more information")) {
    return text.split("\n\n")[0]; // Extract description from the text
  } else if (question.toLowerCase().includes("services") || question.toLowerCase().includes("they do")) {
    return text.split("Services of Asirem are :")[1].split("Contacts" && "The Employees" )[0].trim(); // Extract services from the text
  } else if (question.toLowerCase().includes("contact") || question.toLowerCase().includes("contacts")) {
    return text.split("Contacts for Asirem:")[1].trim(); // Extract contacts from the text
  } else if (question.toLowerCase().includes("titles")) {
    const services = extractedInfo.join('\n');
    return services;
  }  else {
    return "I'm sorry, I don't understand the question.";
  }
}

function extractKeywords(phrase) {
    // Define common stopwords and excluded words
    const stopwords = ['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'from', 'of', 'is', 'are', 'was', 'were', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must', 'have', 'has', 'had', 'do', 'does', 'did', 'give', 'me', 'all', 'similar', 'to'];

    // Split the phrase into words
    const words = phrase.split(/\W+/);

    // Filter out stopwords and words that don't start with an uppercase letter
    const keywords = words.filter(word => {
        return word && word[0] === word[0].toUpperCase() && !stopwords.includes(word.toLowerCase());
    });

    return keywords;
}

async function searchWikipedia(query) {
  try {
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=true&explaintext=true&titles=${query}`;
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
        return "I'm sorry, I couldn't find any information on that topic.";
      }
    }
  } catch (error) {
    console.error("Error searching Wikipedia:", error);
    return "I'm sorry, I couldn't find any information on that topic.";
  }
}

async function getWikipediaData(pageId) {
  const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=info|extracts&inprop=url&explaintext=true&pageids=${pageId}`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data.query.pages[pageId];
    const title = data.title;
    const url = data.fullurl;
    const extract = data.extract;
    return { title, url, extract };
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

function collectFeedback(feedback, context) {
  console.log("Thank you for your feedback! It will help improve YazBot's responses in the future.");
  const feedbackData = { context, feedback };

  // Read existing feedback data
  let existingFeedback = [];
  try {
    existingFeedback = JSON.parse(fs.readFileSync('feedback.json'));
  } catch (error) {
    console.error("Error reading existing feedback data:", error);
  }

  // Append new feedback data
  existingFeedback.push(feedbackData);

  // Write feedback data back to the file
  fs.writeFileSync('feedback.json', JSON.stringify(existingFeedback, null, 2));
}

async function handleInput(req, res, next) {
    const input = req.body && req.body.question;
    console.log('input:', input);

    if (!input) {
      console.log("Question is missing in the request body");
      return res.status(400).json({ error: "Question is missing in the request body" });
    }
  
    const processedInput = input.trim();
    const keywords = extractKeywords(processedInput);
  
    const query = keywords.join(' ');
  
    if (keywords.some(word => ['asirem', 'company', 'services', 'employees'].includes(word.toLowerCase()))) {
      const extractedInfo = extractInformation(text);
      const answer = answerQuestion(processedInput, extractedInfo);
      res.json({ answer });
    } else if (query.toLowerCase().includes("elon musk")) {
      searchWikipedia("Elon Musk")
        .then(response => {
          collectFeedback(input, response); // Collect feedback before sending the response
          res.json({ answer: response });
        })
        .catch(error => res.status(500).json({ error: "Internal server error" }));
    } else {
      next(); // Pass to the next middleware
    }
}

function searchHandler(req, res) {
  const input = req.body && req.body.question;
  const query = extractKeywords(input).join(' ');
  searchWikipedia(query)
    .then(response => {
      collectFeedback(input, response); // Collect feedback before sending the response
      res.json({ answer: response });
    })
    .catch(error => res.status(500).json({ error: "Internal server error" }));
}

// Set up routes
app.post('/ask', handleInput, searchHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
