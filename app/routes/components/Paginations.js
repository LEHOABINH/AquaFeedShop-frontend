import React from 'react';
import { 
    Pagination,
    PaginationItem,
    PaginationLink,
    Label,
    Input
} from 'reactstrap';

const Paginations = ({ currentPage, totalPages, onPageChange, onRecordsPerPageChange, recordsPerPage }) => {
    const options = [5, 10, 50];

    // Logic để xác định phạm vi các trang cần hiển thị
    const renderPaginationItems = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5; // Số trang tối đa để hiển thị
        const leftBound = Math.max(1, currentPage - 2); // 2 trang trước trang hiện tại
        const rightBound = Math.min(totalPages, currentPage + 2); // 2 trang sau trang hiện tại

        if (currentPage > 3) {
            pageNumbers.push(1); // Hiển thị trang 1
            if (currentPage > 4) pageNumbers.push('...'); // Hiển thị dấu ...
        }

        // Thêm các trang ở giữa
        for (let i = leftBound; i <= rightBound; i++) {
            pageNumbers.push(i);
        }

        if (currentPage < totalPages - 2) {
            if (currentPage < totalPages - 3) pageNumbers.push('...'); // Hiển thị dấu ...
            pageNumbers.push(totalPages); // Hiển thị trang cuối
        }

        return pageNumbers;
    };

    return (
        <div className="d-flex justify-content-between align-items-center">
            <Pagination aria-label="Page navigation example" className="mr-auto">
                <PaginationItem disabled={currentPage === 1}>
                    <PaginationLink previous onClick={() => onPageChange(currentPage - 1)}>
                        <i className="fa fa-fw fa-angle-left"></i>
                    </PaginationLink>
                </PaginationItem>
                
                {/* Render các trang với dấu '...' nếu cần */}
                {renderPaginationItems().map((item, index) => (
                    <PaginationItem 
                        key={index} 
                        active={item === currentPage} 
                        disabled={item === '...'}
                    >
                        <PaginationLink 
                            onClick={() => item !== '...' && onPageChange(item)} 
                            style={{ cursor: item === '...' ? 'default' : 'pointer' }}
                        >
                            {item}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                <PaginationItem disabled={currentPage === totalPages}>
                    <PaginationLink next onClick={() => onPageChange(currentPage + 1)}>
                        <i className="fa fa-fw fa-angle-right"></i>
                    </PaginationLink>
                </PaginationItem>
            </Pagination>

            <div className="d-flex align-items-center ml-3">
                <Label for="recordsPerPage" className="mb-0 mr-2">Records per page:</Label>
                <Input
                    type="select"
                    id="recordsPerPage"
                    value={recordsPerPage}
                    onChange={onRecordsPerPageChange}
                    style={{ width: 'auto' }} 
                >
                    {options.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </Input>
            </div>
        </div>
    );
};

export { Paginations };
