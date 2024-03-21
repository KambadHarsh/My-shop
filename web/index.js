// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json()); 

//read product information
app.get("/api/products/info" , async (req ,res)=>{
  let productInfo = await shopify.api.rest.Product.all({
    session : res.locals.shopify.session,
    
  })
   res.status(200).send(productInfo);
})

// API endpoint for creating products
app.post("/api/products/create", async ( req, res) => {

  let createProduct= await new shopify.api.rest.Product({
    session: res.locals.shopify.session
  })

  res.status(200).send(createProduct);
});


// get meta data
app.get("/api/metafields/product" , async (req,res)=>{
  let metafields = await shopify.api.rest.Metafield.all({
    session : res.locals.shopify.session,
    "owner_id": "68573200601",
    "owner_resource": "product",  
  })
  res.status(200).send(metafields);
})

// create metafields
app.get("/api/metafield/create" , async (req,res)=>{
  let metafield = new shopify.api.rest.Metafield({
    session : res.locals.shopify.session,
  });
  metafield.product_id = 125694872356,
  metafield.namespace ="custom";
  metafield.key ="unit_price";
  metafield.type = "number_integer";
  metafield.value ="50";   
  await metafield.save({
    update: true,
  })
  res.status(200).send(metafield);
})


app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.  rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);


// // create meatfiled
// app.post("api/metafiled/createGQL" ,async(req,res)=>{
// const client = new shopify.api.clients.Graphql({
//   session : res.locals.shopify.session,
// });
// let data = await client.query({
//   data: {
//     "query": `mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
//       metafieldDefinitionCreate(definition: $definition) {
//         createdDefinition {
//           id
//           name
//         }
//         userErrors {
//           field
//           message
//           code
//         }
//       }
//     }`,
//     "variables": {
//       "definition": {
//         "name": "bonus price",
//         "namespace": "price",
//         "key": "bonus_money",
//         "type": "number_integer",
//         "description": "THis is app metafiled",
//         "validations": [
//           {
//             "name": "min",
//             "value": "0"
//           },
//           {
//             "name": "max",
//             "value": "20"
//           }
//         ],
//         "ownerType": "PRODUCT"
//       }
//     },
//   },
// })
// });

