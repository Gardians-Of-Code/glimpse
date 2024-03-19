import "./Bookmarks.css";
import bkmrk from "./bookmark";
import { Plus } from "lucide-react";

function InputBookmark({ bookmark, setBookmark, handleAdd }: bkmrk) {
  return (
    <div className="newBookmark">
      <Plus className="plus" />
      <form onSubmit={handleAdd}>
        <input
          className="newBookmark_input focus:outline-none"
          type="text"
          id="inputBookmark"
          placeholder="Add URL"
          value={bookmark}
          onChange={(e) => {
            setBookmark(e.target.value);
          }}
        />
      </form>
    </div>
  );
}

export default InputBookmark;
