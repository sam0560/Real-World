import { createContext, useContext, useState } from "react";
import { FollowContextType, FollowProviderProps } from "../..";

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

// FollowContext
const FollowContext = createContext<FollowContextType | undefined>(undefined);

export const FollowProvider = ({ children }: FollowProviderProps) => {
  const [followStates, setFollowStates] = useState<Map<string, boolean>>(new Map());

  const setFollowState = (username: string, isFollowing: boolean) => {
    setFollowStates((prevStates) => new Map(prevStates).set(username, isFollowing));
  };

  return (
    <FollowContext.Provider value={{ followStates, setFollowState }}>
      {children}
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