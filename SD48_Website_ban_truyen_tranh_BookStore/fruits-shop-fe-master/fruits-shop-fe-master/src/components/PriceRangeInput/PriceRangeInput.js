import React, { useEffect, useState } from "react";

const PriceRangeInput = ({data, fnc}) => {
  const [datarange, fncRange] = useState(0);
  const handleRangeChange = (event) => {
    fncRange(event.target.value);
    fnc(event.target.value)
    console.log(event.target.value)
  };

  return (
    <div className="mb-3">
      <h4 className="mb-2">Price</h4>
      <input
        type="range"
        className="form-range w-100"
        id="rangeInput"
        name="rangeInput"
        min="0"
        max="500"
        value={datarange}
        onChange={(e) => handleRangeChange(e)}
      />
      <output id="amount" name="amount" min="0" max="500" htmlFor="rangeInput">
        {datarange}
      </output>
    </div>
  );
};

export default PriceRangeInput;
