import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FetchData from "../Api/FetchData";
import { Article as ArticleProps } from "../..";
import { useAuth } from "../context/AuthContext"; // Import useAuth to get isAuthenticated
import { FavoriteServices } from "../Api/FavoritingArticle";
import LikeButton from "../components/LikeButton";

interface tagsProp {
  setPopularTag: (tags: string[]) => void;
  selectedTag: string | null;
  key: string; // this key prop is for re-rendering the page whenever the tag is clicked
  feed: boolean;
}

export default function Article({ selectedTag, feed }: tagsProp) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { isAuthenticated } = useAuth(); // Get isAuthenticated from the AuthContext
  const navigate = useNavigate();

  const articlesPerPage: number = 10; // article per page is 10
  const offset = (currentPage - 1) * articlesPerPage;

  const { data, loading, error, totalArticles } = FetchData({
    articlesPerPage,
    offset,
    tag: selectedTag,
    feed,
    isAuthenticated, // Pass isAuthenticated prop to FetchData
  });

  const totalPages = Math.ceil(totalArticles / articlesPerPage);
  const [favoriteStates, setFavoriteStates] = useState<{
    [key: string]: { isFavorited: boolean; favoritesCount: number };
  }>({});

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites") || "{}";
    setFavoriteStates(JSON.parse(storedFavorites));
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favoriteStates));
  }, [favoriteStates]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFavoriteClick = (slug: string) => {
    if (!isAuthenticated) {
      navigate("/register");
      return;
    }

    const newFavoriteState = !favoriteStates[slug]?.isFavorited;

    FavoriteServices(slug, newFavoriteState)
      .then((updatedArticle) => {
        setFavoriteStates((prevStates) => ({
          ...prevStates,
          [slug]: {
            isFavorited: newFavoriteState,
            favoritesCount: updatedArticle.favoritesCount,
          },
        }));
      })
      .catch((error) => {
        console.error("Failed to favorite/unfavorite article:", error);
      });
  };

  return (
    <>
      {loading && <div>Loading articles...</div>}
      {error && <div>{error}</div>}

      {data && data.length === 0 && feed && (
        <p>
          No articles to display. Follow some authors to see their articles
          here.
        </p>
      )}
      {data?.map((article: ArticleProps) => (
        <div className="article-preview" key={article.slug}>
          <div className="article-meta">
            <Link to={`/@${article.author.username}`}>
              <img src={article.author.image} alt={article.author.username} />
            </Link>
            <div className="info">
              <Link to={`/@${article.author.username}`} className="author">
                {article.author.username}
              </Link>
              <span className="date">January 4, 2024</span>
            </div>
            <LikeButton
              isFavorited={favoriteStates[article.slug]?.isFavorited || false}
              favoritesCount={
                favoriteStates[article.slug]?.favoritesCount ||
                article.favoritesCount
              }
              onClick={() => handleFavoriteClick(article.slug)}
            />
          </div>
          <Link to={`/article/${article.slug}`} className="preview-link">
            <h1>{article.title}</h1>
            <p>{article.description}</p>
            <span>Read more...</span>
            <ul className="tag-list">
              {article.tagList.map((tag, index) => (
                <li className="tag-default tag-pill tag-outline" key={index}>
                  {tag}
                </li>
              ))}
            </ul>
          </Link>
        </div>
      ))}

      <ul className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <li
            className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
            key={index}
            onClick={() => handlePageChange(index + 1)}
          >
            <a
              href="#"
              className="page-link"
              onClick={(e) => e.preventDefault()}
            >
              {index + 1}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
