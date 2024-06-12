import { useEffect, useState } from "react";
import {Article} from "../../"

export default function FetchData() {
  const [data, setData] = useState<Article[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //   Fetch data on page load
  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchJsonData = async () => {
      try {
        const res = await fetch("https://api.realworld.io/api/articles?limit=20&offset=0");
        if (!res.ok) {
          throw new Error("Network response fails");
        }
        const result = await res.json();
        setData(result.articles)

      } catch (error) {
        setError("Error while fetching data")
      } finally {
        setLoading(false)
      }
    };

    fetchJsonData();
  }, []);
  return {data, loading, error}
}