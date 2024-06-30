import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import FetchData from "../Api/FetchData";
import { useAuth } from "../context/AuthContext";
import { FavoriteServices } from "../Api/FavoritingArticle"; // Updated import
import { Article } from "../..";
import { useFollow } from "../context/FollowServices";
import FavoriteButton from "../components/FavoriteButton";

export default function SingleArticle() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth(); // Assuming useAuth provides isAuthenticated and jwtToken
  const navigate = useNavigate();

  const { data, loading, error, followAuthor } = FetchData({ slug });
  const articleDetail: Article | undefined = data ? data[0] : undefined;

  const [isFavorited, setIsFavorited] = useState<boolean | null>(null);
  const [favoritesCount, setFavoritesCount] = useState<number>(0);

  const { followStates, setFollowState } = useFollow();
  const isFollowing =
    followStates.get(articleDetail?.author.username || "") || false;

  useEffect(() => {
    // Retrieve favorite states from local storage on component mount
    const storedFavorited = localStorage.getItem(`favorited-${slug}`);
    setIsFavorited(storedFavorited ? JSON.parse(storedFavorited) : null);
  }, [slug]);

  useEffect(() => {
    // Save favorite states to local storage whenever they change
    if (isFavorited !== null) {
      localStorage.setItem(`favorited-${slug}`, JSON.stringify(isFavorited));
    }
  }, [isFavorited, slug]);

  useEffect(() => {
    if (articleDetail) {
      setFavoritesCount(articleDetail.favoritesCount);
    }
  }, [articleDetail]);

  const handleFollowClick = () => {
    if (!isAuthenticated) {
      navigate("/register");
      return;
    }

    if (articleDetail) {
      const newFollowingState = !isFollowing;

      followAuthor(articleDetail.author.username, newFollowingState)
        .then(() => {
          setFollowState(articleDetail.author.username, newFollowingState);
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
      .then((updatedArticle) => {
        setIsFavorited(newFavoriteState);
        setFavoritesCount(updatedArticle.favoritesCount);
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
                  <img
                    src={articleDetail.author.image}
                    alt={articleDetail.author.username}
                  />
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
                <button
                  className={`btn btn-sm btn-${
                    isFollowing ? "secondary" : "outline-secondary"
                  }`}
                  onClick={handleFollowClick}
                >
                  <i className="ion-plus-round"></i>
                  &nbsp; {isFollowing ? "Unfollow" : "Follow"}{" "}
                  {articleDetail.author.username}
                </button>
                &nbsp;&nbsp;
                <FavoriteButton
                  isFavorited={isFavorited}
                  favoritesCount={favoritesCount}
                  onClick={handleFavoriteClick}
                />
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
                  <img
                    src={articleDetail.author.image}
                    alt={articleDetail.author.username}
                  />
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
                <button
                  className={`btn btn-sm btn-${
                    isFollowing ? "secondary" : "outline-secondary"
                  }`}
                  onClick={handleFollowClick}
                >
                  <i className="ion-plus-round"></i>
                  &nbsp; {isFollowing ? "Unfollow" : "Follow"}{" "}
                  {articleDetail.author.username}
                </button>
                &nbsp;
                <FavoriteButton
                  isFavorited={isFavorited}
                  favoritesCount={favoritesCount}
                  onClick={handleFavoriteClick}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
