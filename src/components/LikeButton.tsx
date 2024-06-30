import React from "react";
import { FavoriteButtonProps as LikeButtonProps } from "../..";

const LikeButton: React.FC<LikeButtonProps> = ({ isFavorited, favoritesCount, onClick }) => {
  return (
    <button className={`btn ${isFavorited ? 'btn-primary' : 'btn-outline-primary'} btn-sm pull-xs-right`} onClick={onClick}>
      <i className="ion-heart"></i> {favoritesCount}
    </button>
  );
};

export default LikeButton;
