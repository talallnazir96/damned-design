import React from "react";
import Banner from "../components/Products/Banner";
import Content from "../components/Products/Content";
import Layout from "../components/Layout";
import { SearchSEOConfig } from "../components/SEOConfig";

function Search() {
  // const {searchTerm} = useGlobalContext()
  // get search param from url
  const searchTerm =
    typeof window !== "undefined" ? window.location.search.split("=")[1] : null;

  return (
    <Layout>
      <SearchSEOConfig title={searchTerm} />
      <Banner
        text="Damned Designs offers a wide assortment of knives that are perfect for every occasion and application.  We deliver high-end knives crafted from premium steels like Bohler M390, CPM S35Vn, and D2 steel mated with rugged, durable handle materials such as Titanium, Carbon Fiber, Micarta, and G10.  With drop point, clip point, Wharncliffe, Sheepsfoot and Tanto blades ranging from 2” to 3.5”, Damned Designs offers expertly crafted folding knives that are both beautiful to look at and tremendously functional. Affordable yet substantial."
        page="Search"
      />
      <Content searchTerm={searchTerm} />
    </Layout>
  );
}

export default Search;
