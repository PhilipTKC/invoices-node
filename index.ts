import puppeteer = require("puppeteer");
import express = require("express");
import dayjs = require("dayjs");
import bodyParser = require("body-parser");
import generate = require("nanoid/async/generate");
const fetch = require("node-fetch");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/create', async (req, res) => {

  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();

  const reference = await generate('1234567890', 5);

  const body = req.body;

  const data = {
    customer: {
      email: body.customer.email,
      name: body.customer.name,
    },
    dateFormat: body.dateFormat || "DD/MM/YYYY",
    invoice: {
      date: undefined,
      items: body.invoice.items,
      reference: reference,
      subTotal: 0,
      title: body.invoice.title
    },
    owner: {
      accountNumber: body.owner.accountNumber,
      email: body.owner.email,
      name: body.owner.name,
      phoneNumber: body.owner.phoneNumber,
      taxNumber: body.owner.taxNumber,
    },
    template: body.template || "default"
  };

  data.invoice.date = dayjs().format(data.dateFormat);
  data.invoice.subTotal = calculateSubTotal(data.invoice.items);

  const template = await fetch(`${req.protocol}://${req.headers.host}/template`, {
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
    method: "POST"
  }).then((response: Response) => response.text());

  await page.emulateMediaType("screen");
  await page.setContent(template, { waitUntil: "networkidle0" });

  await page.pdf({
    path: `invoices/invoice-${dayjs().format("DD-MM-YYYY")}-${reference}.pdf`,
    format: "A4",
    printBackground: false
  });

  await browser.close();

  return res.sendStatus(200);
});

app.post("/template", (req, res) => {
  const template = req.body.template;
  return res.render(`${template}.ejs`, req.body);
});

app.listen(3000, () => console.log('Running Server on port 3000'));

function calculateSubTotal(items: any[]): number {
  const total = items.reduce((a, b) => a + (b.rate), 0);
  return total;
}