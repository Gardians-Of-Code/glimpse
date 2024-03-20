export interface bkmrk{
    bookmark: string;
    setBookmark: React.Dispatch<React.SetStateAction<string>>;
    handleAdd: (e:React.FormEvent) => void;
}