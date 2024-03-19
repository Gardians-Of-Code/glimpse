import { useRef, useState } from "react";
import "./Search.css";

function Search() {
  const FormRef = useRef<HTMLFormElement>(null);
  const ButtonRef = useRef<HTMLButtonElement>(null);
  const InputRef1 = useRef<HTMLInputElement>(null);
  const InputRef2 = useRef<HTMLInputElement>(null);

  const [Active, setActive] = useState<boolean>(false);

  const performSearch = (event : React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let query;
    let search_engine = "";
    console.log(Active);
    if (Active == true) {
      search_engine = "bing";
      query = InputRef1.current?.value
    } else {
      search_engine = "google";
      query = InputRef2.current?.value
    }
    if (query !== undefined) {
      if (query.trim() !== "") {
        window.location.href =
          "https://www." + search_engine + ".com/search?q=" + encodeURIComponent(query);
      }
    }
};

  const toggleSearch = () => {
    if (Active == false) {
      setActive(true);
    } else {
      setActive(false);
    }
  };

  return (
    <div>
    <div id="google" className={Active == false ? "search" : "search de-active"}>
      <form ref={FormRef} className="searchForm" onSubmit={performSearch}>
        <input
          ref={InputRef2}
          type="text"
          id="searchInput1"
          className="searchbar"
          placeholder="Search with Google"
        />
          <button
            type="button"
            ref={ButtonRef}
            id="googleButton"
            onClick={toggleSearch}
            className="searchButton"
          ></button>
      </form>
    </div>
    <div id="bing" className={Active == true ? "search" : "search de-active"}>
    <form ref={FormRef} className="searchForm" onSubmit={performSearch}>
      <button
          type="button"
          ref={ButtonRef}
          id="bingButton"
          onClick={toggleSearch}
          className="searchButton"
        ></button>
      <input
        ref={InputRef1}
        type="text"
        id="searchInput2"
        className="searchbar"
        placeholder="Search with Bing"
      />
    </form>
  </div>
  </div>
  );
}

export default Search;
