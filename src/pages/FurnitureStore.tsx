import React, { useState, useEffect, useRef, useMemo } from "react";
import "../styles/furnitureStore.css";
import Header from "../component2/Header";
import Hero from "../component2/Hero";
import Collections from "../component2/Collections";
import Products from "../component2/Products";
import Description from "../component2/Description";
import Footer from "../component2/Footer";
import Articles from "../component2/Articles";
import UserMessages from "../component2/UserMessages";
import Workflow from "../component2/Workflow";
import CommentVideo from "../component2/CommentVideo";
import CommonQuestions from "../component2/CommonQuestions";

const FurnitureStore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="App">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Hero />
      <Collections searchQuery={searchQuery} /> {/* شامل SubCollection داخلی */}
      <Products searchQuery={searchQuery} />
      <Articles />
      <CommonQuestions />
      <CommentVideo />
      <Workflow />
      <UserMessages />
      <Description />
      <Footer />
    </div>
  );
};

export default FurnitureStore;
