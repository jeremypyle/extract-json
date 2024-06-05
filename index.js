const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Add a simple GET route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the JSON from Invoices API');
});

app.post('/', async (req, res) => {
  console.log('Received request:', req.body); // Log the request body

  const { url } = req.body;
  if (!url) {
    console.log('No URL provided');
    return res.status(400).send({ error: 'URL is required' });
  }

  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Wait for the phrase "amount due" to be visible on the page
    try {
      await page.waitForFunction(
        () => document.body.innerText.includes('Amount due'),
        { timeout: 30000 } // Increase the timeout to 30 seconds
      );
    } catch (error) {
      const content = await page.content();
      console.log('Full page content:', content);
      throw error;
    }

    // Extract the full page content
    const content = await page.content();

    await browser.close();

    if (content) {
      console.log('Page content extracted successfully');
      res.status(200).send({ content });
    } else {
      console.log('Failed to extract page content');
      res.status(404).send({ error: 'Failed to extract page content' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
