import "./Bookmarks.css";

import { Plus } from "lucide-react";

interface bkmrk {
  bookmark: string;
  setBookmark: React.Dispatch<React.SetStateAction<string>>;
  handleAdd: (e: React.FormEvent) => void;
}
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
