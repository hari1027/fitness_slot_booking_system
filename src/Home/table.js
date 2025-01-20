import React, { useState, useEffect } from 'react';
import './table.css';

const ClassesTable = ({ classes }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    classType: [],
  });
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);

  const itemsPerPage = 5;

  const userIds = new Set();
  classes.forEach(c => {
    c.bookedIds.forEach(id => userIds.add(id));
    c.waitlistIds.forEach(id => userIds.add(id));
  });

  const userIdList = Array.from(userIds);

  const getClassesForUser = (userId) => {
    const bookedClasses = classes
      .filter(c => c.bookedIds.includes(userId))
      .map(c => c.type)
      .join(', ') || '-';

    const waitingClasses = classes
      .filter(c => c.waitlistIds.includes(userId))
      .map(c => c.type)
      .join(', ') || '-';

    return { bookedClasses, waitingClasses };
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


  const filteredUsers = userIdList.filter((userId) => {
    const filterByClassType = filters.classType.length === 0 || filters.classType.some(classType => {
      return classes.some(c => c.type === classType && (c.bookedIds.includes(userId) || c.waitlistIds.includes(userId)));
    });

    return filterByClassType;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  useEffect(() => {
    if(totalPages === 0){
      setCurrentPage(0);
    }
    if (totalPages > 0) {
      setCurrentPage(1);
    }
  }, [filters, totalPages]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleClassTypeChange = (classType) => {
    setFilters(prevFilters => {
      const isSelected = prevFilters.classType.includes(classType);
      return {
        ...prevFilters,
        classType: isSelected
          ? prevFilters.classType.filter(ct => ct !== classType)
          : [...prevFilters.classType, classType]
      };
    });
  };

  const toggleFilterMenu = () => {
    setFilterMenuVisible(prev => !prev);
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>UserId</th>
            <th>Booked Classes</th>
            <th>Wait Listed Classes</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length > 0 ? (
            currentUsers.map(userId => {
              const { bookedClasses, waitingClasses } = getClassesForUser(userId);
              return (
                <tr key={userId}>
                  <td>{userId}</td>
                  <td>{bookedClasses}</td>
                  <td>{waitingClasses}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4" className="noUserFound">No users found</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1  || currentPage === 0}
        >
          Previous
        </button>
        <span className="pageLabel">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || currentPage === 0}
        >
          Next
        </button>
        <button
          onClick={toggleFilterMenu}
          className={filters.classType.length > 0 ? 'selectedFilterButton' : 'filterButton'}
        >
          Filter
          {filterMenuVisible && (
            <div className="filter-menu">
              <div className='filterOptionsHeader'>
                Filter by class
              </div>
              <div>
                <label className='subLabel'>
                  <input
                    type="checkbox"
                    checked={filters.classType.includes('Yoga')}
                    onChange={() => handleClassTypeChange('Yoga')}
                    className='checkbox'
                  />
                  <p>Yoga</p>
                </label>
                <label className='subLabel'>
                  <input
                    type="checkbox"
                    checked={filters.classType.includes('Gym')}
                    onChange={() => handleClassTypeChange('Gym')}
                    className='checkbox'
                  />
                  <p>Gym</p>
                </label>
                <label className='subLabel'>
                  <input
                    type="checkbox"
                    checked={filters.classType.includes('Dance')}
                    onChange={() => handleClassTypeChange('Dance')}
                    className='checkbox'
                  />
                  <p>Dance</p>
                </label>
              </div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default ClassesTable;
