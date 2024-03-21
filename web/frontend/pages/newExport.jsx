
import React from "react";
import { useEffect, useState } from "react";
import { CalloutCard } from "@shopify/polaris";
import {  CSVLink } from "react-csv";
import { useAuthenticatedFetch }from '../hooks'
import { json } from "react-router-dom";
import { LifecycleHook } from "@shopify/app-bridge";

export default function newExport() {
  
  let[productData , setProductData] = useState([]);
  let[metafields , setMetafields]= useState([]);

  let fetch = useAuthenticatedFetch();  

  async  function fetchProduct(){
    try{
      let meta_req = await fetch("/api/metafields/product");
      // let create_req =  fetch("/api/metafield/create",{
      //   method :"POST",
      //   headers :{"content_type":"application/json"}
      // })
      // console.log(create_req);
      let request = await fetch ("/api/products/info");
      let response =  await request.json();
      let meta_res = await meta_req.json();
      console.log(meta_res);
      console.log(response);

      setProductData(response.data); 
      setMetafields(meta_res.data);
      
    }
  catch(error){
     console.log(error)   
  }
  }

  useEffect(()=>{
    fetchProduct();
  },[]);
  
  const headers = [
    {label : "Id" , key : "id"},
    {label: "Title", key : "title"},
    {label: "Handle", key : "handle"},
    {label: "Body Html ", key : "body_html"},
    {label: "Vendor", key : "vendor"},
    {label: "Tags", key : "tags"},
    {label: "Status", key : "status"},
    {label: "Created At", key : "created_at"},
    {label: "Updated At", key : "updated_at"},
    {label: "Published at", key : "published_at"},
    {label: "Varient ", key : "varients"},
  ]

  const csvData = productData.map( (products) => ({
    id : parseInt(products.id),
    title :products.title,
    handle :products.handle,
    body_html :products.body_html,
    vendor :products.vendor,
    tags :products.tags,
    status :products.status,
    created_at :products.created_at,
    updated_at :products.updated_at,
    published_at :products.published_at,
  }));
   

  const metaData = metafields.map((metadata) => ({
    id : parseInt(metadata.id),
    type :metadata.type,
    description : metadata.description,
    admin_graphql_api_id : metadata.admin_graphql_api_id,
    key :metadata.key,
    namespace :metadata.namespace,
    owner_id :metadata.owner_id,
    owner_resouce :metadata.owner_resouce,
    created_at :metadata.created_at,
    updated_at :metadata.updated_at,
    value :metadata.value
  }));
 

  const meta_headers = [
    {label : "Id" , key : "id"},
    {label: "Type", key : "type"},
    {label: "Description ", key : "description"},
    {label: "admin_graphql_api_id", key : "admin_graphql_api_id"},
    {label: "Key", key : "key"},
    {label: "Namespace", key : "namespace"},
    {label: "Created At", key : "created_at"},
    {label: "Updated At", key : "updated_at"},
    {label: "Owner_id", key : "owner_id"},
    {label: "value ", key : "value"},
  ]
  

  // console.log(csvData,)
return (
        <div>
    

           <CalloutCard
            title="Export" 
            illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
            primaryAction={{
              content: 'Export', 
              disabled : productData.length === 0,
              onAction: () =>{
              },
            }}
          >
            <p>Export your Product files here</p>
            
            {productData.length > 0 && (
                <CSVLink data={csvData} headers={headers} filename="products.csv">
                <button>Download CSV</button>
                </CSVLink> 
                )}
                {metafields.length > 0 && (
                <CSVLink data={metaData} headers={meta_headers} filename="products.csv">
                <button>Download Meta CSV</button>
                </CSVLink> 
                )}
          </CalloutCard>    
        </div>
    );
}