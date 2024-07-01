import { useEffect, useState } from "react";
import { Comment } from "../..";

export default function FetchComment({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async (slug: string) => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://api.realworld.io/api/articles/${slug}/comments`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch comments: ${res.statusText}`);
        }
        const result = await res.json();
        setComments(result.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
        // setError("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments(slug);
  }, [slug]);

  const addComment = async (slug: string, body: string) => {
    try {
      const res = await fetch(
        `https://api.realworld.io/api/articles/${slug}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("jwtToken")}`,
          },
          body: JSON.stringify({ comment: { body } }),
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to post comment: ${res.statusText}`);
      }

      const result = await res.json();
      setComments((prevComments) => [...(prevComments || []), result.comment]);
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const deleteComment = async (slug: string, commentId: number) => {
    try {
      const res = await fetch(
        `https://api.realworld.io/api/articles/${slug}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to delete comment: ${res.statusText}`);
      }

      setComments(
        (prevComments) =>
          prevComments?.filter((comment) => comment.id !== commentId) || null
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError("Error deleting comment:")
    }
  };

  return { comments, loading, error, addComment, deleteComment };
}
