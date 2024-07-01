import { createContext, useContext, useState, useEffect } from "react";
import { FollowContextType, FollowProviderProps } from "../..";

// Follow/unfollow API call
export const FollowServices = async (username: string, follow: boolean) => {
  const jwtToken = localStorage.getItem("jwtToken");

  if (!jwtToken) {
    throw new Error("User is not authenticated");
  }

  const url = `https://api.realworld.io/api/profiles/${username}/follow`;
  const method = follow ? "POST" : "DELETE";

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${jwtToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to ${follow ? "follow" : "unfollow"} author`);
  }

  const result = await res.json();
  return result.profile;
};

// Fetch follow states for the current user
const fetchFollowStates = async (jwtToken: string): Promise<string[]> => {
  const url = "https://api.realworld.io/api/following";
  const res = await fetch(url, {
    headers: {
      Authorization: `Token ${jwtToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch follow states");
  }

  const result = await res.json();
  return result.following;
};

// FollowContext
const FollowContext = createContext<FollowContextType | undefined>(undefined);

export const FollowProvider = ({ children }: FollowProviderProps) => {
  const [followStates, setFollowStates] = useState<Map<string, boolean>>(new Map());
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      fetchFollowStates(jwtToken)
        .then((following) => {
          const followMap: Map<string, boolean> = new Map(following.map((username: string) => [username, true]));
          setFollowStates(followMap);
          setIsLoading(false); // Mark loading as complete
        })
        .catch((error) => {
          console.error("Failed to fetch follow states:", error);
          setIsLoading(false); // Handle error and mark loading as complete
        });
    }
  }, []);

  const setFollowState = (username: string, isFollowing: boolean) => {
    setFollowStates((prevStates) => {
      const newStates = new Map(prevStates);
      newStates.set(username, isFollowing);
      return newStates;
    });
  };

  return (
    <FollowContext.Provider value={{ followStates, setFollowState }}>
      {!isLoading && children} {/* Render children only after loading is complete */}
    </FollowContext.Provider>
  );
};

export const useFollow = (): FollowContextType => {
  const context = useContext(FollowContext);
  if (context === undefined) {
    throw new Error('useFollow must be used within a FollowProvider');
  }
  return context;
};
