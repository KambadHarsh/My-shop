import {
  Page,
  Layout,
  CalloutCard,
  LegacyCard
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";
// import { NavLink } from "react-router-dom";
import React from "react";



export default function HomePage() {
  const { t } = useTranslation();
  return (
    
    <Page narrowWidth>
      <TitleBar title={t("My-Shop")} primaryAction={null} />   
      <Layout>
        <Layout.Section>
          <LegacyCard title="Export" sectioned>
            <p>
              Export your files easily with our app.
            </p>
          </LegacyCard>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <LegacyCard title="Import" sectioned>
            <p>Import your files easily with our app.</p>
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
