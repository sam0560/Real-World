import React from "react";

interface LikeButtonProps {
  favoritesCount: number
}

const LikeButton :React.FC<LikeButtonProps> = ({favoritesCount}) => {
  return (
    <>
      <button className="btn btn-outline-primary btn-sm pull-xs-right">
        <i className="ion-heart"></i> {favoritesCount}
      </button>
    </>
  );
}

export default LikeButton;