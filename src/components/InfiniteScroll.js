import React, { useEffect, useState } from "react";
import Card from "./Card";
import "../css/InfiniteScroll.scss";
import useLocalStorage from "../useLocalStorage";

const InfiniteScroll = () => {
  const [favorites, setFavorites] = useLocalStorage("fav", []);
  const [currentPage, setCurrentPage] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [hearts, setHearts] = useState([]);
  const BASE_URL = "https://www.flickr.com/services/rest";
  const API_KEY = "f27a655cc4f9292f38951bd9b67912be";
  const comparePhotos = (a, b) => {
    return a.id === b.id && a.server === b.server && a.secret === b.secret;
  };
  const getPopular = async (page) => {
    const params = {
      format: "json",
      nojsoncallback: 1,
      method: "flickr.photos.search",
      tags: "alley",
      sort: "relevance",
      extras: "owner_name",
      page: page,
      per_page: 21,
      api_key: API_KEY,
    };
    const query = new URLSearchParams(params);
    const res = await fetch(`${BASE_URL}?${query.toString()}`);
    const data = await res.json();
    return data.photos;
  };
  useEffect(async () => {
    const data = await getPopular(currentPage);
    setPhotos((oldArray) => [...oldArray, ...data.photo]);
  }, [currentPage]);

  function debounceEvent(callback, time) {
    let interval;
    return function () {
      clearTimeout(interval);
      interval = setTimeout(() => {
        interval = null;
        callback.apply(this, arguments);
      }, time);
    };
  }

  const onScrollHandler = (e) => {
    const element = e.target;
    if (element.scrollTop + element.clientHeight * 4 >= element.scrollHeight) {
      setCurrentPage((oldValue) => oldValue + 1);
    }
  };

  const onFavoriteHandler = (e, photo) => {
    const pos = { x: e.pageX, y: e.pageY };
    setHearts((oldValue) => [...oldValue, pos]);

    setTimeout(() => {
      setHearts((oldValue) => oldValue.filter((x) => x !== pos));
    }, 1500);

    if (!favorites.some((x) => comparePhotos(x, photo))) {
      setFavorites((oldValue) => [...oldValue, photo]);
    }
  };

  const onDislikeHandler = (photo) => {
    setFavorites((oldValue) => oldValue.filter((x) => !comparePhotos(x, photo)));
  };

  return (
    <div
      className="scrollcontainer"
      onScroll={debounceEvent(onScrollHandler, 100)}
    >
      <div className="scrollcontainer__cards">
        {photos.map((photo, index) => (
          <Card
            photo={photo}
            key={index}
            onFavorite={onFavoriteHandler}
            liked={favorites.some(
              (x) =>
                x.id === photo.id &&
                x.server === photo.server &&
                x.secret === photo.secret
            )}
            onDislike={onDislikeHandler}
          />
        ))}
        {hearts.map((pos, index) => (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            className="flyingheart"
            style={{ left: pos.x, top: pos.y }}
            width="32"
            viewBox="0 0 64 64"
          >
            <path
              transform={`rotate(${Math.random() * 60 - 30} 32 32)`}
              d="M57,23.547a13.084,13.084,0,0,0-25-5.391A13.078,13.078,0,1,0,11.622,33.525l19.96,19.827a.627.627,0,0,0,.444.184.636.636,0,0,0,.448-.184l20.7-20.568A13.02,13.02,0,0,0,57,23.547Z"
              fill="#d90429"
            />
          </svg>
        ))}
      </div>
    </div>
  );
};

export default InfiniteScroll;
