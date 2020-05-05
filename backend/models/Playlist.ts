import Video from "./Video";

interface Playlist {
    id: string;
    title: string;
    author: {
        name: string;
        id: string;
    };
    videos: Video[];
}

export default Playlist;
