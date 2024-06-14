import { useState } from "react";
import Article from "./Article";

export default function Home() {
  const [popularTags, setPopularTag] = useState<string[]>([
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

  // Func to handle seslectd tag
  const handleTagSelected = (tag: string) => {
    setSelectedTag(tag);
  };

  return (
    <>
      <div className="home-page">
        <div className="banner">
          <div className="container">
            <h1 className="logo-font">conduit</h1>
            <p>A place to share your knowledge.</p>
          </div>
        </div>

        <div className="container page medium">
          <div className="row">
            <div className="col-md-9">
              <div className="feed-toggle">
                <ul className="nav nav-pills outline-active">
                  <li className="nav-item">
                    <a className={`nav-link ${selectedTag? '' : 'active'}`} href="">
                      Global Feed
                    </a>
                  </li>
                  {
                    selectedTag && (
                    <li className="nav-item">
                      <a className={`nav-link ${selectedTag? 'active' : ''}`} href="">
                        <i className="ion-pound"></i>{" " + selectedTag}
                      </a>
                    </li>
                    )
                  }
                </ul>
              </div>

              <Article setPopularTag={setPopularTag} selectedTag={selectedTag} key={selectedTag ?? 'global'}/>
            </div>

            <div className="col-md-3">
              <div className="sidebar">
                <p>Popular Tags</p>

                <div className="tag-list">
                  {popularTags.map((tag, index) => (
                    <a
                      href="#"
                      className="tag-pill tag-default"
                      key={index}
                      onClick={() => handleTagSelected(tag)}
                    >
                      {tag}
                    </a>
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
