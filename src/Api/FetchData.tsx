import { useEffect, useState } from "react";
import { Article } from "../../";
import { FollowServices as followAuthorService } from "../context/FollowServices";

interface Props {
  articlesPerPage?: number;
  offset?: number;
  slug?: string;
  tag?: string | null;
  isAuthenticated?: boolean; // Add isAuthenticated prop
  feed?: boolean;
}

export default function FetchData({
  articlesPerPage = 10,
  offset = 0,
  slug,
  tag,
  isAuthenticated = false, // Default to false if not provided
  feed = false, // Default to false if not provided
}: Props) {
  const [data, setData] = useState<Article[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalArticles, setTotalArticles] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        let url = `https://api.realworld.io/api/articles?limit=${articlesPerPage}&offset=${offset}`;

        if (slug) {
          url = `https://api.realworld.io/api/articles/${slug}`;
        } else if (tag) {
          url += `&tag=${tag}`;
        } else if (feed && isAuthenticated) {
          url = "https://api.realworld.io/api/articles/feed";
        }

        const headers: { Authorization?: string } = {};

        if (isAuthenticated) {
          const jwtToken = localStorage.getItem("jwtToken");
          if (jwtToken) {
            headers.Authorization = `Token ${jwtToken}`;
          }
        }

        const res = await fetch(url, {
          headers,
        });

        if (!res.ok) {
          throw new Error(`Network response failed with status ${res.status}`);
        }

        const result = await res.json();

        if (slug) {
          setData([result.article]);
        } else {
          setData(result.articles);
          setTotalArticles(result.articlesCount);
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [articlesPerPage, offset, slug, tag, feed, isAuthenticated]);

  const followAuthor = async (username: string, follow: boolean) => {
    try {
      const profile = await followAuthorService(username, follow);
      setData((prevData) =>
        prevData?.map((article) =>
          article.author.username === username ? { ...article, author: profile } : article
        ) || null
      );
      localStorage.setItem(`following-${username}`, JSON.stringify(follow))
    } catch (error) {
      setError("Failed to follow/unfollow author");
    }
  };

  return { data, loading, error, totalArticles, followAuthor };
}
