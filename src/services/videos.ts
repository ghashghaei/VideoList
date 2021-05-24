import { getCategories } from './categories';
import { getAuthors } from './authors';
import { ProcessedVideo, Video } from '../common/interfaces';

export const getVideos = (): Promise<ProcessedVideo[]> => {
    return Promise
        .all([getCategories(), getAuthors()])
        .then(([categories, authors]) => {

            let videos: ProcessedVideo[] = [];
            authors.forEach(a => {
                a.videos.forEach(v => {
                    let nv: ProcessedVideo = {
                        name: v.name,
                        author: a.name,
                        id: v.id,
                        categories: categories.filter(c => v.catIds.indexOf(c.id) != -1).map(c => c.name),
                        releaseDate: v.releaseDate,
                        highestqualityformat: v.formats.one.res
                    };
                    videos.push(nv);
                });
            });

            return videos;
        });
};
