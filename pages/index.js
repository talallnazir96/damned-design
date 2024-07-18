import HomeBanner from "../components/Home/HomeBanner";
import Categories from "../components/Home/Categories";
import About from "../components/Home/About";
import Instagram from "../components/Home/Instagram";
import Layout from "../components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import Services from "../components/Home/Services";
import { WP_URL } from "../utils/config";
import Preloader from "../components/Preloader";
import { Spinner } from "react-bootstrap";
export default function Home({ homeData }) {
  const [resolvedPosts, setresolvedPosts] = useState(null);
 

  const [pageInformation, setpageInformation] = useState(null);
  
  
  const getResult = async () => {
    try {
      const response = await axios.get(`https://www.damnedventures.com/wp-json/wp/v2/insta_posts`);
      const res =  JSON.parse(response.data.body);
      const { post, header } = res.data;
      setresolvedPosts(post ?? null);
      setpageInformation(header ?? null);
    } catch (error) {
      console.log("query error \n", error);
    }
    
  };
  useEffect(() => {
    getResult();
  }, []);
  return homeData ? (
    <Layout>
      <HomeBanner homeData={homeData} />
      <Categories homeData={homeData} />
      <About homeData={homeData} />
      <Services homeData={homeData} />
      {
        !resolvedPosts && (<Spinner animation="border" role="status" style={{marginLeft: '50vw',marginTop: '15px', marginBottom:'15px'}}>
        <span className="visually-hidden">Loading Instagram Posts...</span>
      </Spinner>)
      }
      {resolvedPosts && pageInformation && (
        <Instagram
          instagramPostData={resolvedPosts}
          pageInformation={pageInformation}
        />
      )}
    </Layout>
  ) : (
    <Preloader/>
  );
}

export const getServerSideProps = async () => {
  
  let result;
  try {
    const response = await axios.get(`${WP_URL}/wp-json/wp/v2/homepage`);
    result = response.data;
  } catch (error) {
    console.log("query error \n", error);
  }

  

  return {
    props: {
      homeData: result ?? null
    },
  };
};

 
