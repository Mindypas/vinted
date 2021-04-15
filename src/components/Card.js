import React from "react";
import "../css/Card.scss";

const Card = ({ photo, onFavorite, liked, onDislike }) => {
  const onDoubleClickHandler = (e) => {
    onFavorite(e, photo);
  };

  let lastTapTime = 0;

  const onTapHandler = (e) => {
    if (Date.now() <= lastTapTime + 600) {
      onFavorite(e.touches[0], photo);
    }

    lastTapTime = Date.now();
  };

  const onHeartClickHandler = (e) => {
    if (liked) {
      onDislike(photo);
    } else {
      onFavorite(e, photo);
    }
  };

  return (
    <div
      className="card"
      onTouchStart={onTapHandler}
      onDoubleClick={onDoubleClickHandler}
    >
      <div
        className="card__bg"
        style={{
          backgroundImage: `url(https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg})`,
        }}
      ></div>
      <div className="card__dimmer">
        <div className="card__text">
          <b>{photo.title}</b>
          <div className="card__textseperator"></div>
          <i>{photo.ownername}</i>
          <div className="card__heartmargin">
            <div className="card__heart">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 71 62.127"
                onClick={onHeartClickHandler}
              >
                <path
                  d="M65.5,18.249a16.744,16.744,0,0,0-32-6.9A16.737,16.737,0,1,0,7.428,31.018L32.971,56.391a.8.8,0,0,0,.569.236.81.81,0,0,0,.573-.236L60.6,30.067a16.663,16.663,0,0,0,4.9-11.818Z"
                  fill={liked ? "#d90429" : "none"}
                  stroke={liked ? "#d90429" : "white"}
                  strokeMiterlimit="10"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
