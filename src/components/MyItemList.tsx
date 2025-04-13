import React from 'react';

interface ItemEntry {
  label: string;
  value: string;
}

interface MyItemListProps {
  items: ItemEntry[];
}

const MyItemList: React.FC<MyItemListProps> = ({ items }) => {
  if (!items || items.length === 0) return <p>No items to show</p>;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ccc' }}>項目名</th>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ccc' }}>値</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{item.label}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyItemList;
