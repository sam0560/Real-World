import { useEffect, useState } from "react";
import Article from "./Article";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Home() {
  const [popularTags, setPopularTags] = useState<string[]>([
    "eos",
    "est",
    "ipsum",
    "enim",
    "repellat",
    "quia",
    "consequatur",
    "facilis",
    "exercitationem",
    "tenetur",
  ]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const [feed, setFeed] = useState<boolean>(false);

  useEffect(() => {
    isAuthenticated && setFeed(true);
  }, [isAuthenticated]);

  const handleTagSelected = (tag: string) => {
    setSelectedTag(tag);
    setFeed(false);
  };

  const handleFeedToggle = (feedType: boolean) => {
    setSelectedTag(null);
    setFeed(feedType);
  };

  return (
    <>
      <div className="home-page">
        {!isAuthenticated ? (
          <div className="banner">
            <div className="container">
              <h1 className="logo-font">conduit</h1>
              <p>A place to share your knowledge.</p>
            </div>
          </div>
        ) : null}

        <div className="container page medium">
          <div className="row">
            <div className="col-md-9">
              <div className="feed-toggle">
                <ul className="nav nav-pills outline-active">
                  {isAuthenticated ? (
                    <>
                      <li className="nav-item">
                        <Link
                          className={`nav-link ${
                            !selectedTag && feed ? "active" : ""
                          }`}
                          to=""
                          onClick={() => handleFeedToggle(true)}
                        >
                          Your Feed
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          className={`nav-link ${
                            !selectedTag && !feed ? "active" : ""
                          }`}
                          to=""
                          onClick={() => handleFeedToggle(false)}
                        >
                          Global Feed
                        </Link>
                      </li>
                    </>
                  ) : (
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${!selectedTag ? "active" : ""}`}
                        to=""
                      >
                        Global Feed
                      </Link>
                    </li>
                  )}
                  {selectedTag && (
                    <li className="nav-item">
                      <Link className="nav-link active" to="">
                        <i className="ion-pound"></i>
                        {" " + selectedTag}
                      </Link>
                    </li>
                  )}
                </ul>
              </div>

              <Article
                setPopularTag={setPopularTags}
                selectedTag={selectedTag}
                feed={feed}
                key={selectedTag ?? (feed ? "feed" : "global")}
              />
            </div>

            <div className="col-md-3">
              <div className="sidebar">
                <p>Popular Tags</p>

                <div className="tag-list">
                  {popularTags.map((tag, index) => (
                    <Link
                      to="#"
                      className="tag-pill tag-default"
                      key={index}
                      onClick={() => handleTagSelected(tag)}
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
