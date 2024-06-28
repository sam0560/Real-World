import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import FetchData from "../Api/FetchData";
import { useAuth } from "../context/AuthContext";
import { FavoriteServices } from "../Api/FavoritingArticle"; // Updated import
import { Article } from "../..";

export default function SingleArticle() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth(); // Assuming useAuth provides isAuthenticated and jwtToken
  const navigate = useNavigate();

  const { data, loading, error, followAuthor } = FetchData({ slug });
  const articleDetail: Article | undefined = data ? data[0] : undefined;

  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [isFavorited, setIsFavorited] = useState<boolean | null>(null);

  useEffect(() => {
    // Retrieve follow and favorite states from local storage on component mount
    const storedFollowing = localStorage.getItem(`following-${slug}`);
    const storedFavorited = localStorage.getItem(`favorited-${slug}`);

    setIsFollowing(storedFollowing ? JSON.parse(storedFollowing) : null);
    setIsFavorited(storedFavorited ? JSON.parse(storedFavorited) : null);
  }, [slug]);

  useEffect(() => {
    // Save follow and favorite states to local storage whenever they change
    if (isFollowing !== null) {
      localStorage.setItem(`following-${slug}`, JSON.stringify(isFollowing));
    }
    if (isFavorited !== null) {
      localStorage.setItem(`favorited-${slug}`, JSON.stringify(isFavorited));
    }
  }, [isFollowing, isFavorited, slug]);

  const handleFollowClick = () => {
    if (!isAuthenticated) {
      navigate("/register");
      return;
    }

    if (articleDetail) {
      const newFollowingState = !isFollowing;

      followAuthor(articleDetail.author.username, newFollowingState)
        .then(() => {
          setIsFollowing(newFollowingState);
        })
        .catch((error) => {
          console.error("Failed to follow/unfollow author:", error);
        });
    }
  };

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      navigate("/register");
      return;
    }

    const newFavoriteState = !isFavorited;

    FavoriteServices(slug, newFavoriteState)
      .then(() => {
        setIsFavorited(newFavoriteState);

      })
      .catch((error) => {
        console.error("Failed to favorite/unfavorite article:", error);
      });
  };

  return (
    <>
      {loading && <p>Loading article...</p>}
      {error && <p>{error}</p>}
      {articleDetail && (
        <div className="article-page">
          <div className="banner">
            <div className="container">
              <h1>{articleDetail.title}</h1>
              <div className="article-meta">
                <Link to={`/@${articleDetail.author.username}`}>
                  <img src={articleDetail.author.image} alt={articleDetail.author.username} />
                </Link>
                <div className="info">
                  <Link to={`/@${articleDetail.author.username}`} className="author">
                    {articleDetail.author.username}
                  </Link>
                  <span className="date">January 20th</span>
                </div>
                <button
                  className={`btn btn-sm btn-${isFollowing ? "secondary" : "outline-secondary"}`}
                  onClick={handleFollowClick}
                >
                  <i className="ion-plus-round"></i>
                  &nbsp; {isFollowing ? "Unfollow" : "Follow"} {articleDetail.author.username} 
                </button>
                &nbsp;&nbsp;
                <button
                  className={`btn btn-sm btn-${isFavorited ? "primary" : "outline-primary"}`}
                  onClick={handleFavoriteClick}
                >
                  <i className="ion-heart"></i>
                  &nbsp; {isFavorited ? "Unfavorite" : "Favorite"} Article{" "}
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
                    <li className="tag-default tag-pill tag-outline" key={index}>
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
                  <img src={articleDetail.author.image} alt={articleDetail.author.username} />
                </Link>
                <div className="info">
                  <Link to={`/@${articleDetail.author.username}`} className="author">
                    {articleDetail.author.username}
                  </Link>
                  <span className="date">January 20th</span>
                </div>
                <button
                  className={`btn btn-sm btn-${isFollowing ? "secondary" : "outline-secondary"}`}
                  onClick={handleFollowClick}
                >
                  <i className="ion-plus-round"></i>
                  &nbsp; {isFollowing ? "Unfollow" : "Follow"} {articleDetail.author.username}
                </button>
                &nbsp;
                <button
                  className={`btn btn-sm btn-${isFavorited ? "primary" : "outline-primary"}`}
                  onClick={handleFavoriteClick}
                >
                  <i className="ion-heart"></i>
                  &nbsp; {isFavorited ? "Unfavorite" : "Favorite"} Article{" "}
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
