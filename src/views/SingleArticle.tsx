import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import FetchData from "../Api/FetchData";
import { useAuth } from "../context/AuthContext";
import { FavoriteServices } from "../Api/FavoritingArticle"; // Updated import
import { Article } from "../..";
import { useFollow } from "../context/FollowServices";
import FavoriteButton from "../components/FavoriteButton";
import FetchComment from "../Api/FetchComment";

export default function SingleArticle() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const { data, loading, error, followAuthor } = FetchData({ slug });
  const articleDetail: Article | undefined = data ? data[0] : undefined;

  // Comment
  if (!slug) {
    // Handle the case where slug is undefined
    return <p>Article not found</p>;
  }

  const { comments, addComment, deleteComment } = FetchComment({ slug });
  const [commentBody, setCommentBody] = useState<string>("");

  // Favorite
  const [isFavorited, setIsFavorited] = useState<boolean | null>(null);
  const [favoritesCount, setFavoritesCount] = useState<number>(0);

  // Follow
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

  // handle follow click
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

  // Handle favoriting
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

  // Handle commenting
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentBody.trim() && slug) {
      addComment(slug, commentBody);
      setCommentBody("");
    }
  };

  const handleDeleteComment = (commentId: number) => {
    if (slug) {
      deleteComment(slug, commentId);
    }
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

            {/* Comment */}
            {isAuthenticated ? (
              <div className="row">
                <div className="col-xs-12 col-md-8 offset-md-2">
                  <form
                    className="card comment-form"
                    onSubmit={handleAddComment}
                  >
                    <div className="card-block">
                      <textarea
                        className="form-control"
                        placeholder="Write a comment..."
                        value={commentBody}
                        onChange={(e) => setCommentBody(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="card-footer">
                      <img src={user?.image} className="comment-author-img" />
                      <button className="btn btn-sm btn-primary">
                        Post Comment
                      </button>
                    </div>
                  </form>

                  {comments?.map((comment) => (
                    <div className="card" key={comment.id}>
                      <div className="card-block">
                        <p className="card-text">{comment.body}</p>
                      </div>
                      <div className="card-footer">
                        <Link
                          to={`/@${comment.author.username}`}
                          className="comment-author"
                        >
                          <img
                            src={comment.author.image}
                            className="comment-author-img"
                            alt={comment.author.username}
                          />
                        </Link>
                        &nbsp;
                        <Link
                          to={`/@${comment.author.username}`}
                          className="comment-author"
                        >
                          {comment.author.username}
                        </Link>
                        <span className="date-posted">
                          {new Date(comment.createdAt).toDateString()}
                        </span>
                        {comment.author.username === user?.username && (
                          <span
                            className="mod-options"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <i className="ion-trash-a"></i>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <p>
                  {" "}
                  <Link to="/login">Sign in</Link> or{" "}
                  <Link to="/register">sign up</Link> to add comments on this
                  article.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
