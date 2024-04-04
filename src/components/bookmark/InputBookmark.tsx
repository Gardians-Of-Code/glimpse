// import "./Bookmarks.css";

// import { Plus } from "lucide-react";

// interface bkmrk {
//   bookmark: string;
//   setBookmark: React.Dispatch<React.SetStateAction<string>>;
//   handleAdd: (e: React.FormEvent) => void;
// }
// function InputBookmark({ bookmark, setBookmark, handleAdd }: bkmrk) {
//   return (
//     <div className="newBookmark">
//       <Plus className="plus" />
//       <form onSubmit={handleAdd}>
//         <input
//           className="newBookmark_input focus:outline-none"
//           type="text"
//           id="inputBookmark"
//           placeholder="Add URL"
//           value={bookmark}
//           onChange={(e) => {
//             setBookmark(e.target.value);
//           }}
//         />
//       </form>
//     </div>
//   );}

// export default InputBookmark;


import "./Bookmarks.css";

import { Plus } from "lucide-react";

interface bkmrk {
  bookmark: string;
  setBookmark: React.Dispatch<React.SetStateAction<string>>;
  tags: string;
  setTags: React.Dispatch<React.SetStateAction<string>>;
  handleAdd: (e: React.FormEvent) => void;
}

function InputBookmark({ bookmark, setBookmark, tags, setTags, handleAdd }: bkmrk) {
  return (
    <div className="newBookmark">
      <Plus className="plus cursor-pointer hover:scale-110 transform transition-transform duration-300 ease-in-out" onClick={handleAdd} />
      <form onSubmit={handleAdd} >
        <input
          className="newBookmark_input focus:outline-none"
          type="text"
          id="inputBookmark"
          placeholder="Add URL"
          value={bookmark}
          onChange={(e) => {
            setBookmark(e.target.value);
          }}
          onSubmit={handleAdd}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAdd(e);
          }}}
        />
        <input
          className="newBookmark_input focus:outline-none"
          type="text"
          id="inputTags"
          placeholder="Add Tags (space separated)"
          value={tags}
          onChange={(e) => {
            setTags(e.target.value);
          }}
          onSubmit={handleAdd}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAdd(e);
          }}}
        />
      </form>
    </div>
  );
}

export default InputBookmark;

