import { useEffect, useState } from "react";
import { Article } from "../../";

interface Props {
  articlesPerPage?: number
  offset?: number
  slug?: string
  tag?: string | null
}

export default function FetchData({ articlesPerPage, offset, slug, tag }: Props) {
  const [data, setData] = useState<Article[] |null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalArticles, setTotalArticles] = useState<number>(0);

  //   Fetch data on page load
  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        let url = `https://api.realworld.io/api/articles?limit=${articlesPerPage}&offset=${offset}`

        // fetch single article by slug
        if (slug) {
          url = `https://api.realworld.io/api/articles/${slug}`;
        }
        // Fetch articles by tag
        if(tag) {
          url += `&tag=${tag}`
        }
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Network response fails");
        }
        const result = await res.json();
        if (slug) {
          // for single article view 
          setData([result.article]);
        } else {
          // For multiple article views with pagination
          setData(result.articles);
          setTotalArticles(result.articlesCount);
        }
      } catch (error) {
        setError("Failed while fetching articles");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [articlesPerPage, offset, slug, tag]);
  return { data, loading, error, totalArticles };
}
