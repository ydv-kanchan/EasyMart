import React from 'react';

const TopPicks = () => {
  return (
    <div className="h-[calc(100vh-60px)] flex justify-between p-4">
      {/* First Box */}
      <div className="bg-gray-200 p-4 flex flex-col justify-between w-full md:w-1/3 mx-2">
        <div>
          <h3 className="text-xl font-semibold">Elevate Your Style Game</h3>
          <p className="text-sm text-gray-600">Details about this pick.</p>
        </div>
        <div className="mt-auto">
          <button className="bg-blue-500 text-white py-2 px-4 rounded-full">View More</button>
        </div>
      </div>

      {/* Second Box */}
      <div className="bg-gray-300 p-4 flex flex-col justify-between w-full md:w-1/3 mx-2">
        <div>
          <h3 className="text-xl font-semibold">Top Pick 2</h3>
          <p className="text-sm text-gray-600">Details about this pick.</p>
        </div>
        <div className="mt-auto">
          <button className="bg-blue-500 text-white py-2 px-4 rounded-full">View More</button>
        </div>
      </div>

      {/* Third Box */}
      <div className="bg-gray-400 p-4 flex flex-col justify-between w-full md:w-1/3 mx-2">
        <div>
          <h3 className="text-xl font-semibold">Top Pick 3</h3>
          <p className="text-sm text-gray-600">Details about this pick.</p>
        </div>
        <div className="mt-auto">
          <button className="bg-blue-500 text-white py-2 px-4 rounded-full">View More</button>
        </div>
      </div>
    </div>
  );
};

export default TopPicks;
