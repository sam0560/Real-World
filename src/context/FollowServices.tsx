import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the types for the context
interface FollowContextType {
  followStates: Map<string, boolean>;
  setFollowState: (username: string, isFollowing: boolean) => void;
}

interface FollowProviderProps {
  children: ReactNode;
}

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

// Create FollowContext
const FollowContext = createContext<FollowContextType | undefined>(undefined);

export const FollowProvider = ({ children }: FollowProviderProps) => {
  const [followStates, setFollowStates] = useState<Map<string, boolean>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      fetchFollowStates(jwtToken)
        .then((following) => {
          const followMap: Map<string, boolean> = new Map(
            following.map((username: string) => [username, true])
          );
          setFollowStates(followMap);
        })
        .catch((error) => {
          console.error("Failed to fetch follow states:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false); // If no token, no need to load
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
      {!isLoading && children}
    </FollowContext.Provider>
  );
};

export const useFollow = (): FollowContextType => {
  const context = useContext(FollowContext);
  if (!context) {
    throw new Error("useFollow must be used within a FollowProvider");
  }
  return context;
};
