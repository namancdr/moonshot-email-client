interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
}) => {
  return (
    <div className="pagination">
      <button onClick={onPrevPage} disabled={currentPage === 1}>
        ←
      </button>
      <span>{`Page ${currentPage} of ${totalPages}`}</span>
      <button onClick={onNextPage} disabled={currentPage === totalPages}>
        →
      </button>
    </div>
  );
};

export default Pagination;
