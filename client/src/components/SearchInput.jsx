import { FiSearch } from 'react-icons/fi';

const SearchInput = ({ searchQuery, setSearchQuery }) => {
      return (
            <div className="relative  ">
                  <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search CNR number..."
                        className="w-full p-3 py-4 pl-12 pr-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:placeholder:text-[18px]"
                  />
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
      );
};

export default SearchInput;
