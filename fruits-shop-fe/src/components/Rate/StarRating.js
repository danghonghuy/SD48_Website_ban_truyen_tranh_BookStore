import React from 'react';

const StarRating = ({rate}) => {
  const filledStars = Array.from({ length: rate }, (_, index) => (
    <i key={index} className="fa fa-star text-secondary"></i>
  ));
  const unfilledStar = <i className="fa fa-star"></i>;

  return (
    <div className="d-flex mb-2">
      {filledStars}
      {unfilledStar}
    </div>
  );
};

export default StarRating;
