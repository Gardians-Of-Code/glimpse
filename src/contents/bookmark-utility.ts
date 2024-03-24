import { v4 as uuidv4 } from "uuid";

interface Bookmark {
  title: string;
  url: string;
  favicon?: string;
  tags?: string[];
  description?: string;
}

const extentionId = chrome.runtime.id;
let bookmarks: Bookmark[] = [];

// export const getBookmarks = () => {
//     chrome.bookmarks.getSubTree(extentionId, (results) => {
//         bookmarks = results[0].children;
//     });
// };

export const addBookmark = (url: string) => {
  //   chrome.bookmarks.create({
  //     title: bookmark.title,
  //     url: bookmark.url,
  //     parentId: extentionId,
  //     index: 0,
  //   });
};

export const removeBookmark = (url: string) => {
  // chrome.bookmarks.remove(bookmark.id);
};

export const checkIfBookmarked = (url: string) => {
  // return bookmarks.some((bookmark) => bookmark.url === url);
  return false;
};
