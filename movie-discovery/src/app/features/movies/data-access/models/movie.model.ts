export interface Movie {
  readonly id: number;
  readonly title: string;
  readonly overview: string;
  readonly poster_path: string | null;
  readonly backdrop_path: string | null;
  readonly release_date: string;
  readonly vote_average: number;
  readonly genre_ids?: number[];
  readonly genres?: ReadonlyArray<{ readonly id: number; readonly name: string }>;
}

export interface MovieSearchResponse {
  readonly page: number;
  readonly results: Movie[];
  readonly total_pages: number;
  readonly total_results: number;
}

export interface MovieVideo {
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly site: string;
  readonly type: string;
  readonly official?: boolean;
}

export interface MovieVideosResponse {
  readonly id: number;
  readonly results: MovieVideo[];
}

