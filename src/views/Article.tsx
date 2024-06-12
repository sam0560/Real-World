import LikeButton from "../components/LikeButton";
import FetchData from "../Api/FetchData";
import { Article as ArticleProps } from "../..";
import { Link } from "react-router-dom";

export default function Article() {
  const { data, loading, error } = FetchData();

  return (
    <>
      {/* Loading */}
      {loading && <div>Loading.......</div>}
      {/* Error */}
      {error && <div>Fetching Articles failed</div>}

      {/* This is a view of articles */}
      {data?.map((i: ArticleProps) => (
        <div className="article-preview" key={i.slug}>
          <div className="article-meta">
            <Link to={`/#/@${i.author.username}`}>
              <img src={i.author.image} />
            </Link>
            <div className="info">
              <Link to={`/#/@${i.author.username}`} className="author">
                {i.author.username}
              </Link>
              <span className="date">January 4,2024</span>
            </div>
            <LikeButton favoritesCount={i.favoritesCount} />
          </div>
          <Link
            to={`/article/${i.slug}`}
            className="preview-link"
          >
            <h1>{i.title}</h1>
            <p>{i.description}</p>
            <span>Read more...</span>
            <ul className="tag-list">
              {i.tagList.map((tag, index) => (
                <li className="tag-default tag-pill tag-outline" key={index}>
                  {tag}
                </li>
              ))}
            </ul>
          </Link>
        </div>
      ))}
    </>
  );
}
