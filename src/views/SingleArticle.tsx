import { Link, useParams } from "react-router-dom";
import FetchData from "../Api/FetchData";

export default function SingleArticle() {
  const { slug } = useParams<{ slug: string }>();
  
  // Get article from fetchData
  const { data, loading, error } = FetchData({ slug });
  
  const articleDetail = data? data[0] : null;
  
  return (
    <>
      {loading && <p>Loading articles ...</p>}
      {error && <p>{error}</p>}
      {articleDetail && (
        <div className="article-page">
          <div className="banner">
            <div className="container">
              <h1>{articleDetail.title}</h1>

              <div className="article-meta">
                <Link to={`/@${articleDetail.author.username}`}>
                  <img src={articleDetail.author.image} />
                </Link>
                <div className="info">
                  <Link
                    to={`/@${articleDetail.author.username}`}
                    className="author"
                  >
                    {articleDetail.author.username}
                  </Link>
                  <span className="date">January 20th</span>
                </div>
                <button className="btn btn-sm btn-outline-secondary">
                  <i className="ion-plus-round"></i>
                  &nbsp; Follow {articleDetail.author.username}{" "}
                </button>
                &nbsp;&nbsp;
                <button className="btn btn-sm btn-outline-primary">
                  <i className="ion-heart"></i>
                  &nbsp; Favorite Post{" "}
                  <span className="counter">
                    {articleDetail.favoritesCount}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="container page medium">
            <div className="row article-content">
              <div className="col-md-12">
                <p>{articleDetail.body}</p>
                <ul className="tag-list">
                  {articleDetail.tagList.map((tag, index) => (
                    <li
                      className="tag-default tag-pill tag-outline"
                      key={index}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <hr />

            <div className="article-actions">
              <div className="article-meta">
                <Link to={`/@${articleDetail.author.username}`}>
                  <img src={articleDetail.author.image} />
                </Link>
                <div className="info">
                  <Link
                    to={`/@${articleDetail.author.username}`}
                    className="author"
                  >
                    {articleDetail.author.username}
                  </Link>
                  <span className="date">January 20th</span>
                </div>
                <button className="btn btn-sm btn-outline-secondary">
                  <i className="ion-plus-round"></i>
                  &nbsp; Follow {articleDetail.author.username}
                </button>
                &nbsp;
                <button className="btn btn-sm btn-outline-primary">
                  <i className="ion-heart"></i>
                  &nbsp; Favorite Article{" "}
                  <span className="counter">
                    {articleDetail.favoritesCount}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
