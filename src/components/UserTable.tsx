import React from 'react';

interface User {
  name: string;
  email: string;
  phone: string;
  company: string;
}

interface UserListTableProps {
  users: User[];
}

const UserListTable: React.FC<UserListTableProps> = ({ users }) => {
  if (!users || users.length === 0) return <p>No users found</p>;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={cellStyle}>名前</th>
            <th style={cellStyle}>メール</th>
            <th style={cellStyle}>電話番号</th>
            <th style={cellStyle}>会社名</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td style={cellStyle}>{user.name}</td>
              <td style={cellStyle}>{user.email}</td>
              <td style={cellStyle}>{user.phone}</td>
              <td style={cellStyle}>{user.company}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const cellStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '8px',
  textAlign: 'left',
};

export default UserListTable;
