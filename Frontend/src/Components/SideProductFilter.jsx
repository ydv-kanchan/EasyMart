import React from "react";
import { FaRedoAlt } from "react-icons/fa";

const SideProductFilter = ({
  priceRange,
  sortOrder,
  onPriceChange,
  onSortChange,
  onReset,
}) => {
  // Checkbox toggle for priceRange array
  const handleCheckboxChange = (range) => {
    if (priceRange.includes(range)) {
      onPriceChange(priceRange.filter((r) => r !== range));
    } else {
      onPriceChange([...priceRange, range]);
    }
  };

  return (
    <aside className="w-[15%] min-h-screen p-4 bg-white  sticky  hidden md:block overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-bold text-black-800  border-b pb-3">
          Refine Results
        </h3>
        <FaRedoAlt
          className="cursor-pointer text-orange-500 hover:text-orange-700 transition text-xl mt-[-5px] "
          onClick={onReset}
          title="Reset Filters"
        />
      </div>

      <div className="mb-8">
        <p className="mb-4 text-lg font-semibold text-gray-700">Price</p>
        <div className="flex flex-col gap-2">
          {["₹0 - ₹500", "₹500 - ₹1000", "Above ₹1000"].map((range) => (
            <label
              className="flex items-center gap-2 cursor-pointer"
              key={range}
            >
              <input
                type="checkbox"
                className="accent-orange-500 cursor-pointer"
                checked={priceRange.includes(range)}
                onChange={() => handleCheckboxChange(range)}
              />
              <span>{range}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-4 text-lg font-semibold text-gray-700">Sort By</p>
        <select
          className="bg-gray-100 px-3 py-2 rounded-md w-full focus:outline-none "
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="default">Default</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
      </div>
    </aside>
  );
};

export default SideProductFilter;
