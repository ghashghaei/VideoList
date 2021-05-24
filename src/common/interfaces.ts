export interface Category {
  id: number;
  name: string;
}

export interface VideoFormat {
  res: string;
  size: number;
}
export interface Video {
  id: number;
  catIds: number[];
  name: string;
  releaseDate: string;
  formats: { [id: string]: VideoFormat; };
}

export interface Author {
  id: number;
  name: string;
  videos: Video[];
}

export interface ProcessedVideo {
  id: number;
  name: string;
  author: string;
  categories: string[];
  releaseDate: string;
  highestqualityformat: string;
}


