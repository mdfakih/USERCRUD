import React, { useEffect, useState } from 'react';
import { getAllUserData } from '../services/crudApis';
import DataTable from 'react-data-table-component';
import '../styles/UserTable.css';
import DatePicker from './DatePicker';
import SearchInput from './SearchInput';
import { useNavigate } from 'react-router';

const UserTable = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(20);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const filters = {
        gender: activeTab !== 'all' ? activeTab : undefined,
        search: query?.trim() || undefined,
      };

      const skip = (currentPage - 1) * recordsPerPage;

      const userData = await getAllUserData(filters, recordsPerPage, skip);
      let users = userData?.data?.users || [];
      if (selectedDate) {
        const selected = new Date(selectedDate);
        users = users.filter((user) => new Date(user.birthDate) <= selected);
      }

      setData({ ...userData?.data, users });
      setLoading(false);
    };

    fetchData();
  }, [activeTab, selectedDate, query, currentPage, recordsPerPage]);

  const columns = [
    {
      name: 'Id',
      selector: (row) => row.id,
    },
    {
      name: 'First Name',
      selector: (row) => row.firstName,
    },
    {
      name: 'Last Name',
      selector: (row) => row.lastName,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
    },
    {
      name: 'Gender',
      selector: (row) => row.gender,
    },
    {
      name: 'Birth Date',
      selector: (row) => new Date(row.birthDate).toLocaleDateString('en-GB'),
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handlePerPageChange = (newPerPage, page) => {
    setRecordsPerPage(newPerPage);
    setCurrentPage(page);
  };

  const totalRows = data?.total || 0;

  return (
    <div>
      {/* {data && console.log('data', data)} */}
      <div className="title">
        <h1>Users</h1>
        <button
          onClick={() => navigate('/create-user')}
          className="go-create-btn"
        >
          Create New User
        </button>
      </div>

      <div className="header">
        <div className="leftDiv">
          <div>
            <button
              onClick={() => setActiveTab('all')}
              className={activeTab === 'all' ? 'activeTab' : 'tab'}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('male')}
              className={activeTab === 'male' ? 'activeTab' : 'tab'}
            >
              Male
            </button>
            <button
              onClick={() => setActiveTab('female')}
              className={activeTab === 'female' ? 'activeTab' : 'tab'}
            >
              Female
            </button>
          </div>
          <div>
            <DatePicker
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
        <div>
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email..."
          />
        </div>
      </div>

      <div className="tableContainer">
        <DataTable
          columns={columns}
          data={data?.users || []}
          progressPending={loading}
          fixedHeader
          fixedHeaderScrollHeight="500px"
          onRowClicked={(row) => navigate(`/details/${row.id}`)}
          pointerOnHover
          highlightOnHover
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          paginationPerPage={recordsPerPage}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePerPageChange}
          paginationDefaultPage={currentPage}
        />
      </div>
    </div>
  );
};

export default UserTable;
