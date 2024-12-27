import React from 'react';
 
const Pagination = ({ currentPage, totalPages, onPageChange, rowsPerPage, onRowsPerPageChange }) => {
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxButtons = 5; 
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = startPage + maxButtons - 1;
 
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
 
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
 
    return pageNumbers.map(number => (
      <button
        key={number}
        onClick={() => onPageChange(number)}
        className={`px-2 py-1 border rounded ${currentPage === number ? 'bg-blue-500 text-white' : ''}`}
      >
        {number}
      </button>
    ));
  };
 
  return (
    <div className="flex items-center justify-center p-4 space-x-4 pagination">
      <button
        onClick={() => onPageChange(1)}
        className="px-2 py-1 border rounded"
        disabled={currentPage === 1}
      >
        &laquo;&laquo;
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        className="px-2 py-1 border rounded"
        disabled={currentPage === 1}
      >
        &laquo;
      </button>
      {currentPage > 2 && (
        <span className="px-2 py-1">...</span>
      )}
      {renderPageNumbers()}
      {currentPage < totalPages - 1 && (
        <span className="px-2 py-1">...</span>
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        className="px-2 py-1 border rounded"
        disabled={currentPage === totalPages}
      >
        &raquo;
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        className="px-2 py-1 border rounded"
        disabled={currentPage === totalPages}
      >
        &raquo;&raquo;
      </button>
      <div className="ml-4">
        <label className="mr-2">Rows Per page</label>
        <select
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          className="p-1 border rounded"
        >
          {[10,20,30,40,50].map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
 
export default Pagination;