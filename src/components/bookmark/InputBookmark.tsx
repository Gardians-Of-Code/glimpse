import "./Bookmarks.css";

import { Plus } from "lucide-react";

interface bkmrk {
  bookmark: string;
  setBookmark: React.Dispatch<React.SetStateAction<string>>;
  tags: string;
  setTags: React.Dispatch<React.SetStateAction<string>>;
  handleAddBookmark: (e: React.FormEvent) => void;
}

function InputBookmark({ bookmark, setBookmark, tags, setTags, handleAddBookmark }: bkmrk) {
  return (
    <div className="newBookmark">
      <Plus className="plus cursor-pointer hover:scale-150 transform transition-transform duration-300 ease-in-out" onClick={handleAddBookmark} />
      <form onSubmit={handleAddBookmark} >
        <span className="w-[2px] h-5 bg-[#00000062]"/>
        <input
          className="newBookmark_input focus:outline-none"
          type="text"
          id="inputBookmark"
          placeholder="Add URL"
          value={bookmark}
          onChange={(e) => {
            setBookmark(e.target.value);
          }}
          onSubmit={handleAddBookmark}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddBookmark(e);
          }}}
        />
        <span className="w-[2px] h-5 bg-[#00000062] ml-[5px]"/>
        <input
          className="newBookmark_input focus:outline-none"
          type="text"
          id="inputTags"
          placeholder="Tag1, Tag2, ..."
          value={tags}
          onChange={(e) => {
            setTags(e.target.value);
          }}
          onSubmit={handleAddBookmark}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddBookmark(e);
          }}}
        />
      </form>
    </div>
  );
}

export default InputBookmark;

