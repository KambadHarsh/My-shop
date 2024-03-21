import React, { useState, useCallback } from "react";
import { Toast, CalloutCard, Button, TextStyle } from '@shopify/polaris';
import PapaParse from 'papaparse';
import { useAuthenticatedFetch } from '../hooks'
export default function NewImport() {

  const [data, setData] = useState([]);
  let fetch = useAuthenticatedFetch();


  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      let finalData = [];
      const parseData = await PapaParse.parse(event.target.result, {
        header: true,
        dynamicTyping: true,

        complete: (parseData) => {
          // console.log(parseData, "Parse")
          parseData.data.map((data) => {
            if (data.Id != null) {
              finalData.push(data)
              console.log(data, "Parse");
            }
          })
        },
        error: (error) => {
          console.error("Error parsing CSV file:", error);
        },
      });

      console.log(finalData, "final data");
      setData(finalData)
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {


    if (!data.length) {
      console.error('Please select a CSV file to import.');
      return;
    }

    try {
      const response = await fetch("/api/products/create", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error creating products: ${await response.text()}`);
      }

      setData([]); // Clear parsed data after successful import
      console.log('Products imported successfully!');
    } catch (error) {
      console.error("Error importing products:", error);
    }
  };

  const clearData = () => {
    setData([]);
    console.clear();
  }

  return (
    <div>
      <CalloutCard
        title="Import"
        primaryAction={{
          content: 'Import',
          onAction: handleImport,
        }}
      >
        <p>Import your product files here</p>

        <input type="file" onChange={handleFileChange} accept=".csv" id="file" style={{ cursor: 'pointer' }} />
        {data.length > 0 && (
          <>
            <div>Parsed Data:</div>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </>
        )}
        <Button onClick={clearData} destructive>Clear Data</Button>

      </CalloutCard>
    </div>
  );
}
