import { IonButton } from '@ionic/react';
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { CalendarValue } from '../../types/common'; // ← Date | [Date, Date]

type InternalCalendarValue = Date | [Date, Date] | null; // react-calendar側の型
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface PopupCalendarProps {
  value: CalendarValue;
  onChange: (value: CalendarValue) => void;
}

const PopupCalendar: React.FC<PopupCalendarProps> = ({ value, onChange }) => {
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateChange = (newValue: Value, _event: React.MouseEvent<HTMLButtonElement>) => {
    // nullを含んでいないDateか[Date, Date]のみ通す（安全に）
    if (
      newValue instanceof Date ||
      (Array.isArray(newValue) &&
        newValue.length === 2 &&
        newValue[0] instanceof Date &&
        newValue[1] instanceof Date)
    ) {
      onChange(newValue as CalendarValue); // 明示的にキャストして型エラー回避
    }
    setShowCalendar(false);
  };

  const formatDate = (val: CalendarValue) => {
    if (val instanceof Date) return val.toLocaleDateString();
    return `${val[0].toLocaleDateString()} - ${val[1].toLocaleDateString()}`;
  };

  return (
    <div style={{ position: 'relative' }}>
      <IonButton onClick={() => setShowCalendar(true)}>
        {formatDate(value)}
      </IonButton>

      {showCalendar && (
        <div style={{
          position: 'absolute',
          zIndex: 999,
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '8px'
        }}>
          <Calendar
            onChange={handleDateChange}
            value={value}
          />
          <IonButton fill="clear" onClick={() => setShowCalendar(false)}>Close</IonButton>
        </div>
      )}
    </div>
  );
};

export default PopupCalendar;
