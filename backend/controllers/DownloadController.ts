import fs from "fs";
import path from "path";
import sanitizeFileName from "sanitize-filename";
import { file } from "tmp-promise";
import ytdl from "ytdl-core";
import ytpl from "ytpl";
import url from "url";
import querystring from "querystring";
import Video from "../models/Video";
import Playlist from "../models/Playlist";
import { convertTime } from "../tools";

export const ID_REGEX = /^A-Za-z0-9\-_]+$/;

export const videoUrlToId = (link: string) => {
    const urlObj = url.parse(link);
    const query = querystring.parse(urlObj.query || "");

    return (query && query.v) || null;
};

export const videoIdToUrl = (id: string) => {
    return `https://www.youtube.com/watch?v=${id}`;
};

export const playlistUrlToId = (link: string) => {
    const urlObj = url.parse(link);
    const query = querystring.parse(urlObj.query || "");

    return (query && query.list) || null;
};

export const playlistIdToUrl = (id: string) => {
    return `https://www.youtube.com/playlist?list=${id}`;
};

export const fetchVideo = (id: string): Promise<Video> => {
    return new Promise((resolve, reject) => {
        if (!ID_REGEX.test(id)) {
            throw new Error(`Invalid id "${id}" given.`);
        }

        ytdl.getBasicInfo(videoIdToUrl(id))
            .then((info) => {
                const { videoDetails } = info.player_response;

                const thumbnail = videoDetails.thumbnail.thumbnails.sort(
                    (a, b) => b.height - a.height
                )[0];

                resolve({
                    id: videoDetails.videoId ?? info.video_id,
                    title:
                        info.player_response?.microformat
                            ?.playerMicroformatRenderer?.title?.simpleText ??
                        videoDetails.title ??
                        info.title,
                    author: {
                        name: videoDetails.author ?? info.author.name,
                        id: videoDetails.channelId ?? info.author.id,
                    },
                    length:
                        videoDetails.lengthSeconds ??
                        Number(info.length_seconds),
                    thumbnail: thumbnail.url,
                });
            })
            .catch(reject);
    });
};

export const fetchPlaylist = (id: string): Promise<Playlist> =>
    new Promise(async (resolve, reject) => {
        if (!ID_REGEX.test(id)) {
            throw new Error(`Invalid playlist id "${id}" given.`);
        }

        ytpl(id).then((data) => {
            resolve({
                id: data.id,
                title: data.title,
                author: {
                    name: data.author.name,
                    id: data.author.id,
                },
                videos: data.items
                    .map<Video | null>((v) => {
                        if (v.duration === null || v.author.name === null) {
                            return null;
                        }

                        return {
                            id: v.id,
                            title: v.title,
                            author: {
                                name: v.author.name,
                                id: v.author.id,
                            },
                            length: convertTime(v.duration),
                            thumbnail: v.thumbnail,
                        };
                    })
                    .filter((x) => x !== null) as Video[],
            });
        });
    });
