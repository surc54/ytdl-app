interface Video {
    id: string;
    title: string;
    author: {
        name: string;
        id: string | null;
    };
    length: number;
    thumbnail?: string;
}

export default Video;
