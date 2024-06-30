import React from "react";
import { FavoriteButtonProps } from "../..";

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ isFavorited, favoritesCount, onClick }) => {
  return (
    <button className={`btn btn-sm btn-${isFavorited ? "primary" : "outline-primary"}`} onClick={onClick}>
      <i className="ion-heart"></i>
      &nbsp; {isFavorited ? "Unfavorite" : "Favorite"} Article{" "}
      <span className="counter">{favoritesCount}</span>
    </button>
  );
};

export default FavoriteButton;
