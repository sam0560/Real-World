import LikeButton from "../components/LikeButton";
import FetchData from "../Api/FetchData";
import { Article as ArticleProps } from "../..";
import { Link } from "react-router-dom";
import { useState } from "react";

interface tagsProp {
  setPopularTag: (tags: string[]) => void
  selectedTag: string | null
  key: string // this key props is for re-redering page whenever tag is clicked
}

export default function Article({selectedTag}: tagsProp) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const articlesPerPage: number = 10; // article per page is 10

  const offset = (currentPage - 1) * articlesPerPage;
  const { data, loading, error, totalArticles } = FetchData({
    articlesPerPage,
    offset,
    tag: selectedTag
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
              <span className="date">January 4,2024</span>
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
