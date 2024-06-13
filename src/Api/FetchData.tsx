import { useEffect, useState } from "react";
import { Article } from "../../";

interface Props {
  articlesPerPage?: number;
  offset?: number;
  slug?: string;
}

export default function FetchData({ articlesPerPage, offset, slug }: Props) {
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
        const url = `https://api.realworld.io/api/articles?limit=${articlesPerPage}&offset=${offset}`

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Network response fails");
        }
        const result = await res.json();
        if (slug) {
          setData(result.articles);
        } else {
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
  }, [articlesPerPage, offset, slug]);
  return { data, loading, error, totalArticles };
}
