import LikeButton from "../components/LikeButton";
import FetchData from "../Api/FetchData";
import { Article as ArticleProps } from "../..";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Import useAuth to get isAuthenticated

interface tagsProp {
  setPopularTag: (tags: string[]) => void;
  selectedTag: string | null;
  key: string; // this key prop is for re-rendering the page whenever the tag is clicked
  feed: boolean;
}

export default function Article({ selectedTag, feed }: tagsProp) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { isAuthenticated } = useAuth(); // Get isAuthenticated from the AuthContext

  const articlesPerPage: number = 10; // article per page is 10

  const offset = (currentPage - 1) * articlesPerPage;
  const { data, loading, error, totalArticles } = FetchData({
    articlesPerPage,
    offset,
    tag: selectedTag,
    feed,
    isAuthenticated, // Pass isAuthenticated prop to FetchData
  });

  // Get total navigation pages
  const totalPages = Math.ceil(totalArticles / articlesPerPage);

  // Func to handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {/* Loading */}
      {loading && <div>Loading articles...</div>}
      {/* Error */}
      {error && <div>{error}</div>}

      {data && data.length === 0 && feed && <p>No articles to display. Follow some authors to see their articles here.</p>}
      {/* This is a view of articles */}
      {data?.map((i: ArticleProps) => (
        <div className="article-preview" key={i.slug}>
          <div className="article-meta">
            <Link to={`/@${i.author.username}`}>
              <img src={i.author.image} />
            </Link>
            <div className="info">
              <Link to={`/@${i.author.username}`} className="author">
                {i.author.username}
              </Link>
              <span className="date">January 4, 2024</span>
            </div>
            <LikeButton favoritesCount={i.favoritesCount} />
          </div>
          <Link to={`/article/${i.slug}`} className="preview-link">
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

      {/* Pagination */}
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
