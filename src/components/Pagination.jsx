import React from 'react'

export default function Pagination({ totalPages, currentPage, onPageChange }) {
    
    const getPaginationNumbers = () => {
        const pages = [];

        if (totalPages <= 5) {
            // show all pages
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first and last, and 2 around current
            pages.push(1);

            if (currentPage > 3) pages.push("...");

            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) pages.push("...");

            pages.push(totalPages);
        }

        return pages;
    };

    const pages = getPaginationNumbers();

    return (
        <>
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 text-sm font-semibold text-slate-700"
            >
                Prev
            </button>

            {pages.map((page, i) =>
                page === "..." ? (
                    <span key={i} className="px-3 py-1 text-gray-500">...</span>
                ) : (
                    <button
                        key={i}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-1 rounded text-sm font-semibold text-slate-700 ${currentPage === page ? "bg-[#0085db] text-white" : "bg-gray-200"}`}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 text-sm font-semibold text-slate-700"
            >
                Next
            </button>
        </>
    );
}